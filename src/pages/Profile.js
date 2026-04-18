import Shell from "../components/Shell";
import { getGroups, fmt } from "../data/store";

export default function Profile() {
  const groups = getGroups();
  return (
    <Shell>
      <div className="page">
        <div className="row g-4 mb-4">
          <div className="col-md-7">
            <div className="card-soft">
              <div className="d-flex gap-4">
                <div style={{
                  width: 120, height: 120, borderRadius: "50%", background: "var(--primary)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 48, fontWeight: 700,
                }}>H</div>
                <div className="flex-grow-1">
                  <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>Harshita</h1>
                  <span className="pill pill-green mb-3 d-inline-block">PRO MEMBER</span>

                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <span className="px-3 py-2" style={{ background: "var(--bg)", borderRadius: 10, fontSize: 14 }}>📧 harshita12@gmail.com</span>
                    <span className="px-3 py-2" style={{ background: "var(--bg)", borderRadius: 10, fontSize: 14 }}>📍 Mumbai, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card-soft">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div style={{ fontSize: 32 }}>💰</div>
                <span className="pill pill-green">YTD Stats</span>
              </div>
              <div className="label-muted">Total spent</div>
              <div className="amount mb-3">{fmt(8920)}</div>
              <div style={{ height: 6, background: "var(--bg)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: "65%", height: "100%", background: "var(--primary)" }} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-soft">
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔴</div>
              <div className="label-muted">Total owed</div>
              <div className="amount amount-red mb-3">{fmt(4205)}</div>
              <div className="small" style={{ color: "var(--success)", fontWeight: 600 }}>TO 4 FRIENDS</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-soft">
              <div style={{ fontSize: 32, marginBottom: 12 }}>💚</div>
              <div className="label-muted">Total lent</div>
              <div className="amount amount-green mb-3">{fmt(1500)}</div>
              <div className="small" style={{ color: "var(--success)", fontWeight: 600 }}>DUE THIS WEEK</div>
            </div>
          </div>
        </div>

        <div className="card-soft">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Top Groups</h3>
          {groups.slice(0, 3).map((g) => (
            <div key={g.id} className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="member-dot" style={{ background: "var(--primary)" }}>{g.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div className="text-muted small">{g.members.length} members</div>
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>{g.amount === 0 ? "Settled" : fmt(g.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
