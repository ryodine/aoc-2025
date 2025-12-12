import {
  appWrapper,
  withLineInput,
  withListTransformedInput,
} from "@aoc-2025/common";

import { SingleBar, Presets } from "cli-progress";
import colors from "ansi-colors";

/**
 * Converts [..##.] to 0b00110
 * @param indicators
 * @returns
 */
function indicatorStringToBitmask(indicators: string): number {
  return indicators
    .slice(1, -1)
    .split("")
    .reverse()
    .reduce((acc, curr) => {
      return (acc << 1) | (curr === "#" ? 1 : 0);
    }, 0);
}

/**
 * Converts 0b00110 to [..##.]
 * @param bitmask
 * @param length
 */
function bitmaskToIndicatorString(bitmask: number, length: number) {
  const chars: string[] = [];
  for (let i = length - 1; i >= 0; i--) {
    const bit = (bitmask >> i) & 1;
    chars.push(bit === 1 ? "#" : ".");
  }
  return `[${chars.reverse().join("")}]`;
}

/**
 * Converts (1,5,3) to 0b101010
 * @param button
 */
function buttonToBitmask(button: string): number {
  return button
    .slice(1, -1)
    .split(",")
    .reduce((acc, curr) => {
      const btnNum = parseInt(curr, 10);
      return acc | (1 << btnNum);
    }, 0);
}

/**
 * Converts 0b101010 to (1,5,3)
 * @param bitmask
 * @param length
 * @returns
 */
function bitmaskToButtonString(bitmask: number, length: number) {
  const parts: string[] = [];
  for (let i = 0; i < length; i++) {
    const bit = (bitmask >> i) & 1;
    if (bit === 1) {
      parts.push(i.toString());
    }
  }
  return `(${parts.join(",")})`;
}

function press(state: number, button: number): number {
  return state ^ button;
}

function impacts(state: number, button: number): boolean {
  return (state & button) !== 0;
}

function isSolved(state: number, desiredState: number): boolean {
  return state === desiredState;
}

function bitDiff(state: number, desiredState: number): number {
  return state ^ desiredState;
}

interface State {
  indicators: number;
  presses: number[];
  type: "State";
}

interface PendingAction {
  state: State;
  nextPress: number;
}

interface Machine {
  stateLength: number;
  desiredState: number;
  buttons: number[];
  type: "Machine";
}

function toMachine(line: string): Machine {
  // [.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
  const parts = line.split(" ");
  const desiredStateStr = parts[0]!.trim();
  const buttons: number[] = [];
  for (
    let i = 1 /* skip desired state */;
    i < parts.length - 1 /* skip last part */;
    i++
  ) {
    const buttonStr = parts[i]!.trim();
    buttons.push(buttonToBitmask(buttonStr));
  }
  return {
    stateLength: desiredStateStr.length - 2,
    desiredState: indicatorStringToBitmask(desiredStateStr),
    buttons,
    type: "Machine",
  };
}

function machineToString(machine: Machine): string {
  const desiredStateStr = bitmaskToIndicatorString(
    machine.desiredState,
    machine.stateLength
  );
  const buttonStrs = machine.buttons.map((button) =>
    bitmaskToButtonString(button, machine.stateLength)
  );
  return `${desiredStateStr} ${buttonStrs.join(" ")}`;
}

function puzzle1_optimizePressesForMachine(input: Machine): number {
  console.log("Starting machine:");
  console.log(machineToString(input));
  let epoch: PendingAction[] = [];

  let nextEpoch: PendingAction[] = input.buttons.map((b) => ({
    nextPress: b,
    state: {
      indicators: 0,
      presses: [],
      type: "State",
    },
  }));

  const bar = new SingleBar(
    {
      format: colors.red(" {bar}") + " | Depth: {depth} | {value}/{total}",
      clearOnComplete: true,
    },
    Presets.shades_classic
  );

  let depth = 0;
  let epochLen = 0;

  while (true) {
    // get pending action:
    const action = epoch.shift();
    if (!action) {
      if (!nextEpoch.length) {
        throw new Error("Unsolvable machine!");
      }
      epoch = nextEpoch;
      nextEpoch = [];
      depth++;
      epochLen = epoch.length;
      bar.start(epoch.length, 0, {
        depth,
      });
      continue;
    }

    const newState = { ...action.state };

    // act
    newState.presses = [...action.state.presses, action.nextPress];
    newState.indicators = press(action.state.indicators, action.nextPress);

    // check for success
    if (isSolved(newState.indicators, input.desiredState)) {
      bar.update(epochLen);
      bar.stop();
      console.log("\n\nSolved!");
      console.log(machineToString(input));
      console.log(
        " -> " +
          newState.presses
            .map((b) => bitmaskToButtonString(b, input.stateLength))
            .join(" -> ")
      );
      return newState.presses.length;
    }

    if (newState.presses.length! >= 10) {
      console.log(machineToString(input));
      throw new Error("too many!");
    }

    // console.log(
    //   newState.presses
    //     .map((b) => bitmaskToButtonString(b, input.stateLength))
    //     .join(" -> ") +
    //     " = " +
    //     bitmaskToIndicatorString(newState.indicators, input.stateLength)
    // );

    if (epoch.length % 100 === 0) {
      bar.update(epochLen - epoch.length);
    }

    // queue up next actions
    for (const button of input.buttons) {
      if (!impacts(bitDiff(newState.indicators, input.desiredState), button)) {
        continue;
      }
      if (newState.presses.includes(button)) {
        continue;
      }
      nextEpoch.push({
        nextPress: button,
        state: newState,
      });
    }
  }
}

function puzzle1(input: Machine[]): string {
  return (
    "Answer: " +
    input.reduce(
      (acc, machine) => puzzle1_optimizePressesForMachine(machine) + acc,
      0
    )
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  appWrapper({
    puzzle1: withLineInput(withListTransformedInput(puzzle1, toMachine)),
    // puzzle2: withLineInput(puzzle2),
  })();
}
