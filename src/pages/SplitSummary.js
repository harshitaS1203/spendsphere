import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Shell, { MemberDot } from "../components/Shell";
import { getGroupById, getUserTransactions, getGroupExpenses, settleBetween } from "../api";
import { useCurrency } from "../CurrencyContext";

export default function SplitSummary() {
  const { id } = useParams();
  const { fmt } = useCurrency();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [group, setGroup] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [categories, setCategories] = useState({});
  const [totalPending, setTotalPending] = useState(0);
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

        const transactionsData = await getUserTransactions(currentUser._id);
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
        let total = 0;
        for (const [otherId, amount] of Object.entries(balances)) {
          if (Math.abs(amount) > 0.01) {
            total += Math.abs(amount);
            if (amount < 0) {
              netSettlements.push({
                _id: otherId,
                from: currentUser.name,
                to: userNames[otherId],
                amount: Math.abs(amount)
              });
            } else {
              netSettlements.push({
                _id: otherId,
                from: userNames[otherId],
                to: currentUser.name,
                amount: amount
              });
            }
          }
        }
        setSettlements(netSettlements);
        setTotalPending(total);

        // Fetch expenses to calculate categories
        const expensesData = await getGroupExpenses(id);
        let catTotals = { Travel: 0, Food: 0, Shopping: 0, Others: 0 };
        let totalExp = 0;
        expensesData.forEach(e => {
          const cat = e.category || 'Others';
          catTotals[cat] = (catTotals[cat] || 0) + e.amount;
          totalExp += e.amount;
        });

        const catPercentages = {};
        for (const [cat, amt] of Object.entries(catTotals)) {
          if (totalExp > 0) {
            catPercentages[cat] = Math.round((amt / totalExp) * 100);
          } else {
            catPercentages[cat] = 0;
          }
        }
        setCategories(catPercentages);

      } catch (err) {
        console.error("Failed to fetch summary data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, currentUser, navigate]);

  const handleSettle = async (otherId) => {
    try {
      await settleBetween(id, currentUser._id, otherId);
      window.location.reload();
    } catch (err) {
      alert("Failed to settle");
      console.error(err);
    }
  };

  if (!currentUser || loading) return <Shell><div className="page">Loading...</div></Shell>;
  if (!group) return <Shell><div className="page">Group not found.</div></Shell>;


  return (
    <Shell>
      <div className="page">
        <div className="text-muted mb-2">
          <Link to="/groups" className="text-muted text-decoration-none">Groups</Link> ›
          <Link to={`/groups/${group._id}`} className="text-muted text-decoration-none"> {group.name}</Link> ›
          <span style={{ color: "var(--primary)" }}> Split Summary</span>
        </div>

        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h1 className="page-title">Split Summary</h1>
            <p className="page-sub">Detailed breakdown of debts and settlements.</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7">
            {settlements.length === 0 && (
              <div className="card-soft text-center py-4 text-muted">All settled! 🎉</div>
            )}
            {settlements.map((s, i) => (
              <div className="card-soft mb-3" key={s._id}>
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
                  <button className="btn-green" onClick={() => handleSettle(s._id)}>Settle Now</button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-5">
            <div className="card-purple mb-3">
              <div className="muted" style={{ fontSize: 12, letterSpacing: 1 }}>TOTAL PENDING</div>
              <div className="amount-lg mb-3">{fmt(totalPending)}</div>
              <div className="muted">Across {settlements.length} settlements in {group.name}</div>
            </div>
            <div className="card-soft">
              <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Spending Categories</h4>
              {Object.entries(categories).filter(([_, val]) => val > 0).map(([cat, val]) => (
                 <div className="d-flex justify-content-between mb-3" key={cat}>
                   <span>{cat}</span><strong>{val}%</strong>
                 </div>
              ))}
              {Object.entries(categories).filter(([_, val]) => val > 0).length === 0 && (
                 <div className="text-muted">No expenses yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
