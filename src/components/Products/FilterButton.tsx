import { Button } from "../../UI/Button";

type Props = {
  label: string;
  active?: boolean;
  onClick: () => void;
};

export const FilterButton = ({
  label,
  active,
  onClick
}: Props) => {

  return (
    <Button
      onClick={onClick}
      className={`filter-button ${active ? "active" : ""}`}
    >
      {label}
    </Button>
  );
};