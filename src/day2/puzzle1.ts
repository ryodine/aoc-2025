interface Range {
  min: number;
  max: number;
}

type Checker = (value: number) => boolean;

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

function isRepeatedTwice(n: number): boolean {
  const nStr = n.toString();
  if (nStr.length % 2 !== 0) {
    return false;
  }
  const [a, b] = [nStr.slice(0, nStr.length / 2), nStr.slice(nStr.length / 2)];
  return a === b;
}

function puzzle1(input: string[]): number {
  const sum = input
    .map(toRange)
    .map(makeRangeWalk([isRepeatedTwice]))
    .reduce((allInvalids, rangeInvalids) => {
      return allInvalids.union(rangeInvalids);
    }, new Set<number>())
    .values()
    .reduce((sum, id) => sum + id, 0);
  return sum;
}

function main() {
  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk.toString();
  });

  process.stdin.on("end", () => {
    const result = puzzle1(data.split(","));
    console.log(result);
  });

  process.stdin.setEncoding("utf8");
}

main();
