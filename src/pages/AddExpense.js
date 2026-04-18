import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Shell, { MemberDot } from "../components/Shell";
import { getGroups } from "../data/store";

const AddExpense = () => {
    const [splitType, setSplitType] = useState("equal");
    const navigate = useNavigate();

    const groups = getGroups();
    const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || "");

    const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
    const members = activeGroup ? activeGroup.members : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/dashboard"); // go back after submit
    };

    return (
        <Shell>
            <div className="page w-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h1 className="page-title mb-0">Add Expense</h1>
                    <button className="btn-close" onClick={() => navigate(-1)} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>×</button>
                </div>
                <p className="page-sub mb-4">
                    Record a new shared expense and split it instantly.
                </p>

                <div className="card-soft">
                    <form onSubmit={handleSubmit}>
                        {/* GROUP */}
                        <div className="form-group mb-4">
                            <label className="form-label-upper mb-2 d-block">Choose a group</label>
                            <select 
                                className="form-select" 
                                value={selectedGroupId} 
                                onChange={(e) => setSelectedGroupId(e.target.value)}
                                style={{ padding: "14px 16px", fontSize: 16 }}
                            >
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.icon} {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DESCRIPTION + AMOUNT */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            <div className="form-group mb-0">
                                <label className="form-label-upper mb-2 d-block">DESCRIPTION</label>
                                <input className="form-input" placeholder="Coffee, dinner, gas..." />
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label-upper mb-2 d-block">AMOUNT</label>
                                <input className="form-input" placeholder="₹ 0.00" />
                            </div>
                        </div>

                        {/* PAID BY + CATEGORY */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                            <div className="form-group mb-0">
                                <label className="form-label-upper mb-2 d-block">PAID BY</label>
                                <select className="form-select">
                                    {members.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label-upper mb-2 d-block">CATEGORY</label>
                                <select className="form-select">
                                    <option>Dining Out</option>
                                    <option>Travel</option>
                                    <option>Shopping</option>
                                    <option>Groceries</option>
                                    <option>Others</option>
                                </select>
                            </div>
                        </div>

                        {/* SPLIT TYPE */}
                        <div className="form-group mb-4">
                            <label className="form-label-upper mb-2 d-block">SPLIT METHOD</label>
                            <div className="split-options">
                                {["Equal", "Custom", "Percentage"].map((type) => {
                                    const val = type.toLowerCase();
                                    return (
                                        <button
                                            type="button"
                                            key={val}
                                            className={`split-option ${splitType === val ? "active" : ""}`}
                                            onClick={() => setSplitType(val)}
                                            style={{ padding: "12px" }}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* MEMBERS */}
                        <div className="split-members-list mb-4" style={{ borderTop: "none", marginTop: 0 }}>
                            {members.map((m, i) => (
                                <div key={m} className="split-member-item" style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <MemberDot name={m} idx={i} />
                                        <span style={{ fontWeight: 600 }}>{m}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="text-muted">₹0.00</span>
                                        <span style={{ color: "var(--success)" }}>✓</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SUBMIT */}
                        <button className="form-submit mt-2" style={{ width: "100%", padding: "16px", fontSize: 16 }}>
                            Post Expense
                        </button>
                    </form>
                </div>
            </div>
        </Shell>
    );
};

export default AddExpense;