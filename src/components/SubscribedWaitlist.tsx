import checkIcon from "../assets/check.svg";
interface SubscribeWaitlistProps {
  setIsLoading: Function;
  goToStep: Function;
  email: string;
}

const SubscribeWaitlist = ({ goToStep, email }: SubscribeWaitlistProps) => {
  return (
    <div className="step-3">
      <div className="content content-center">
        <img
          src={checkIcon}
          height={24}
          style={{
            marginBottom: "20px",
          }}
        />
        <span className="ds-font-default ds-font-emphatized">
          Registration successful!
        </span>
        <span className="ds-font-small">
          We've sent an email to <strong>{email}</strong>.<br />
          Be sure to check your inbox and spam folder for the
          <br /> access key needed to test the plugin.
        </span>
        <button
          className="ds-font-small"
          style={{
            marginTop: "20px",
          }}
          onClick={() => {
            goToStep("activate_key");
          }}
        >
          Activate Key
        </button>
      </div>
    </div>
  );
};

export default SubscribeWaitlist;
