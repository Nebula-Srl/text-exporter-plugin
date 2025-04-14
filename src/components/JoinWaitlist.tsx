import { useState } from "react";
import arrowLeft from "../assets/arrow-left.svg";

interface JoinWaitlistProps {
  setIsLoading: Function;
  setStep: Function;
}

const JoinWaitlist = ({ setIsLoading, setStep }: JoinWaitlistProps) => {
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
      <div
        className="back-header"
        onClick={() => {
          setIsLoading(false);
          setStep(3);
        }}
      >
        <img src={arrowLeft} alt="Back" />
        <span>Go Back</span>
      </div>

      <div className="content">
        <h2>Join our community</h2>
        <span>
          Subscribe and we will send you a free key, so that you will be able to
          try our plugin!
        </span>
        <div className="input-group">
          <label htmlFor="full-name">Full Name</label>
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
          <label htmlFor="email">Email</label>
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
          <label htmlFor="role">Role</label>
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
        <button
          className="btn"
          onClick={() => {
            subscribeToWhitelist();
          }}
        >
          Join Whitelist
        </button>
      </div>
    </div>
  );
};
export default JoinWaitlist;
