import { useState } from "react";
import arrowLeft from "../assets/arrow-left.svg";
import joinPro from "../assets/join-pro.svg";
import joinProLimit from "../assets/join-pro-limit.svg";

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
      <div
        className="back-header"
        onClick={() => {
          setIsLoading(false);
          setStep(1);
        }}
      >
        <div className="back-header-content">
          <img src={arrowLeft} alt="Back" />
          <span>Go Back</span>
        </div>
      </div>
      <div className="content">
        {limitExceed ? <img src={joinProLimit} /> : <img src={joinPro} />}
        {limitExceed && (
          <div className="limit-exceed">
            The extraction exceeds the 200-line limit of the free plan
          </div>
        )}
        <h2>
          Enter the Key and access <span>PRO features</span>
        </h2>
        <span>
          With the Pro version, you can extract text from frames with over 50
          lines of code and access powerful automatic translation features.
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
  );
};
export default JoinPro;
