import { Routes, Route } from "react-router-dom";
import Home from "../features/home/HomePage";
import Dashboard from "../features/dashboard/DashboardPage";
import Invoices from "../features/invoice/Invoices";
import LoginPage from "../features/auth/LoginPage";
import SettingsPage from "../features/settings/SettingsPage";
import VehiclesPage from "../features/vehicles/VehiclesPage";
import MyVehiclesPage from "../features/vehicles/MyVehiclesPage";

import AdminLayout from "../features/dashboard/components/AdminLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/my-vehicles" element={<MyVehiclesPage />} />
      <Route path="/admin" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice" element={<Invoices />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
      </Route>
    </Routes>
  );
}
