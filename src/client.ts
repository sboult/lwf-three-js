import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

function getCanvas(): HTMLCanvasElement {
  const element = document.querySelector<HTMLCanvasElement>("#lambda-canvas");
  if (!element) {
    throw new Error("Lambda canvas was not found");
  }
  return element;
}

const canvas = getCanvas();

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
camera.position.set(0, 0.15, 7.8);

scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x381305, 2.1));

const keyLight = new THREE.DirectionalLight(0xffe3c0, 4.5);
keyLight.position.set(-3, 4, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff6a00, 3.2);
rimLight.position.set(4, -1, -4);
scene.add(rimLight);

const coaster = new THREE.Group();
scene.add(coaster);

const body = new THREE.Mesh(
  new RoundedBoxGeometry(3.45, 3.45, 0.38, 8, 0.22),
  new THREE.MeshPhysicalMaterial({
    color: 0xdd5f0a,
    roughness: 0.36,
    metalness: 0.04,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
  }),
);
coaster.add(body);

const texture = new THREE.TextureLoader().load("/texture.png");
texture.colorSpace = THREE.SRGBColorSpace;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

function roundedSquare(size: number, radius: number): THREE.ShapeGeometry {
  const half = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half + radius, -half);
  shape.lineTo(half - radius, -half);
  shape.quadraticCurveTo(half, -half, half, -half + radius);
  shape.lineTo(half, half - radius);
  shape.quadraticCurveTo(half, half, half - radius, half);
  shape.lineTo(-half + radius, half);
  shape.quadraticCurveTo(-half, half, -half, half - radius);
  shape.lineTo(-half, -half + radius);
  shape.quadraticCurveTo(-half, -half, -half + radius, -half);

  const geometry = new THREE.ShapeGeometry(shape, 8);
  const uv = geometry.getAttribute("uv");

  for (let index = 0; index < uv.count; index += 1) {
    uv.setXY(
      index,
      geometry.getAttribute("position").getX(index) / size + 0.5,
      geometry.getAttribute("position").getY(index) / size + 0.5,
    );
  }

  return geometry;
}

const faceGeometry = roundedSquare(3.42, 0.2);
const faceMaterial = new THREE.MeshPhysicalMaterial({
  map: texture,
  side: THREE.FrontSide,
  roughness: 0.4,
  clearcoat: 0.32,
  clearcoatRoughness: 0.35,
});

const frontFace = new THREE.Mesh(faceGeometry, faceMaterial);
frontFace.position.z = 0.196;
coaster.add(frontFace);

const backFace = new THREE.Mesh(faceGeometry, faceMaterial);
backFace.position.z = -0.196;
backFace.rotation.y = Math.PI;
coaster.add(backFace);

coaster.rotation.x = -0.12;
coaster.rotation.z = -0.035;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const clock = new THREE.Clock();

function resize(): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function render(): void {
  resize();

  if (!reducedMotion.matches) {
    const elapsed = clock.getElapsedTime();
    coaster.rotation.y = elapsed * 0.72 - 0.5;
    coaster.rotation.x = -0.12 + Math.sin(elapsed * 0.72) * 0.08;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
