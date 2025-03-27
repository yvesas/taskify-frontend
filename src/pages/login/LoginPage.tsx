import { LoginForm } from "../../components/auth/LoginForm";

export const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <LoginForm />
      </div>
    </div>
  );
};
