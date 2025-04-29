import { useState } from "react";
import TopBar from "./TopBar";

interface JoinWaitlistProps {
  setStep: Function;
}

const JoinWaitlist = ({ setStep }: JoinWaitlistProps) => {
  const [whitelistForm, setWhitelistForm] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const subscribeToWhitelist = async () => {
    if (!whitelistForm.email || !whitelistForm.fullName) {
      alert("Please fill all fields");
      return;
    }
    if (!whitelistForm.email.includes("@")) {
      alert("Invalid email");
      return;
    }
    fetch(import.meta.env.VITE_API_BASE_URL + "/whitelist", {
      method: "POST",
      body: JSON.stringify(whitelistForm),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.status === 200) {
        setStep(5);
        setWhitelistForm({
          fullName: "",
          email: "",
          role: "",
        });
      } else {
        alert("An error occurred");
      }
    });
  };

  return (
    <div className="step-4">
      <TopBar hideManage setStep={setStep} showGoBack oldStep={3} />

      <div className="content">
        <span className="ds-font-default ds-font-emphatized">
          Join our community
        </span>
        <span className="ds-font-default">
          Subscribe and we will send you a free key, so that you will be able to
          try our plugin!
        </span>
        <div className="form-container">
          <div className="input-group">
            <label
              htmlFor="full-name"
              className="ds-font-small ds-font-emphatized"
            >
              Full Name
            </label>
            <input
              type="email"
              id="full-name"
              placeholder="Full Name..."
              value={whitelistForm.fullName}
              onChange={(e) => {
                setWhitelistForm({
                  ...whitelistForm,
                  fullName: e.target.value,
                });
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email" className="ds-font-small ds-font-emphatized">
              Email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              placeholder="Email..."
              value={whitelistForm.email}
              onChange={(e) => {
                setWhitelistForm({ ...whitelistForm, email: e.target.value });
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="role" className="ds-font-small ds-font-emphatized">
              Role
            </label>
            <select
              value={whitelistForm.role}
              id="role"
              onChange={(e) => {
                setWhitelistForm({ ...whitelistForm, role: e.target.value });
              }}
            >
              <option value="">Select an option</option>
              <option value="designer">Designer</option>
              <option value="developer">Developer</option>
              <option value="product-manager">Product Manager</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="btn-container">
          <button
            className="btn"
            onClick={() => {
              subscribeToWhitelist();
            }}
          >
            Sign up and request key
          </button>
        </div>
      </div>
    </div>
  );
};
export default JoinWaitlist;
