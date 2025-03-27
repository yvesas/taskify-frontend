import BackgroundPaths from "@/components/ui/background-paths";
import { RegisterForm } from "../../components/auth/RegisterForm";

export const RegisterPage = () => {
  return (
    <BackgroundPaths>
      <div className="flex justify-center items-center h-screen">
        <div className="border p-6 rounded-md shadow-md w-96 bg-background">
          <h2 className="text-2xl font-semibold mb-4">Registrar</h2>
          <RegisterForm />
        </div>
      </div>
    </BackgroundPaths>
  );
};
