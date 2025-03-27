import BackgroundPaths from "@/components/ui/background-paths";
import { LoginForm } from "../../components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <BackgroundPaths>
      <div className="flex justify-center items-center h-screen">
        <div className="border p-6 rounded-md shadow-md w-96 bg-background">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <LoginForm />
        </div>
      </div>
    </BackgroundPaths>
  );
};
