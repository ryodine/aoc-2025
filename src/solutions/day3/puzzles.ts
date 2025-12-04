import { appWrapper, withLineInput } from "@aoc-2025/common";

function maxJoltagePt1(s: string): number {
  let max = -1;
  let altMax = -1;
  let rightSideMax = -1;
  for (let i = s.length - 1; i >= 0; i--) {
    const value = parseInt(s.charAt(i), 10);
    if (value >= max) {
      rightSideMax = max;
      max = value;
    } else if (value > altMax) {
      altMax = value;
    }
  }

  if (max === -1) {
    throw new Error(`No digits found in string: ${s}`);
  }
  if (rightSideMax === -1 && altMax === -1) {
    throw new Error(`Not enough digits found in string: ${s}`);
  }

  return rightSideMax > 0 ? max * 10 + rightSideMax : altMax * 10 + max;
}

function maxJoltagePt2(s: string): number {
  const digits = s.split("").map((d) => parseInt(d, 10));

  let max = 0;
  let maxIdx = -1;
  for (let i = 0; i <= digits.length - 12; i++) {
    if (digits[i]! > max) {
      max = digits[i]!;
      maxIdx = i;
    }
  }
  const outVec: number[] = [max];

  let boundIdx = maxIdx;
  for (let loop = 11; loop > 0; loop--) {
    max = -1;
    maxIdx = -1;
    for (let i = boundIdx + 1; i <= digits.length - loop; i++) {
      if (digits[i]! > max) {
        max = digits[i]!;
        maxIdx = i;
      }
    }
    boundIdx = maxIdx;
    outVec.push(max);
  }

  return parseInt(outVec.join(""), 10);
}

function puzzleHarness(joltageCalculator: (s: string) => number) {
  return (input: string[]): number => {
    return input.map(joltageCalculator).reduce((a, b) => a + b, 0);
  };
}

appWrapper({
  puzzle1: withLineInput(puzzleHarness(maxJoltagePt1)),
  puzzle2: withLineInput(puzzleHarness(maxJoltagePt2)),
})();
