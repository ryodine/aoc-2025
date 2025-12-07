import {
  appWrapper,
  asNumGroups,
  withLineInput,
  withSplitIntoGroups,
} from "@aoc-2025/common";

function puzzle1([numberLines, operators]: [string[], string[]]) {
  const numericalLinesParsed = numberLines.map((line) =>
    line
      .trim()
      .split(" ")
      .filter((n) => n.trim().length > 0)
      .map((n) => parseInt(n.trim(), 10))
  );
  const operatorsParsed = operators[0]!
    .trim()
    .split(" ")
    .filter((n) => n.trim().length > 0)
    .map((op) => op.trim());
  const results = numericalLinesParsed.slice(1).reduce((acc, nums) => {
    return acc.map((prevColVal, idx) => {
      const op = operatorsParsed[idx]!;
      switch (op) {
        case "+":
          return prevColVal + nums[idx]!;
        case "*":
          return prevColVal * nums[idx]!;
        default:
          throw new Error(`Unknown operator: ${op}`);
      }
    });
  }, numericalLinesParsed[0]!);
  return results.reduce((a, b) => a + b, 0);
}

function puzzle2([numberLines, operators]: [string[], string[]]) {
  const ops: { op: "*" | "+"; idx: number }[] = [];
  for (let i = 0; i < operators[0]!.length; i++) {
    if (operators[0]!.charAt(i) === "*") {
      ops.push({ op: "*", idx: i });
    } else if (operators[0]!.charAt(i) === "+") {
      ops.push({ op: "+", idx: i });
    }
  }
  const cells = numberLines.map((line) => {
    return [...ops, { op: "*", idx: line.length + 1 }]
      .slice(1)
      .map(({ idx }, i) => line.substring(ops[i]!.idx, idx - 1));
  });

  // transposed
  const columns: number[][] = cells[0]!.map(() => []);

  for (let col = 0; col < cells[0]!.length; col++) {
    for (let char = 0; char < cells[0]![col]!.length; char++) {
      columns[col]!.push(
        parseInt(
          cells
            .map((row) => row[col]!.charAt(char))
            .join("")
            .trim(),
          10
        )
      );
    }
  }

  const results = columns.map((col, idx) => {
    const op = ops[idx]!.op;
    switch (op) {
      case "+":
        return col.reduce((a, b) => a + b, 0);
      case "*":
        return col.reduce((a, b) => a * b, 1);
      default:
        throw new Error(`Unknown operator: ${op}`);
    }
  });

  return results.reduce((a, b) => a + b, 0);
}

appWrapper({
  puzzle1: withLineInput(
    withSplitIntoGroups(
      asNumGroups(puzzle1, 2),
      (_, index, arr) => index === arr.length - 1,
      true
    ),
    false
  ),
  puzzle2: withLineInput(
    withSplitIntoGroups(
      asNumGroups(puzzle2, 2),
      (_, index, arr) => index === arr.length - 1,
      true
    ),
    false
  ),
})();
