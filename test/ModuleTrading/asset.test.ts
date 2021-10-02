function x(a, b) {
  return a + b;
}

test("test", () => {
  expect(x(1, 2)).toBe(3);
});
