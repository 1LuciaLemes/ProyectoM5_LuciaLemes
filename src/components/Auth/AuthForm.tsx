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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    if (showName && !name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (showConfirm && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

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
              placeholder="Tu nombre"
              required
            />
          </label>
        )}

        <label className="auth-form__field">
          Email
          <input
            className="auth-form__input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </label>

        <label className="auth-form__field">
          Contraseña
          <input
            className="auth-form__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required
          />
        </label>

        {showConfirm && (
          <label className="auth-form__field">
            Confirmar contraseña
            <input
              className="auth-form__input"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repite la contraseña"
              required
            />
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
