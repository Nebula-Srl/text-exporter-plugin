import { useEffect, useState } from "react";
import "./assets/css/_variables.css"; // Import CSS for styles
import "./App.css"; // Import CSS for styles
import artboardImg from "./assets/artboard.svg";
import selectArtboardImg from "./assets/select_arboard.svg";
import arrowLeft from "./assets/arrow-left.svg";
import emptyImg from "./assets/empty_img.png";
import checkImg from "./assets/check.svg";

const choices = [
  {
    id: 1,
    name: "Extraction max 200 lines",
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
const App = () => {
  const [artworkList, setArtworkList] = useState([]);
  const [jsonOutput, setJsonOutput] = useState("Waiting for data...");
  const [optimize, setOptimize] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(0);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [whitelistForm, setWhitelistForm] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [translations, setTranslations] = useState<string[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage;
      if (!message.type || message.type !== "export") return;
      setArtworkList(message.frames);
      setJsonOutput(JSON.stringify(message.textData, null, 2));
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (artworkList.length) {
      setShowError(false);
    }
  }, [artworkList]);

  const startExtraction = async () => {
    setIsLoading(true);
    if (!window.localStorage.getItem("user_key") && selectedChoice !== 1) {
      setStep(3);
      return;
    }
    if (selectedChoice === 1) {
      setEnhancedResult(jsonOutput);
      setIsLoading(false);
      setStep(2);
      return;
    }
    const res = await fetch("http://localhost:3001/ai-enhancer", {
      body: JSON.stringify({ jsonOutput, optimize, translations }),
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resultText = await res.text();
    // Remove ```json from the start and ``` from the end
    const result = JSON.parse(resultText.replace(/^```json|```$/g, ""));
    if (!result) {
      setIsLoading(false);
      return;
    }
    setEnhancedResult(result);
    setStep(2);
    setIsLoading(false);
  };

  const downloadJson = () => {
    const element = document.createElement("a");
    const file = new Blob([enhancedResult], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "extracted-text.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

    //TODO: Handle error
    window.localStorage.setItem("user_key", key);
    setStep(1);
    setIsLoading(false);
  };

  const enableKey = async () => {
    if (!key) return;
    fetch("http://localhost:3001/enable-key", {
      method: "POST",
      body: JSON.stringify({ key }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        window.localStorage.setItem("user_key", key);
        setStep(1);
        setIsLoading(false);
      } else {
        alert("Invalid Key");
      }
    });
  };

  const subscribeToWhitelist = async () => {
    if (!whitelistForm.email || !whitelistForm.fullName) {
      alert("Please fill all fields");
      return;
    }
    if (!whitelistForm.email.includes("@")) {
      alert("Invalid email");
      return;
    }
    fetch("http://localhost:3001/whitelist", {
      method: "POST",
      body: JSON.stringify(whitelistForm),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        setStep(5);
        setWhitelistForm({
          fullName: "",
          email: "",
          role: "",
        });
      } else {
        alert("An error occurred");
      }
    });
  };

  return (
    <>
      {step == 0 && (
        <div className="container select-artboard">
          <h1>Welcome to Extract and Translate</h1>
          <img src={selectArtboardImg} width={143} height={143} />
          <div className="info">
            <p>
              <strong>Extract, Optimize, Traduct</strong>
            </p>
            <p>
              Please select the artboards containing the texts you want to
              extract and translate
            </p>
            <button
              className="btn"
              onClick={() => {
                if (!artworkList?.length) {
                  setShowError(true);
                  return;
                }
                setStep(1);
              }}
            >
              Start now
            </button>
            {!showError && (
              <p>
                <strong>{artworkList?.length} selected</strong>
              </p>
            )}

            {!artworkList?.length && showError && (
              <div className="error-banner">
                Select at least one artboard to proceed
              </div>
            )}
          </div>
        </div>
      )}
      {step == 1 && !isLoading && (
        <div className="container">
          <div className="left-column">
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
                {choices.map((choice, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedChoice(choice.id)}
                    className={`choice ${choice.description ? " with-description" : ""} ${choice.id === selectedChoice ? " active" : ""}`}
                  >
                    {choice.description ? (
                      <div>
                        <span>{choice.name}</span>

                        <div className={`chip ${choice.price.toLowerCase()}`}>
                          {choice.price}
                        </div>
                      </div>
                    ) : (
                      <>
                        <span>{choice.name}</span>

                        <div className={`chip ${choice.price.toLowerCase()}`}>
                          {choice.price}
                        </div>
                      </>
                    )}

                    {choice.description && (
                      <span id="small-description">{choice.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="optimize-container">
              <span>
                Exclude numbers from extracted text (useful for dates, IDs,
                etc.)
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
              <select className="select">
                <option value="en">English</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div className="footer-button">
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
      )}
      {step == 1 && isLoading && (
        <div className="loading-container">
          <div className="loader" />
          <h2>Extracting and Translating...</h2>
        </div>
      )}
      {step == 2 && (
        <div className="final-container">
          <h2>Your file is ready!</h2>
          <button
            onClick={() => {
              downloadJson();
            }}
          >
            Download JSON
          </button>
        </div>
      )}
      {step == 3 && (
        <div className="step-3">
          <div
            className="back-header"
            onClick={() => {
              setIsLoading(false);
              setStep(1);
            }}
          >
            <img src={arrowLeft} alt="Back" />
            <span>Go Back</span>
          </div>
          <div className="content">
            <img src={emptyImg} height={103} />
            <h2>
              Enter the Key and access <span>PRO features</span>
            </h2>
            <span>
              With the Pro version, you can extract text from artboards with
              over 200 lines of code and access powerful automatic translation
              features.
            </span>
            <div className="input-container">
              <input
                type="text"
                placeholder="Insert key here"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  enableKey();
                }}
              >
                Activate Key
              </button>
            </div>
            <div className="footer">
              <h3>Don't have a License Key?</h3>
              <button
                onClick={() => {
                  setStep(4);
                }}
              >
                Join the whitelist
              </button>
            </div>
          </div>
        </div>
      )}

      {step == 4 && (
        <div className="step-3">
          <div
            className="back-header"
            onClick={() => {
              setIsLoading(false);
              setStep(3);
            }}
          >
            <img src={arrowLeft} alt="Back" />
            <span>Go Back</span>
          </div>

          <div className="content">
            <h2>Join the whitelist</h2>
            <div className="input-group">
              <label htmlFor="full-name">Full Name *</label>
              <input
                type="email"
                id="full-name"
                placeholder="Full Name..."
                value={whitelistForm.fullName}
                onChange={(e) => {
                  setWhitelistForm({
                    ...whitelistForm,
                    fullName: e.target.value,
                  });
                }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email *</label>
              <input
                className="input"
                type="email"
                id="email"
                placeholder="Email..."
                value={whitelistForm.email}
                onChange={(e) => {
                  setWhitelistForm({ ...whitelistForm, email: e.target.value });
                }}
              />
            </div>

            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select
                value={whitelistForm.role}
                id="role"
                onChange={(e) => {
                  setWhitelistForm({ ...whitelistForm, role: e.target.value });
                }}
              >
                <option value="designer">Designer</option>
                <option value="developer">Developer</option>
                <option value="product-manager">Product Manager</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              className="btn"
              onClick={() => {
                subscribeToWhitelist();
              }}
            >
              Join Whitelist
            </button>
          </div>
        </div>
      )}

      {step == 5 && (
        <div className="step-3">
          <div
            className="back-header"
            onClick={() => {
              setIsLoading(false);
              setStep(1);
            }}
          >
            <img src={arrowLeft} alt="Back" />
            <span>Go Back</span>
          </div>

          <div className="content content-center">
            <img src={checkImg} height={75} />
            <h2>You've subscribed to the whitelist</h2>
            <span>
              If you will be granted access to the PRO features, you will be
              notified via email.
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
