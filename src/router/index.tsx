import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../components/sections/Service";
import Form from "../pages/Form";
import Dashboard from "../pages/Dashboard";
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
