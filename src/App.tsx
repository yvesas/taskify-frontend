import { GlobalToast } from "./components/GlobalToast";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <>
      <AppRoutes />
      <GlobalToast />
    </>
  );
}

export default App;
