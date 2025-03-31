import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { useIsAuthenticated } from "../stores/useAuthStore";
import { ErrorBoundaryWrapper } from "@/components/ErrorBoundary";
const TasksPage = lazy(() => import("@/pages/tasks/TasksPage"));
const LoginPage = lazy(() => import("@/pages/login/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/register/RegisterPage"));
import { PageLoader } from "@/components/PageLoader";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Router>
      <ErrorBoundaryWrapper>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TasksPage />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/tasks" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </ErrorBoundaryWrapper>
    </Router>
  );
};
