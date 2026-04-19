import { Link } from "react-router-dom";
import Shell, { MemberDots } from "../components/Shell";
import { getGroups } from "../data/store";
import { useCurrency } from "../CurrencyContext";

export default function Groups() {
  const groups = getGroups();
  const { fmt } = useCurrency();
  return (
    <Shell>
      <div className="page">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h1 className="page-title mb-0">Your Groups</h1>
          <Link to="/create-group"><button className="btn-purple">+ New Group</button></Link>
        </div>
        <p className="page-sub">All your shared expense groups in one place.</p>
        <div className="row g-4">
          {groups.map((g) => (
            <div className="col-md-4" key={g.id}>
              <Link to={`/groups/${g.id}`} className="group-card">
                <div className="card-soft h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="group-icon" style={{ marginBottom: 0 }}>{g.icon}</div>
                    <MemberDots members={g.members} />
                  </div>
                  <h4 style={{ fontWeight: 700 }}>{g.name}</h4>
                  <div className="text-muted mb-3">{g.members.length} active members</div>
                  <div className="label-muted">{g.status}</div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div style={{
                      fontWeight: 700, fontSize: 18,
                      color: g.amount < 0 ? "var(--danger)" : g.amount > 0 ? "var(--success)" : "var(--text)",
                    }}>
                      {g.amount === 0 ? "All Settled" : fmt(g.amount)}
                    </div>
                    <span style={{ color: "var(--muted)" }}>→</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
