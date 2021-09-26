import { Given, Then, When } from "@cucumber/cucumber";
import { assert } from "chai";
import tuples from "../../src/tuples";
import { EPSILON } from "../../src/constants";

const numberExpressionRegex =
  "(-?√?[0-9]+(?:\\.[0-9]+)?(?:\\/-?√?[0-9]+(?:\\.[0-9]+)?)?)";

function parseNumberExpression(value: string): number {
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

Given(
  new RegExp(
    `^([a-z0-9]+) ← tuple\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name: string,
    xExpression: string,
    yExpression: string,
    zExpression: string,
    wExpression: string
  ) {
    if (!this.environment) {
      this.environment = {};
    }

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = parseNumberExpression(wExpression);
    this.environment[name] = { x, y, z, w };
  }
);

Given(
  new RegExp(
    `^([a-z0-9]+) ← (point|vector)\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name: string,
    type: string,
    xExpression: string,
    yExpression: string,
    zExpression: string
  ) {
    if (!this.environment) {
      this.environment = {};
    }

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = type == "point" ? 1 : 0;
    this.environment[name] = { x, y, z, w };
  }
);

When(
  "{word} ← normalize\\({word})",
  function (normalName: string, name: string) {
    const value = tuples.normalize(this.environment[name]);
    this.environment[normalName] = value;
  }
);

Then(
  new RegExp(`([a-z0-9]+)\.([a-z]+) = ${numberExpressionRegex}`),
  function (name: string, element: string, expected: number) {
    const actual = this.environment[name][element];
    assert.equal(actual, expected);
  }
);

Then("{word} is a point", function (name: string) {
  const actual = this.environment[name].w;
  assert.equal(actual, 1.0);
});

Then("{word} is not a point", function (name: string) {
  const actual = this.environment[name].w;
  assert.notEqual(actual, 1.0);
});

Then("{word} is a vector", function (name: string) {
  const actual = this.environment[name].w;
  assert.equal(actual, 0.0);
});

Then("{word} is not a vector", function (name: string) {
  const actual = this.environment[name].w;
  assert.notEqual(actual, 0.0);
});

Then(
  new RegExp(
    `^([a-z0-9]+) = tuple\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name: string,
    xExpression: string,
    yExpression: string,
    zExpression: string,
    wExpression: string
  ) {
    const actual = this.environment[name];

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = parseNumberExpression(wExpression);
    const expected = { x, y, z, w };
    assert.deepEqual(actual, expected);
  }
);

Then(
  new RegExp(
    `^-([a-z0-9]+) = tuple\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name: string,
    xExpression: string,
    yExpression: string,
    zExpression: string,
    wExpression: string
  ) {
    const actual = tuples.negate(this.environment[name]);

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = parseNumberExpression(wExpression);
    const expected = { x, y, z, w };
    assert.deepEqual(actual, expected);
  }
);

Then(
  new RegExp(
    `^([a-z0-9]+) = vector\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name: string,
    xExpression: string,
    yExpression: string,
    zExpression: string
  ) {
    const actual = this.environment[name];

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = 0;
    const expected = { x, y, z, w };

    assert.approximately(actual.x, expected.x, EPSILON);
    assert.approximately(actual.y, expected.y, EPSILON);
    assert.approximately(actual.z, expected.z, EPSILON);
    assert.approximately(actual.w, expected.w, EPSILON);
  }
);

Then(
  new RegExp(
    `^([a-z0-9]+) \\+ ([a-z0-9]+) = tuple\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name1: string,
    name2: string,
    xExpression: string,
    yExpression: string,
    zExpression: string,
    wExpression: string
  ) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];
    let actual = tuples.add(value1, value2);

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = parseNumberExpression(wExpression);
    const expected = { x, y, z, w };
    assert.deepEqual(actual, expected);
  }
);

Then(
  new RegExp(
    `^([a-z0-9]+) ([*/]) ${numberExpressionRegex} = tuple\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name: string,
    op: string,
    scalarExpression: string,
    xExpression: string,
    yExpression: string,
    zExpression: string,
    wExpression: string
  ) {
    const value = this.environment[name];
    const scalar = parseNumberExpression(scalarExpression);

    let actual;
    switch (op) {
      case "*":
        actual = tuples.mul(value, scalar);
        break;
      case "/":
        actual = tuples.div(value, scalar);
        break;
    }

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = parseNumberExpression(wExpression);
    const expected = { x, y, z, w };
    assert.deepEqual(actual, expected);
  }
);

Then(
  new RegExp(
    `^([a-z0-9]+) - ([a-z0-9]+) = (point|vector)\\(${numberExpressionRegex}, ${numberExpressionRegex}, ${numberExpressionRegex}\\)$`
  ),
  function (
    name1: string,
    name2: string,
    type: string,
    xExpression: string,
    yExpression: string,
    zExpression: string
  ) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];
    const actual = tuples.sub(value1, value2);

    const x = parseNumberExpression(xExpression);
    const y = parseNumberExpression(yExpression);
    const z = parseNumberExpression(zExpression);
    const w = type == "point" ? 1 : 0;
    const expected = { x, y, z, w };
    assert.deepEqual(actual, expected);
  }
);

Then(
  new RegExp(`^magnitude\\(([a-z0-9]+)\\) = ${numberExpressionRegex}$`),
  function (name: string, expectedExpression: string) {
    const value = this.environment[name];
    const actual = tuples.magnitude(value);
    let expected = parseNumberExpression(expectedExpression);
    assert.equal(actual, expected);
  }
);

Then(
  "normalize\\({word}) = vector\\({float}, {float}, {float})",
  function (name: string, x: number, y: number, z: number) {
    const value = this.environment[name];
    const actual = tuples.normalize(value);
    const expected = { x, y, z, w: 0 };
    assert.deepEqual(actual, expected);
  }
);

Then(
  "normalize\\({word}) = approximately vector\\({float}, {float}, {float})",
  function (name: string, x: number, y: number, z: number) {
    const value = this.environment[name];
    const actual = tuples.normalize(value);
    const expected = { x, y, z, w: 0 };
    assert.approximately(actual.x, expected.x, EPSILON);
    assert.approximately(actual.y, expected.y, EPSILON);
    assert.approximately(actual.z, expected.z, EPSILON);
    assert.approximately(actual.w, expected.w, EPSILON);
  }
);

Then(
  "cross\\({word}, {word}) = vector\\({float}, {float}, {float})",
  function (name1: string, name2: string, x: number, y: number, z: number) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];
    const actual = tuples.cross(value1, value2);

    const expected = { x, y, z, w: 0 };
    assert.deepEqual(actual, expected);
  }
);

Then(
  "dot\\({word}, {word}) = {float}",
  function (name1: string, name2: string, expected: number) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];
    const actual = tuples.dot(value1, value2);
    assert.equal(actual, expected);
  }
);
