import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../UI/Button";
import "./AuthForm.css";

type AuthFormProps = {
  title: string;
  submitLabel: string;
  showName?: boolean;
  showConfirm?: boolean;
  onSubmit: (data: {
    name?: string;
    email: string;
    password: string;
  }) => Promise<void>;
  footer?: ReactNode;
};

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function validateEmail(email: string): string | undefined {
  if (!email.trim()) return "El email es obligatorio.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Ingresá un email válido.";
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  return undefined;
}

export function AuthForm({
  title,
  submitLabel,
  showName = false,
  showConfirm = false,
  onSubmit,
  footer,
}: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof FieldErrors, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let err: string | undefined;
    if (field === "email") err = validateEmail(value);
    else if (field === "password") err = validatePassword(value);
    else if (field === "name" && showName && !value.trim()) err = "El nombre es obligatorio.";
    else if (field === "confirmPassword" && showConfirm && value !== password) err = "Las contraseñas no coinciden.";

    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const newErrors: FieldErrors = {};
    if (showName) newErrors.name = !name.trim() ? "El nombre es obligatorio." : undefined;
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);
    if (showConfirm && password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    setFieldErrors(newErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    setSubmitting(true);

    try {
      await onSubmit({
        name: showName ? name.trim() : undefined,
        email: email.trim(),
        password,
      });
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Ocurrió un error al enviar el formulario.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-form">
      <h1>{title}</h1>

      <form className="auth-form__form" onSubmit={handleSubmit}>
        {showName && (
          <label className="auth-form__field">
            Nombre
            <input
              className="auth-form__input"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => handleBlur("name", name)}
              placeholder="Tu nombre"
              required
            />
            {touched.name && fieldErrors.name && (
              <span className="auth-form__field-error">{fieldErrors.name}</span>
            )}
          </label>
        )}

        <label className="auth-form__field">
          Email
          <input
            className="auth-form__input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => handleBlur("email", email)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
          {touched.email && fieldErrors.email && (
            <span className="auth-form__field-error">{fieldErrors.email}</span>
          )}
        </label>

        <label className="auth-form__field">
          Contraseña
          <input
            className="auth-form__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={() => handleBlur("password", password)}
            placeholder="********"
            required
          />
          {touched.password && fieldErrors.password && (
            <span className="auth-form__field-error">{fieldErrors.password}</span>
          )}
        </label>

        {showConfirm && (
          <label className="auth-form__field">
            Confirmar contraseña
            <input
              className="auth-form__input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onBlur={() => handleBlur("confirmPassword", confirmPassword)}
              placeholder="Repite la contraseña"
              required
            />
            {touched.confirmPassword && fieldErrors.confirmPassword && (
              <span className="auth-form__field-error">{fieldErrors.confirmPassword}</span>
            )}
          </label>
        )}

        {error && <p className="error-text">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Procesando..." : submitLabel}
        </Button>
      </form>

      {footer}
    </section>
  );
}
