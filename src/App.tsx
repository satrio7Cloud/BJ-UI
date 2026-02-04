import ScrollTop from "./shared/components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./router/AppRoutes";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
      <ScrollTop />
    </>
  );
}

export default App;
