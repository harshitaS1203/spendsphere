import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { getGroups, saveGroups, USERS } from "../data/store";

const ICONS = ["👥", "🏖️", "✈️", "🍽️", "🏠", "🎉", "🛒", "💼", "🎓", "📚"];

export default function CreateGroup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("👥");
  const [members, setMembers] = useState(["Harshita"]);
  const [input, setInput] = useState("");

  function addMember() {
    const v = input.trim();
    if (v && !members.includes(v)) setMembers([...members, v]);
    setInput("");
  }
  function removeMember(i) {
    setMembers(members.filter((_, idx) => idx !== i));
  }
  function create() {
    if (!name.trim()) { alert("Please enter a group name"); return; }
    const groups = getGroups();
    groups.push({
      id: name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: name.trim(),
      icon, members,
      status: "All Settled", amount: 0,
    });
    saveGroups(groups);
    nav("/groups");
  }

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
            <input className="form-control" placeholder="Enter member name" list="userList"
                   value={input} onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())} />
            <datalist id="userList">
              {USERS.map((u) => <option key={u} value={u} />)}
            </datalist>
            <button className="btn-purple" onClick={addMember}>Add</button>
          </div>

          <div className="mb-2">
            {members.map((m, i) => (
              <span key={m} className="tag-member">
                {m}{i === 0 ? " (You)" : (
                  <span className="x" onClick={() => removeMember(i)}>×</span>
                )}
              </span>
            ))}
          </div>
          <div className="text-muted small mb-4">{members.length} member{members.length !== 1 ? "s" : ""} added</div>

          <div className="d-flex gap-2">
            <Link to="/dashboard"><button className="btn-outline-purple px-4">Cancel</button></Link>
            <button className="btn-purple flex-grow-1 py-3" onClick={create}>Create Group</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
