import AccountRibbon from "../AccountRibbon";

describe("AccountRibbon", () => {
  it("should have a closeOpporunities method", () => {
    expect(typeof AccountRibbon.closeOpporunities).toBe("function");
  });

  it("should have a closeOpportunitiesInternal method", () => {
    expect(typeof AccountRibbon.closeOpportunitiesInternal).toBe("function");
  });
});
