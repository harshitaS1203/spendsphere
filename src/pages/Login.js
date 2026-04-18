import { Link, useNavigate } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";

export default function Login() {
  const nav = useNavigate();
  function submit(e) {
    e.preventDefault();
    nav("/dashboard");
  }
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="logo-img mx-auto" style={{ width: 64, height: 64, fontSize: 28 }}><img src={logo} alt="logo" className="logo-img" /></div>
        </div>
        <h1 className="auth-title text-center">Welcome Back</h1>
        <p className="text-center text-muted mb-4">Access your curated financial ledger.</p>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <button className="btn w-100 py-3" style={{ border: "1px solid var(--border)", borderRadius: 10 }}> Google</button>
          </div>
          <div className="col-6">
            <button className="btn w-100 py-3" style={{ border: "1px solid var(--border)", borderRadius: 10 }}> Apple</button>
          </div>
        </div>

        <div className="text-center text-muted small mb-3">— OR EMAIL —</div>

        <form onSubmit={submit}>
          <label className="label-muted mb-2 d-block">Email Address</label>
          <input className="form-control mb-3" defaultValue="harshita12@gmail.com" />

          <div className="d-flex justify-content-between mb-2">
            <label className="label-muted">Password</label>
            <Link to="#" style={{ color: "var(--primary)", fontSize: 13 }}>Forgot?</Link>
          </div>
          <input className="form-control mb-4" type="password" defaultValue="••••••••" />

          <button type="submit" className="btn-purple w-100 py-3">Sign In</button>
        </form>

        <p className="text-center text-muted mt-4 mb-0">
          New to SpendSphere?{" "}
          <Link to="/dashboard" style={{ color: "var(--primary)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
