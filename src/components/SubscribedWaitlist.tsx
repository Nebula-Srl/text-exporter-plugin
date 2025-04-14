import checkImg from "../assets/check.svg";
import arrowLeft from "../assets/arrow-left.svg";

interface SubscribeWaitlistProps {
  setIsLoading: Function;
  setStep: Function;
}

const SubscribeWaitlist = ({
  setIsLoading,
  setStep,
}: SubscribeWaitlistProps) => {
  return (
    <div className="step-3">
      <div
        className="back-header"
        onClick={() => {
          setIsLoading(false);
          setStep(1);
        }}
      >
        <img src={arrowLeft} alt="Back" />
        <span>Go Back</span>
      </div>

      <div className="content content-center">
        <img src={checkImg} height={75} />
        <h2>You've subscribed to the whitelist</h2>
        <span>
          If you will be granted access to the PRO features, you will be
          notified via email.
        </span>
      </div>
    </div>
  );
};

export default SubscribeWaitlist;
