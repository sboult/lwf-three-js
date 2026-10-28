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

const glintTime = { value: 0 };

function addGlint(material: THREE.MeshBasicMaterial): void {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.glintTime = glintTime;
    shader.fragmentShader = `
      uniform float glintTime;

      float glintHash(vec2 point) {
        return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
      }

      float glintNoise(vec2 point) {
        vec2 cell = floor(point);
        vec2 offset = fract(point);
        offset = offset * offset * (3.0 - 2.0 * offset);

        return mix(
          mix(
            glintHash(cell),
            glintHash(cell + vec2(1.0, 0.0)),
            offset.x
          ),
          mix(
            glintHash(cell + vec2(0.0, 1.0)),
            glintHash(cell + vec2(1.0, 1.0)),
            offset.x
          ),
          offset.y
        );
      }

      ${shader.fragmentShader}
    `.replace(
      "#include <opaque_fragment>",
      `
        vec2 centeredUv = vMapUv - 0.5;
        mat2 glintRotation = mat2(
          0.6428, 0.7660,
          -0.7660, 0.6428
        );
        vec2 glintUv = glintRotation * centeredUv;
        vec2 drift = vec2(glintTime * 0.16, -glintTime * 0.035);

        float broadSheen = smoothstep(
          0.35,
          0.82,
          glintNoise(glintUv * vec2(4.0, 2.0) + drift)
        );
        float fineSheen = smoothstep(
          0.48,
          0.9,
          glintNoise(glintUv * vec2(8.0, 3.0) - drift * 0.55)
        );
        float sweepPosition = fract(
          glintUv.x * 0.55 + glintUv.y * 0.2 + glintTime * 0.22
        );
        float movingSweep = 1.0 - smoothstep(
          0.0,
          0.24,
          abs(sweepPosition - 0.5)
        );
        float glintTexture = broadSheen * 0.75 + fineSheen * 0.25;
        float glint = clamp(
          glintTexture * (0.25 + movingSweep * 0.75),
          0.0,
          1.0
        );
        vec3 glintColor = mix(
          vec3(0.95, 0.12, 1.0),
          vec3(0.05, 0.82, 1.0),
          fineSheen
        );
        vec3 screenedGlint = 1.0 - (
          (1.0 - clamp(outgoingLight, 0.0, 1.0)) *
          (1.0 - glintColor * 0.55)
        );
        outgoingLight = mix(outgoingLight, screenedGlint, glint * 0.58);
        #include <opaque_fragment>
      `,
    );
  };
  material.customProgramCacheKey = () => "subtle-lambda-glint";
}

const frontMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  toneMapped: false,
});

const backMaterial = new THREE.MeshBasicMaterial({
  map: backTexture,
  toneMapped: false,
});

addGlint(frontMaterial);
addGlint(backMaterial);

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
  glintTime.value = reducedMotion.matches ? 0 : performance.now() / 1000;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
