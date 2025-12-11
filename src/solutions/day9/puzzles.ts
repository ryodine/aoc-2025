import { appWrapper, withLineInput } from "@aoc-2025/common";

export class Point2D {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  rectAreaWith(point: Point2D): number {
    return (Math.abs(this.x - point.x) + 1) * (Math.abs(this.y - point.y) + 1);
  }

  static fromString(s: string): Point2D {
    const [xStr, yStr] = s.split(",");
    return new Point2D(parseFloat(xStr!.trim()), parseFloat(yStr!.trim()));
  }
}

export function throughRect(
  a: Point2D,
  b: Point2D,
  lineA: Point2D,
  lineB: Point2D
): boolean {
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);
  const pointIn = (check: Point2D) =>
    check.x > minX && check.x < maxX && check.y > minY && check.y < maxY;

  return (
    pointIn(lineA) ||
    pointIn(lineB) ||
    /* vert */ (lineA.x === lineB.x &&
      lineA.x > minX &&
      lineA.x < maxX /* ray thru */ &&
      ((lineA.y < maxY && lineA.y > minY) ||
        (lineB.y < maxY && lineB.y > minY) ||
        (lineA.y <= minY && lineB.y >= maxY) ||
        (lineB.y <= minY && lineA.y >= maxY))) ||
    /* horiz */ (lineA.y === lineB.y &&
      lineA.y > minY &&
      lineA.y < maxY /* ray thru */ &&
      ((lineA.x < maxX && lineA.x > minX) ||
        (lineB.x < maxX && lineB.x > minX) ||
        (lineA.x <= minX && lineB.x >= maxX) ||
        (lineB.x <= minX && lineA.x >= maxX)))
  );
}

function puzzle1(lines: string[]) {
  const points = lines.map(Point2D.fromString);
  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const area = points[i]!.rectAreaWith(points[j]!);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }
  return maxArea;
}

function puzzle2(lines: string[]) {
  const points = lines.map(Point2D.fromString);

  let maxArea = 0;
  for (let i = 0; i < points.length; i++) {
    outer: for (let j = i + 1; j < points.length; j++) {
      let lastPoint = points[points.length - 1];
      for (let k = 0; k < points.length; k++) {
        if (
          lastPoint &&
          throughRect(points[i]!, points[j]!, lastPoint, points[k]!)
        ) {
          continue outer;
        }
        lastPoint = points[k]!;
      }
      const area = points[i]!.rectAreaWith(points[j]!);
      if (area > maxArea) {
        maxArea = area;
      }
    }
  }
  return maxArea;
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  appWrapper({
    puzzle1: withLineInput(puzzle1),
    puzzle2: withLineInput(puzzle2),
  })();
}
