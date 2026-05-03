import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { createGroup, getAllUsers } from "../api";

const ICONS = ["👥", "🏖️", "✈️", "🍽️", "🏠", "🎉", "🛒", "💼", "🎓", "📚"];

export default function CreateGroup() {
  const nav = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("👥");
  
  // Store full user objects in members, starting with currentUser
  const [members, setMembers] = useState(currentUser ? [currentUser] : []);
  
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      nav("/login");
      return;
    }
    async function fetchUsers() {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, nav]);

  function addMember() {
    const v = input.trim().toLowerCase();
    if (!v) return;
    
    // Find user by name or email
    const user = allUsers.find(u => u.name.toLowerCase() === v || u.email.toLowerCase() === v);
    if (!user) {
      alert("User not found!");
      return;
    }

    if (!members.find(m => m._id === user._id)) {
      setMembers([...members, user]);
    }
    setInput("");
  }

  function removeMember(i) {
    if (i === 0) return; // don't remove creator
    setMembers(members.filter((_, idx) => idx !== i));
  }

  async function create() {
    if (!name.trim()) { alert("Please enter a group name"); return; }
    setLoading(true);
    try {
      // Create array of just the IDs for the backend
      const memberIds = members.map(m => m._id);
      await createGroup(name.trim(), memberIds, icon);
      nav("/groups");
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  }

  if (!currentUser) return null;

  return (
    <Shell>
      <div className="page w-100">
        <div className="text-muted mb-2">
          <Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link> ›
          <span style={{ color: "var(--primary)" }}> New Group</span>
        </div>
        <h1 className="page-title">Create New Group</h1>
        <p className="page-sub">Set up a group and add members to start splitting expenses.</p>

        <div className="card-soft">
          <label className="label-muted mb-2 d-block">Group Name</label>
          <input className="form-control mb-4" placeholder="e.g. Goa Trip 2024"
                 value={name} onChange={(e) => setName(e.target.value)} />

          <label className="label-muted mb-2 d-block">Pick an Icon</label>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {ICONS.map((ic) => (
              <div key={ic}
                   className={"icon-pick" + (ic === icon ? " selected" : "")}
                   onClick={() => setIcon(ic)}>{ic}</div>
            ))}
          </div>

          <label className="label-muted mb-2 d-block">Add Members</label>
          <div className="d-flex gap-2 mb-3">
            <input className="form-control" placeholder="Enter member name or email" list="userList"
                   value={input} onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())} />
            <datalist id="userList">
              {allUsers.filter(u => u._id !== currentUser._id).map((u) => <option key={u._id} value={u.email}>{u.name}</option>)}
            </datalist>
            <button className="btn-purple" onClick={addMember}>Add</button>
          </div>

          <div className="mb-2">
            {members.map((m, i) => (
              <span key={m._id} className="tag-member">
                {m.name}{i === 0 ? " (You)" : (
                  <span className="x" onClick={() => removeMember(i)}>×</span>
                )}
              </span>
            ))}
          </div>
          <div className="text-muted small mb-4">{members.length} member{members.length !== 1 ? "s" : ""} added</div>

          <div className="d-flex gap-2 justify-content-start">
            <Link to="/dashboard"><button className="btn-outline-purple px-4">Cancel</button></Link>
            <button className="btn-purple px-4" onClick={create} disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
