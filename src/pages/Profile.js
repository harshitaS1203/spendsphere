import { useState, useEffect } from "react";
import Shell from "../components/Shell";
import { useCurrency } from "../CurrencyContext";
import { getUserGroups, getUserTransactions, getUserExpenses } from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { fmt } = useCurrency();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [groups, setGroups] = useState([]);
  const [owed, setOwed] = useState(0); // what they owe me (lent)
  const [owe, setOwe] = useState(0);   // what I owe (owed)
  const [totalSpent, setTotalSpent] = useState(0);


  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    async function fetchData() {
      try {
        const fetchedGroups = await getUserGroups(currentUser._id);
        setGroups(fetchedGroups || []);

        const fetchedTransactions = await getUserTransactions(currentUser._id);
        let tempOwe = 0;
        let tempOwed = 0;

        if (fetchedTransactions) {
          fetchedTransactions.forEach(t => {
            if (!t.isSettled) {
              if (t.fromUser && t.fromUser._id === currentUser._id) {
                tempOwe += t.amount;
              } else if (t.toUser && t.toUser._id === currentUser._id) {
                tempOwed += t.amount;
              }
            }
          });
        }

        setOwe(tempOwe);
        setOwed(tempOwed);

        const expenses = await getUserExpenses(currentUser._id);
        let myTotalSpent = 0;
        if (expenses) {
          expenses.forEach(e => {
            // Check if user is in splitBetween list
            const splitIds = e.splitBetween.map(u => u._id || u);
            if (splitIds.includes(currentUser._id)) {
              myTotalSpent += e.amount / e.splitBetween.length;
            }
          });
        }
        setTotalSpent(myTotalSpent);

      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, navigate]);

  if (!currentUser) return null;

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
                }}>{currentUser.name[0].toUpperCase()}</div>
                <div className="flex-grow-1">
                  <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 4 }}>{currentUser.name}</h1>


                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <span className="px-3 py-2" style={{ background: "var(--bg)", borderRadius: 10, fontSize: 14 }}>📧 {currentUser.email}</span>
                    <span className="px-3 py-2" style={{ background: "var(--bg)", borderRadius: 10, fontSize: 14 }}>📍 Mumbai, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card-soft h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="label-muted mb-0">Total spent</div>

              </div>
              <div className="amount mb-auto">{fmt(totalSpent)}</div>
              <div className="mt-3">
                

              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-soft h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="label-muted mb-0">Total owed</div>
              </div>
              <div className="amount amount-red mb-auto">{fmt(owe)}</div>
              
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-soft h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="label-muted mb-0">Total lent</div>
              </div>
              <div className="amount amount-green mb-auto">{fmt(owed)}</div>
              
            </div>
          </div>
        </div>

        <div className="card-soft">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Top Groups</h3>
          {groups.length === 0 ? <p className="text-muted">No groups joined yet.</p> : groups.slice(0, 3).map((g) => (
            <div key={g._id} className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="group-icon" style={{ marginBottom: 0, width: 40, height: 40, fontSize: 20 }}>{g.icon || "👥"}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div className="text-muted small">{g.members.length} members</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
