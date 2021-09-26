import canvas from "../src/canvas";
import tuples, { Tuple } from "../src/tuples";

type Projectile = {
  position: Tuple;
  velocity: Tuple;
};

type Simulation = {
  gravity: Tuple;
  wind: Tuple;
  projectile: Projectile;
};

function tick(simulation: Simulation) {
  const position = tuples.add(
    simulation.projectile.position,
    simulation.projectile.velocity
  );
  const velocity = tuples.add(
    simulation.projectile.velocity,
    tuples.add(simulation.gravity, simulation.wind)
  );
  const projectile = { position, velocity };
  return { ...simulation, projectile };
}

function is_running(simulation: Simulation) {
  return simulation.projectile.position.y > 0;
}

const position = { x: 0, y: 1, z: 0, w: 1 };
const velocity = tuples.mul(
  tuples.normalize({ x: 1, y: 1.8, z: 0, w: 0 }),
  11.25
);
const gravity = { x: 0, y: -0.1, z: 0, w: 0 };
const wind = { x: -0.01, y: 0, z: 0, w: 0 };
const color = { red: 0.8, green: 0.2, blue: 0.1 };

const projectile = {
  position,
  velocity,
};

let simulation = {
  gravity,
  wind,
  projectile,
};

const c = canvas.canvas(900, 550);

while (is_running(simulation)) {
  let { x, y } = simulation.projectile.position;
  x = Math.round(x);
  y = c.height - Math.round(y);

  canvas.write_pixel(c, x, y, color);
  simulation = tick(simulation);
}

const output = canvas.canvas_to_ppm(c);
process.stdout.write(output);
