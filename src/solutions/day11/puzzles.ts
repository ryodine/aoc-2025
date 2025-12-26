import {
  appWrapper,
  withLineInput,
  type PuzzleHandler,
} from "@aoc-2025/common";

interface Node {
  id: string;
  outs: Set<Node>;
}

class Graph {
  nodes: Map<string, Node>;
  constructor() {
    this.nodes = new Map();
  }

  private addOrGetNode(node: string) {
    const nodeInGraph = this.nodes.get(node);
    if (!nodeInGraph) {
      const newNode = { id: node, outs: new Set<Node>() };
      this.nodes.set(node, newNode);
      return newNode;
    }
    return nodeInGraph;
  }

  addEdges(from: string, to: string[]) {
    const fromNode = this.addOrGetNode(from);
    to.map((node) => this.addOrGetNode(node)).forEach((node) =>
      fromNode.outs.add(node)
    );
  }
}

function withGraphInputFromEdges<T>(
  handler: PuzzleHandler<T, Graph>
): PuzzleHandler<T, string[]> {
  return (input: string[]) => {
    const graph = new Graph();
    input.forEach((edge) => {
      const [src, dests] = edge.split(": ");
      graph.addEdges(src!, dests!.split(" "));
    });
    return handler(graph);
  };
}

function dfsCountPaths(node: Node, destNode: Node): number {
  if (node.id === destNode.id) {
    return 1;
  }
  return node.outs.values().reduce((accum, adjacentNode) => {
    return accum + dfsCountPaths(adjacentNode, destNode);
  }, 0);
}

function puzzle1(graph: Graph) {
  console.log(dfsCountPaths(graph.nodes.get("you")!, graph.nodes.get("out")!));
  return 0;
}

interface State {
  pathsWithoutDACorFFT: number;
  pathsWithoutDAC: number;
  pathsWithoutFFT: number;
  pathsWithBoth: number;
}

function combineStates(state1: State, state2: State): State {
  return {
    pathsWithoutDACorFFT:
      state1.pathsWithoutDACorFFT + state2.pathsWithoutDACorFFT,
    pathsWithoutDAC: state1.pathsWithoutDAC + state2.pathsWithoutDAC,
    pathsWithoutFFT: state1.pathsWithoutFFT + state2.pathsWithoutFFT,
    pathsWithBoth: state1.pathsWithBoth + state2.pathsWithBoth,
  };
}

function handleSpecialNodeVisit(state: State, nodeId: string): State {
  /**
   * A "state" is a memo of the state of DFS traversal at a given node.
   * The count of paths that reach the destination from this node, categorized
   * by whether or not each path has passed through the "dac" and "fft" nodes.
   *
   * "joining a state" means updating the state when arriving at a new node,
   * meaning a node that is one step further away from the destination. As such,
   * there is special logic for how to update the state when arriving at the
   * "dac" or "fft" nodes:
   *
   * When arriving at "dac", all paths that have not yet seen "dac" are now
   * considered to have seen "dac". Similarly for "fft".
   */

  if (nodeId === "dac") {
    return {
      pathsWithoutDACorFFT: 0,
      pathsWithoutDAC: 0,
      pathsWithoutFFT: state.pathsWithoutFFT + state.pathsWithoutDACorFFT,
      pathsWithBoth: state.pathsWithBoth + state.pathsWithoutDAC,
    };
  } else if (nodeId === "fft") {
    return {
      pathsWithoutDACorFFT: 0,
      pathsWithoutDAC: state.pathsWithoutDAC + state.pathsWithoutDACorFFT,
      pathsWithoutFFT: 0,
      pathsWithBoth: state.pathsWithBoth + state.pathsWithoutFFT,
    };
  } else {
    return state;
  }
}

const makeNullState = (): State => ({
  pathsWithoutDACorFFT: 0,
  pathsWithoutDAC: 0,
  pathsWithoutFFT: 0,
  pathsWithBoth: 0,
});

function dfsCountPathsWithStops(
  node: Node,
  destNode: Node,
  path: string[],
  memoTable: Map<string, State>
): State {
  if (path.includes(node.id)) {
    console.log("LOOP");
    memoTable.set(node.id, makeNullState());
    return makeNullState();
  }
  if (node.id === destNode.id) {
    return {
      pathsWithoutDACorFFT: 1,
      pathsWithoutDAC: 0,
      pathsWithoutFFT: 0,
      pathsWithBoth: 0,
    };
  }
  let value = node.outs.values().reduce((accum, adjacentNode) => {
    let result = makeNullState();
    if (memoTable.has(adjacentNode.id)) {
      result = combineStates(accum, memoTable.get(adjacentNode.id)!);
    } else {
      result = combineStates(
        accum,
        dfsCountPathsWithStops(
          adjacentNode,
          destNode,
          [...path, node.id],
          memoTable
        )
      );
    }
    return result;
  }, makeNullState());
  value = handleSpecialNodeVisit(value, node.id);
  memoTable.set(node.id, value);
  return value;
}

function puzzle2(graph: Graph) {
  const result = dfsCountPathsWithStops(
    graph.nodes.get("svr")!,
    graph.nodes.get("out")!,
    [],
    new Map()
  ).pathsWithBoth;
  return result;
}

appWrapper({
  puzzle1: withLineInput(withGraphInputFromEdges(puzzle1)),
  puzzle2: withLineInput(withGraphInputFromEdges(puzzle2)),
})();
