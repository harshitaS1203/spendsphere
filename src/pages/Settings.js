import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { useCurrency } from "../CurrencyContext";

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem("spendsphere_theme") || "light");
  const { currency, setCurrency } = useCurrency();
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  function applyTheme(t) {
    setTheme(t);
    localStorage.setItem("spendsphere_theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }
  function applyCurrency(c) {
    setCurrency(c);
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const nav = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) {
      nav("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, nav]);

  if (!currentUser) return null;

  return (
    <Shell>
      <div className="page">
        <h1 className="page-title">Settings</h1>
        <p className="page-sub">Customize your financial gallery and account preferences.</p>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card-soft">
              <div className="d-flex gap-3 mb-4">
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", background: "var(--primary)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, fontWeight: 700,
                }}>{currentUser.name[0].toUpperCase()}</div>
                <div>
                  <h2 style={{ fontWeight: 700, marginBottom: 4 }}>{currentUser.name}</h2>
                  <div className="text-muted">{currentUser.email}</div>

                </div>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="label-muted mb-2 d-block">Username</label>
                  <input className="form-control" defaultValue={currentUser.name} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card-purple">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Appearance</h3>
              <div className={"theme-card" + (theme === "light" ? " selected" : "")}
                onClick={() => applyTheme("light")}>
                <span>☀️ Light Mode</span>
                {theme === "light" && <span>✓</span>}
              </div>
              <div className={"theme-card" + (theme === "dark" ? " selected" : "")}
                onClick={() => applyTheme("dark")}>
                <span>🌙 Dark Mode</span>
                {theme === "dark" && <span>✓</span>}
              </div>
              <p className="muted small mt-3 mb-0">
                Visual shifts happen instantly to match your surrounding light conditions.
              </p>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card-soft">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Currency</h3>
              <select className="form-select" value={currency} onChange={(e) => applyCurrency(e.target.value)}>
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="EUR">EUR — Euro (€)</option>
              </select>
              <p className="text-muted small mt-3 mb-0">
                Changes the default symbol for all new shared expenses.
              </p>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card-soft">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Notification Channel</h3>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Email Digest</div>
                  <div className="text-muted small">Weekly summary of all activities</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={emailDigest} onChange={(e) => setEmailDigest(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div style={{ fontWeight: 600 }}>Push Notifications</div>
                  <div className="text-muted small">Real-time alerts for bill additions</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
