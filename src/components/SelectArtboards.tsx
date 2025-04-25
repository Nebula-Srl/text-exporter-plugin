import { useEffect, useState } from "react";
import selectArtboardImg from "../assets/select_arboard.svg";
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
    <div className="container select-artboard">
      <h1>Welcome to Extract and Translate</h1>
      <img src={selectArtboardImg} width={143} height={143} />
      <div className="info">
        <p>
          <strong>Extract, Optimize, Traduct</strong>
        </p>
        <p>
          Please select the frames containing the texts you want to extract and
          translate
        </p>
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
        {!showError && (
          <p>
            <strong>{artworkList?.length} frames selected</strong>
          </p>
        )}

        {!artworkList?.length && showError && (
          <div className="error-banner">
            Select at least one frame to proceed
          </div>
        )}
      </div>
    </div>
  );
};
export default SelectArtboards;
