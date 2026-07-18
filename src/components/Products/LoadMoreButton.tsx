import { Button } from "../../UI/Button";

type LoadMoreButtonProps = {
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void | Promise<void>;
  className?: string;
};

export const LoadMoreButton = ({
  loadingMore,
  hasMore,
  onLoadMore,
  className = "",
}: LoadMoreButtonProps) => {
  if (!hasMore) {
    return null;
  }

  return (
    <div className={`load-more-container ${className}`.trim()}>
      <Button onClick={() => void onLoadMore()} disabled={loadingMore}>
        {loadingMore ? "Cargando más..." : "Cargar más"}
      </Button>
    </div>
  );
};
