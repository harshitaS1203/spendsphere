import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../CurrencyContext";
import { getReminders } from "../api";

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const { currency, setCurrency } = useCurrency();
  const isActive = (p) => pathname === p || pathname.startsWith(p + "/");
  const navigate = useNavigate();
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (currentUser) {
      getReminders(currentUser._id)
        .then(data => setReminders(data.reminders))
        .catch(err => console.error("Failed to fetch reminders", err));
    }
  }, [currentUser]);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="logo" className="logo-img" />
          <div>
            <div className="brand-text">SpendSphere</div>
            <div className="brand-sub">Split Smarter</div>
          </div>
        </div>
        <NavLink to="/dashboard" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}>
          <span className="nav-icon"></span>
          <span className="nav-text">Dashboard</span>
        </NavLink>
        <NavLink to="/groups" className={() => "nav-link-side" + (isActive("/groups") || isActive("/create-group") ? " active" : "")}>
          <span className="nav-icon"></span>
          <span className="nav-text">Groups</span>
        </NavLink>
        <NavLink to="/activity" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}>
          <span className="nav-icon"></span>
          <span className="nav-text">Activity</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}>
          <span className="nav-icon"></span>
          <span className="nav-text">Profile</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}>
          <span className="nav-icon"></span>
          <span className="nav-text">Settings</span>
        </NavLink>
        <div className="sidebar-footer">
          <Link to="/create-group"><button className="btn-new-group">+ New Group</button></Link>
          <span onClick={() => { localStorage.removeItem("currentUser"); navigate("/login"); }} className="nav-link-side" style={{cursor: "pointer"}}><span>Logout</span></span>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="d-flex align-items-center gap-4">
            <div className="logo-img" style={{ width: 36, height: 36, fontSize: 16 }}><img src={logo} alt="logo" className="logo-img" /></div>
            <nav className="top-nav">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
              <NavLink to="/groups" className={() => isActive("/groups") ? "active" : ""}>Groups</NavLink>
              <NavLink to="/activity" className={({ isActive }) => isActive ? "active" : ""}>Activity</NavLink>
            </nav>
          </div>
          <div className="top-actions">
            <div className="currency-toggle">
              {["INR", "USD", "EUR"].map((c, i) => (
                <span key={c}>
                  <span
                    className={currency === c ? "active" : ""}
                    onClick={() => setCurrency(c)}
                    style={{ cursor: "pointer" }}
                  >
                    {c}
                  </span>
                  {i < 2 && " / "}
                </span>
              ))}
            </div>
            <button className="btn-add-expense" onClick={() => navigate("/add-expense")}>Add Expense</button>
            <div className="position-relative">
              <div className="bell" onClick={() => setShowReminders(!showReminders)}>
                🔔
                {reminders.length > 0 && <span className="notification-dot" style={{position: "absolute", top: 0, right: 0, background: "var(--danger)", width: 8, height: 8, borderRadius: "50%"}}></span>}
              </div>
              {showReminders && (
                <div className="reminders-popup">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <h4 style={{ fontWeight: 700, margin: 0 }}>Reminders</h4>
                    <span className="text-muted">{reminders.length} pending</span>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {reminders.length === 0 ? (
                      <div className="text-muted text-center py-3">No pending reminders!</div>
                    ) : (
                      reminders.map((rem, i) => (
                        <div key={i} className={`reminder-card ${rem.includes("owe") ? "reminder-red" : "reminder-green"}`}>
                          <div className="d-flex gap-3 align-items-start">
                            <div style={{ fontSize: 24 }}>{rem.includes("owe") ? "🔔" : "💸"}</div>
                            <div className="flex-grow-1">
                              <div style={{ fontWeight: 600 }}>{rem}</div>
                            </div>
                            <button className="btn-close-reminder">×</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="avatar" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>{currentUser ? currentUser.name[0].toUpperCase() : "U"}</div>
          </div>
        </div>

        {children}

        <div className="footer">
          <div><strong>SpendSphere</strong> © 2026 SpendSphere. Curated Financial Clarity.</div>
          <div className="footer-links">
            <a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#api">API</a><a href="#support">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MemberDot({ name, idx, color }) {
  const colors = ["#7c3aed", "#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];
  const bg = color || colors[idx % colors.length];
  return <div className="member-dot" style={{ background: bg }}>{name ? name[0].toUpperCase() : "?"}</div>;
}

export function MemberDots({ members, max = 3 }) {
  const visible = members.slice(0, max);
  const extra = members.length - max;
  return (
    <div className="member-dots">
      {visible.map((m, i) => <MemberDot key={m} name={m} idx={i} />)}
      {extra > 0 && <div className="member-dot" style={{ background: "#94a3b8" }}>+{extra}</div>}
    </div>
  );
}
