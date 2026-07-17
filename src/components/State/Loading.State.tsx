import type { ReactNode } from "react";

type LoadingStateProps = {
  id: string;
  loading: boolean;
  children?: ReactNode;
  fallback?: ReactNode;
};

export function LoadingState({
  id,
  loading,
  children = null,
  fallback = <p>Cargando...</p>,
}: LoadingStateProps) {
  return (
    <section data-state-id={id}>
      {loading ? fallback : children}
    </section>
  );
}