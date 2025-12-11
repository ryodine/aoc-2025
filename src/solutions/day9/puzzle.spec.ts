import { Point2D, throughRect } from "./puzzles.ts";

describe("throughRect", () => {
  const exampleRect = [new Point2D(10, 10), new Point2D(20, 20)];

  describe("truthy cases (line divides/passes through rectangle)", () => {
    it("detects line fully inside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(12, 12),
        new Point2D(15, 15)
      );
      expect(result).toBe(true);
    });

    it("detects vertical line that passes fully through the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 5),
        new Point2D(15, 25)
      );
      expect(result).toBe(true);
    });

    it("detects horizontal line that passes fully through the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(5, 15),
        new Point2D(25, 15)
      );
      expect(result).toBe(true);
    });

    it("detects vertical line that starts inside and goes outside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 15),
        new Point2D(15, 25)
      );
      expect(result).toBe(true);
    });

    it("detects horizontal line that starts inside and goes outside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 15),
        new Point2D(25, 15)
      );
      expect(result).toBe(true);
    });

    it("detects vertical line that starts outside and goes inside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 5),
        new Point2D(15, 15)
      );
      expect(result).toBe(true);
    });

    it("detects horizontal line that starts outside and goes inside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(5, 15),
        new Point2D(15, 15)
      );
      expect(result).toBe(true);
    });

    it("detects a vertical line that starts on the edge and ends inside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 10),
        new Point2D(15, 15)
      );
      expect(result).toBe(true);
    });

    it("detects a horizontal line that starts on the edge and ends inside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 15),
        new Point2D(15, 15)
      );
      expect(result).toBe(true);
    });

    it("detects a vertical line that starts inside and ends on the edge of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 15),
        new Point2D(15, 20)
      );
      expect(result).toBe(true);
    });

    it("detects a horizontal line that starts inside and ends on the edge of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 15),
        new Point2D(20, 15)
      );
      expect(result).toBe(true);
    });

    it("detects vertical line with one endpoint strictly inside and one outside", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 12),
        new Point2D(15, 25)
      );
      expect(result).toBe(true);
    });

    it("detects horizontal line with one endpoint strictly inside and one outside", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(12, 15),
        new Point2D(25, 15)
      );
      expect(result).toBe(true);
    });

    it("detects vertical line that spans from one edge to the opposite edge", () => {
      // This line is at x=15 (inside x-range) and spans the full y-range
      // This DOES divide the rectangle, so it should return true
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 10),
        new Point2D(15, 20)
      );
      expect(result).toBe(true);
    });

    it("detects horizontal line that spans from one edge to the opposite edge", () => {
      // This line is at y=15 (inside y-range) and spans the full x-range
      // This DOES divide the rectangle, so it should return true
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 15),
        new Point2D(20, 15)
      );
      expect(result).toBe(true);
    });
  });

  describe("falsy cases (line does not divide rectangle)", () => {
    it("detects line fully outside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(5, 5),
        new Point2D(8, 8)
      );
      expect(result).toBe(false);
    });

    it("detects vertical line that is completely outside (left of rectangle)", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(5, 10),
        new Point2D(5, 20)
      );
      expect(result).toBe(false);
    });

    it("detects vertical line that is completely outside (right of rectangle)", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(25, 10),
        new Point2D(25, 20)
      );
      expect(result).toBe(false);
    });

    it("detects horizontal line that is completely outside (above rectangle)", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 5),
        new Point2D(20, 5)
      );
      expect(result).toBe(false);
    });

    it("detects horizontal line that is completely outside (below rectangle)", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 25),
        new Point2D(20, 25)
      );
      expect(result).toBe(false);
    });

    it("detects vertical line that starts on the edge and goes outside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 10),
        new Point2D(15, 5)
      );
      expect(result).toBe(false);
    });

    it("detects horizontal line that starts on the edge and goes outside the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 15),
        new Point2D(5, 15)
      );
      expect(result).toBe(false);
    });

    it("detects vertical line that starts outside and goes on the edge of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 5),
        new Point2D(15, 10)
      );
      expect(result).toBe(false);
    });

    it("detects horizontal line that starts outside and goes on the edge of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(5, 15),
        new Point2D(10, 15)
      );
      expect(result).toBe(false);
    });

    it("detects a vertical line that is collinear with one edge of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 12),
        new Point2D(10, 18)
      );
      expect(result).toBe(false);
    });

    it("detects a horizontal line that is collinear with one edge of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(12, 10),
        new Point2D(18, 10)
      );
      expect(result).toBe(false);
    });

    it("detects vertical line that touches a corner but doesn't pass through", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 5),
        new Point2D(10, 10)
      );
      expect(result).toBe(false);
    });

    it("detects horizontal line that touches a corner but doesn't pass through", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(5, 10),
        new Point2D(10, 10)
      );
      expect(result).toBe(false);
    });

    it("detects vertical line at x position inside range but y completely outside", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(15, 3),
        new Point2D(15, 8)
      );
      expect(result).toBe(false);
    });

    it("detects horizontal line at y position inside range but x completely outside", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(3, 15),
        new Point2D(8, 15)
      );
      expect(result).toBe(false);
    });

    it("detects line segment between two corners of the rectangle", () => {
      const result = throughRect(
        exampleRect[0]!,
        exampleRect[1]!,
        new Point2D(10, 10),
        new Point2D(20, 20)
      );
      expect(result).toBe(false);
    });
  });
});
