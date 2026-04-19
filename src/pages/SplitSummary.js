import { Link, useParams } from "react-router-dom";
import Shell, { MemberDot } from "../components/Shell";
import { getGroups, GROUP_DETAILS } from "../data/store";
import { useCurrency } from "../CurrencyContext";

export default function SplitSummary() {
  const { id } = useParams();
  const { fmt } = useCurrency();
  const groups = getGroups();
  const group = groups.find((g) => g.id === id) || groups[0];
  const details = GROUP_DETAILS[id] || { settlements: [] };
  const total = details.settlements.reduce((a, s) => a + s.amount, 0);

  return (
    <Shell>
      <div className="page">
        <div className="text-muted mb-2">
          <Link to="/groups" className="text-muted text-decoration-none">Groups</Link> ›
          <Link to={`/groups/${group.id}`} className="text-muted text-decoration-none"> {group.name}</Link> ›
          <span style={{ color: "var(--primary)" }}> Split Summary</span>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="page-title">Split Summary</h1>
            <p className="page-sub">Detailed breakdown of debts and settlements.</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontWeight: 600 }}>Simplify Payments</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            {details.settlements.length === 0 && (
              <div className="card-soft text-center py-4 text-muted">All settled! 🎉</div>
            )}
            {details.settlements.map((s, i) => (
              <div className="card-soft mb-3" key={i}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flow-card">
                    <MemberDot name={s.from} idx={i} />
                    <span className="arrow">→</span>
                    <MemberDot name={s.to} idx={i + 1} />
                    <div className="ms-2">
                      <div><strong>{s.to}</strong> gets <strong>{fmt(s.amount)}</strong> from <strong>{s.from}</strong></div>
                      <div className="text-muted small">Tap to settle this transaction</div>
                    </div>
                  </div>
                  <button className="btn-green">Settle Now</button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-5">
            <div className="card-purple mb-3">
              <div className="muted" style={{ fontSize: 12, letterSpacing: 1 }}>TOTAL PENDING</div>
              <div className="amount-lg mb-3">{fmt(total)}</div>
              <div className="muted">Across {details.settlements.length} settlements in {group.name}</div>
            </div>
            <div className="card-soft">
              <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Spending Categories</h4>
              <div className="d-flex justify-content-between mb-3"><span>✈️ Travel</span><strong>64%</strong></div>
              <div className="d-flex justify-content-between mb-3"><span>🍽️ Food & Drink</span><strong>22%</strong></div>
              <div className="d-flex justify-content-between"><span>🎒 Leisure</span><strong>14%</strong></div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
