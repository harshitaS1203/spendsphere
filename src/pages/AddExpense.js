import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { getUserGroups, addExpense } from "../api";

const AddExpense = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState(currentUser?._id || "");
    const [category, setCategory] = useState("Others");
    const [splitType, setSplitType] = useState("equal");
    const [customSplitMembers, setCustomSplitMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        async function fetchGroups() {
            try {
                const fetchedGroups = await getUserGroups(currentUser._id);
                setGroups(fetchedGroups);
                if (fetchedGroups.length > 0) {
                    setSelectedGroupId(fetchedGroups[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch groups", err);
            } finally {
                setLoading(false);
            }
        }
        fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?._id, navigate]);

    const activeGroup = groups.find((g) => String(g._id) === String(selectedGroupId)) || groups[0];
    const members = activeGroup ? activeGroup.members : [];

    // Reset custom split members and paidBy when group changes
    useEffect(() => {
        if (members.length > 0) {
            setCustomSplitMembers(members.map(m => String(m._id)));
            
            // Ensure paidBy is a valid member of the newly selected group
            const isValidPayer = members.some(m => String(m._id) === String(paidBy));
            if (!isValidPayer) {
                const me = members.find(m => String(m._id) === String(currentUser?._id));
                setPaidBy(me ? String(me._id) : String(members[0]._id));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGroupId, members]);

    const handleToggleCustomMember = (memberId) => {
        const mId = String(memberId);
        if (customSplitMembers.includes(mId)) {
            // Ensure at least one member remains selected
            if (customSplitMembers.length > 1) {
                setCustomSplitMembers(customSplitMembers.filter(id => id !== mId));
            }
        } else {
            setCustomSplitMembers([...customSplitMembers, mId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid description and amount.");
            return;
        }

        setSubmitting(true);
        try {
            const splitIds = splitType === "custom" ? customSplitMembers : members.map(m => m._id);
            const expenseData = {
                groupId: selectedGroupId,
                description: description,
                amount: Number(amount),
                paidBy: paidBy,
                splitBetween: splitIds,
                splitType: splitType,
                category: category
            };
            await addExpense(expenseData);
            navigate(`/groups/${selectedGroupId}`);
        } catch (err) {
            console.error(err);
            alert("Failed to add expense");
        } finally {
            setSubmitting(false);
        }
    };

    if (!currentUser || loading) return <Shell><div className="page">Loading...</div></Shell>;

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
                    {groups.length === 0 ? (
                        <p className="text-muted">You need to be part of a group to add an expense.</p>
                    ) : (
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
                                    <option key={g._id} value={g._id}>
                                        {g.icon || "📁"} {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DESCRIPTION + CATEGORY + AMOUNT */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            <div className="form-group mb-0">
                                <label className="form-label-upper mb-2 d-block">DESCRIPTION</label>
                                <input className="form-input" placeholder="Coffee, dinner, gas..." 
                                       value={description} onChange={e => setDescription(e.target.value)} required />
                            </div>

                            <div className="form-group mb-0">
                                <label className="form-label-upper mb-2 d-block">CATEGORY</label>
                                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="Food">Food</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <div className="form-group mb-0" style={{ gridColumn: "span 2" }}>
                                <label className="form-label-upper mb-2 d-block">AMOUNT</label>
                                <input className="form-input" placeholder="₹ 0.00" type="number"
                                       value={amount} onChange={e => setAmount(e.target.value)} required />
                            </div>
                        </div>

                        {/* PAID BY */}
                        <div className="form-group mb-4">
                            <label className="form-label-upper mb-2 d-block">PAID BY</label>
                            <select className="form-select" value={paidBy} onChange={e => setPaidBy(e.target.value)}>
                                {members.map((m) => (
                                    <option key={m._id} value={m._id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* SPLIT TYPE */}
                        <div className="form-group mb-4">
                            <label className="form-label-upper mb-2 d-block">SPLIT METHOD</label>
                            <div className="split-options mb-3">
                                {["Equal", "Custom"].map((type) => {
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

                            {splitType === "custom" && (
                                <div className="split-members-list mt-3">
                                    <label className="form-label-upper mb-2 d-block">Select members to split with:</label>
                                    {members.map(m => (
                                        <div key={m._id} className="d-flex align-items-center gap-3 py-2">
                                            <input 
                                                type="checkbox" 
                                                id={`member-${m._id}`}
                                                checked={customSplitMembers.includes(m._id)}
                                                onChange={() => handleToggleCustomMember(m._id)}
                                                style={{ width: 18, height: 18, cursor: "pointer" }}
                                            />
                                            <label htmlFor={`member-${m._id}`} style={{ cursor: "pointer", fontWeight: 500 }}>
                                                {m.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SUBMIT */}
                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn-purple px-4 py-2" disabled={submitting}>
                                {submitting ? "Posting..." : "Post Expense"}
                            </button>
                        </div>
                    </form>
                    )}
                </div>
            </div>
        </Shell>
    );
};

export default AddExpense;