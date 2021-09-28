export type Tuple = {
  x: number;
  y: number;
  z: number;
  w: number;
};

function add(lhs: Tuple, rhs: Tuple) {
  const x = lhs.x + rhs.x;
  const y = lhs.y + rhs.y;
  const z = lhs.z + rhs.z;
  const w = lhs.w + rhs.w;

  return {
    x,
    y,
    z,
    w,
  };
}

function sub(lhs: Tuple, rhs: Tuple) {
  const x = lhs.x - rhs.x;
  const y = lhs.y - rhs.y;
  const z = lhs.z - rhs.z;
  const w = lhs.w - rhs.w;

  return {
    x,
    y,
    z,
    w,
  };
}

function mul(value: Tuple, scalar: number) {
  const x = value.x * scalar;
  const y = value.y * scalar;
  const z = value.z * scalar;
  const w = value.w * scalar;

  return {
    x,
    y,
    z,
    w,
  };
}

function div(value: Tuple, scalar: number) {
  const x = value.x / scalar;
  const y = value.y / scalar;
  const z = value.z / scalar;
  const w = value.w / scalar;

  return {
    x,
    y,
    z,
    w,
  };
}

function negate(value: Tuple) {
  const x = -value.x;
  const y = -value.y;
  const z = -value.z;
  const w = -value.w;

  return {
    x,
    y,
    z,
    w,
  };
}

function magnitude({ x, y, z, w }: Tuple) {
  const sum = Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2) + Math.pow(w, 2);
  return Math.sqrt(sum);
}

function normalize(value: Tuple) {
  const m = magnitude(value);
  return div(value, m);
}

function cross(lhs: Tuple, rhs: Tuple) {
  const x = lhs.y * rhs.z - lhs.z * rhs.y;
  const y = lhs.z * rhs.x - lhs.x * rhs.z;
  const z = lhs.x * rhs.y - lhs.y * rhs.x;
  return { x, y, z, w: 0 };
}

function dot(lhs: Tuple, rhs: Tuple) {
  return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z;
}

function element(value: Tuple, index: number) {
  switch (index) {
    case 0:
      return value.x;
    case 1:
      return value.y;
    case 2:
      return value.z;
    case 3:
      return value.w;
    default:
      throw "invalid index";
  }
}

export default {
  add,
  sub,
  mul,
  div,
  negate,
  magnitude,
  normalize,
  cross,
  dot,
  element,
};
