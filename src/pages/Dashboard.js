import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { useCurrency } from "../CurrencyContext";
import { getUserGroups, getUserTransactions, getUserExpenses } from "../api";

function Donut({ categoryTotals }) {
  const { fmt } = useCurrency();
  const C = 502.4; // 2*PI*80

  const total = Object.values(categoryTotals || {}).reduce((a, b) => a + b, 0);

  const colors = {
    Travel: "#7c3aed",
    Food: "#f59e0b",
    Shopping: "#10b981",
    Others: "#4292c6"
  };

  const segs = total > 0 ? Object.entries(categoryTotals).map(([cat, val]) => ({
    v: val / total,
    color: colors[cat] || "#94a3b8",
    label: cat
  })).filter(s => s.v > 0) : [
    { v: 1, color: "#e5e7eb", label: "No expenses" }
  ];

  let off = 0;
  return (
    <div className="d-flex align-items-center gap-4">
      <div style={{ position: "relative" }}>
        <svg viewBox="0 0 200 200" width="200" height="200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="30" />
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
          <text x="100" y="95" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor">{fmt(total)}</text>
          <text x="100" y="115" textAnchor="middle" fontSize="11" fill="#64748b">TOTAL EXPENSES</text>
        </svg>
      </div>
      {total > 0 && (
        <div className="donut-legend">
          {segs.map(s => (
            <div key={s.label} className="legend-item">
              <div className="legend-dot" style={{ background: s.color }} />
              <div style={{ minWidth: 80 }}>{s.label}</div>
              <div className="text-muted small">{Math.round(s.v * 100)}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [owe, setOwe] = useState(0);
  const [owed, setOwed] = useState(0);
  const [owedByDetails, setOwedByDetails] = useState([]);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [groupsIOwe, setGroupsIOwe] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});
  const { fmt } = useCurrency();
  const nav = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!currentUser) {
      nav("/login");
      return;
    }

    async function fetchData() {
      // 1. Fetch Groups
      try {
        const fetchedGroups = await getUserGroups(currentUser._id);
        setGroups(fetchedGroups || []);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }

      // 2. Fetch Transactions
      try {
        const fetchedTransactions = await getUserTransactions(currentUser._id);
        let tempOwe = 0;
        let tempOwed = 0;
        let owedMap = {};
        let groupsIOweMap = {};

        if (fetchedTransactions && fetchedTransactions.length > 0) {
          fetchedTransactions.forEach(t => {
            if (!t.isSettled) {
              if (t.fromUser && t.fromUser._id === currentUser._id) {
                tempOwe += t.amount;
                if (t.groupId) {
                  groupsIOweMap[t.groupId._id] = t.groupId;
                }
              } else if (t.toUser && t.toUser._id === currentUser._id) {
                tempOwed += t.amount;
                if (t.fromUser) {
                  if (!owedMap[t.fromUser._id]) {
                    owedMap[t.fromUser._id] = { name: t.fromUser.name, amount: 0 };
                  }
                  owedMap[t.fromUser._id].amount += t.amount;
                }
              }
            }
          });
        }
        setOwe(tempOwe);
        setOwed(tempOwed);
        const sortedDebtors = Object.values(owedMap).sort((a, b) => b.amount - a.amount);
        setOwedByDetails(sortedDebtors.slice(0, 1));
        setGroupsIOwe(Object.values(groupsIOweMap));
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }

      // 3. Fetch Expenses for Donut
      try {
        const expenses = await getUserExpenses(currentUser._id);
        const cats = { Travel: 0, Food: 0, Shopping: 0, Others: 0 };
        if (expenses && expenses.length > 0) {
          expenses.forEach(e => {
            const splitIds = e.splitBetween.map(u => u._id || u);
            if (splitIds.includes(currentUser._id)) {
              const myShare = e.amount / e.splitBetween.length;
              const cat = e.category || 'Others';
              if (cats[cat] !== undefined) cats[cat] += myShare;
              else cats[cat] = myShare;
            }
          });
        }
        setCategoryTotals(cats);
      } catch (err) {
        console.error("Failed to fetch user expenses", err);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, nav]);

  if (!currentUser) return null;

  return (
    <Shell>
      <div className="page">
        <h1 className="page-title">Hello {currentUser.name}!</h1>
        <p className="page-sub">Ready to harmonize your shared finances today?</p>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card-soft h-100">
              <div className="label-muted mb-2">Total you owe</div>
              <div className="amount-lg mb-3" style={{ color: "var(--danger)" }}>{fmt(owe)}</div>
              <div className="d-flex gap-2 mt-auto">
                <button className="btn-green" onClick={() => setShowSettleModal(true)}>Settle Now</button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card-purple h-100 d-flex flex-column">
              <div className="muted mb-2">Total you are owed</div>
              <div className="amount-lg mb-4">{fmt(owed)}</div>
              {owedByDetails.length > 0 && (
                <div className="mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "12px" }}>
                  <div className="muted mb-2" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Who owes you</div>
                  <div className="d-flex flex-column gap-2" style={{ maxHeight: "120px", overflowY: "auto" }}>
                    {owedByDetails.map((person, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center">
                        <span style={{ fontWeight: 500, fontSize: "14px" }}>{person.name}</span>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>{fmt(person.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card-soft">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ fontWeight: 700, margin: 0 }}>Expense Analytics</h3>
                <span className="pill pill-purple">Realtime</span>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center gap-4 mt-4">
                <div className="text-center"><Donut categoryTotals={categoryTotals} /></div>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontWeight: 700, margin: 0 }}>Your Groups</h3>
              <Link to="/create-group" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>+ New Group</Link>
            </div>
            {groups.length === 0 ? <p className="text-muted">No groups yet.</p> : groups.slice(0, 4).map((g) => (
              <Link to={`/groups/${g._id}`} key={g._id} className="group-card">
                <div className="card-soft mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="group-icon" style={{ marginBottom: 0 }}>{g.icon || "📁"}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{g.name}</div>
                        <div className="text-muted small">{g.members.length} members</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {showSettleModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }} onClick={() => setShowSettleModal(false)}>
          <div className="card-soft" style={{
            width: "100%", maxWidth: "400px", background: "var(--bg)", 
            position: "relative", padding: "24px", borderRadius: "16px"
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowSettleModal(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--muted)", lineHeight: 1 }}
            >×</button>
            <h3 style={{ fontWeight: 700, marginBottom: "8px", marginTop: 0 }}>Settle Up</h3>
            <p className="text-muted mb-4">Select a group to settle your debts.</p>
            
            {groupsIOwe.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎉</div>
                You don't owe anything!
              </div>
            ) : (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {groupsIOwe.map(g => {
                  const fullGroup = groups.find(grp => grp._id === g._id) || g;
                  return (
                  <Link 
                    key={g._id} 
                    to={`/groups/${g._id}/summary`} 
                    className="group-card card-soft" 
                    style={{ textDecoration: "none", padding: "12px", transition: "transform 0.2s", margin: 0 }}
                    onClick={() => setShowSettleModal(false)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="group-icon" style={{ marginBottom: 0, fontSize: "24px", width: "40px", height: "40px" }}>{fullGroup.icon || "📁"}</div>
                      <div style={{ fontWeight: 600, fontSize: "16px", color: "var(--text)" }}>{fullGroup.name}</div>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
}
