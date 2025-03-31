import { GlobalAlerts } from "./components/GlobalAlerts";
import { Toaster } from "sonner";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppRoutes />
      <GlobalAlerts />
    </>
  );
}

export default App;
