import type { ReactNode } from "react";

type ErrorStateProps = {
  id: string;
  error: string | null;
  children: ReactNode;
  fallback?: ReactNode;
};

export function ErrorState({
  id,
  error,
  children,
  fallback = <p>Ocurrió un error al cargar los productos.</p>,
}: ErrorStateProps) {
  return (
    <section data-state-id={id}>
      {error ? fallback : children}
    </section>
  );
}