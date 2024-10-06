import { describe } from "mocha";
import { expect } from "chai";

describe("Math operations", () => {
  it("should add two integer numbers", () => {
    const result = 10 + 10;
    expect(result).to.equal(20);
  });

  it("testing with array", () => {
    const array = [1, 2, 3];
    expect(array).to.include(3);
  });
});
