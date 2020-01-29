import Calculator from "../Calculator";

describe("calculate", function() {
  it("add", function() {
    let result = Calculator.Sum(5, 2);
    expect(result).toBe(7);
  });

  it("substract", function() {
    let result = Calculator.Difference(5, 2);
    expect(result).toBe(3);
  });
});
