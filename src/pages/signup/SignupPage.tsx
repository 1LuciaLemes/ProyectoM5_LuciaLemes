import { useNavigate } from "react-router-dom";
import { AuthForm } from "../../components/Auth/AuthForm";
import { useAuth } from "../../contexts/auth/useAuth";

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ name, email, password }: { name?: string; email: string; password: string }) => {
    if (!name) {
      throw new Error("El nombre es obligatorio para registrarse.");
    }

    await signup(name, email, password);
    navigate("/", { replace: true });
  };

  return (
    <main>
      <AuthForm
        title="Crear cuenta"
        submitLabel="Registrarme"
        showName
        showConfirm
        onSubmit={handleSubmit}
      />
    </main>
  );
};