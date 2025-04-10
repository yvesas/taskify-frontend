import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, RegisterData } from "@/schemas/validations";
import { useAlertStore } from "@/stores/useAlertStore";
import { globalAlertHandler } from "@/utils/globalAlertHandler";
import { useAuthStore } from "@/stores/useAuthStore";

export const RegisterForm = () => {
  const { register: registerUser } = useAuthStore();
  const { showAlert } = useAlertStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data.email, data.password);
      showAlert("Registro realizado com sucesso!", "success");
    } catch (error) {
      globalAlertHandler(error);
    }
  };

  const renderFieldError = (errorMessage?: string) =>
    errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {renderFieldError(errors.email?.message)}
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Senha"
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {renderFieldError(errors.password?.message)}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Registrando..." : "Registrar"}
      </Button>
    </form>
  );
};
