import { DataTable, Given, Then } from "@cucumber/cucumber";
import { assert } from "chai";
import { Tuple } from "../../src/tuples";
import { EPSILON } from "../../src/constants";
import matrix, { Matrix } from "../../src/matrix";
import {
  matrixApproximatelyEqual,
  tableToMatrix,
  tupleApproximatelyEqual,
} from "./common";

Given(
  "the following {int}x{int} matrix {matrix}:",
  function (_width: number, _height: number, name: string, table: DataTable) {
    this.environment[name] = tableToMatrix(table);
  }
);

Given(
  "the following matrix {matrix}:",
  function (name: string, table: DataTable) {
    this.environment[name] = tableToMatrix(table);
  }
);

Given("{matrix} ← transpose\\(identity_matrix)", function (name: string) {
  const id = matrix.identity(4);
  this.environment[name] = matrix.transpose(id);
});

Given(
  "{matrix} ← submatrix\\({matrix}, {int}, {int})",
  function (destination: string, source: string, i: number, j: number) {
    const value = this.environment[source] as Matrix;
    this.environment[destination] = matrix.submatrix(value, i, j);
  }
);

Given(
  "{matrix} ← inverse\\({matrix})",
  function (destination: string, source: string) {
    const value = this.environment[source] as Matrix;
    this.environment[destination] = matrix.inverse(value);
  }
);

Given(
  "{matrix} ← {matrix} * {matrix}",
  function (destination: string, lhs: string, rhs: string) {
    const value1 = this.environment[lhs] as Matrix;
    const value2 = this.environment[rhs] as Matrix;
    this.environment[destination] = matrix.mul(value1, value2);
  }
);

Then(
  "{matrix}[{int},{int}] = {expression}",
  function (name: string, i: number, j: number, expected: number) {
    const matrix = this.environment[name] as Matrix;
    const actual = matrix.values[i][j];
    assert.approximately(actual, expected, EPSILON);
  }
);

Then("{matrix} = {matrix}", function (lhs: string, rhs: string) {
  const value1 = this.environment[lhs] as Matrix;
  const value2 = this.environment[rhs] as Matrix;
  matrixApproximatelyEqual(value1, value2);
});

Then("{matrix} != {matrix}", function (lhs: string, rhs: string) {
  const value1 = this.environment[lhs] as Matrix;
  const value2 = this.environment[rhs] as Matrix;
  assert.notDeepEqual(value1, value2);
});

Then(
  "{matrix} * {matrix} is the following 4x4 matrix:",
  function (lhs: string, rhs: string, table: DataTable) {
    const value1 = this.environment[lhs] as Matrix;
    const value2 = this.environment[rhs] as Matrix;
    const actual = matrix.mul(value1, value2) as Matrix;
    const expected = tableToMatrix(table);

    matrixApproximatelyEqual(actual, expected);
  }
);

Then(
  "{matrix} {operator} {variable} = tuple\\({expression}, {expression}, {expression}, {expression})",
  function (
    lhs: string,
    operator: string,
    rhs: string,
    x: number,
    y: number,
    z: number,
    w: number
  ) {
    const value1 = this.environment[lhs];
    const value2 = this.environment[rhs];

    let actual: Tuple;
    switch (operator) {
      case "*":
        actual = matrix.mul(value1, value2) as Tuple;
        break;
      default:
        throw `unsupport op ${operator}`;
    }

    const expected = { x, y, z, w };
    tupleApproximatelyEqual(actual, expected);
  }
);

Then(
  "{matrix} * identity_matrix = {matrix}",
  function (name: string, expectedName: string) {
    const value = this.environment[name] as Matrix;
    const id = matrix.identity(value.size);
    const actual = matrix.mul(value, id) as Matrix;
    const expected = this.environment[expectedName];
    matrixApproximatelyEqual(actual, expected);
  }
);

Then(
  "identity_matrix * {variable} = {variable}",
  function (name: string, expectedName: string) {
    const value = this.environment[name];
    const id = matrix.identity(4);
    const actual = matrix.mul(id, value) as Tuple;
    const expected = this.environment[expectedName];
    tupleApproximatelyEqual(actual, expected);
  }
);

Then(
  "transpose\\({matrix}) is the following matrix:",
  function (name: string, table: DataTable) {
    const value = this.environment[name] as Matrix;
    const actual = matrix.transpose(value);
    const expected = tableToMatrix(table);
    matrixApproximatelyEqual(actual, expected);
  }
);

Then("{matrix} = identity_matrix", function (name: string) {
  const actual = this.environment[name] as Matrix;
  const expected = matrix.identity(actual.size);
  matrixApproximatelyEqual(actual, expected);
});

Then(
  "determinant\\({matrix}) = {expression}",
  function (name: string, expected: number) {
    const value = this.environment[name] as Matrix;
    const actual = matrix.determinant(value);
    assert.approximately(actual, expected, EPSILON);
  }
);

Then(
  "submatrix\\({matrix}, {int}, {int}) is the following {int}x{int} matrix:",
  function (
    name: string,
    i: number,
    j: number,
    _height: number,
    _width: number,
    table: DataTable
  ) {
    const value = this.environment[name] as Matrix;
    const actual = matrix.submatrix(value, i, j);
    const expected = tableToMatrix(table);
    matrixApproximatelyEqual(actual, expected);
  }
);

Then(
  "minor\\({matrix}, {int}, {int}) = {expression}",
  function (name: string, i: number, j: number, expected: number) {
    const value = this.environment[name] as Matrix;
    const actual = matrix.minor(value, i, j);
    assert.approximately(actual, expected, EPSILON);
  }
);

Then(
  "cofactor\\({matrix}, {int}, {int}) = {expression}",
  function (name: string, i: number, j: number, expected: number) {
    const value = this.environment[name] as Matrix;
    const actual = matrix.cofactor(value, i, j);
    assert.approximately(actual, expected, EPSILON);
  }
);

Then("{matrix} is invertible", function (name: string) {
  const value = this.environment[name] as Matrix;
  const actual = matrix.determinant(value);
  assert.notEqual(actual, 0);
});

Then("{matrix} is not invertible", function (name: string) {
  const value = this.environment[name] as Matrix;
  const actual = matrix.determinant(value);
  assert.equal(actual, 0);
});

Then(
  "{matrix} is the following 4x4 matrix:",
  function (name: string, table: DataTable) {
    const actual = this.environment[name] as Matrix;
    const expected = tableToMatrix(table);
    matrixApproximatelyEqual(actual, expected);
  }
);

Then(
  "inverse\\({matrix}) is the following 4x4 matrix:",
  function (name: string, table: DataTable) {
    const value = this.environment[name] as Matrix;
    const actual = matrix.inverse(value);
    const expected = tableToMatrix(table);
    matrixApproximatelyEqual(actual, expected);
  }
);

Then(
  "{matrix} * inverse\\({matrix}) = {matrix}",
  function (lhs: string, rhs: string, expectedName: string) {
    const value1 = this.environment[lhs] as Matrix;
    const value2 = this.environment[rhs] as Matrix;
    const inverted = matrix.inverse(value2);
    const actual = matrix.mul(value1, inverted) as Matrix;
    const expected = this.environment[expectedName] as Matrix;
    matrixApproximatelyEqual(actual, expected);
  }
);
