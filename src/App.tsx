// Import dotenv
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
const App = () => {
  const [artworkList, setArtworkList] = useState([]);
  const [jsonOutput, setJsonOutput] = useState("Waiting for data...");
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<string>("");
  const [loaderText, setLoaderText] = useState<string>(
    "Extracting and Translating..."
  );
  const [limitExceed, setLimitExceed] = useState(false);

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

  return (
    <>
      {isLoading && <Loader text={loaderText} />}
      {step == 0 && (
        <SelectArtboards artworkList={artworkList} setStep={setStep} />
      )}
      {step == 1 && (
        <ExtractionSettings
          artworkList={artworkList}
          setLoaderText={setLoaderText}
          setIsLoading={setIsLoading}
          setStep={setStep}
          jsonOutput={jsonOutput}
          setEnhancedResult={setEnhancedResult}
          setLimitExceed={setLimitExceed}
        />
      )}
      {step == 2 && (
        <DownloadJson
          enhancedResult={enhancedResult}
          setStep={setStep}
          setIsLoading={setIsLoading}
        />
      )}
      {step == 3 && (
        <JoinPro
          setIsLoading={setIsLoading}
          setStep={setStep}
          limitExceed={limitExceed}
        />
      )}
      {step == 4 && (
        <JoinWaitlist setIsLoading={setIsLoading} setStep={setStep} />
      )}

      {step == 5 && (
        <SubscribeWaitlist setIsLoading={setIsLoading} setStep={setStep} />
      )}

      {step == 6 && <Settings setStep={setStep} />}
    </>
  );
};

export default App;
