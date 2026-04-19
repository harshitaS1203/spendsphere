import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "/Users/harshitasadhwani/Downloads/spendsphere/src/assets/s logo.jpeg";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../CurrencyContext";

export default function Shell({ children }) {
  const { pathname } = useLocation();
  const { currency, setCurrency } = useCurrency();
  const isActive = (p) => pathname === p || pathname.startsWith(p + "/");
  const navigate = useNavigate();
  const [showReminders, setShowReminders] = useState(false);

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
        <NavLink to="/dashboard" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}><span>Dashboard</span></NavLink>
        <NavLink to="/groups" className={() => "nav-link-side" + (isActive("/groups") || isActive("/create-group") ? " active" : "")}><span>Groups</span></NavLink>
        <NavLink to="/activity" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}><span>Activity</span></NavLink>
        <NavLink to="/profile" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}><span>Profile</span></NavLink>
        <NavLink to="/settings" className={({ isActive }) => "nav-link-side" + (isActive ? " active" : "")}><span>Settings</span></NavLink>
        <div className="sidebar-footer">
          <Link to="/create-group"><button className="btn-new-group">+ New Group</button></Link>
          <Link to="/" className="nav-link-side"><span>Logout</span></Link>
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
              <div className="bell" onClick={() => setShowReminders(!showReminders)}>🔔</div>
              {showReminders && (
                <div className="reminders-popup">
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                    <h4 style={{ fontWeight: 700, margin: 0 }}>Reminders</h4>
                    <span className="text-muted">3 pending</span>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="reminder-card reminder-red">
                      <div className="d-flex gap-3 align-items-start">
                        <div style={{ fontSize: 24 }}>🔔</div>
                        <div className="flex-grow-1">
                          <div style={{ fontWeight: 600 }}>You owe ₹500 to Dhruvi</div>
                          <div className="text-muted small">in College Trip</div>
                        </div>
                        <button className="btn-close-reminder">×</button>
                      </div>
                    </div>
                    <div className="reminder-card reminder-green">
                      <div className="d-flex gap-3 align-items-start">
                        <div style={{ fontSize: 24 }}>💸</div>
                        <div className="flex-grow-1">
                          <div style={{ fontWeight: 600 }}>Heer owes you ₹300</div>
                        </div>
                        <button className="btn-close-reminder">×</button>
                      </div>
                    </div>
                    <div className="reminder-card reminder-red">
                      <div className="d-flex gap-3 align-items-start">
                        <div style={{ fontSize: 24 }}>🔔</div>
                        <div className="flex-grow-1">
                          <div style={{ fontWeight: 600 }}>You owe ₹240 to Anuja</div>
                          <div className="text-muted small">in Goa Trip</div>
                        </div>
                        <button className="btn-close-reminder">×</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="avatar" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>H</div>
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
  return <div className="member-dot" style={{ background: bg }}>{name[0]}</div>;
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
