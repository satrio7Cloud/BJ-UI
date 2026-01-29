import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../components/sections/Service";
import Form from "../pages/Form";
// import Succes

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/form" element={<Form />} />
        {/* // <Route path="/success" element={<Success />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
