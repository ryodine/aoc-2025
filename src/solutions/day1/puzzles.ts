import { appWrapper, withLineInput } from "@aoc-2025/common";

interface Rotation {
  direction: "L" | "R";
  ticks: number;
}

interface State {
  tick: number;
  crossings: number;
}

function parseRotation(input: string): Rotation {
  const direction = input.charAt(0) as "L" | "R";
  const ticks = parseInt(input.slice(1), 10);
  return { direction, ticks };
}

function puzzle1(list: string[]): number {
  function rotate(current: number, rotation: Rotation): number {
    const turn = (rotation.direction === "L" ? -1 : 1) * rotation.ticks;
    return (((current + turn) % 100) + 100) % 100;
  }

  let count = 0;
  list.map(parseRotation).reduce((state, rotation) => {
    const newState = rotate(state, rotation);
    if (newState === 0) {
      count += 1;
    }
    return newState;
  }, 50);
  return count;
}

function puzzle2(list: string[]): number {
  function rotate(current: State, rotation: Rotation): State {
    const turn = (rotation.direction === "L" ? -1 : 1) * rotation.ticks;
    const preModTurn = current.tick + turn;

    const fullTurns = preModTurn / 100;
    let crossings =
      Math.floor(Math.abs(fullTurns)) + (Math.sign(fullTurns) !== 1 ? 1 : 0);

    const endTick = ((preModTurn % 100) + 100) % 100;

    // account for no crossing when starting on 0 (left only)
    // --
    // this special case is because when starting at 0, any turn will immediately
    // trigger Math.sign(fullTurns) to be negative, which would count as a wrap
    // back, but the zero we are at is already accounted for.
    // --
    // we don't have to do this for right turns, because starting at 0 and turning
    // right will never cause an immediate wrap without also incuring a new zero
    // visit.
    if (turn < 0 && current.tick === 0) {
      crossings -= 1;
    }

    return { tick: endTick, crossings: current.crossings + crossings };
  }

  const state = list.map(parseRotation).reduce(
    (state, rotation) => {
      const newState = rotate(state, rotation);
      console.log(
        `[${String(state.tick).padStart(2, " ")}] + ${String(
          rotation.direction + rotation.ticks
        ).padStart(3, " ")} => [${String(newState.tick).padStart(
          2,
          " "
        )}], total crossings: ${newState.crossings}`
      );
      return newState;
    },
    { tick: 50, crossings: 0 }
  );
  return state.crossings;
}

appWrapper({
  puzzle1: withLineInput(puzzle1),
  puzzle2: withLineInput(puzzle2),
})();
