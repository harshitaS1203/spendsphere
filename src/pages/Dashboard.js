import { Link } from "react-router-dom";
import Shell from "../components/Shell";
import { getGroups } from "../data/store";
import { useCurrency } from "../CurrencyContext";

function Donut() {
  const { fmt } = useCurrency();
  // 4 segments: Travel 42%, Food 28%, Shopping 20%, Others 10%
  const C = 502.4; // 2*PI*80
  const segs = [
    { v: 0.42, color: "#7c3aed" },
    { v: 0.28, color: "#f59e0b" },
    { v: 0.20, color: "#10b981" },
    { v: 0.10, color: "#4292c6" },
  ];
  let off = 0;
  return (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
      {segs.map((s, i) => {
        const dash = s.v * C;
        const node = (
          <circle key={i} cx="100" cy="100" r="80" fill="none"
            stroke={s.color} strokeWidth="30"
            strokeDasharray={`${dash} ${C}`}
            strokeDashoffset={-off}
            transform="rotate(-90 100 100)" />
        );
        off += dash;
        return node;
      })}
      <text x="100" y="95" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor">{fmt(24000)}</text>
      <text x="100" y="115" textAnchor="middle" fontSize="11" fill="#64748b">TOTAL</text>
    </svg>
  );
}

export default function Dashboard() {
  const groups = getGroups();
  const { fmt } = useCurrency();
  const owe = 1200, owed = 800;

  return (
    <Shell>
      <div className="page">
        <h1 className="page-title">Hello Harshita 👋</h1>
        <p className="page-sub">Ready to harmonize your shared finances today?</p>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card-soft">
              <div className="label-muted mb-2">↗️ Total you owe</div>
              <div className="amount amount-red mb-3">{fmt(owe)}</div>
              <span className="pill pill-red mb-3 d-inline-block">3 Pending Bills</span>
              <div className="d-flex gap-2 mt-3">
                <button className="btn-green">Settle Now</button>
                <button className="btn-outline-purple">View All</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-purple h-100">
              <div className="muted mb-2">Total you are owed</div>
              <div className="amount-lg mb-4">{fmt(owed)}</div>
              <div className="muted" style={{ fontSize: 12, letterSpacing: 1 }}>LARGEST DEBTOR</div>
              <div className="d-flex align-items-center gap-2 mt-2">
                <div className="member-dot" style={{ background: "#10b981", borderColor: "transparent" }}>A</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Aditi</div>
                  <div className="muted small">{fmt(300)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card-soft">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ fontWeight: 700, margin: 0 }}>Expense Analytics</h3>
                <span className="pill pill-purple">This Month</span>
              </div>
              <div className="row align-items-center">
                <div className="col-5 text-center"><Donut /></div>
                <div className="col-7">
                  <div className="donut-legend">
                    <div className="legend-item"><span className="legend-dot" style={{ background: "#7c3aed" }} /> Travel <span className="ms-auto fw-bold">42%</span></div>
                    <div className="legend-item"><span className="legend-dot" style={{ background: "#f59e0b" }} /> Food <span className="ms-auto fw-bold">28%</span></div>
                    <div className="legend-item"><span className="legend-dot" style={{ background: "#10b981" }} /> Shopping <span className="ms-auto fw-bold">20%</span></div>
                    <div className="legend-item"><span className="legend-dot" style={{ background: "#4292c6" }} /> Others <span className="ms-auto fw-bold">10%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontWeight: 700, margin: 0 }}>Your Groups</h3>
              <Link to="/create-group" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>+ New Group</Link>
            </div>
            {groups.slice(0, 4).map((g) => (
              <Link to={`/groups/${g.id}`} key={g.id} className="group-card">
                <div className="card-soft mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="group-icon" style={{ marginBottom: 0 }}>{g.icon}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{g.name}</div>
                        <div className="text-muted small">{g.members.length} members</div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="label-muted">{g.status}</div>
                      <div style={{
                        fontWeight: 700,
                        color: g.amount < 0 ? "var(--danger)" : g.amount > 0 ? "var(--success)" : "var(--text)",
                      }}>
                        {g.amount === 0 ? "All Settled" : fmt(g.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
