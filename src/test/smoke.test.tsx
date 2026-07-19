import { describe, expect, test } from "vitest";
import { renderWithProvider } from "./renderWithProvider";

describe("renderWithProvider", () => {
  test("renderiza correctamente", () => {
    const { getByText } = renderWithProvider(<h1>hola test</h1>);

    expect(getByText("hola test")).toBeInTheDocument();
  });
});
