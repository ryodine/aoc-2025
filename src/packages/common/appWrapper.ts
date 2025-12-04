import { readFile } from "node:fs/promises";

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => {
      data += chunk.toString();
    });

    process.stdin.on("end", () => {
      resolve(data);
    });

    process.stdin.setEncoding("utf8");
  });
}

type PuzzleHandler<Out, In = string> = (input: In) => Promise<Out> | Out;

export function appWrapper<T>(puzzles: {
  [key: string]: PuzzleHandler<T>;
}): () => void {
  const fn = async () => {
    // usage: ts-node file.ts [input-file|-] [puzzle1|puzzle2]
    const args = process.argv.slice(2);
    if (args.length < 2) {
      console.error("Usage: ts-node file.ts [puzzleKey] [input-file|-]");
      process.exit(1);
    }
    const inputType = args[0]!;
    const source = args[1]!;

    if (!(inputType in puzzles)) {
      console.error(`Unknown puzzle: ${inputType}`);
      process.exit(1);
    }

    let runner = undefined;
    const puzzle = puzzles[inputType]!;

    switch (source) {
      case "-":
        runner = readStdin().then(puzzle);
        break;
      default:
        runner = readFile(source, { encoding: "utf-8" }).then(puzzle);
        break;
    }

    console.log(`Output: ${await runner}`);
  };

  // do not await
  return () => fn();
}

export function withLineInput<T>(
  handler: PuzzleHandler<T, string[]>
): PuzzleHandler<T, string> {
  return (input: string) => {
    const lines = input.split("\n").filter((line) => line.length > 0);
    return handler(lines);
  };
}

export function withCommaSeparatedInput<T>(
  handler: PuzzleHandler<T, string[]>
): PuzzleHandler<T, string> {
  return (input: string) => {
    const lines = input
      .split(",")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    return handler(lines);
  };
}

export function withSubs<T>(
  find: string,
  replace: string,
  handler: PuzzleHandler<T, string>
): PuzzleHandler<T, string> {
  return (input: string) => {
    const replaced = input.replaceAll(find, replace);
    return handler(replaced);
  };
}

export interface SimpleCharGrid {
  width: number;
  height: number;
  data: string[][];
}

export function withGridInput<T>(
  handler: PuzzleHandler<T, SimpleCharGrid>
): PuzzleHandler<T, string> {
  return (input: string) => {
    const lines = input.split("\n").map((line) => line.trim().split(""));

    const grid: SimpleCharGrid = {
      width: lines.length > 0 ? lines[0]!.length : 0,
      height: lines.length,
      data: lines,
    };

    return handler(grid);
  };
}
