import { Given, Then, When } from "@cucumber/cucumber";
import { assert } from "chai";
import { Color } from "../../src/colors";
import canvas, { Canvas } from "../../src/canvas";
import { EPSILON } from "../../src/constants";

Given(
  "{word} ← canvas\\({int}, {int})",
  function (name: string, width: number, height: number) {
    if (!this.environment) {
      this.environment = {};
    }

    this.environment[name] = canvas.canvas(width, height);
  }
);

When(
  "write_pixel\\({word}, {int}, {int}, {word})",
  function (canvasName: string, x: number, y: number, colorName: string) {
    const c = this.environment[canvasName];
    const color = this.environment[colorName];
    canvas.write_pixel(c, x, y, color);
  }
);

When(
  "{word} ← canvas_to_ppm\\({word})",
  function (outputName: string, canvasName: string) {
    const c = this.environment[canvasName];
    this.environment[outputName] = canvas.canvas_to_ppm(c);
  }
);

When(
  "every pixel of {word} is set to color\\({float}, {float}, {float})",
  function (name: string, red: number, green: number, blue: number) {
    const canvas = this.environment[name] as Canvas;
    canvas.pixels.fill({ red, green, blue });
  }
);

Then(
  "every pixel of {word} is color\\({float}, {float}, {float})",
  function (name: string, red: number, green: number, blue: number) {
    const actual = this.environment[name] as Canvas;
    assert.equal(actual.pixels.length, actual.width * actual.height);

    actual.pixels.forEach((pixel) => {
      assert.deepEqual(pixel, { red, green, blue });
    });
  }
);

Then(
  "pixel_at\\({word}, {int}, {int}) = {word}",
  function (canvasName: string, x: number, y: number, colorName: string) {
    const c = this.environment[canvasName];
    const expected = this.environment[colorName] as Color;
    const actual = canvas.pixel_at(c, x, y);

    assert.approximately(actual.red, expected.red, EPSILON);
    assert.approximately(actual.green, expected.green, EPSILON);
    assert.approximately(actual.blue, expected.blue, EPSILON);
  }
);

Then(
  "lines {int}-{int} of {word} are",
  function (start: number, end: number, name: string, data: string) {
    const value = this.environment[name] as string;
    const expected = data.split("\n");
    const actual = value.split("\n").slice(start - 1, end);

    assert.deepEqual(actual, expected);
  }
);

Then("{word} ends with a newline character", function (name: string) {
  const value = this.environment[name] as string;
  assert.isTrue(value.endsWith("\n"));
});
