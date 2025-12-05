import {
  appWrapper,
  withLineInput,
  withSplitIntoGroups,
} from "@aoc-2025/common";

type Range = {
  min: number;
  max: number;
};

function inRange(n: number, range: Range): boolean {
  return n >= range.min && n <= range.max;
}

function makeRange(rangeStr: string): Range {
  const [minStr, maxStr] = rangeStr.split("-");
  if (!minStr || !maxStr) {
    throw new Error(`Invalid range: ${rangeStr}`);
  }
  return { min: parseInt(minStr, 10), max: parseInt(maxStr, 10) };
}

function puzzle1(data: string[][]) {
  if (data.length !== 2) {
    throw new Error(`Expected exactly 2 groups, got ${data.length}`);
  }
  const rangeGroup = data[0]!;
  const checkGroup = data[1]!;

  const ranges = rangeGroup.map(makeRange);
  const filteredCheckGroup = checkGroup.filter((line) => {
    const n = parseInt(line, 10);
    for (const range of ranges) {
      if (inRange(n, range)) {
        return true;
      }
    }
    return false;
  });

  return filteredCheckGroup.length;
}

function combineRanges(a: Range, b: Range): Range | [Range, Range] {
  if (a.max < b.min - 1 || b.max < a.min - 1) {
    return [a, b];
  }
  return { min: Math.min(a.min, b.min), max: Math.max(a.max, b.max) };
}

function puzzle2(data: string[][]) {
  if (data.length !== 2) {
    throw new Error(`Expected exactly 2 groups, got ${data.length}`);
  }
  const rangeGroup = data[0]!;

  const ranges = rangeGroup.map(makeRange).sort((a, b) => a.min - b.min);

  let baseRPtr = 0;
  while (baseRPtr < ranges.length - 1) {
    const combined = combineRanges(ranges[baseRPtr]!, ranges[baseRPtr + 1]!);
    if (Array.isArray(combined)) {
      baseRPtr++;
    } else {
      ranges.splice(baseRPtr, 2, combined);
    }
  }

  return ranges.reduce((acc, range) => acc + (range.max - range.min + 1), 0);
}

appWrapper({
  puzzle1: withLineInput(
    withSplitIntoGroups(puzzle1, (val) => val.length === 0),
    false
  ),
  puzzle2: withLineInput(
    withSplitIntoGroups(puzzle2, (val) => val.length === 0),
    false
  ),
})();
