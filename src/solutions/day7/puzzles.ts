import {
  appWrapper,
  withGridInput,
  type SimpleCharGrid,
} from "@aoc-2025/common";

function popRow(i: number, grid: SimpleCharGrid): string[] {
  const row = grid.data[i]!;
  grid.data.splice(i, 1);
  grid.height--;
  return row;
}

function willSplit(j: number, state: number[]): boolean {
  return state[j]! > 0;
}

function puzzle1And2(grid: SimpleCharGrid) {
  const header = popRow(0, grid);
  const state: number[] = header.map((possibleStartPixel) =>
    possibleStartPixel === "S" ? 1 : 0
  );
  let splits = 0;
  for (let i = 0; i < grid.height; i++) {
    for (let j = 0; j < grid.width; j++) {
      if (grid.data[i]![j]! === "^") {
        if (willSplit(j, state)) {
          const pathsIn = state[j]!;
          state[j] = 0;
          if (j > 0) {
            state[j - 1] = state[j - 1]! + pathsIn;
          }
          if (j < grid.width - 1) {
            state[j + 1] = state[j + 1]! + pathsIn;
          }
          splits++;
        }
      }
    }
  }
  return { splits, pathsPerColAtEnd: state };
}

function puzzle1(grid: SimpleCharGrid) {
  const { splits } = puzzle1And2(grid);
  return splits;
}

function puzzle2(grid: SimpleCharGrid) {
  const { pathsPerColAtEnd } = puzzle1And2(grid);
  return pathsPerColAtEnd.reduce((a, b) => a + b, 0);
}

appWrapper({
  puzzle1: withGridInput(puzzle1),
  puzzle2: withGridInput(puzzle2),
})();
