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
        <div className="d-flex gap-3 justify-content-center mb-4">
          <Link to="/create-group"><button className="btn-purple px-4 py-3">Create Group</button></Link>
          <Link to="/dashboard"><button className="btn-outline-purple px-4 py-3">Join Group</button></Link>
        </div>
        <div className="mt-4 pt-4 border-top">
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Sign in to your account →
          </Link>
        </div>
      </div>
    </div>
  );
}
