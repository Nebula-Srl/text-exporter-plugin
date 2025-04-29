import { useEffect, useState } from "react";
import arrowLeft from "../assets/arrow-left.svg";
import { Storage } from "../storage";

const Settings = ({ setStep }: { setStep: Function }) => {
  const [key, setKey] = useState();
  useEffect(() => {
    const fetchkey = async () => {
      const storedKey = await Storage.get("user_key");
      setKey(storedKey || "");
    };
    fetchkey();
  }, []);
  return (
    <div className="settings">
      <div className="back-header">
        <div className="back-header-content" onClick={() => setStep(1)}>
          <img src={arrowLeft} alt="Back" />
          <span>Go Back</span>
        </div>
      </div>
      <div className="settings-content">
        <span className="settings-title">Remove License Key</span>
        <span className="settings-subtitle">
          If you no longer need Pro features or want to switch accounts, you can
          safely remove your current license key here.
          <br />
          <br />
          NB: This will deactivate all Pro functionalities.
        </span>
        <div className="settings-input">
          <div className="input-group">
            <label htmlFor="key" className="input-label">
              License Key
            </label>
            <div className="input-wrapper">
              <input
                id="licenseKey"
                type="text"
                value={key}
                readOnly
                className="license-input"
              />
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(key || "");
                }}
              >
                COPY
              </button>
            </div>
          </div>

          <button
            className="remove-key"
            onClick={async () => {
              await Storage.set("user_key", "");
              setStep(0);
            }}
          >
            Remove Key
          </button>
        </div>
      </div>
    </div>
  );
};
export default Settings;
