import { describe, it, expect } from "vitest";
import {
  CLIP_TYPES,
  detectClipType,
  generateClipTitle,
  summarizeClip,
  normalizeImportedClip,
} from "../clipboardUtils";

describe("clipboardUtils", () => {
  describe("CLIP_TYPES", () => {
    it("should contain expected types", () => {
      expect(CLIP_TYPES).toContain("Prompt");
      expect(CLIP_TYPES).toContain("API Key");
      expect(CLIP_TYPES).toContain("Token");
      expect(CLIP_TYPES).toContain("Command");
      expect(CLIP_TYPES).toContain("Note");
      expect(CLIP_TYPES).toContain("Template");
      expect(CLIP_TYPES).toContain("JSON");
      expect(CLIP_TYPES).toContain("Markdown");
      expect(CLIP_TYPES).toContain("Other");
    });
  });

  describe("detectClipType", () => {
    it("should detect JSON type", () => {
      expect(detectClipType('{"key": "value"}')).toBe("JSON");
      expect(detectClipType("[1, 2, 3]")).toBe("JSON");
    });

    it("should detect Markdown type", () => {
      expect(detectClipType("# Heading")).toBe("Markdown");
      expect(detectClipType("## Subheading")).toBe("Markdown");
      expect(detectClipType("```code```")).toBe("Markdown");
      expect(detectClipType("- [ ] task")).toBe("Markdown");
      expect(detectClipType("[link](url)")).toBe("Markdown");
    });

    it("should detect Command type", () => {
      expect(detectClipType("npm install")).toBe("Command");
      expect(detectClipType("git status")).toBe("Command");
      expect(detectClipType("docker ps")).toBe("Command");
    });

    it("should detect API Key type", () => {
      expect(detectClipType("sk-1234567890abcdef")).toBe("API Key");
    });

    it("should default to Note for plain text", () => {
      expect(detectClipType("Hello world")).toBe("Note");
      expect(detectClipType("")).toBe("Note");
    });
  });

  describe("generateClipTitle", () => {
    it("should generate title from first line", () => {
      const title = generateClipTitle("First line\nSecond line");
      expect(title).toBe("First line");
    });

    it("should truncate long titles", () => {
      const longText = "a".repeat(200);
      const title = generateClipTitle(longText);
      expect(title.length).toBeLessThanOrEqual(50);
      expect(title).toContain("...");
    });

    it("should handle empty content with time-based title", () => {
      const title = generateClipTitle("");
      expect(title).toMatch(/^Clip · \d{2}:\d{2}$/);
    });

    it("should generate type-based titles", () => {
      const jsonTitle = generateClipTitle('{"key": "value"}');
      expect(jsonTitle).toMatch(/^JSON Snippet · \d{2}:\d{2}$/);

      const mdTitle = generateClipTitle("# Heading");
      expect(mdTitle).toMatch(/^Markdown Note · \d{2}:\d{2}$/);
    });
  });

  describe("summarizeClip", () => {
    it("should show content for non-sensitive clips", () => {
      const clip = {
        id: "1",
        title: "Test",
        content: "Hello world",
        type: "Note" as const,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
        favorite: false,
        sensitive: false,
        encrypted: false,
        note: "",
      };
      expect(summarizeClip(clip)).toBe("Hello world");
    });

    it("should show content for sensitive clips when revealed", () => {
      const clip = {
        id: "1",
        title: "Test",
        content: "secret",
        type: "API Key" as const,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
        favorite: false,
        sensitive: true,
        encrypted: false,
        note: "",
      };
      expect(summarizeClip(clip, "secret")).toBe("secret");
    });

    it("should hide encrypted content when not revealed", () => {
      const clip = {
        id: "1",
        title: "Test",
        content: "secret",
        type: "API Key" as const,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
        favorite: false,
        sensitive: true,
        encrypted: true,
        note: "",
      };
      const summary = summarizeClip(clip);
      expect(summary).toContain("encrypted content");
      expect(summary).not.toBe("secret");
    });
  });

  describe("normalizeImportedClip", () => {
    it("should normalize valid clip", () => {
      const input = {
        id: "test-id",
        title: "Test",
        content: "Hello",
        type: "Note",
        tags: ["tag1"],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        pinned: false,
        favorite: false,
        sensitive: false,
        encrypted: false,
      };
      const result = normalizeImportedClip(input);
      expect(result).not.toBeNull();
      expect(result?.id).toBe("test-id");
      expect(result?.type).toBe("Note");
    });

    it("should return null for invalid input", () => {
      expect(normalizeImportedClip(null)).toBeNull();
      expect(normalizeImportedClip(undefined)).toBeNull();
      expect(normalizeImportedClip("string")).toBeNull();
      expect(normalizeImportedClip(123)).toBeNull();
    });

    it("should provide defaults for missing fields", () => {
      const input = { content: "Hello" };
      const result = normalizeImportedClip(input);
      expect(result).not.toBeNull();
      expect(result?.id).toBeDefined();
      expect(result?.type).toBe("Note");
      expect(result?.tags).toEqual([]);
    });

    it("should validate type field", () => {
      const input = { content: "Hello", type: "InvalidType" };
      const result = normalizeImportedClip(input);
      expect(result).not.toBeNull();
      expect(result?.type).toBe("Note");
    });
  });
});
