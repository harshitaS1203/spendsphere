import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";
import { loginUser } from "../api";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      localStorage.setItem("currentUser", JSON.stringify(user));
      nav("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="text-center mb-4">
          <div className="logo-img mx-auto" style={{ width: 64, height: 64, fontSize: 28 }}><img src={logo} alt="logo" className="logo-img" /></div>
        </div>
        <h1 className="auth-title text-center">Welcome Back</h1>
        <p className="text-center text-muted mb-4">Access your curated financial ledger.</p>

        {error && <div className="alert alert-danger p-2 mb-3 small">{error}</div>}

        <form onSubmit={submit}>
          <label className="label-muted mb-2 d-block">Email Address</label>
          <input className="form-control mb-3" value={email} onChange={e => setEmail(e.target.value)} required />

          <div className="d-flex justify-content-between mb-2">
            <label className="label-muted">Password</label>
            <Link to="#" style={{ color: "var(--primary)", fontSize: 13 }}>Forgot?</Link>
          </div>
          <input className="form-control mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" className="btn-purple w-100 py-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-muted mt-4 mb-0">
          New to SpendSphere?{" "}
          <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}
