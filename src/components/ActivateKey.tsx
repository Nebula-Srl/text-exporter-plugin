import TopBar from "./TopBar";
import activateKeyImg from "../assets/activate-key-img.png";
import { useState } from "react";
import { Storage } from "../storage";

interface ActivateKeyProps {
  goToStep: Function;
  setUserKey: Function;
  goBack: Function;
}

const ActivateKey = ({ goToStep, setUserKey, goBack }: ActivateKeyProps) => {
  const [key, setKey] = useState<string>("");
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
      if (res.status === 200) {
        Storage.set("user_key", key);
        setUserKey(key);
        goToStep("select_artboards");
      } else {
        alert("Invalid Key");
      }
    });
  };
  return (
    <div className="activate-key-container">
      <TopBar hideManage goToStep={goToStep} goBack={goBack} />

      <div className="content">
        <img src={activateKeyImg} width={120} />
        <div className="content__text">
          <span className="ds-font-default ds-font-emphatized">
            We're currently in beta!
          </span>
          <span className="ds-font-default" style={{ paddingRight: "30px" }}>
            To enable the plugin, please enter your license key or sign up for
            the waiting list.
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

export default ActivateKey;
