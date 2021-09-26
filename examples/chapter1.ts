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
const velocity = tuples.normalize({ x: 1, y: 1, z: 0, w: 0 });
const gravity = { x: 0, y: -0.05, z: 0, w: 0 };
const wind = { x: 0, y: 0, z: 0, w: 0 };

const projectile = {
  position,
  velocity,
};

let simulation = {
  gravity,
  wind,
  projectile,
};

while (is_running(simulation)) {
  console.log(simulation);
  simulation = tick(simulation);
}
