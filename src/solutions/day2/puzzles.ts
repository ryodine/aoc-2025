import { appWrapper, withCommaSeparatedInput } from "@aoc-2025/common";

interface Range {
  min: number;
  max: number;
}

type Checker = (value: number) => boolean;

function isRepeatedTwice(n: number): boolean {
  const nStr = n.toString();
  if (nStr.length % 2 !== 0) {
    return false;
  }
  const [a, b] = [nStr.slice(0, nStr.length / 2), nStr.slice(nStr.length / 2)];
  return a === b;
}

function hasRepeatingPattern(n: number): boolean {
  const nStr = n.toString();
  const nStrLen = nStr.length;
  const nStrHalfLen = Math.floor(nStrLen / 2);
  // Slower, simpler version:
  // return /^([0-9]+)\1+$/gm.test(nStr);

  // Strategy: pick larger and larger slices from the front of the string,
  // and see if repeating that slice makes up the whole string.
  // e.g. for 123123123, try "1", "12", "123", etc.
  // Skip sizes that don't evenly divide the string length.
  ol: for (let patternSz = 1; patternSz <= nStrHalfLen; patternSz++) {
    if (nStr.length % patternSz !== 0) {
      continue;
    }
    const pattern = nStr.slice(0, patternSz);
    for (let i = patternSz; i < nStrLen; i += patternSz) {
      if (nStr.slice(i, i + patternSz) !== pattern) {
        continue ol;
      }
    }
    return true;
  }
  return false;
}

function toRange(input: string): Range {
  const [minStr, maxStr] = input.split("-");
  if (!minStr || !maxStr) {
    throw new Error(`Invalid range: ${input}`);
  }
  return { min: parseInt(minStr, 10), max: parseInt(maxStr, 10) };
}

function makeRangeWalk(checkers: Checker[]): (range: Range) => Set<number> {
  return (range: Range) => {
    const invalids = new Set<number>();
    for (let i = range.min; i <= range.max; i++) {
      for (const checker of checkers) {
        if (checker(i)) {
          invalids.add(i);
        }
      }
    }
    return invalids;
  };
}

function puzzleHarness(checkers: Checker[]) {
  return (input: string[]): number => {
    const sum = input
      .map(toRange)
      .map(makeRangeWalk(checkers))
      .reduce((allInvalids, rangeInvalids) => {
        return allInvalids.union(rangeInvalids);
      }, new Set<number>())
      .values()
      .reduce((sum, id) => sum + id, 0);
    return sum;
  };
}

appWrapper({
  puzzle1: withCommaSeparatedInput(puzzleHarness([isRepeatedTwice])),
  puzzle2: withCommaSeparatedInput(puzzleHarness([hasRepeatingPattern])),
})();
