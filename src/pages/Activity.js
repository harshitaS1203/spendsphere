import { useState, useEffect } from "react";
import Shell, { MemberDot } from "../components/Shell";
import { useCurrency } from "../CurrencyContext";
import { getUserTransactions } from "../api";
import { useNavigate } from "react-router-dom";

export default function Activity() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { fmt } = useCurrency();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [youPaid, setYouPaid] = useState(0);
  const [youReceived, setYouReceived] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        const fetchedTransactions = await getUserTransactions(currentUser._id);
        
        let paid = 0;
        let received = 0;
        const mappedActs = [];

        fetchedTransactions.forEach((t, i) => {
          const isPending = !t.isSettled;
          if (t.fromUser._id === currentUser._id) {
            if (isPending) paid += t.amount;
            mappedActs.push({
              id: t._id || i,
              group: isPending ? "PENDING" : "SETTLED",
              type: "Paid",
              textTpl: (f) => isPending ? `You owe ${t.toUser.name} ${f(t.amount)}` : `You paid ${t.toUser.name} ${f(t.amount)}`,
              time: new Date(t.createdAt).toLocaleDateString(),
              amountPrefix: "− ",
              amountVal: t.amount,
              name: t.toUser.name,
              amountColor: isPending ? "var(--danger)" : "var(--muted)",
              tag: t.groupId?.name ? `${t.groupId.icon || "📁"} ${t.groupId.name}` : "",
              isSettled: !isPending
            });
          } else if (t.toUser._id === currentUser._id) {
            if (isPending) received += t.amount;
            mappedActs.push({
              id: t._id || i,
              group: isPending ? "PENDING" : "SETTLED",
              type: "Received",
              textTpl: (f) => isPending ? `${t.fromUser.name} owes you ${f(t.amount)}` : `${t.fromUser.name} paid you ${f(t.amount)}`,
              time: new Date(t.createdAt).toLocaleDateString(),
              amountPrefix: "+ ",
              amountVal: t.amount,
              name: t.fromUser.name,
              amountColor: isPending ? "var(--success)" : "var(--muted)",
              tag: t.groupId?.name ? `${t.groupId.icon || "📁"} ${t.groupId.name}` : "",
              isSettled: !isPending
            });
          }
        });

        setYouPaid(paid);
        setYouReceived(received);
        setActivities(mappedActs);
      } catch (err) {
        console.error("Failed to fetch activity data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, navigate]);

  const filteredActivities = activities.filter(act => {
    if (filter !== "All" && act.type !== filter) return false;
    const text = act.textTpl(fmt);
    if (search && !text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groupedActivities = filteredActivities.reduce((acc, act) => {
    if (!acc[act.group]) acc[act.group] = [];
    acc[act.group].push(act);
    return acc;
  }, {});

  if (!currentUser) return null;

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
              <div className="text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>YOU OWE</div>
              <div style={{ color: "var(--danger)", fontWeight: 700, fontSize: 20 }}>{fmt(youPaid)}</div>
            </div>
            <div className="stat-box flex-grow-1">
              <div className="text-muted" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>YOU ARE OWED</div>
              <div style={{ color: "var(--success)", fontWeight: 700, fontSize: 20 }}>{fmt(youReceived)}</div>
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
              {["All", "Paid", "Received"].map(f => (
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

        {loading ? (
          <div className="text-center py-5 text-muted">Loading activities...</div>
        ) : Object.entries(groupedActivities).length === 0 ? (
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
                          <MemberDot name={act.name} idx={idx} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{act.textTpl(fmt)}</div>
                          <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                            {act.tag && <span className="tag-member" style={{ padding: "2px 8px", fontSize: 11, margin: 0 }}>{act.tag}</span>}
                            <span className="text-muted small">{act.time}</span>
                            <span className="pill" style={{ fontSize: 10, background: "var(--bg)", color: act.isSettled ? "var(--success)" : "inherit" }}>
                              {act.isSettled ? "SETTLED" : "PENDING"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm-end" style={{ color: act.amountColor, fontWeight: 700, fontSize: 18 }}>
                        {act.amountPrefix}{fmt(act.amountVal)}
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
