export const USERS = ["Harshita", "Dhruvi", "Heer", "Tvisha", "Anuja", "Riya", "Aditi", "Karan"];
export const CURRENT_USER = "Harshita";

export const DEFAULT_GROUPS = [
  { id: "college-trip",   name: "College Trip",   icon: "🎓", members: ["Harshita", "Dhruvi", "Heer", "Tvisha"],          status: "You owe",      amount: -500 },
  { id: "school-buddies", name: "School Buddies", icon: "📚", members: ["Harshita", "Anuja", "Riya"],                     status: "All Settled",  amount: 0    },
  { id: "goa-trip",       name: "Goa Trip",       icon: "🏖️", members: ["Harshita", "Anuja", "Riya", "Aditi", "Karan"],   status: "You are owed", amount: 300  },
  { id: "flatmates",      name: "Flatmates",      icon: "🏠", members: ["Harshita", "Dhruvi", "Tvisha"],                  status: "You owe",      amount: -700 },
  { id: "birthday-party", name: "Birthday Party", icon: "🎉", members: ["Harshita", "Heer", "Anuja", "Aditi"],            status: "All Settled",  amount: 0    },
];

export const GROUP_DETAILS = {
  "college-trip": {
    expenses: [
      { paidBy: "Harshita", desc: "Hotel", amount: 1000, category: "Travel", icon: "🏨" },
      { paidBy: "Dhruvi",   desc: "Cab",   amount: 500,  category: "Travel", icon: "🚕" },
      { paidBy: "Harshita", desc: "Lunch", amount: 600,  category: "Food",   icon: "🍽️" },
    ],
    settlements: [
      { from: "Heer",   to: "Harshita", amount: 300 },
      { from: "Tvisha", to: "Harshita", amount: 200 },
      { from: "Tvisha", to: "Dhruvi",   amount: 150 },
    ],
  },
  "goa-trip": {
    expenses: [
      { paidBy: "Harshita", desc: "Beach Resort",    amount: 5000, category: "Travel",   icon: "🏖️" },
      { paidBy: "Anuja",    desc: "Seafood Dinner",  amount: 1800, category: "Food",     icon: "🍽️" },
      { paidBy: "Riya",     desc: "Souvenirs",       amount: 900,  category: "Shopping", icon: "🛍️" },
    ],
    settlements: [
      { from: "Aditi", to: "Harshita", amount: 300 },
      { from: "Karan", to: "Anuja",    amount: 400 },
    ],
  },
  "school-buddies": { expenses: [], settlements: [] },
  "flatmates": {
    expenses: [
      { paidBy: "Dhruvi", desc: "Groceries", amount: 2100, category: "Food",   icon: "🛒" },
      { paidBy: "Tvisha", desc: "WiFi Bill", amount: 900,  category: "Others", icon: "📶" },
    ],
    settlements: [{ from: "Harshita", to: "Dhruvi", amount: 700 }],
  },
  "birthday-party": { expenses: [], settlements: [] },
};

export function getGroups() {
  const stored = localStorage.getItem("spendsphere_groups");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("spendsphere_groups", JSON.stringify(DEFAULT_GROUPS));
  return DEFAULT_GROUPS;
}
export function saveGroups(g) {
  localStorage.setItem("spendsphere_groups", JSON.stringify(g));
}
export function memberColor(idx) {
  const colors = ["#7c3aed", "#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];
  return colors[idx % colors.length];
}
