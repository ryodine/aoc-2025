function maxJoltage(s: string): number {
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

function puzzle2(input: string[]): number {
  return input.map(maxJoltage).reduce((a, b) => {
    console.log(b);
    return a + b;
  }, 0);
}

function main() {
  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk.toString();
  });

  process.stdin.on("end", () => {
    const result = puzzle2(data.split("\n").filter((line) => line.length > 0));
    console.log(result);
  });

  process.stdin.setEncoding("utf8");
}

main();
