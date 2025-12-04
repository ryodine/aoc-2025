import {
  appWrapper,
  withSubs,
  withGridInput,
  type SimpleCharGrid,
} from "@aoc-2025/common";

function findClearables(
  { data }: SimpleCharGrid,
  onClearable: (i: number, j: number) => void
) {
  function getOrDefault(i: number, j: number, def: number): number {
    if (i < 0 || j < 0 || i >= data.length || j >= data[i]!.length) {
      return def;
    }
    return parseInt(data[i]![j]!, 10);
  }

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i]!.length; j++) {
      // push the sum of all 8 neighbors to sumGrid
      const state = getOrDefault(i, j, 0);
      const sum =
        getOrDefault(i - 1, j - 1, 0) +
        getOrDefault(i - 1, j, 0) +
        getOrDefault(i - 1, j + 1, 0) +
        getOrDefault(i, j - 1, 0) +
        getOrDefault(i, j + 1, 0) +
        getOrDefault(i + 1, j - 1, 0) +
        getOrDefault(i + 1, j, 0) +
        getOrDefault(i + 1, j + 1, 0);
      if (state === 1) {
        if (sum < 4) {
          onClearable(i, j);
        }
      }
    }
  }
}

function puzzle1(data: SimpleCharGrid) {
  let gt4Count = 0;
  findClearables(data, () => {
    gt4Count++;
  });
  return gt4Count;
}

function puzzle2(data: SimpleCharGrid) {
  let grid = data;
  let cellsCleared = 0;
  let totalCellsCleared = 0;
  do {
    cellsCleared = 0;
    const gridAfter = structuredClone(grid);
    findClearables(grid, (i, j) => {
      cellsCleared++;
      gridAfter.data[i]![j]! = "0";
    });
    grid = gridAfter;
    totalCellsCleared += cellsCleared;
  } while (cellsCleared > 0);

  return totalCellsCleared;
}

appWrapper({
  puzzle1: withSubs("@", "1", withSubs(".", "0", withGridInput(puzzle1))),
  puzzle2: withSubs("@", "1", withSubs(".", "0", withGridInput(puzzle2))),
})();
