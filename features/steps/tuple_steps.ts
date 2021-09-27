import colors from "../../src/colors";
import tuples from "../../src/tuples";
import { EPSILON } from "../../src/constants";
import { Given, Then, When } from "@cucumber/cucumber";
import { assert } from "chai";

Given(
  "{variable} ← tuple\\({expression}, {expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number, w: number) {
    this.environment[name] = { x, y, z, w };
  }
);

Given(
  "{variable} ← point\\({expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number) {
    this.environment[name] = { x, y, z, w: 1 };
  }
);

Given(
  "{variable} ← vector\\({expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number) {
    this.environment[name] = { x, y, z, w: 0 };
  }
);

Given(
  "{variable} ← color\\({expression}, {expression}, {expression})",
  function (name: string, red: number, green: number, blue: number) {
    this.environment[name] = { red, green, blue, w: 0 };
  }
);

When(
  "{variable} ← normalize\\({variable})",
  function (normalName: string, name: string) {
    const value = tuples.normalize(this.environment[name]);
    this.environment[normalName] = value;
  }
);

Then(
  "{variable}.{variable} = {expression}",
  function (name: string, property: string, expected: number) {
    const actual = this.environment[name][property];
    assert.equal(actual, expected);
  }
);

Then("{variable} is a point", function (name: string) {
  const actual = this.environment[name].w;
  assert.equal(actual, 1.0);
});

Then("{variable} is not a point", function (name: string) {
  const actual = this.environment[name].w;
  assert.notEqual(actual, 1.0);
});

Then("{variable} is a vector", function (name: string) {
  const actual = this.environment[name].w;
  assert.equal(actual, 0.0);
});

Then("{variable} is not a vector", function (name: string) {
  const actual = this.environment[name].w;
  assert.notEqual(actual, 0.0);
});

Then(
  "{variable} = tuple\\({expression}, {expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number, w: number) {
    const actual = this.environment[name];
    const expected = { x, y, z, w };
    assert.deepEqual(actual, expected);
  }
);

Then(
  "-{variable} = tuple\\({expression}, {expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number, w: number) {
    const actual = tuples.negate(this.environment[name]);
    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, w, EPSILON);
  }
);

Then(
  "{variable} = point\\({expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number) {
    const actual = this.environment[name];
    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, 1, EPSILON);
  }
);

Then(
  "{variable} = vector\\({expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number) {
    const actual = this.environment[name];
    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, 0, EPSILON);
  }
);

Then(
  "{variable} {operator} {variable} = tuple\\({expression}, {expression}, {expression}, {expression})",
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

    let actual;
    switch (operator) {
      case "+":
        actual = tuples.add(value1, value2);
        break;
      default:
        throw `unsupport op ${operator}`;
    }

    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, w, EPSILON);
  }
);

Then(
  "{variable} {operator} {expression} = tuple\\({expression}, {expression}, {expression}, {expression})",
  function (
    name: string,
    operator: string,
    scalar: number,
    x: number,
    y: number,
    z: number,
    w: number
  ) {
    const value = this.environment[name];

    let actual;
    switch (operator) {
      case "*":
        actual = tuples.mul(value, scalar);
        break;
      case "/":
        actual = tuples.div(value, scalar);
        break;
      default:
        throw `unsupport op ${operator}`;
    }

    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, w, EPSILON);
  }
);

Then(
  "{variable} {operator} {variable} = point\\({expression}, {expression}, {expression})",
  function (
    lhs: string,
    operator: string,
    rhs: string,
    x: number,
    y: number,
    z: number
  ) {
    const value1 = this.environment[lhs];
    const value2 = this.environment[rhs];

    let actual;
    switch (operator) {
      case "+":
        actual = tuples.add(value1, value2);
        break;
      case "-":
        actual = tuples.sub(value1, value2);
        break;
      default:
        throw `unsupport op ${operator}`;
    }

    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, 1, EPSILON);
  }
);

Then(
  "{variable} {operator} {variable} = vector\\({expression}, {expression}, {expression})",
  function (
    lhs: string,
    operator: string,
    rhs: string,
    x: number,
    y: number,
    z: number
  ) {
    const value1 = this.environment[lhs];
    const value2 = this.environment[rhs];

    let actual;
    switch (operator) {
      case "+":
        actual = tuples.add(value1, value2);
        break;
      case "-":
        actual = tuples.sub(value1, value2);
        break;
      default:
        throw `unsupport op ${operator}`;
    }

    assert.approximately(actual.x, x, EPSILON);
    assert.approximately(actual.y, y, EPSILON);
    assert.approximately(actual.z, z, EPSILON);
    assert.approximately(actual.w, 0, EPSILON);
  }
);

Then(
  "magnitude\\({variable}) = {expression}",
  function (name: string, expected: number) {
    const value = this.environment[name];
    const actual = tuples.magnitude(value);
    assert.equal(actual, expected);
  }
);

Then(
  "normalize\\({variable}) = vector\\({expression}, {expression}, {expression})",
  function (name: string, x: number, y: number, z: number) {
    const value = this.environment[name];
    const actual = tuples.normalize(value);
    const expected = { x, y, z, w: 0 };
    assert.deepEqual(actual, expected);
  }
);

Then(
  "normalize\\({variable}) = approximately vector\\({expression}, {expression}, {expression})",
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
  "cross\\({variable}, {variable}) = vector\\({expression}, {expression}, {expression})",
  function (name1: string, name2: string, x: number, y: number, z: number) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];
    const actual = tuples.cross(value1, value2);

    const expected = { x, y, z, w: 0 };
    assert.deepEqual(actual, expected);
  }
);

Then(
  "dot\\({variable}, {variable}) = {expression}",
  function (name1: string, name2: string, expected: number) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];
    const actual = tuples.dot(value1, value2);
    assert.equal(actual, expected);
  }
);

Then(
  "{variable} {operator} {variable} = color\\({expression}, {expression}, {expression})",
  function (
    name1: string,
    operator: string,
    name2: string,
    red: number,
    green: number,
    blue: number
  ) {
    const value1 = this.environment[name1];
    const value2 = this.environment[name2];

    let actual;
    switch (operator) {
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
        throw `unknown op ${operator}`;
    }

    assert.approximately(actual.red, red, EPSILON);
    assert.approximately(actual.green, green, EPSILON);
    assert.approximately(actual.blue, blue, EPSILON);
  }
);

Then(
  "{variable} {operator} {expression} = color\\({expression}, {expression}, {expression})",
  function (
    name: string,
    operator: string,
    scalar: number,
    red: number,
    green: number,
    blue: number
  ) {
    const value = this.environment[name];

    let actual;
    switch (operator) {
      case "*":
        actual = colors.mul(value, scalar);
        break;
      default:
        throw `unknown op ${operator}`;
    }

    assert.approximately(actual.red, red, EPSILON);
    assert.approximately(actual.green, green, EPSILON);
    assert.approximately(actual.blue, blue, EPSILON);
  }
);
