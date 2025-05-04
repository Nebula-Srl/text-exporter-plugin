import { useEffect, useState } from "react";
import ChoiceInput, { Choice } from "./ChoiceInput";
import { Storage } from "../storage";
import artboardIcon from "../assets/artboard.svg";
import TopBar from "./TopBar";
interface ExtractionSettingsProps {
  artworkList: any[];
  setIsLoading: Function;
  jsonOutput: string;
  setEnhancedResult: Function;
  setLimitExceed: Function;
  goBack: Function;
  goToStep: Function;
}
const choices = [
  {
    id: 1,
    name: "Extract up to 200 lines",
    price: "FREE",
    description: "",
  },
  {
    id: 2,
    name: "Unlimited text extraction",
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
  setIsLoading,
  jsonOutput,
  setEnhancedResult,
  setLimitExceed,
  goToStep,
  goBack,
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
    setIsLoading(true);

    if (!userKey && selectedChoice !== 1) {
      goToStep("join_pro");
      setIsLoading(false);
      return;
    }

    if (selectedChoice === 1) {
      // Count the number of keys in the jsonOutput
      let keysCount = countKeys(JSON.parse(jsonOutput));
      if (keysCount > 50) {
        goToStep("join_pro");
        setLimitExceed(true);
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

      if (!res.ok || !res.body) {
        throw new Error("Network response was not ok or body is missing.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let resultText: string = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          console.log("Stream finished");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        resultText += chunk;

        // Optionally: update UI with partial result
        console.log("Received chunk:", chunk);
      }

      // Do something with full result
      console.log("Full result:", resultText);

      const result = JSON.parse(resultText.replace(/^```json|```$/g, ""));

      if (!result) {
        window.alert("An error occurred while replacing json, please retry.");
        setIsLoading(false);
        return;
      }

      setEnhancedResult(result);
      goToStep("download_json");
      setIsLoading(false);
    } catch (e) {
      goToStep("select_artboards");
      setIsLoading(false);
      setError("An error occurred while processing your request.");
    }
  };

  useEffect(() => {
    if (selectedChoice) setError(null);
  }, [selectedChoice]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);
  return (
    <div
      style={{
        minHeight: "100%",
      }}
    >
      <TopBar showGoBack goBack={goBack} goToStep={goToStep} />
      <div className="extraction-settings">
        <div className="left-column">
          <span className="ds-font-default ds-font-emphatized">
            {artworkList?.length} Frame to extract
          </span>
          <div id="artwork-list">
            {artworkList?.map((artwork, index) => (
              <div key={index} className="artwork">
                <img src={artboardIcon} />
                <span>{artwork}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="right-column">
          <div className="options-container">
            <span className="ds-font-default ds-font-emphatized">
              Choose extraction type
            </span>
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
            <span className="ds-font-medium">
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
            <span className="ds-font-default ds-font-emphatized">
              Which language to translate?
            </span>
            <select
              className="select"
              value={translations}
              disabled={selectedChoice !== 3}
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
              className="ds-font-small"
              onClick={() => {
                startExtraction();
              }}
            >
              Start extraction process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExtractionSettings;
