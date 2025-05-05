import { useEffect, useState } from "react";
import "./assets/css/_variables.css";
import "./App.css";
import Loader from "./components/Loader";
import SubscribeWaitlist from "./components/SubscribedWaitlist";
import JoinWaitlist from "./components/JoinWaitlist";
import JoinPro from "./components/JoinPro";
import DownloadJson from "./components/DownlaodJson";
import SelectArtboards from "./components/SelectArtboards";
import ExtractionSettings from "./components/ExtractionSettings";
import Settings from "./components/Settings";
import { Storage } from "./storage";
import ActivateKey from "./components/ActivateKey";

type Steps =
  | "select_artboards"
  | "extraction_settings"
  | "download_json"
  | "join_pro"
  | "join_waitlist"
  | "subscribe_waitlist"
  | "settings";

const App = () => {
  const [userKey, setUserKey] = useState<string | null>(null);
  const [artworkList, setArtworkList] = useState([]);
  const [jsonOutput, setJsonOutput] = useState("Waiting for data...");
  const [step, setStep] = useState<Steps>("select_artboards");
  const [_stepHistory, setStepHistory] = useState<Steps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loaderText, setLoaderText] = useState<string>(
    "Starting extraction..."
  );
  const [limitExceed, setLimitExceed] = useState(false);

  useEffect(() => {
    const loadUserKey = async () => {
      const key = await Storage.get("user_key");
      setUserKey(key);
    };
    loadUserKey();
  }, [Storage.get("user_key"), Storage, userKey]);

  // Navigate forward, storing current step in history
  const goToStep = (newStep: Steps) => {
    setStepHistory((prev) => [...prev, step]);
    setStep(newStep);
  };

  // Navigate backward
  const goBack = () => {
    setStepHistory((prev) => {
      if (prev.length === 0) return prev;
      const lastStep = prev[prev.length - 1];
      setStep(lastStep);
      return prev.slice(0, -1); // pop last
    });
  };

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
    if (!isLoading) {
      setLoaderText("Starting extraction...");
      return;
    }

    const interval = setInterval(() => {
      if (isLoading) {
        setLoaderText((prev) => {
          if (prev === "Starting extraction...") {
            return "Selecting text from artboards...";
          } else if (prev === "Selecting text from artboards...") {
            return "Elaborating extraction...";
          } else if (prev === "Elaborating extraction...") {
            return "Organizing data in JSON format...";
          } else {
            return "Extracting...";
          }
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);
  if (!userKey && step !== "join_waitlist" && step !== "subscribe_waitlist") {
    return (
      <ActivateKey
        goToStep={goToStep}
        goBack={goBack}
        setUserKey={setUserKey}
      />
    );
  }
  return (
    <>
      {isLoading && <Loader text={loaderText} />}
      {step === "select_artboards" && (
        <SelectArtboards artworkList={artworkList} goToStep={goToStep} />
      )}
      {step === "extraction_settings" && (
        <ExtractionSettings
          artworkList={artworkList}
          setIsLoading={setIsLoading}
          goToStep={goToStep}
          goBack={goBack}
          jsonOutput={jsonOutput}
          setEnhancedResult={setEnhancedResult}
          setLimitExceed={setLimitExceed}
        />
      )}
      {step === "download_json" && (
        <DownloadJson
          enhancedResult={enhancedResult}
          goToStep={goToStep}
          goBack={goBack}
          setIsLoading={setIsLoading}
        />
      )}
      {step === "join_pro" && (
        <JoinPro
          goToStep={goToStep}
          goBack={goBack}
          setIsLoading={setIsLoading}
          limitExceed={limitExceed}
        />
      )}
      {step === "join_waitlist" && (
        <JoinWaitlist goToStep={goToStep} goBack={goBack} setEmail={setEmail} />
      )}
      {step === "subscribe_waitlist" && (
        <SubscribeWaitlist
          goToStep={goToStep}
          setIsLoading={setIsLoading}
          email={email}
        />
      )}
      {step === "settings" && <Settings goBack={goBack} />}
    </>
  );
};

export default App;
