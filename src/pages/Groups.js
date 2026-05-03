import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell, { MemberDots } from "../components/Shell";

import { getUserGroups } from "../api";

export default function Groups() {
  const [groups, setGroups] = useState([]);

  const nav = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!currentUser) {
      nav("/login");
      return;
    }

    async function fetchGroups() {
      try {
        const fetchedGroups = await getUserGroups(currentUser._id);
        setGroups(fetchedGroups);
      } catch (err) {
        console.error("Failed to fetch groups", err);
      }
    }

    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, nav]);

  if (!currentUser) return null;

  return (
    <Shell>
      <div className="page">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h1 className="page-title mb-0">Your Groups</h1>
          <Link to="/create-group"><button className="btn-purple">+ New Group</button></Link>
        </div>
        <p className="page-sub">All your shared expense groups in one place.</p>
        <div className="row g-4">
          {groups.length === 0 ? <p className="text-muted mt-4">You are not part of any groups yet.</p> : groups.map((g) => (
            <div className="col-md-4" key={g._id}>
              <Link to={`/groups/${g._id}`} className="group-card">
                <div className="card-soft h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="group-icon" style={{ marginBottom: 0 }}>{g.icon || "📁"}</div>
                    <MemberDots members={g.members.map(m => m.name)} />
                  </div>
                  <h4 style={{ fontWeight: 700 }}>{g.name}</h4>
                  <div className="text-muted mb-3">{g.members.length} active members</div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>View Details</div>
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
