import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../features/home/HomePage";
import Services from "../features/home/sections/Service";
import Form from "../features/home/FormPage";
import Dashboard from "../features/dashboard/DashboardPage";
import Invoices from "../pages/Invoices";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/form" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice" element={<Invoices />} />
        {/* // <Route path="/success" element={<Success />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
