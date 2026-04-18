import { useState } from "react";
import Shell, { MemberDot } from "../components/Shell";

const DUMMY_ACTIVITIES = [
  { id: 1, group: "TODAY", type: "Paid", text: "Harshita paid ₹500 to Dhruvi", time: "2:45 PM", amount: "− ₹500", name: "Harshita", icon: "💸", amountColor: "var(--danger)", badgeColor: "var(--danger)" },
  { id: 2, group: "TODAY", type: "Group Expenses", text: "₹1,000 added in College Trip by Dhruvi", time: "11:20 AM", amount: "₹1,000", name: "Dhruvi", icon: "👥", amountColor: "var(--text)", badgeColor: "var(--primary)", tag: "👥 College Trip" },
  { id: 3, group: "YESTERDAY", type: "Received", text: "You received ₹300 from Heer", time: "7:10 PM", amount: "+ ₹300", name: "Heer", icon: "💰", amountColor: "var(--success)", badgeColor: "var(--success)" },
  { id: 4, group: "YESTERDAY", type: "Paid", text: "Tvisha settled ₹200 with Dhruvi", time: "4:32 PM", amount: "₹200", name: "Tvisha", icon: "🔄", amountColor: "var(--text)", badgeColor: "var(--muted)" }
];

export default function Activity() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredActivities = DUMMY_ACTIVITIES.filter(act => {
    if (filter !== "All" && act.type !== filter) return false;
    if (search && !act.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groupedActivities = filteredActivities.reduce((acc, act) => {
    if (!acc[act.group]) acc[act.group] = [];
    acc[act.group].push(act);
    return acc;
  }, {});

  return (
    <Shell>
      <div className="page w-100">
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
          <div>
            <h1 className="page-title mb-1">Activity</h1>
            <p className="page-sub mb-0">All your payments, group expenses and settlements in one place.</p>
          </div>
          <div className="d-flex gap-3 flex-wrap">
            <div className="stat-box flex-grow-1">
              <div className="text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>YOU PAID</div>
              <div style={{ color: "var(--danger)", fontWeight: 700, fontSize: 20 }}>₹950</div>
            </div>
            <div className="stat-box flex-grow-1">
              <div className="text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>YOU RECEIVED</div>
              <div style={{ color: "var(--success)", fontWeight: 700, fontSize: 20 }}>₹1,050</div>
            </div>
          </div>
        </div>

        <div className="card-soft mb-5 p-3">
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            <div className="flex-grow-1 position-relative">
              <span style={{ position: "absolute", left: 14, top: 10, color: "var(--muted)" }}>🔍</span>
              <input 
                type="text" 
                className="form-input w-100" 
                placeholder="Search by name or group..." 
                style={{ paddingLeft: 40 }} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {["All", "Paid", "Received", "Group Expenses"].map(f => (
                <span 
                  key={f} 
                  className={`filter-pill ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {Object.entries(groupedActivities).length === 0 ? (
          <div className="text-center py-5 text-muted">No activities found.</div>
        ) : (
          Object.entries(groupedActivities).map(([group, acts]) => (
            <div key={group} className="activity-group mb-5">
              <div className="activity-group-title">{group}</div>
              <div className="d-flex flex-column gap-3">
                {acts.map((act, idx) => (
                  <div key={act.id} className="activity-card" style={{ animation: `fadeIn 0.3s ease forwards ${idx*0.05}s`, opacity: 0 }}>
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between w-100 gap-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="position-relative">
                          <MemberDot name={act.name} idx={act.id} />
                          <span className="activity-badge" style={{ color: act.badgeColor }}>{act.icon}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{act.text}</div>
                          <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                            {act.tag && <span className="tag-member" style={{ padding: "2px 8px", fontSize: 11, margin: 0 }}>{act.tag}</span>}
                            <span className="text-muted small">{act.time}</span>
                            <span className="pill pill-green" style={{ fontSize: 10 }}>COMPLETED</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm-end" style={{ color: act.amountColor, fontWeight: 700, fontSize: 18 }}>
                        {act.amount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Shell>
  );
}
