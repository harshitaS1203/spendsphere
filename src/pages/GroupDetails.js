import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Shell, { MemberDot } from "../components/Shell";
import { getGroups, saveGroups, GROUP_DETAILS, USERS } from "../data/store";
import { useCurrency } from "../CurrencyContext";

export default function GroupDetails() {
  const { id } = useParams();
  const { fmt } = useCurrency();
  const navigate = useNavigate();
  const [groups, setGroups] = useState(getGroups());
  const [newMemberName, setNewMemberName] = useState("");
  
  const group = groups.find((g) => g.id === id) || groups[0];
  const details = GROUP_DETAILS[id] || { expenses: [], settlements: [] };

  const handleDeleteGroup = () => {
    if (window.confirm(`Are you sure you want to delete ${group.name}?`)) {
      const newGroups = groups.filter(g => g.id !== group.id);
      saveGroups(newGroups);
      navigate("/groups");
    }
  };

  const handleRemoveMember = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member}?`)) {
      const newGroups = groups.map(g => {
        if (g.id === group.id) {
          return { ...g, members: g.members.filter(m => m !== member) };
        }
        return g;
      });
      setGroups(newGroups);
      saveGroups(newGroups);
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    if (group.members.includes(newMemberName.trim())) {
      alert("Member already in group!");
      return;
    }
    const updatedGroups = groups.map(g => {
      if (g.id === group.id) {
        return { ...g, members: [...g.members, newMemberName.trim()] };
      }
      return g;
    });
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    setNewMemberName("");
  };

  return (
    <Shell>
      <div className="page">
        <div className="text-muted mb-2">
          <Link to="/groups" className="text-muted text-decoration-none">Groups</Link> ›
          <span style={{ color: "var(--primary)" }}> {group.name}</span>
        </div>

        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="group-icon" style={{ marginBottom: 0, width: 64, height: 64, fontSize: 32 }}>{group.icon}</div>
          <div>
            <h1 className="page-title mb-1">{group.name}</h1>
            <p className="page-sub mb-0">{group.members.length} members · Detailed breakdown</p>
          </div>
          <div className="ms-auto d-flex gap-2">
            <button className="btn-outline-purple" onClick={handleDeleteGroup} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>Delete Group</button>
            <Link to={`/groups/${group.id}/summary`}><button className="btn-outline-purple">View Summary</button></Link>
            <button className="btn-green">Settle Up</button>
          </div>
        </div>

        <div className="card-soft mb-4">
          <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Members</h4>
          <div className="d-flex flex-wrap align-items-center gap-2">
            {group.members.map((m, i) => (
              <span key={m} className="tag-member d-inline-flex align-items-center gap-2">
                <MemberDot name={m} idx={i} />
                <span style={{ fontWeight: 500 }}>{m}</span>
                <button 
                  onClick={() => handleRemoveMember(m)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--danger)', 
                    cursor: 'pointer',
                    padding: '0 4px',
                    fontSize: '14px',
                    lineHeight: 1
                  }}
                  title={`Remove ${m}`}
                >
                  ✕
                </button>
              </span>
            ))}
            <form onSubmit={handleAddMember} className="d-flex align-items-center gap-2 ms-2">
              <select
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                style={{ width: '140px', background: 'var(--bg)', border: 'none', borderRadius: '8px', padding: '6px 12px', color: 'var(--text)', outline: 'none' }}
              >
                <option value="" disabled>Add friend...</option>
                {USERS.filter(u => !group.members.includes(u)).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <button type="submit" className="btn-green" style={{ padding: '6px 12px', fontSize: '14px' }}>Add</button>
            </form>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-7 d-flex flex-column gap-4">
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
              {details.expenses.length === 0 && (
                <p className="text-muted text-center py-4">No expenses yet.</p>
              )}
              {details.expenses.map((e, i) => (
                <div className="expense-row" key={i}>
                  <div className="d-flex align-items-center">
                    <div className="cat-icon">{e.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{e.desc}</div>
                      <div className="text-muted small">{e.paidBy} paid · {e.category}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{fmt(e.amount)}</div>
                </div>
              ))}
            </div>

            <div className="card-soft">
              <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Who Owes Whom</h4>
              {details.settlements.length === 0 && (
                <p className="text-muted text-center py-3">All settled up! 🎉</p>
              )}
              {details.settlements.map((s, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-3 mb-2"
                     style={{ background: "var(--bg)", borderRadius: 12 }}>
                  <div className="d-flex align-items-center gap-2">
                    <strong>{s.from}</strong>
                    <span className="text-muted">owes</span>
                    <strong>{s.to}</strong>
                  </div>
                  <div style={{ color: "var(--success)", fontWeight: 700 }}>{fmt(s.amount)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-5">
            <div className="card-soft chat-container">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 style={{ fontWeight: 700, margin: 0 }}>Group Chat</h4>
                <span className="text-muted fw-bold" style={{ cursor: "pointer", letterSpacing: 2 }}>...</span>
              </div>
              
              <div className="chat-messages">
                <div className="chat-message left">
                  <div className="chat-sender">Dhruvi</div>
                  <div className="chat-bubble">Hey! Did we include the museum tickets? 🎟️</div>
                  <div className="chat-reaction">👍 2</div>
                </div>
                
                <div className="chat-message right mt-2">
                  <div className="chat-bubble">Not yet, let me add it now.</div>
                </div>
                
                <div className="chat-message left mt-2">
                  <div className="chat-sender">Tvisha</div>
                  <div className="chat-bubble">Awesome, thanks! That makes things easier.</div>
                  <div className="chat-reaction">💖 1</div>
                </div>
              </div>
              
              <div className="chat-input-wrapper">
                <input type="text" className="chat-input" placeholder="Type a message..." />
                <button className="btn-send" style={{ fontSize: 14 }}>▶</button>
              </div>
              
              <div className="emoji-toolbar">
                <span>😊</span>
                <span>😂</span>
                <span>🎉</span>
                <span>🔥</span>
                <span>🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
