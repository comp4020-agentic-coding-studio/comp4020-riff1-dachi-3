import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Crit 1's own spec, on top of the shipped invariants: plain HTML/CSS with no
// JavaScript, and a real site — several content pages, all reachable from home.
// https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/api/crits/01-forgotten-web.json
const DIST = resolve("dist");

function distFiles(dir: string = DIST): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return distFiles(path);
    return [path];
  });
}

const files = distFiles();
const htmlFiles = files.filter((path) => extname(path) === ".html");
const pages = htmlFiles.map((path) => ({
  name: relative(DIST, path),
  doc: new JSDOM(readFileSync(path, "utf8")).window.document,
}));

describe("crit 1: no JavaScript", () => {
  it("ships no .js files", () => {
    const jsFiles = files.filter((path) => extname(path) === ".js");
    expect(jsFiles).toEqual([]);
  });

  for (const { name, doc } of pages) {
    it(`${name} has no <script> tags`, () => {
      expect(doc.querySelectorAll("script").length).toBe(0);
    });

    it(`${name} has no inline event handlers`, () => {
      for (const el of doc.querySelectorAll("*")) {
        for (const attr of el.attributes) {
          expect(
            attr.name.startsWith("on"),
            `<${el.tagName.toLowerCase()}> has a JS event handler: ${attr.name}`,
          ).toBe(false);
        }
      }
    });
  }
});

describe("crit 1: a real site", () => {
  it("has a handful of content pages beyond the home page", () => {
    expect(pages.length).toBeGreaterThanOrEqual(4);
  });

  const home = pages.find(({ name }) => name === "index.html");
  const otherPages = pages.filter(({ name }) => name !== "index.html");

  it("links from the home page to every other page", () => {
    const hrefs = new Set(
      Array.from(home!.doc.querySelectorAll("a[href]")).map((a) =>
        a.getAttribute("href")!.replace(/^\.\//, ""),
      ),
    );
    for (const { name } of otherPages) {
      expect(hrefs.has(name), `home page doesn't link to ${name}`).toBe(true);
    }
  });
});
