import assert from "assert";
import tuples, { Tuple } from "./tuples";

export type Matrix = {
  size: number;
  values: number[][];
};

function empty(size: number) {
  let values = new Array<number[]>(size);
  for (let i = 0; i < values.length; i++) {
    values[i] = new Array<number>(size);
    values[i].fill(0);
  }

  return { size, values };
}

function identity(size: number) {
  let matrix = empty(size);
  for (let i = 0; i < size; i++) {
    matrix.values[i][i] = 1;
  }

  return matrix;
}

function mul(lhs: Matrix, rhs: Matrix | Tuple) {
  if ("size" in rhs) {
    assert(lhs.size == rhs.size);

    let result = empty(lhs.size);
    for (let i = 0; i < lhs.size; i++) {
      for (let j = 0; j < lhs.size; j++) {
        let sum = 0;
        for (let n = 0; n < lhs.size; n++) {
          sum += lhs.values[i][n] * rhs.values[n][j];
        }

        result.values[i][j] = sum;
      }
    }

    return result;
  } else {
    assert(lhs.size == 4);

    let result = new Array<number>(lhs.size);
    for (let i = 0; i < lhs.size; i++) {
      let sum = 0;
      for (let n = 0; n < lhs.size; n++) {
        sum += lhs.values[i][n] * tuples.element(rhs, n);
      }

      result[i] = sum;
    }

    const [x, y, z, w] = result;

    return { x, y, z, w };
  }
}

function transpose(matrix: Matrix) {
  let result = empty(matrix.size);
  for (let i = 0; i < matrix.size; i++) {
    for (let j = 0; j < matrix.size; j++) {
      result.values[j][i] = matrix.values[i][j];
    }
  }

  return result;
}

function determinant(matrix: Matrix) {
  if (matrix.size == 2) {
    const [[a, b], [c, d]] = matrix.values;
    return a * d - b * c;
  } else {
    let result = 0;
    for (let j = 0; j < matrix.size; j++) {
      result += matrix.values[0][j] * cofactor(matrix, 0, j);
    }
    return result;
  }
}

function submatrix(matrix: Matrix, row: number, col: number) {
  let result = empty(matrix.size - 1);

  let dest_i = 0;
  for (let i = 0; i < matrix.size; i++) {
    let dest_j = 0;
    if (i == row) {
      continue;
    }

    for (let j = 0; j < matrix.size; j++) {
      if (j == col) {
        continue;
      }

      result.values[dest_i][dest_j] = matrix.values[i][j];

      dest_j++;
    }

    dest_i++;
  }

  return result;
}

function minor(matrix: Matrix, i: number, j: number) {
  return determinant(submatrix(matrix, i, j));
}

function cofactor(matrix: Matrix, i: number, j: number) {
  let value = minor(matrix, i, j);
  if ((i + j) % 2 == 0) {
    return value;
  } else {
    return -value;
  }
}

function inverse(matrix: Matrix) {
  const det = determinant(matrix);
  if (det == 0) {
    throw new Error("unable to invert matrix");
  }

  let result = empty(matrix.size);
  for (let i = 0; i < matrix.size; i++) {
    for (let j = 0; j < matrix.size; j++) {
      const c = cofactor(matrix, i, j);

      result.values[j][i] = c / det;
    }
  }

  return result;
}

export default {
  empty,
  identity,
  mul,
  transpose,
  determinant,
  submatrix,
  minor,
  cofactor,
  inverse,
};
