import "./Skeleton.css";

type SkeletonProps = {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
};

export function Skeleton({
  width,
  height = "1rem",
  borderRadius = "0.35rem",
  className = "",
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton width="100%" height="15rem" borderRadius="0.5rem" />
      <div className="skeleton-card__body">
        <Skeleton width="70%" height="1.1rem" />
        <Skeleton width="40%" height="1rem" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="product-list">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </section>
  );
}
