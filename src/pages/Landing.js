import { Link } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";
export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-card">
        <img src={logo} alt="logo" className="logo-img" />
        <div className="landing-title">SpendSphere</div>
        <div className="landing-tagline">Shared Expenses, Perfectly in Sync</div>
        <p className="text-muted mb-4">
          All your shared expenses in one place. Curated financial clarity for the digital era.
        </p>
        <div className="mt-4">
          <Link to="/login">
            <button className="btn-purple w-100 py-3 mb-3" style={{ fontSize: '16px' }}>Sign In</button>
          </Link>
          <p className="text-center text-muted mt-3 mb-0">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
