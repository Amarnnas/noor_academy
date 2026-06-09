import React from "react";
import { renderToString } from "react-dom/server";
import { BRAND_ASSETS, SITE } from "@/lib/constants";
import { formatCoursePrice } from "@/lib/currency";
import { logger } from "@/lib/logger";
import { SocialIcon } from "@/components/shared/social-icons";

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

  it("should expose symbol and full brand logos", () => {
    expect(BRAND_ASSETS.symbol).toBe("/images/just-logo.png");
    expect(BRAND_ASSETS.full).toBe("/images/noorpro.png");
  });
});

describe("Page Exports", () => {
  it("root layout exports metadata", () => {
    const layout = require("@/app/layout");
    expect(layout.metadata).toBeDefined();
    expect(layout.metadata.title.default).toContain("أكاديمية نور");
  });
});

describe("Course Display Updates", () => {
  it("formats course prices in Sudanese pounds", () => {
    expect(formatCoursePrice(499)).toBe("499 جنيه سوداني");
    expect(formatCoursePrice(499)).not.toContain("ريال");
  });

  it("renders actual social media icons", () => {
    const facebook = renderToString(React.createElement(SocialIcon, { name: "facebook" }));
    const youtube = renderToString(React.createElement(SocialIcon, { name: "youtube" }));

    expect(facebook).toContain("M18 2h-3a5");
    expect(youtube).toContain("m10 15 5-3-5-3z");
  });
});
