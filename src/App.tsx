import { Routes, Route } from "react-router-dom";
import ScrollTop from "./components/common/ScrollToTop";

import Home from "./pages/Home";
import Form from "./pages/Form";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
// import Success from "./pages/Success";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoice" element={<Invoices />} />
        {/* <Route path="/success" element={<Success />} /> */}
      </Routes>

      <ScrollTop />
    </>
  );
}

export default App;
