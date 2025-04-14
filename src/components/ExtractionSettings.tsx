import { useState } from "react";
import ChoiceInput, { Choice } from "./ChoiceInput";
import artboardImg from "../assets/artboard.svg";

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

  const startExtraction = async () => {
    setLoaderText(
      selectedChoice === 1 ? "Extracting..." : "Extracting and Translating..."
    );
    setIsLoading(true);
    if (!window.localStorage.getItem("user_key") && selectedChoice !== 1) {
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
          body: JSON.stringify({ jsonOutput, optimize, translations }),
          method: "POST",
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
            "x-choice": selectedChoice.toString(),
            "x-user-key": window.localStorage.getItem("user_key") || "",
          },
        }
      );
      console.log(res);
      if (res.status !== 200) {
        window.alert("Status - An error occurred, please retry.");
        setIsLoading(false);
        return;
      }
      const resultText = await res.text();
      // Remove ```json from the start and ``` from the end
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
      window.alert("Catch - An error occurred, please retry.");
      setIsLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="left-column">
        <button
          onClick={() => {
            window.localStorage.removeItem("user_key");
          }}
        >
          Reset user_key
        </button>
        <h2>{artworkList?.length} Artboards to extract</h2>
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
          {/* <pre id="json-output">{jsonOutput}</pre> */}
          <button
            id="start-extraction"
            onClick={() => {
              if (!artworkList?.length || !selectedChoice) {
                return;
              }
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
