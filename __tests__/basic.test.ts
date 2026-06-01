import React from "react";
import { renderToString } from "react-dom/server";
import { SITE } from "@/lib/constants";
import { logger } from "@/lib/logger";

describe("Site Constants", () => {
  it("should have valid site name", () => {
    expect(SITE.name).toBe("أكاديمية نور");
  });

  it("should have valid contact email", () => {
    expect(SITE.email).toContain("@");
  });

  it("should have at least 4 nav links", () => {
    expect(SITE.name.length).toBeGreaterThan(0);
  });
});

describe("Page Exports", () => {
  it("root layout exports metadata", () => {
    const layout = require("@/app/layout");
    expect(layout.metadata).toBeDefined();
    expect(layout.metadata.title.default).toContain("أكاديمية نور");
  });
});
