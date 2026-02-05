import { Routes, Route } from "react-router-dom";
import Home from "../features/home/HomePage";
import Form from "../features/form/FormPage";
import Dashboard from "../features/dashboard/DashboardPage";
import Invoices from "../features/invoice/Invoices";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<Form />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/invoice" element={<Invoices />} />
    </Routes>
  );
}
