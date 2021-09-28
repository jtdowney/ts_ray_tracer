import matrix from "../src/matrix";

console.log(matrix.inverse(matrix.identity(4)));

let m = matrix.empty(4);
m.values = [
  [3.0, -9.0, 7.0, 3.0],
  [3.0, -8.0, 2.0, -9.0],
  [-4.0, 4.0, 4.0, 1.0],
  [-6.0, 5.0, -1.0, 1.0],
];
console.log(m);
console.log(matrix.mul(m, matrix.inverse(m)));
console.log(matrix.transpose(matrix.inverse(m)));
console.log(matrix.inverse(matrix.transpose(m)));

const id = matrix.identity(4);
const v = { x: 1, y: 2, z: 3, w: 0 };
console.log(matrix.mul(id, v));

id.values[1][0] = 2;
console.log(matrix.mul(id, v));
