import "./login.css";

const LoginPage = () => {
  return (
    <div className="wrapper d-flex align-items-center justify-content-center">
      <div className="card loginCard">

        <div className="text-center mb-4">
          <div className="iconCircle mb-3">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="green"  // ← makes it green
                            strokeWidth="2"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
            </div>
          <h3 className="title">জনসেবা লগইন</h3>
          <p className="subtitle">
            আপনার তথ্য দিয়ে লগইন সম্পন্ন করুন
          </p>
        </div>

        <form>
        {/* NID */}
        <div className="mb-3">
          
          <label className="form-label fw-bold ">এনআইডি *</label>
          <input
            type="text"
            className="form-control input"
            placeholder="আপনার এনআইডি নম্বর"
            required
          />
        
        </div>
        {/* Password */}
        <div className="mb-4">
          <label className="form-label fw-bold">পাসওয়ার্ড *</label>
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;