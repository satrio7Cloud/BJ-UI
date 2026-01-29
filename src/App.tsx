import { Routes, Route } from "react-router-dom";
import ScrollTop from "./components/common/ScrollToTop";

import Home from "./pages/Home";
import Form from "./pages/Form";
// import Success from "./pages/Success";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        {/* <Route path="/success" element={<Success />} /> */}
      </Routes>

      <ScrollTop />
    </>
  );
}

export default App;
