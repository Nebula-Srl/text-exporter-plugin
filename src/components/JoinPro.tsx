import { useState } from "react";
import joinPro from "../assets/pro.png";
import { Storage } from "../storage";
import TopBar from "./TopBar";

interface JoinProProps {
  setIsLoading: Function;
  goToStep: Function;
  goBack: Function;
  limitExceed?: boolean;
}
const JoinPro = ({
  setIsLoading,
  goToStep,
  goBack,
  limitExceed,
}: JoinProProps) => {
  const [key, setKey] = useState("");

  const enableKey = async () => {
    if (!key) return;
    debugger;
    fetch(import.meta.env.VITE_API_BASE_URL + "/enable-key", {
      method: "POST",
      body: JSON.stringify({ key }),
      headers: {
        "Content-Type": "application/json",
        origin: "https://figma.com",
      },
    }).then((res) => {
      debugger;
      if (res.status === 200) {
        Storage.set("user_key", key);
        goToStep('"select_artboards');
        setIsLoading(false);
      } else {
        alert("Invalid Key");
      }
    });
  };
  return (
    <div className="step-3">
      <TopBar hideManage goBack={goBack} goToStep={goToStep} showGoBack />
      <div className="content">
        <img src={joinPro} width={"100%"} />
        <div className="content__text">
          {limitExceed && (
            <div className="limit-exceed">
              The extraction exceeds the 200-line limit of the free plan
            </div>
          )}
          <span className="ds-font-default ds-font-emphatized">
            Enter the Key and access <span className="ds-font-pro">PRO</span>
          </span>
          <span className="ds-font-small" style={{ paddingRight: "30px" }}>
            With the Pro version, you can extract text from artboards with over
            200 lines of code and access powerful automatic translation
            features.
          </span>
          <div className="input-container">
            <input
              type="text"
              placeholder="Insert License Key"
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
        </div>
        <div className="footer">
          <span className="ds-font-small">Don't have a License Key?</span>
          <button
            className="btn-outline"
            onClick={() => {
              goToStep("join_waitlist");
            }}
          >
            Join waiting list
          </button>
        </div>
      </div>
    </div>
  );
};
export default JoinPro;
