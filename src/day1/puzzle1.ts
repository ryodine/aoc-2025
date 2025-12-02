interface Rotation {
  direction: "L" | "R";
  ticks: number;
}

function parseRotation(input: string): Rotation {
  const direction = input.charAt(0) as "L" | "R";
  const ticks = parseInt(input.slice(1), 10);
  return { direction, ticks };
}

function rotate(current: number, rotation: Rotation): number {
  const turn = (rotation.direction === "L" ? -1 : 1) * rotation.ticks;
  return (((current + turn) % 100) + 100) % 100;
}

function puzzle1(list: string[]): number {
  let count = 0;
  list.map(parseRotation).reduce((state, rotation) => {
    const newState = rotate(state, rotation);
    // console.log(state, rotation, newState);
    if (newState === 0) {
      count += 1;
    }
    return newState;
  }, 50);
  return count;
}

function main() {
  let data = "";
  process.stdin.on("data", (chunk) => {
    data += chunk.toString();
  });

  process.stdin.on("end", () => {
    const result = puzzle1(data.split("\n"));
    console.log(result);
  });

  process.stdin.setEncoding("utf8");
}

main();
