interface DownloadJsonProps {
  enhancedResult: BlobPart;
  goToStep: Function;
  goBack: Function;
  setIsLoading: Function;
}
const DownloadJson = ({
  enhancedResult,
  goToStep,
  setIsLoading,
}: DownloadJsonProps) => {
  const downloadJson = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(enhancedResult, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "extracted-text.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();

    setIsLoading(false);
  };
  return (
    <div className="final-container">
      <span className="ds-font-default ds-font-emphatized">
        Your file is ready!
      </span>
      <button
        onClick={() => {
          downloadJson();
        }}
      >
        Download JSON
      </button>
      <div className="footer">
        <button
          onClick={() => goToStep("select_artboards")}
          className="ds-font-small"
        >
          Start New Extraction
        </button>
      </div>
    </div>
  );
};
export default DownloadJson;
