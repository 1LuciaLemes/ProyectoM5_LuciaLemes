import type { ReactNode } from "react";

type EmptyStateProps = {
  id: string;
  isEmpty: boolean;
  children: ReactNode;
  fallback?: ReactNode;
};

export function EmptyState({
  id,
  isEmpty,
  children,
  fallback = <p>No hay productos para mostrar.</p>,
}: EmptyStateProps) {
  return <section data-state-id={id}>{isEmpty ? fallback : children}</section>;
}
