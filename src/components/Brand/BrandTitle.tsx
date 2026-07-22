type BrandTitleProps = {
  children?: string;
};

export function BrandTitle({ children = "ƒragranza" }: BrandTitleProps) {
  return <h1>{children}</h1>;
}
