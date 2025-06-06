import { useEffect, useState } from "react";
import arrowLeft from "../assets/arrow-left.svg";
import keyIcon from "../assets/key.svg";
import separatorIcon from "../assets/separator.svg";
import helpIcon from "../assets/help.svg";
import { Storage } from "../storage";

interface TopBarProps {
  showGoBack?: boolean;
  hideManage?: boolean;
  goBack: Function;
  goToStep: Function;
}
const TopBar = ({
  showGoBack = false,
  hideManage = false,
  goBack,
  goToStep,
}: TopBarProps) => {
  const [key, setKey] = useState();
  useEffect(() => {
    const fetchkey = async () => {
      const storedKey = await Storage.get("user_key");
      setKey(storedKey || "");
    };
    fetchkey();
  }, []);
  return (
    <div className="top-bar">
      {showGoBack && (
        <div className="back-container" onClick={() => goBack()}>
          <img src={arrowLeft} alt="Back" className="back-icon" />
          <span>Go back</span>
        </div>
      )}
      {!showGoBack && <span>Welcome</span>}
      <div className="right-header-content">
        {!hideManage && (
          <button
            className={"btn-gray"}
            onClick={() => {
              debugger;
              if (key) {
                goToStep("settings");
                return;
              }
              goToStep("join_pro");
            }}
          >
            {key ? "Manage key" : "Activate key"}
            <img src={keyIcon} alt="key" className="key-icon" />
          </button>
        )}
        {!hideManage && (
          <img src={separatorIcon} alt="separator" className="separator-icon" />
        )}
        <button
          className="btn-gray btn-fit-content"
          onClick={() => {
            // Open mail to info@explorenebula.com
            window.open("mailto:info@explorenebula.com", "_blank");
          }}
        >
          <img src={helpIcon} alt="help" className="help-icon" />
        </button>
      </div>
    </div>
  );
};
export default TopBar;
