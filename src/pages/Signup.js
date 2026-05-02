import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";
import { registerUser } from "../api";

export default function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerUser(name, email, password);
      // Redirect to login page after successful registration
      nav("/login");
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
          <div className="logo-img mx-auto" style={{ width: 64, height: 64, fontSize: 28 }}>
            <img src={logo} alt="logo" className="logo-img" />
          </div>
        </div>
        <h1 className="auth-title text-center">Create Account</h1>
        <p className="text-center text-muted mb-4">Join SpendSphere today.</p>

        {error && <div className="alert alert-danger p-2 mb-3 small">{error}</div>}

        <form onSubmit={submit}>
          <label className="label-muted mb-2 d-block">Username</label>
          <input className="form-control mb-3" placeholder="e.g. harshita" value={name} onChange={e => setName(e.target.value)} required />

          <label className="label-muted mb-2 d-block">Email Address</label>
          <input className="form-control mb-3" type="email" placeholder="e.g. harshita@example.com" value={email} onChange={e => setEmail(e.target.value)} required />

          <label className="label-muted mb-2 d-block">Password</label>
          <input className="form-control mb-4" type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required />

          <button type="submit" className="btn-purple w-100 py-3" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-muted mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
