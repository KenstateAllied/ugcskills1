import { buildAssetUrl } from "./utils/assetUrl";

test("buildAssetUrl normalizes uploaded file paths", () => {
  expect(buildAssetUrl("uploads\\profile.png")).toContain("uploads/profile.png");
});
