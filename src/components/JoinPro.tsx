import { useState } from "react";

import joinPro from "../assets/pro.png";
import arrowLeft from "../assets/arrow-left.svg";
import TopBar from "./TopBar";
interface JoinProProps {
  setIsLoading: Function;
  setStep: Function;
  limitExceed?: boolean;
}
const JoinPro = ({ setIsLoading, setStep, limitExceed }: JoinProProps) => {
  const [key, setKey] = useState("");

  const enableKey = async () => {
    if (!key) return;
    fetch(import.meta.env.VITE_API_BASE_URL + "/enable-key", {
      method: "POST",
      body: JSON.stringify({ key }),
      headers: {
        "Content-Type": "application/json",
        origin: "https://figma.com",
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
  return (
    <div className="step-3">
      <TopBar hideManage setStep={setStep} showGoBack />
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
          <span className="ds-font-default">Don't have a License Key?</span>
          <button
            className="btn-outline"
            onClick={() => {
              setStep(4);
            }}
          >
            Join the whitelist
          </button>
        </div>
      </div>
    </div>
  );
};
export default JoinPro;
