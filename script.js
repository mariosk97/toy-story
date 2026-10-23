
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

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
// 3. Παιδικό δωμάτιο - πάτωμα
// ------------------------------------

// Εναλλάξ χρώματα ξύλινων σανίδων

const floorMaterials = [
    new THREE.MeshStandardMaterial({
        color: 0x96613f,
        roughness: 1
    }),
    new THREE.MeshStandardMaterial({
        color: 0xb48259,
        roughness: 1
    })
];

// Κάθε σανίδα έχει διαφορετική απόχρωση
for (let z = -9.5; z <= 9.5; z += 1) {
    const plank = new THREE.Mesh(
        new THREE.BoxGeometry(20, 0.04, 1),
        floorMaterials[Math.round(z + 9.5) % 2]
    );

    plank.position.set(0, -0.02, z);
    scene.add(plank);
}

// Οριζόντιες γραμμές ανάμεσα στις σανίδες
const floorLineMaterial = new THREE.MeshStandardMaterial({
    color: 0x68432f,
    roughness: 1
});

for (let z = -9; z <= 9; z += 1) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(20, 0.015, 0.035),
        floorLineMaterial
    );

    line.position.set(0, 0.005, z);
    scene.add(line);
}

// ------------------------------------
// 4. Παιδικό δωμάτιο - τοίχοι
// ------------------------------------

const wallMaterials = [
    new THREE.MeshStandardMaterial({
        color: 0xd8b38c,
        roughness: 1
    }),
    new THREE.MeshStandardMaterial({
        color: 0xe8c9a7,
        roughness: 1
    })
];

const wallLineMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9916d,
    roughness: 1
});

// Πίσω τοίχος από εναλλάξ κάθετες σανίδες
for (let x = -9.5; x <= 9.5; x += 1) {
    const plank = new THREE.Mesh(
        new THREE.BoxGeometry(1, 8, 0.3),
        wallMaterials[Math.round(x + 9.5) % 2]
    );

    plank.position.set(x, 4, -10);
    scene.add(plank);
}

// Πλαϊνοί τοίχοι
for (const side of [-1, 1]) {
    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 8, 20),
        wallMaterials[0]
    );

    wall.position.set(side * 10, 4, 0);
    scene.add(wall);
}

// Κάθετες γραμμές ανάμεσα στις σανίδες του πίσω τοίχου
for (let x = -9.5; x <= 9.5; x += 1) {
    const line = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, 8, 0.025),
        wallLineMaterial
    );

    line.position.set(x, 4, -9.82);
    scene.add(line);
}

// ------------------------------------
// 5. Παράθυρα με θέα έξω
// ------------------------------------


 // ------------------------------------
 // Λωρίδες χαμηλά στους τοίχους
 // ------------------------------------

 const darkBrownMaterial = new THREE.MeshStandardMaterial({
     color: 0x593923,
     roughness: 1
 });

 const tealMaterial = new THREE.MeshStandardMaterial({
     color: 0x55b8bd,
     roughness: 1
 });

 // Ύψη λωρίδων
 const brownHeight = 0.5;
 const tealHeight = 2;

 // Τοποθέτηση χαμηλά στον τοίχο
 const brownCenterY = brownHeight / 2;
 const tealCenterY = brownHeight + tealHeight / 2;

 // Πίσω τοίχος: σκούρα καφέ λωρίδα
 const backBrownStrip = new THREE.Mesh(
     new THREE.BoxGeometry(20, brownHeight, 0.08),
     darkBrownMaterial
 );

 backBrownStrip.position.set(0, brownCenterY, -9.78);
 scene.add(backBrownStrip);

 // Πίσω τοίχος: θαλασσί λωρίδα
 const backTealStrip = new THREE.Mesh(
     new THREE.BoxGeometry(20, tealHeight, 0.08),
     tealMaterial
 );

 backTealStrip.position.set(0, tealCenterY, -9.78);
 scene.add(backTealStrip);

 // Πλαϊνοί τοίχοι
 for (const side of [-1, 1]) {

     // Σκούρα καφέ λωρίδα
     const brownStrip = new THREE.Mesh(
         new THREE.BoxGeometry(0.08, brownHeight, 20),
         darkBrownMaterial
     );

     brownStrip.position.set(
         side * 9.78,
         brownCenterY,
         0
     );

     scene.add(brownStrip);

     // Θαλασσί λωρίδα
     const tealStrip = new THREE.Mesh(
         new THREE.BoxGeometry(0.08, tealHeight, 20),
         tealMaterial
     );

     tealStrip.position.set(
         side * 9.78,
         tealCenterY,
         0
     );

     scene.add(tealStrip);
 }


