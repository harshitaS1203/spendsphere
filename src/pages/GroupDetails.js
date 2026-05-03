import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Shell, { MemberDot } from "../components/Shell";
import { useCurrency } from "../CurrencyContext";
import { getGroupById, getGroupExpenses, getUserTransactions } from "../api";

export default function GroupDetails() {
  const { id } = useParams();
  const { fmt } = useCurrency();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        const groupData = await getGroupById(id);
        setGroup(groupData);

        const expensesData = await getGroupExpenses(id);
        setExpenses(expensesData);

        const transactionsData = await getUserTransactions(currentUser._id);
        // Filter transactions for this specific group
        const groupSettlements = transactionsData.filter(t => t.groupId && t.groupId._id === id && !t.isSettled);
        
        // Aggregate balances
        const balances = {};
        const userNames = {};

        groupSettlements.forEach(t => {
          if (t.fromUser._id === currentUser._id) {
            const otherId = t.toUser._id;
            userNames[otherId] = t.toUser.name;
            balances[otherId] = (balances[otherId] || 0) - t.amount;
          } else if (t.toUser._id === currentUser._id) {
            const otherId = t.fromUser._id;
            userNames[otherId] = t.fromUser.name;
            balances[otherId] = (balances[otherId] || 0) + t.amount;
          }
        });

        const netSettlements = [];
        for (const [otherId, amount] of Object.entries(balances)) {
          if (Math.abs(amount) > 0.01) {
            if (amount < 0) {
              netSettlements.push({
                _id: otherId, // using otherId as a stable key
                fromUser: { name: currentUser.name },
                toUser: { name: userNames[otherId] },
                amount: Math.abs(amount)
              });
            } else {
              netSettlements.push({
                _id: otherId,
                fromUser: { name: userNames[otherId] },
                toUser: { name: currentUser.name },
                amount: amount
              });
            }
          }
        }

        setSettlements(netSettlements);
      } catch (err) {
        console.error("Failed to fetch group details", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, currentUser, navigate]);

  const handleDeleteGroup = () => {
    alert("Delete not fully implemented in API yet, skipping for safety.");
  };



  if (!currentUser || loading) return <Shell><div className="page">Loading...</div></Shell>;
  if (!group) return <Shell><div className="page">Group not found.</div></Shell>;

  return (
    <Shell>
      <div className="page">
        <div className="text-muted mb-2">
          <Link to="/groups" className="text-muted text-decoration-none">Groups</Link> ›
          <span style={{ color: "var(--primary)" }}> {group.name}</span>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="group-icon" style={{ marginBottom: 0, width: 64, height: 64, fontSize: 32 }}>{group.icon || "📁"}</div>
          <div>
            <h1 className="page-title mb-1">{group.name}</h1>
            <p className="page-sub mb-0">{group.members.length} members · Detailed breakdown</p>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button className="btn-outline-purple" onClick={handleDeleteGroup} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>Delete Group</button>
            <Link to={`/groups/${group._id}/summary`}><button className="btn-outline-purple">View Summary</button></Link>
          </div>
        </div>

        <div className="card-soft mb-4">
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Members</h4>
          <div className="d-flex flex-wrap align-items-center gap-2">
            {group.members.map((m, i) => (
              <span key={m._id} className="tag-member d-inline-flex align-items-center gap-2">
                <MemberDot name={m.name} idx={i} />
                <span style={{ fontWeight: 500 }}>{m.name}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 d-flex flex-column gap-4">
            <div className="card-soft">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 style={{ fontWeight: 700, margin: 0 }}>Expenses</h4>
                <button 
                  className="btn-purple" 
                  style={{ padding: '6px 12px', fontSize: '14px', borderRadius: '8px' }} 
                  onClick={() => navigate("/add-expense")}
                >
                  + Add Expense
                </button>
              </div>
              {expenses.length === 0 && (
                <p className="text-muted text-center py-4">No expenses yet.</p>
              )}
              {expenses.map((e) => {
                const isCustom = e.splitType === 'custom';
                return (
                  <div className="expense-row" key={e._id}>
                    <div className="d-flex align-items-center">
                      <div>
                        <div style={{ fontWeight: 600 }}>{e.description}</div>
                        <div className="text-muted small">
                          {e.paidBy.name} paid 
                          {isCustom && (() => {
                            const otherMembers = e.splitBetween
                                .filter(u => String(u._id) !== String(e.paidBy._id))
                                .map(u => u.name);
                            const splitText = otherMembers.length > 0 
                                ? `(Custom split with ${otherMembers.join(", ")})` 
                                : `(Custom split)`;
                            return <span className="ms-1" style={{color: "var(--primary)"}}>{splitText}</span>;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{fmt(e.amount)}</div>
                  </div>
                );
              })}
            </div>

            <div className="card-soft">
              <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Your Outstanding Balances</h4>
              {settlements.length === 0 && (
                <p className="text-muted text-center py-3">All settled up! 🎉</p>
              )}
              {settlements.map((s) => (
                <div key={s._id} className="d-flex align-items-center justify-content-between p-3 mb-2"
                     style={{ background: "var(--bg)", borderRadius: 12 }}>
                  <div className="d-flex align-items-center gap-2">
                    <strong>{s.fromUser.name}</strong>
                    <span className="text-muted">owes</span>
                    <strong>{s.toUser.name}</strong>
                  </div>
                  <div style={{ color: "var(--success)", fontWeight: 700 }}>{fmt(s.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
