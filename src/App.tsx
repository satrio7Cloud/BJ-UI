import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollTop from "./shared/components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./router/AppRoutes";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
      <ScrollTop />
    </>
  );
}

export default App;
