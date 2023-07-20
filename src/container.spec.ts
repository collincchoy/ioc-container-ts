import { describe, expect, it } from "vitest";
import { Container } from "./container";

describe("container", () => {
  it("initializes correctly", () => {
    const container = new Container();

    expect(container).toBeDefined();
  });

  it("can register and resolve services", () => {
    const container = new Container();

    container.register("hansolo", () => ({}));

    expect(container.resolve("hansolo")).toBeTypeOf("object");
  });
});
