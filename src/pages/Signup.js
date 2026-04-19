import { Link, useNavigate } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";

export default function Signup() {
  const nav = useNavigate();
  function submit(e) {
    e.preventDefault();
    // Redirect to login page after successful registration
    nav("/login");
  }
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="logo-img mx-auto" style={{ width: 64, height: 64, fontSize: 28 }}>
            <img src={logo} alt="logo" className="logo-img" />
          </div>
        </div>
        <h1 className="auth-title text-center">Create Account</h1>
        <p className="text-center text-muted mb-4">Join SpendSphere today.</p>

        <form onSubmit={submit}>
          <label className="label-muted mb-2 d-block">Username</label>
          <input className="form-control mb-3" placeholder="e.g. harshita" required />

          <label className="label-muted mb-2 d-block">Email Address</label>
          <input className="form-control mb-3" type="email" placeholder="e.g. harshita@example.com" required />

          <label className="label-muted mb-2 d-block">Phone Number</label>
          <input className="form-control mb-3" type="tel" placeholder="e.g. +91 9876543210" required />

          <label className="label-muted mb-2 d-block">Password</label>
          <input className="form-control mb-4" type="password" placeholder="Create a strong password" required />

          <button type="submit" className="btn-purple w-100 py-3">Sign Up</button>
        </form>

        <p className="text-center text-muted mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
