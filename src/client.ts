import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TEXTURE_PATH } from "./constants.ts";

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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 5.2;
controls.maxDistance = 11;
controls.autoRotate = !reducedMotion.matches;
controls.autoRotateSpeed = 2.1;
controls.target.set(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x381305, 2.1));

const keyLight = new THREE.DirectionalLight(0xffe3c0, 4.5);
keyLight.position.set(-3, 4, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff6a00, 3.2);
rimLight.position.set(4, -1, -4);
scene.add(rimLight);

const coaster = new THREE.Group();
scene.add(coaster);

const texture = new THREE.TextureLoader().load(TEXTURE_PATH);
texture.colorSpace = THREE.SRGBColorSpace;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const backTexture = texture.clone();
backTexture.needsUpdate = true;

const frontMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  toneMapped: false,
});

const backMaterial = new THREE.MeshBasicMaterial({
  map: backTexture,
  toneMapped: false,
});

const edgeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xdf680c,
  roughness: 0.4,
  clearcoat: 0.32,
  clearcoatRoughness: 0.35,
});

const body = new THREE.Mesh(
  new THREE.BoxGeometry(2.48, 2.48, 0.272),
  [
    edgeMaterial,
    edgeMaterial,
    edgeMaterial,
    edgeMaterial,
    frontMaterial,
    backMaterial,
  ],
);
coaster.add(body);

coaster.rotation.x = -0.12;
coaster.rotation.z = -0.035;

let resumeRotation: number | undefined;

controls.addEventListener("start", () => {
  controls.autoRotate = false;
  if (resumeRotation !== undefined) {
    window.clearTimeout(resumeRotation);
  }
});

controls.addEventListener("end", () => {
  if (reducedMotion.matches) {
    return;
  }

  resumeRotation = window.setTimeout(() => {
    controls.autoRotate = true;
  }, 1800);
});

reducedMotion.addEventListener("change", ({ matches }) => {
  controls.autoRotate = !matches;
});

function resize(): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function render(): void {
  resize();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
