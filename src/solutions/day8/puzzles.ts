import { appWrapper, withLineInput } from "@aoc-2025/common";

class Point3D {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  distanceTo(other: Point3D): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static fromString(s: string): Point3D {
    const [xStr, yStr, zStr] = s.split(",");
    return new Point3D(
      parseFloat(xStr!.trim()),
      parseFloat(yStr!.trim()),
      parseFloat(zStr!.trim())
    );
  }
}

interface Segment {
  start: Point3D;
  end: Point3D;
  distance: number;
}

function puzzle1(points: string[]) {
  const pointObjs = points.map(Point3D.fromString);
  const segments: Segment[] = [];
  for (let i = 0; i < pointObjs.length - 1; i++) {
    for (let j = i + 1; j < pointObjs.length; j++) {
      const dist = pointObjs[i]!.distanceTo(pointObjs[j]!);
      segments.push({
        start: pointObjs[i]!,
        end: pointObjs[j]!,
        distance: dist,
      });
    }
  }

  const sortedSegments = segments.sort((a, b) => a.distance - b.distance);

  const pointToCircuit = new Map<Point3D, number>();
  const circuitToPoints = new Map<number, Point3D[]>();
  let maxCircuit = 0;

  for (const segment of sortedSegments.slice(0, 1000)) {
    const startCircuit = pointToCircuit.get(segment.start);
    const endCircuit = pointToCircuit.get(segment.end);

    if (startCircuit === undefined && endCircuit === undefined) {
      const newCircuit = maxCircuit++;
      pointToCircuit.set(segment.start, newCircuit);
      pointToCircuit.set(segment.end, newCircuit);
      circuitToPoints.set(newCircuit, [segment.start, segment.end]);
    } else if (startCircuit !== undefined && endCircuit === undefined) {
      pointToCircuit.set(segment.end, startCircuit);
      circuitToPoints.get(startCircuit)!.push(segment.end);
    } else if (startCircuit === undefined && endCircuit !== undefined) {
      pointToCircuit.set(segment.start, endCircuit);
      circuitToPoints.get(endCircuit)!.push(segment.start);
    } else if (
      startCircuit !== endCircuit &&
      startCircuit !== undefined &&
      endCircuit !== undefined
    ) {
      // Merge circuits (keep start circuit)
      for (const point of circuitToPoints.get(endCircuit)!) {
        pointToCircuit.set(point, startCircuit);
        circuitToPoints.get(startCircuit)!.push(point);
      }
      circuitToPoints.delete(endCircuit);
    }
  }

  const circuitSizes = [...circuitToPoints.values()]
    .map((points) => points.length)
    .sort((a, b) => b - a);

  return circuitSizes.slice(0, 3).reduce((a, b) => a * b, 1);
}

function puzzle2(points: string[]) {
  const pointObjs = points.map(Point3D.fromString);
  const segments: Segment[] = [];
  for (let i = 0; i < pointObjs.length - 1; i++) {
    for (let j = i + 1; j < pointObjs.length; j++) {
      const dist = pointObjs[i]!.distanceTo(pointObjs[j]!);
      segments.push({
        start: pointObjs[i]!,
        end: pointObjs[j]!,
        distance: dist,
      });
    }
  }

  const sortedSegments = segments.sort((a, b) => a.distance - b.distance);

  const pointToCircuit = new Map<Point3D, number>();
  const circuitToPoints = new Map<number, Point3D[]>();
  let maxCircuit = 0;

  for (const segment of sortedSegments) {
    const startCircuit = pointToCircuit.get(segment.start);
    const endCircuit = pointToCircuit.get(segment.end);

    if (startCircuit === undefined && endCircuit === undefined) {
      const newCircuit = maxCircuit++;
      pointToCircuit.set(segment.start, newCircuit);
      pointToCircuit.set(segment.end, newCircuit);
      circuitToPoints.set(newCircuit, [segment.start, segment.end]);
    } else if (startCircuit !== undefined && endCircuit === undefined) {
      pointToCircuit.set(segment.end, startCircuit);
      circuitToPoints.get(startCircuit)!.push(segment.end);
    } else if (startCircuit === undefined && endCircuit !== undefined) {
      pointToCircuit.set(segment.start, endCircuit);
      circuitToPoints.get(endCircuit)!.push(segment.start);
    } else if (
      startCircuit !== endCircuit &&
      startCircuit !== undefined &&
      endCircuit !== undefined
    ) {
      // Merge circuits (keep start circuit)
      for (const point of circuitToPoints.get(endCircuit)!) {
        pointToCircuit.set(point, startCircuit);
        circuitToPoints.get(startCircuit)!.push(point);
      }
      circuitToPoints.delete(endCircuit);
    }
    if (
      circuitToPoints.size === 1 &&
      [...pointToCircuit.keys()].length === points.length
    ) {
      return segment.start.x * segment.end.x;
    }
  }
}

appWrapper({
  puzzle1: withLineInput(puzzle1),
  puzzle2: withLineInput(puzzle2),
})();
