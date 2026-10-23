import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { breadcrumbsFor, isActive, navItems, settingsItems } from "./navigation.ts";

describe("navigation", () => {
  it("keeps unique menu hrefs", () => {
    const hrefs = navItems.map((item) => item.href);
    assert.equal(new Set(hrefs).size, hrefs.length);
  });

  it("marks only the matching section active", () => {
    assert.equal(isActive("/", "/"), true);
    assert.equal(isActive("/contracts", "/"), false);
    assert.equal(isActive("/contracts/new", "/contracts"), true);
    assert.equal(isActive("/settings/users", "/settings"), true);
    assert.equal(isActive("/settings/users", "/contracts"), false);
  });

  it("builds contract and settings crumbs", () => {
    assert.deepEqual(
      breadcrumbsFor("/contracts/ck123").map((crumb) => crumb.label),
      ["계약관리", "계약 상세"],
    );
    assert.equal(breadcrumbsFor("/contracts/new").at(-1)?.label, "신규 계약");
    assert.equal(breadcrumbsFor("/settings/roles").at(-1)?.label, "권한관리");
  });

  it("keeps settings links inside the settings section", () => {
    for (const item of settingsItems) {
      assert.equal(item.href.startsWith("/settings/"), true);
    }
  });
});
