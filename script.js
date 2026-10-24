import * as THREE from 'three';
import { createRoom } from './room.js';
import { createWoodyController } from './woody.js';

// ------------------------------------
// 1. Βασικές ρυθμίσεις
// ------------------------------------

const status = document.getElementById('status');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb9d9f5);

const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 3.5, 7);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// ------------------------------------
// 2. Φωτισμός
// ------------------------------------

const hemisphereLight = new THREE.HemisphereLight(
    0xffffff,
    0x73849a,
    2.2
);

scene.add(hemisphereLight);

const sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
sunlight.position.set(5, 10, 5);
scene.add(sunlight);

// ------------------------------------
// Δημιουργία δωματίου και Woody
// ------------------------------------

createRoom(scene);

const woodyController = createWoodyController({
    scene,
    camera,
    status
});

woodyController.load();

// ------------------------------------
// Κεντρικός βρόχος παιχνιδιού
// ------------------------------------

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    woodyController.update(delta);
    woodyController.updateCamera(delta);

    renderer.render(scene, camera);
}

// ------------------------------------
// Προσαρμογή οθόνης
// ------------------------------------

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
