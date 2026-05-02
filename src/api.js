const API_URL = 'http://localhost:5001/api';

// Users
export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error('Failed to register');
  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Invalid email or password');
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

// Groups
export const createGroup = async (name, members, icon) => {
  const res = await fetch(`${API_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, members, icon }),
  });
  if (!res.ok) throw new Error('Failed to create group');
  return res.json();
};

export const getUserGroups = async (userId) => {
  const res = await fetch(`${API_URL}/groups/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch groups');
  return res.json();
};

export const getGroupById = async (groupId) => {
  const res = await fetch(`${API_URL}/groups/${groupId}`);
  if (!res.ok) throw new Error('Failed to fetch group');
  return res.json();
};

// Expenses
export const addExpense = async (expenseData) => {
  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData),
  });
  if (!res.ok) throw new Error('Failed to add expense');
  return res.json();
};

export const getGroupExpenses = async (groupId) => {
  const res = await fetch(`${API_URL}/expenses/${groupId}`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
};

export const getUserExpenses = async (userId) => {
  const res = await fetch(`${API_URL}/expenses/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user expenses');
  return res.json();
};

// Transactions
export const getUserTransactions = async (userId) => {
  const res = await fetch(`${API_URL}/transactions/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const settleTransaction = async (transactionId) => {
  const res = await fetch(`${API_URL}/transactions/${transactionId}/settle`, {
    method: 'PUT',
  });
  if (!res.ok) throw new Error('Failed to settle transaction');
  return res.json();
};

export const settleBetween = async (groupId, user1Id, user2Id) => {
  const res = await fetch(`${API_URL}/transactions/settle-between`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ groupId, user1Id, user2Id }),
  });
  if (!res.ok) throw new Error('Failed to settle between users');
  return res.json();
};

// Reminders
export const getReminders = async (userId) => {
  const res = await fetch(`${API_URL}/reminders/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch reminders');
  return res.json();
};
