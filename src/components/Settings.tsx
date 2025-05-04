import { useEffect, useState } from "react";
import { Storage } from "../storage";
import TopBar from "./TopBar";

const Settings = ({ goBack }: { goBack: Function }) => {
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
      <TopBar goBack={goBack} goToStep={() => {}} showGoBack hideManage />
      <div className="settings-content">
        <span className="ds-font-default ds-font-emphatized">
          Remove License Key
        </span>
        <span className="ds-font-default">
          If you no longer need Pro features or want to switch accounts, you can
          safely remove your current license key here.
          <br />
          <br />
          NB: This will deactivate all Pro functionalities.
        </span>
        <div className="settings-input">
          <div className="input-group">
            <label htmlFor="key" className="ds-font-default ds-font-emphatized">
              License Key
            </label>
            <div className="input-wrapper">
              <input
                id="licenseKey"
                type="text"
                value={key}
                readOnly
                className="license-input"
                disabled
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
            className="remove-key ds-font-default"
            onClick={async () => {
              await Storage.set("user_key", "");
              goBack();
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
