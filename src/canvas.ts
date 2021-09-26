import { BLACK, Color } from "./colors";

export type Canvas = {
  width: number;
  height: number;
  pixels: Color[];
};

function canvas(width: number, height: number) {
  let pixels = new Array(width * height);
  pixels.fill(BLACK);

  return { width, height, pixels };
}

function write_pixel(canvas: Canvas, x: number, y: number, color: Color) {
  let index = index_at(canvas, x, y);
  canvas.pixels[index] = color;
}

function pixel_at(canvas: Canvas, x: number, y: number) {
  let index = index_at(canvas, x, y);
  return canvas.pixels[index];
}

function canvas_to_ppm(canvas: Canvas) {
  let output = [];
  output.push("P3");
  output.push(`${canvas.width} ${canvas.height}`);
  output.push("255");

  for (let j = 0; j < canvas.height; j++) {
    const { lines, values } = canvas.pixels
      .slice(j * canvas.width, (j + 1) * canvas.width)
      .flatMap((pixel) => {
        const red = color_value(pixel.red);
        const green = color_value(pixel.green);
        const blue = color_value(pixel.blue);
        return [red, green, blue];
      })
      .reduce(
        ({ lines, values }, color) => {
          if (values.length == 17) {
            lines.push(values.join(" "));
            values = [];
          }

          values.push(color);

          return { lines, values };
        },
        { lines: new Array<string>(), values: new Array<string>() }
      );

    if (values.length > 0) {
      lines.push(values.join(" "));
    }

    lines.forEach((line) => {
      output.push(line);
    });
  }

  output.push("");

  return output.join("\n");
}

function index_at(canvas: Canvas, x: number, y: number) {
  return y * canvas.width + x;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function color_value(color: number) {
  const clamped = clamp(color, 0, 1);
  return Math.round(clamped * 255).toString();
}

export default {
  canvas,
  write_pixel,
  pixel_at,
  canvas_to_ppm,
};
