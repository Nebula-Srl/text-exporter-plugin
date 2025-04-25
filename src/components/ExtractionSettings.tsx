import { useEffect, useState } from "react";
import ChoiceInput, { Choice } from "./ChoiceInput";
import artboardImg from "../assets/artboard.svg";
import { Storage } from "../storage";

interface ExtractionSettingsProps {
  artworkList: any[];
  setLoaderText: Function;
  setIsLoading: Function;
  setStep: Function;
  jsonOutput: string;
  setEnhancedResult: Function;
}
const choices = [
  {
    id: 1,
    name: "Extraction max 50 lines",
    price: "FREE",
    description: "",
  },
  {
    id: 2,
    name: "Extraction unlimited lines",
    price: "PRO",
    description: "",
  },
  {
    id: 3,
    name: "Extract & auto-translate",
    price: "PRO",
    description: "Extracts text and translates it into the selected language",
  },
];
const ExtractionSettings = ({
  artworkList,
  setLoaderText,
  setIsLoading,
  setStep,
  jsonOutput,
  setEnhancedResult,
}: ExtractionSettingsProps) => {
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [optimize, setOptimize] = useState(false);
  const [translations, setTranslations] = useState<string[]>([]);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function countKeys(obj: any): number {
    let count = 0;

    function recursiveCount(obj: any) {
      if (typeof obj !== "object" || obj === null) return;

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          count++;
          recursiveCount(obj[key]);
        }
      }
    }

    recursiveCount(obj);
    return count;
  }

  // Load user key on component mount
  useEffect(() => {
    const loadUserKey = async () => {
      const key = await Storage.get("user_key");
      setUserKey(key);
    };
    loadUserKey();
  }, []);

  const startExtraction = async () => {
    if (!selectedChoice) {
      setError("Select an extraction type to continue");
      return;
    }
    if (!artworkList?.length) {
      setError("Select at least one frame to extract");
      return;
    }
    setLoaderText(
      selectedChoice === 1 ? "Extracting..." : "Extracting and Translating..."
    );
    setIsLoading(true);

    if (!userKey && selectedChoice !== 1) {
      setStep(3);
      setIsLoading(false);
      return;
    }

    if (selectedChoice === 1) {
      // Count the number of keys in the jsonOutput
      let keysCount = countKeys(JSON.parse(jsonOutput));
      if (keysCount > 50) {
        setStep(3);
        setIsLoading(false);
        return;
      }
    }
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/ai-enhancer",
        {
          body: JSON.stringify({
            jsonOutput,
            optimize,
            translations,
          }),
          method: "POST",
          headers: {
            "x-user-key": String(userKey),
            "x-choice": String(selectedChoice),
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200) {
        window.alert("Status - An error occurred, please retry.");
        setIsLoading(false);
        return;
      }

      const resultText = await res.text();
      const result = JSON.parse(resultText.replace(/^```json|```$/g, ""));

      if (!result) {
        window.alert("An error occurred while replacing json, please retry.");
        setIsLoading(false);
        return;
      }

      setEnhancedResult(result);
      setStep(2);
      setIsLoading(false);
    } catch (e) {
      setStep(1);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChoice) setError(null);
  }, [selectedChoice]);
  return (
    <div className="container extraction-settings">
      <div className="left-column">
        <button
          onClick={() => {
            window.localStorage.removeItem("user_key");
          }}
        >
          Reset user_key
        </button>
        <h2>{artworkList?.length} Frame to extract</h2>
        <div id="artwork-list">
          {artworkList?.map((artwork, index) => (
            <div key={index} className="artwork">
              <img src={artboardImg} />
              <span>{artwork}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="right-column">
        <div className="options-container">
          <h2>Select an option</h2>
          <div className="choices">
            {choices.map((choice: Choice, index: number) => (
              <ChoiceInput
                choice={choice}
                index={index}
                key={index}
                setSelectedChoice={setSelectedChoice}
                selectedChoice={selectedChoice}
              />
            ))}
          </div>
        </div>
        <div className="optimize-container">
          <span>
            Exclude numbers from extracted text (useful for dates, IDs, etc.)
          </span>
          <div>
            <label className="switch">
              <input
                type="checkbox"
                checked={optimize}
                onChange={(e) => {
                  setOptimize(e.target.checked);
                }}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        <div
          className="language-container"
          style={{
            opacity: selectedChoice === 3 ? 1 : 0.2,
          }}
        >
          <h2>Which language to translate?</h2>
          <select
            className="select"
            value={translations}
            onChange={(e) => {
              setTranslations([e.target.value]);
            }}
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
        <div className="footer-button">
          {error && <div className="toast-error">{error}</div>}
          {/* <pre id="json-output">{jsonOutput}</pre> */}
          <button
            id="start-extraction"
            onClick={() => {
              startExtraction();
            }}
          >
            Start extraction process
          </button>
        </div>
      </div>
    </div>
  );
};
export default ExtractionSettings;
