import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.fog = new THREE.FogExp2('grey', 0.02); // (color, density)



const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial({ 
  color: 'red', 
  metalness: 0.8, 
  roughness: 0.2 
});

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
const canvas = document.querySelector("canvas")
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(scene.fog.color);

// Hemisphere light for ambient sky/ground lighting
const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x222233, 0.8);
scene.add(hemiLight);

// Main sunlight with shadows
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// Optional: SpotLight for rim or highlight effects
const spotLight = new THREE.SpotLight(0xfff2cc, 1, 100, Math.PI / 6, 0.2, 1);
spotLight.position.set(-10, 15, 20);
spotLight.castShadow = true;
scene.add(spotLight);

// Tone mapping and exposure for HDR-like effect (after renderer creation)
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.2;


window.addEventListener("resize",()=>{
  renderer.setSize(window.innerWidth,window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;
controls.enableZoom = true;
controls.enablePan = true;
controls.dampingFactor = 0.25;
controls.enableRotate = true;
controls.enableZoom = true;


const loader = new THREE.TextureLoader();
const smokeTexture = loader.load('../texture/circle_01.png'); 

const smokeMaterial = new THREE.PointsMaterial({
  size: 2,
  map: smokeTexture,
  transparent: true,
  opacity: 0.3,          // Adjust for desired transparency
  depthWrite: false,     // Prevent z-buffer clipping artifacts
  blending: THREE.AdditiveBlending,  // For glow effect
  color: 0xcccccc
});



const particlesCount = 10000;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200; // spread around
}

const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));


const particles = new THREE.Points(geo, smokeMaterial);
scene.add(particles);

const particleData = [];
for (let i = 0; i < particlesCount; i++) {
  particleData.push({
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    ),
    rotation: Math.random() * 2 * Math.PI
  });
}
// const bounds = 100;
// for (let i = 0; i < particlesCount; i++) {
//   positions[i * 3]     += particleData[i].velocity.x;
//   positions[i * 3 + 1] += particleData[i].velocity.y;
//   positions[i * 3 + 2] += particleData[i].velocity.z;
//   // Wrap around
//   if (positions[i * 3] > bounds) positions[i * 3] = -bounds;
//   if (positions[i * 3] < -bounds) positions[i * 3] = bounds;
//   if (positions[i * 3 + 1] > bounds) positions[i * 3 + 1] = -bounds;
//   if (positions[i * 3 + 1] < -bounds) positions[i * 3 + 1] = bounds;
//   if (positions[i * 3 + 2] > bounds) positions[i * 3 + 2] = -bounds;
//   if (positions[i * 3 + 2] < -bounds) positions[i * 3 + 2] = bounds;
// }

// In your animate() loop:
function animate() {
  requestAnimationFrame(animate);

  // Animate particles
  const positions = geo.attributes.position.array;
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3]     += particleData[i].velocity.x;
    positions[i * 3 + 1] += particleData[i].velocity.y;
    positions[i * 3 + 2] += particleData[i].velocity.z;
    // Optionally: wrap around or reset position if out of bounds
  }
  geo.attributes.position.needsUpdate = true;
  particles.opacity -= 0.005; // gradually fade out
  particles.size += 0.01;     // gradually grow
  // Animate rotation (if using Sprites or custom shaders)
  // Not supported directly by Points, but you can switch to Sprites for more control

  controls.update();
  renderer.render(scene, camera);
}

animate()