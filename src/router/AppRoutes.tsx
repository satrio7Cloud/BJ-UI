import { Route, Routes } from "react-router-dom";
import LoginPage from "../features/admin/auth/LoginPage";
import Dashboard from "../features/admin/dashboard/DashboardPage";
import Invoices from "../features/admin/invoice/Invoices";
import SettingsPage from "../features/admin/settings/SettingsPage";
import VehiclesPage from "../features/admin/vehicles/VehiclesPage";
import CheckoutPage from "../features/user/checkout/CheckoutPage";
import Home from "../features/user/home/HomePage";
import QrisPaymentPage from "../features/user/invoice/QrisPaymentPage";
import ServicesPage from "../features/user/services/ServicesPage";
import MyVehiclesPage from "../features/user/vehicles/MyVehiclesPage";

import AdminLayout from "../features/admin/dashboard/components/AdminLayout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/layanan" element={<ServicesPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-vehicles" element={<MyVehiclesPage />} />
            <Route path="/pay/:orderId" element={<QrisPaymentPage />} />
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
