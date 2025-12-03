function maxJoltage(s: string): number {
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

function puzzle1(input: string[]): number {
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
    const result = puzzle1(data.split("\n").filter((line) => line.length > 0));
    console.log(result);
  });

  process.stdin.setEncoding("utf8");
}

main();
