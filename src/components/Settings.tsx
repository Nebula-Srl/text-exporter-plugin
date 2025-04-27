import settingsImg from "../assets/settings-img.svg";
import arrowLeft from "../assets/arrow-left.svg";
import { Storage } from "../storage";

const Settings = ({ setStep }: { setStep: Function }) => {
  return (
    <div className="settings">
      <div className="back-header">
        <div className="back-header-content" onClick={() => setStep(1)}>
          <img src={arrowLeft} alt="Back" />
          <span>Go Back</span>
        </div>
      </div>
      <img src={settingsImg} alt="Settings" />
      <div className="settings-content">
        <span className="settings-title">Remove License Key</span>
        <span className="settings-subtitle">
          If you no longer need Pro features or want to switch accounts, you can
          safely remove your current license key here. This will deactivate all
          Pro functionalities.
        </span>
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
  );
};
export default Settings;
