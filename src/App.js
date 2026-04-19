import { Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./CurrencyContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import SplitSummary from "./pages/SplitSummary";
import CreateGroup from "./pages/CreateGroup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AddExpense from "./pages/AddExpense";
import Activity from "./pages/Activity";

export default function App() {
  return (
    <CurrencyProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
        <Route path="/groups/:id/summary" element={<SplitSummary />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/activity" element={<Activity />} />
      </Routes>
    </CurrencyProvider>
  );
}