const skyMaterial = new THREE.MeshBasicMaterial({
    color: 0x83c9f5
});

const grassMaterial = new THREE.MeshBasicMaterial({
    color: 0x69ad53
});

const cloudMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
});

const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8
});

function addWindow(centerX) {
    const centerY = 4.8;
    const windowWidth = 3.2;
    const windowHeight = 2.6;
    const z = -9.78;

    // Ο ουρανός
    const sky = new THREE.Mesh(
        new THREE.PlaneGeometry(windowWidth, windowHeight),
        skyMaterial
    );

    sky.position.set(centerX, centerY, z);
    scene.add(sky);

    // Πράσινο τοπίο
    const grass = new THREE.Mesh(
        new THREE.PlaneGeometry(windowWidth, 0.8),
        grassMaterial
    );

    grass.position.set(centerX, centerY - 0.9, z + 0.01);
    scene.add(grass);

    // Σύννεφα
    function addCloud(x, y, scale = 1) {
        const parts = [
            [-0.22, 0, 0.20],
            [0, 0.10, 0.27],
            [0.25, 0, 0.19]
        ];

        for (const [dx, dy, radius] of parts) {
            const cloudPart = new THREE.Mesh(
                new THREE.CircleGeometry(radius * scale, 16),
                cloudMaterial
            );

            cloudPart.position.set(
                x + dx * scale,
                y + dy * scale,
                z + 0.025
            );

            scene.add(cloudPart);
        }
    }

    addCloud(centerX - 0.65, centerY + 0.55, 0.8);
    addCloud(centerX + 0.65, centerY + 0.25, 0.65);

    // Λευκό πλαίσιο παραθύρου
    const frameZ = -9.65;
    const frameThickness = 0.13;

    const framePieces = [
        [windowWidth + 0.25, frameThickness, 0, windowHeight / 2],
        [windowWidth + 0.25, frameThickness, 0, -windowHeight / 2],
        [frameThickness, windowHeight, -windowWidth / 2, 0],
        [frameThickness, windowHeight, windowWidth / 2, 0],
        [frameThickness * 0.8, windowHeight, 0, 0],
        [windowWidth, frameThickness * 0.8, 0, 0]
    ];

    for (const [w, h, dx, dy] of framePieces) {
        const piece = new THREE.Mesh(
            new THREE.BoxGeometry(w, h, 0.16),
            frameMaterial
        );

        piece.position.set(
            centerX + dx,
            centerY + dy,
            frameZ
        );

        scene.add(piece);
    }
}

addWindow(-4);
addWindow(4);

// ------------------------------------
// 6. Ζωγραφισμένα λουλούδια στον τοίχο
// ------------------------------------

function addFlower(x, y, petalColor) {
    const z = -9.70;

    const petalMaterial = new THREE.MeshBasicMaterial({
        color: petalColor,
        side: THREE.DoubleSide
    });

    const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd84d,
        side: THREE.DoubleSide
    });

    // Πέντε πέταλα
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;

        const petal = new THREE.Mesh(
            new THREE.CircleGeometry(0.19, 16),
            petalMaterial
        );

        petal.position.set(
            x + Math.cos(angle) * 0.22,
            y + Math.sin(angle) * 0.22,
            z
        );

        scene.add(petal);
    }

    // Κέντρο λουλουδιού
    const center = new THREE.Mesh(
        new THREE.CircleGeometry(0.14, 16),
        centerMaterial
    );

    center.position.set(x, y, z + 0.01);
    scene.add(center);

    // Κοτσάνι
    const stem = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.65, 0.025),
        new THREE.MeshBasicMaterial({
            color: 0x39894b
        })
    );

    stem.position.set(x, y - 0.48, z);
    scene.add(stem);

    // Φύλλα
    for (const direction of [-1, 1]) {
        const leaf = new THREE.Mesh(
            new THREE.CircleGeometry(0.11, 12),
            new THREE.MeshBasicMaterial({
                color: 0x55a653,
                side: THREE.DoubleSide
            })
        );

        leaf.scale.set(1.5, 0.65, 1);

        leaf.position.set(
            x + direction * 0.12,
            y - 0.43,
            z + 0.02
        );

        leaf.rotation.z = direction * 0.5;
        scene.add(leaf);
    }
}

