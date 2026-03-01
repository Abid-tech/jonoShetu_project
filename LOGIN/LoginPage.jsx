import styles from "./login.module.css";

const LoginPage = () => {
  return (
    <div className={`${styles.wrapper} d-flex align-items-center justify-content-center`}>
      <div className={`card shadow-lg ${styles.loginCard}`}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div className={styles.iconCircle}>
              <i className="bi bi-person-fill"></i>
            </div>
            <h3 className={styles.title}>লগইন</h3>
            <p className={styles.subtitle}>
              আপনার একাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* NID */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              NID
            </label>
            <input
              type="text"
              className={`form-control ${styles.input}`}
              placeholder="আপনার NID লিখুন"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              className={`form-control ${styles.input}`}
              placeholder="আপনার পাসওয়ার্ড লিখুন"
            />
          </div>

          <button className={`btn w-100 ${styles.loginBtn}`}>
            লগইন করুন
          </button>

          <div className="text-center mt-3">
            <small className={styles.forgot}>
              পাসওয়ার্ড ভুলে গেছেন?
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;