import colors from "../../src/colors";
import tuples from "../../src/tuples";
import { EPSILON } from "../../src/constants";
import { Given, Then, When } from "@cucumber/cucumber";
import { assert } from "chai";
import { NUMBER_EXPRESSION_REGEX, parseNumberExpression } from "./common";

Given(
  new RegExp(
    `^([a-z0-9]+) ← tuple\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
    `^([a-z0-9]+) ← (point|vector)\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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

Given(
  new RegExp(
    `^([a-z0-9]+) ← color\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
  ),
  function (
    name: string,
    redExpression: string,
    greenExpression: string,
    blueExpression: string
  ) {
    if (!this.environment) {
      this.environment = {};
    }

    const red = parseNumberExpression(redExpression);
    const green = parseNumberExpression(greenExpression);
    const blue = parseNumberExpression(blueExpression);
    this.environment[name] = { red, green, blue };
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
  new RegExp(`([a-z0-9]+)\.([a-z]+) = ${NUMBER_EXPRESSION_REGEX}`),
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
    `^([a-z0-9]+) = tuple\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
    `^-([a-z0-9]+) = tuple\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
    `^([a-z0-9]+) = vector\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
    `^([a-z0-9]+) \\+ ([a-z0-9]+) = tuple\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
    `^([a-z0-9]+) ([*/]) ${NUMBER_EXPRESSION_REGEX} = tuple\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
    `^([a-z0-9]+) - ([a-z0-9]+) = (point|vector)\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
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
  new RegExp(`^magnitude\\(([a-z0-9]+)\\) = ${NUMBER_EXPRESSION_REGEX}$`),
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

Then(
  new RegExp(
    `^([a-z0-9]+) ([-+*]) ([a-z]+[0-9]+) = color\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
  ),
  function (
    name1: string,
    op: string,
    name2: string,
    redExpression: string,
    greenExpression: string,
    blueExpression: string
  ) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];

    let actual;
    switch (op) {
      case "+":
        actual = colors.add(value1, value2);
        break;
      case "-":
        actual = colors.sub(value1, value2);
        break;
      case "*":
        actual = colors.mul(value1, value2);
        break;
      default:
        throw `unknown op ${op}`;
    }

    const red = parseNumberExpression(redExpression);
    const green = parseNumberExpression(greenExpression);
    const blue = parseNumberExpression(blueExpression);

    assert.approximately(actual.red, red, EPSILON);
    assert.approximately(actual.green, green, EPSILON);
    assert.approximately(actual.blue, blue, EPSILON);
  }
);

Then(
  new RegExp(
    `^([a-z0-9]+) \\* ${NUMBER_EXPRESSION_REGEX} = color\\(${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}, ${NUMBER_EXPRESSION_REGEX}\\)$`
  ),
  function (
    name: string,
    scalarExpression: string,
    redExpression: string,
    greenExpression: string,
    blueExpression: string
  ) {
    const value = this.environment[name];
    const scalar = parseNumberExpression(scalarExpression);
    const actual = colors.mul(value, scalar);

    const red = parseNumberExpression(redExpression);
    const green = parseNumberExpression(greenExpression);
    const blue = parseNumberExpression(blueExpression);

    assert.approximately(actual.red, red, EPSILON);
    assert.approximately(actual.green, green, EPSILON);
    assert.approximately(actual.blue, blue, EPSILON);
  }
);