addFlower(-7, 5.3, 0xff8db5);
addFlower(-6, 3.0, 0xffe16b);
addFlower(6, 5.5, 0xc49bff);
addFlower(7, 3.0, 0xff8db5);

// ------------------------------------
// 7. Μεταβλητές χαρακτήρα
// ------------------------------------

const loader = new FBXLoader();

let woody = null;
let mixer = null;

const actions = {
    idle: null,
    walk: null,
    jump: null
};

let currentAction = null;

const clock = new THREE.Clock();
const keys = {};

let isGrounded = true;
let verticalVelocity = 0;

const gravity = 15;
const jumpStrength = 6;
const moveSpeed = 2.8;

// ------------------------------------
// 8. Προετοιμασία animation
// ------------------------------------

function prepareAnimation(originalClip) {
    const clip = originalClip.clone();

    for (const track of clip.tracks) {
        if (/hips\.position$/i.test(track.name)) {
            const values = track.values;

            if (values.length >= 3) {
                const firstX = values[0];
                const firstZ = values[2];

                for (let i = 0; i < values.length; i += 3) {
                    values[i] = firstX;
                    values[i + 2] = firstZ;
                }
            }
        }
    }

    return clip;
}

// ------------------------------------
// 9. Φόρτωση Woody και animations
// ------------------------------------

async function loadGame() {
    try {
        status.textContent = 'Φόρτωση Woody...';

        // Βασικό μοντέλο με Idle
        woody = await loader.loadAsync('./Woody_Idle.fbx');

        // Κανονικοποίηση ύψους
        let bounds = new THREE.Box3().setFromObject(woody);
        const originalHeight = bounds.max.y - bounds.min.y;

        if (originalHeight > 0) {
            woody.scale.setScalar(2.8 / originalHeight);
        }

		woody.scale.setScalar(0.25);
        // Κεντράρισμα και τοποθέτηση στο έδαφος
        bounds.setFromObject(woody);

        const center = bounds.getCenter(new THREE.Vector3());

        woody.position.x -= center.x;
        woody.position.z -= center.z;
        woody.position.y -= bounds.min.y;

		
        scene.add(woody);

        mixer = new THREE.AnimationMixer(woody);

        if (!woody.animations.length) {
            throw new Error('Δεν βρέθηκε το Idle animation.');
        }

        actions.idle = mixer.clipAction(woody.animations[0]);

        // Φόρτωση Walk
        const walkFile = await loader.loadAsync('./Woody_Walk.fbx');

        if (!walkFile.animations.length) {
            throw new Error('Δεν βρέθηκε το Walk animation.');
        }

        const walkClip = prepareAnimation(walkFile.animations[0]);
        actions.walk = mixer.clipAction(walkClip);

        // Φόρτωση Jump
        const jumpFile = await loader.loadAsync('./Woody_Jump.fbx');

        if (!jumpFile.animations.length) {
            throw new Error('Δεν βρέθηκε το Jump animation.');
        }

        const jumpClip = prepareAnimation(jumpFile.animations[0]);
        actions.jump = mixer.clipAction(jumpClip);

        playAnimation('idle');

        status.textContent = 'Έτοιμος! Κινήσου με τα βελάκια.';

    } catch (error) {
        console.error(error);
        status.textContent =
            'Σφάλμα φόρτωσης. Έλεγξε τα αρχεία και την κονσόλα.';
    }
}

