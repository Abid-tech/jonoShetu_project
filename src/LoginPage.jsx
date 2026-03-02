// LoginPage.jsx
import "./login.css"; 

const LoginPage = () => {
  return (
    <div className="wrapper d-flex align-items-center justify-content-center">
      <div className="card loginCard">

        <div className="text-center mb-4">
          <div className="iconCircle">
            <i className="bi bi-person-fill"></i>
          </div>
          <h3 className="title">জনসেবা লগইন</h3>
          <p className="subtitle">
            আপনার তথ্য দিয়ে লগইন সম্পন্ন করুন
          </p>
        </div>

        {/* NID */}
        <div className="mb-3">
          <label className="form-label fw-semibold">NID</label>
          <input
            type="text"
            className="form-control input"
            placeholder="আপনার NID নম্বর"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="form-label fw-semibold">পাসওয়ার্ড</label>
          <input
            type="password"
            className="form-control input"
            placeholder="আপনার পাসওয়ার্ড লিখুন"
            required
          />
        </div>

        <button className="btn w-100 loginBtn">
          লগইন করুন
        </button>

        <div className="text-center mt-3">
          <small className="forgot">পাসওয়ার্ড ভুলে গেছেন?</small>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
