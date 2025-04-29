import { useEffect, useState } from "react";
import selectArtboardImg from "../assets/frame_extractor.png";
import TopBar from "./TopBar";
interface SelectArtboardsProps {
  setStep: Function;
  artworkList: any[];
}
const SelectArtboards = ({ artworkList, setStep }: SelectArtboardsProps) => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (artworkList.length) {
      setShowError(false);
    }
  }, [artworkList]);
  return (
    <div className="select-artboard">
      <TopBar setStep={setStep} />
      <div className="select-artboard__content">
        <img src={selectArtboardImg} width={120} height={120} />
        <div className="info">
          <div className="info__text">
            <span className="ds-font-default ds-font-emphatized">
              Extract, Optimize, Translate
            </span>
            <span className="ds-font-default">
              Please select the frames containing the texts you want to extract
              and translate
            </span>
          </div>
          <div className="info__actions">
            <button
              className="btn"
              onClick={() => {
                if (!artworkList?.length) {
                  setShowError(true);
                  return;
                }
                setStep(1);
              }}
            >
              Start now
            </button>

            <span className="ds-font-small">
              {artworkList?.length} frames selected
            </span>

            {!artworkList?.length && showError && (
              <div className="error-banner">
                Select at least one frame to proceed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SelectArtboards;
