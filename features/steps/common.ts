import { Before, DataTable, defineParameterType } from "@cucumber/cucumber";
import { assert } from "chai";
import { Matrix } from "src/matrix";
import { Tuple } from "../../src/tuples";
import { EPSILON } from "../../src/constants";

export function tupleApproximatelyEqual(actual: Tuple, expected: Tuple) {
  assert.approximately(actual.x, expected.x, EPSILON);
  assert.approximately(actual.y, expected.y, EPSILON);
  assert.approximately(actual.z, expected.z, EPSILON);
  assert.approximately(actual.w, expected.w, EPSILON);
}

export function matrixApproximatelyEqual(actual: Matrix, expected: Matrix) {
  assert.equal(actual.size, expected.size);
  for (let i = 0; i < actual.size; i++) {
    for (let j = 0; j < actual.size; j++) {
      assert.approximately(actual.values[i][j], expected.values[i][j], EPSILON);
    }
  }
}

export function tableToMatrix(table: DataTable) {
  const values = table.raw().map((row) => {
    return row.map((value) => {
      return Number(value);
    });
  });
  const size = values.length;
  return { values, size };
}

function transformExpression(value: string): number {
  return value
    .split("/")
    .map((part) => {
      let negated = false;
      let square_rooted = false;

      if (part.startsWith("-")) {
        negated = true;
        part = part.substr(1);
      }

      if (part.startsWith("√")) {
        square_rooted = true;
        part = part.substr(1);
      }

      let value = Number(part);
      if (square_rooted) {
        value = Math.sqrt(value);
      }

      if (negated) {
        value = -value;
      }

      return value;
    })
    .reduceRight((acc, value) => {
      return value / acc;
    }, 1);
}

defineParameterType({
  name: "expression",
  regexp: "(-?√?[0-9]+(?:\\.[0-9]+)?(?:\\/-?√?[0-9]+(?:\\.[0-9]+)?)?)",
  transformer: transformExpression,
  useForSnippets: false,
});

defineParameterType({
  name: "variable",
  regexp: "[a-z][a-z0-9]*",
  transformer: (s) => {
    return s;
  },
  useForSnippets: false,
});

defineParameterType({
  name: "matrix",
  regexp: "[A-Z]",
  transformer: (s) => {
    return s;
  },
  useForSnippets: false,
});

defineParameterType({
  name: "operator",
  regexp: "\\+|-|\\*|\\/",
  transformer: (s) => {
    return s;
  },
  useForSnippets: false,
});

Before(function () {
  this.environment = {};
});
