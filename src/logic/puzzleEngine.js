import CryptoJS from "crypto-js";

const SECRET_KEY = "logic-looper-2024";

class SeededRandom {
  constructor(seed) {
    const rawSeed = CryptoJS.SHA256(seed + SECRET_KEY).toString();
    this.seed = rawSeed;
    this.index = 0;
  }

  next() {
    const hash = CryptoJS.SHA256(this.seed + this.index).toString();
    this.index++;
    const intValue = parseInt(hash.substring(0, 8), 16);
    return intValue / 0xffffffff;
  }

  nextInt(min, max) {
    return Math.floor(this.next() * (max - min) + min);
  }

  choice(array) {
    return array[this.nextInt(0, array.length)];
  }
}

export function generateDailyPuzzle(dateString) {
  const rng = new SeededRandom(dateString);
  const typeChoice = rng.nextInt(0, 3);

  if (typeChoice === 0) return generateNumericGrid(rng);
  if (typeChoice === 1) return generateBinaryLogic(rng);
  return generateSequenceSolver(rng);
}

// 1. Quantum Math: Target Sum Grid
function generateNumericGrid(rng) {
  const size = 3;
  let grid = [];
  let totalSum = 0;

  for (let i = 0; i < size; i++) {
    let row = [];
    for (let j = 0; j < size; j++) {
      const val = rng.nextInt(1, 15);
      row.push(val);
      totalSum += val;
    }
    grid.push(row);
  }

  const hideX = rng.nextInt(0, size);
  const hideY = rng.nextInt(0, size);
  const answer = grid[hideX][hideY];
  grid[hideX][hideY] = "?";

  return {
    type: "NUMERIC_GRID",
    title: "Quantum Sum",
    instruction: `The total sum of all numbers in this 3x3 grid is ${totalSum}. Find the missing value (?).`,
    data: { grid },
    checkSolution: (val) => parseInt(val) === answer,
    hint: `Try subtracting all visible numbers from ${totalSum}.`
  };
}

// 2. Binary Circuit: Logic Gate Chain
function generateBinaryLogic(rng) {
  const ops = ["AND", "OR", "XOR"];
  const v1 = rng.nextInt(0, 2);
  const v2 = rng.nextInt(0, 2);
  const v3 = rng.nextInt(0, 2);
  const op1 = ops[rng.nextInt(0, 3)];
  const op2 = ops[rng.nextInt(0, 3)];

  const expression = `(${v1} ${op1} ${v2}) ${op2} ${v3}`;

  const evalOp = (a, b, op) => {
    if (op === "AND") return a && b;
    if (op === "OR") return a || b;
    if (op === "XOR") return a ^ b;
    return 0;
  };

  const step1 = evalOp(v1, v2, op1);
  const answer = evalOp(step1, v3, op2) ? 1 : 0;

  return {
    type: "BINARY_LOGIC",
    title: "Circuit Logic",
    instruction: "Solve the binary logic expression to find the final bit (0 or 1).",
    data: { expression },
    checkSolution: (val) => parseInt(val) === answer,
    hint: `Solve the brackets first: ${v1} ${op1} ${v2} = ${step1}.`
  };
}

// 3. Pattern Sequence: Complex Mathematical Patterns
function generateSequenceSolver(rng) {
  const patternType = rng.nextInt(0, 4);
  let sequence = [];
  let answer = 0;
  let title = "Logic Sequence";

  if (patternType === 0) { // Fibonacci-style
    const start1 = rng.nextInt(1, 5);
    const start2 = rng.nextInt(1, 5);
    sequence = [start1, start2, start1 + start2, start1 + (2 * start2), (2 * start1) + (3 * start2)];
    answer = sequence[4];
    sequence[4] = "?";
    title = "Recursive Sequence";
  } else if (patternType === 1) { // Squares + offset
    const offset = rng.nextInt(1, 5);
    for (let i = 1; i <= 5; i++) sequence.push((i * i) + offset);
    answer = sequence[4];
    sequence[4] = "?";
    title = "Exponential Growth";
  } else { // Multiplier + constant
    const start = rng.nextInt(1, 10);
    const mult = rng.nextInt(2, 4);
    const add = rng.nextInt(1, 5);
    let curr = start;
    for (let i = 0; i < 5; i++) {
        sequence.push(curr);
        curr = (curr * mult) + add;
    }
    answer = sequence[4];
    sequence[4] = "?";
    title = "Iterative Pattern";
  }

  return {
    type: "SEQUENCE_SOLVER",
    title: title,
    instruction: "Analyze the pattern and identify the missing number (?) in the sequence.",
    data: { sequence },
    checkSolution: (val) => parseInt(val) === answer,
    hint: "Look at the difference between consecutive numbers."
  };
}
