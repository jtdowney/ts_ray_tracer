export type Color = {
  red: number;
  green: number;
  blue: number;
};

export const BLACK = { red: 0, green: 0, blue: 0 };

function add(lhs: Color, rhs: Color) {
  const red = lhs.red + rhs.red;
  const green = lhs.green + rhs.green;
  const blue = lhs.blue + rhs.blue;
  return { red, green, blue };
}

function sub(lhs: Color, rhs: Color) {
  const red = lhs.red - rhs.red;
  const green = lhs.green - rhs.green;
  const blue = lhs.blue - rhs.blue;
  return { red, green, blue };
}

function mul(lhs: Color, rhs: Color | number) {
  if (typeof rhs === "number") {
    const red = lhs.red * rhs;
    const green = lhs.green * rhs;
    const blue = lhs.blue * rhs;
    return { red, green, blue };
  } else {
    const red = lhs.red * rhs.red;
    const green = lhs.green * rhs.green;
    const blue = lhs.blue * rhs.blue;
    return { red, green, blue };
  }
}

export default { add, sub, mul };
