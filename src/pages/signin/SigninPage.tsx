import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthForm } from "../../components/Auth/AuthForm";
import { useAuth } from "../../contexts/auth/useAuth";

export const SigninPage = () => {
  const { signin, signinWhitGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    await signin(email, password);
    navigate(from, { replace: true });
  };

  const handleGoogle = async () => {
    await signinWhitGoogle();
    navigate(from, { replace: true });
  };

  return (
    <main>
      <AuthForm
        title="Iniciar sesión"
        submitLabel="Entrar"
        onSubmit={handleSubmit}
        footer={
          <>
          <button type="button" className="auth-form__google" onClick={handleGoogle}>
            Iniciar con Google
          </button>
          <p className="auth-form__footer-text">
          ¿Aún no tenés cuenta? <Link to="/signup">Registrarse</Link>
        </p>
          </>
        }
      />
    </main>
  );
};