// ------------------------------------
// 10. Εναλλαγή animations
// ------------------------------------

function playAnimation(name) {
    const nextAction = actions[name];

    if (!nextAction) return;
    if (currentAction === nextAction) return;

    if (currentAction) {
        currentAction.fadeOut(0.2);
    }

    nextAction.reset();
    nextAction.enabled = true;
    nextAction.setEffectiveWeight(1);
    nextAction.setEffectiveTimeScale(1);

    if (name === 'jump') {
        nextAction.setLoop(THREE.LoopOnce, 1);
        nextAction.clampWhenFinished = true;
    } else {
        nextAction.setLoop(THREE.LoopRepeat, Infinity);
        nextAction.clampWhenFinished = false;
    }

    nextAction.fadeIn(0.2);
    nextAction.play();

    currentAction = nextAction;
}

// ------------------------------------
// 11. Χειρισμός πληκτρολογίου
// ------------------------------------

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (
        ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ']
        .includes(key)
    ) {
        event.preventDefault();
    }

    // Αγνοούμε επαναλαμβανόμενα keydown
    if (keys[key]) return;

    keys[key] = true;

    // Ένα άλμα ανά πάτημα Space
    if (
        key === ' ' &&
        isGrounded &&
        woody
    ) {
        verticalVelocity = jumpStrength;
        isGrounded = false;

        playAnimation('jump');
    }
});

window.addEventListener('keyup', (event) => {
    keys[event.key.toLowerCase()] = false;
});

window.addEventListener('blur', () => {
    for (const key in keys) {
        keys[key] = false;
    }
});

// ------------------------------------
// 12. Κίνηση χαρακτήρα
// ------------------------------------

function updateMovement(delta) {
    if (!woody || !mixer) return;

    let moveX = 0;
    let moveZ = 0;

    if (keys['arrowup'] || keys['w']) moveZ -= 1;
    if (keys['arrowdown'] || keys['s']) moveZ += 1;
    if (keys['arrowleft'] || keys['a']) moveX -= 1;
    if (keys['arrowright'] || keys['d']) moveX += 1;

    const moving = moveX !== 0 || moveZ !== 0;

    if (moving) {
        const length = Math.hypot(moveX, moveZ);

        moveX /= length;
        moveZ /= length;

        woody.position.x += moveX * moveSpeed * delta;
        woody.position.z += moveZ * moveSpeed * delta;

        woody.rotation.y = Math.atan2(moveX, moveZ);
    }

    // Idle / Walk χωρίς διακοπή του Jump
    if (isGrounded) {
        if (moving) {
            playAnimation('walk');
        } else {
            playAnimation('idle');
        }
    }

    // Φυσική άλματος
    if (!isGrounded) {
        woody.position.y += verticalVelocity * delta;
        verticalVelocity -= gravity * delta;

        if (woody.position.y <= 0) {
            woody.position.y = 0;
            verticalVelocity = 0;
            isGrounded = true;

            if (moving) {
                playAnimation('walk');
            } else {
                playAnimation('idle');
            }
        }
    }
}

// ------------------------------------
// 13. Κάμερα που ακολουθεί τον Woody
// ------------------------------------

function updateCamera(delta) {
    if (!woody) return;

    const desiredPosition = new THREE.Vector3(
        woody.position.x,
        woody.position.y + 3.2,
        woody.position.z + 7
    );

    const smoothing = 1 - Math.exp(-4 * delta);

    camera.position.lerp(desiredPosition, smoothing);

    camera.lookAt(
        woody.position.x,
        woody.position.y + 1.2,
        woody.position.z
    );
}

// ------------------------------------
// 14. Κεντρικός βρόχος παιχνιδιού
// ------------------------------------

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (mixer) {
        updateMovement(delta);
        mixer.update(delta);
    }

    updateCamera(delta);

    renderer.render(scene, camera);
}

// ------------------------------------
// 15. Προσαρμογή οθόνης
// ------------------------------------

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Εκκίνηση παιχνιδιού
loadGame();
animate();
