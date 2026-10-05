// main.js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
// Ambient light (soft general light)
const ambientLight = new THREE.AmbientLight('white', 0.6);
scene.add(ambientLight);

// Directional light (like sun)
const directionalLight = new THREE.DirectionalLight('white', 1.0);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Optional: Point light for soft rim highlights
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

// Load FBX
const loader = new FBXLoader();
loader.load('../assets/Wukong_Royal.fbx', (object) => {
  object.scale.set(0.01, 0.01, 0.01); // Adjust scale
  scene.add(object);
}, undefined, (error) => {
  console.error('FBX Load Error:', error);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
