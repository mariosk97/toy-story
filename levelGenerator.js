
import * as THREE from 'three';

const blockColors = [
    0xd94f45,
    0xf0c84b,
    0x4d91d0,
    0x63a85c,
    0xe99a48,
    0xb38ac7
];

const greekLetters = [
    'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ',
    'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ',
    'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ'
];

const generatedObjects = new Set();

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}

function distance2D(a, b) {
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dz * dz);
}

function addGeneratedObject(scene, object) {
    object.userData.isGeneratedLevel = true;
    generatedObjects.add(object);
    scene.add(object);
    return object;
}

function addWoodenBlock(scene, x, z, letter, color) {
    const size = 0.8;

    const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.85
    });

    const block = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
    );

    block.position.set(x, size / 2, z);
    block.userData.isWoodenBlock = true;
    block.userData.letter = letter;

    addGeneratedObject(scene, block);

    // Δημιουργία της επιφάνειας με το γράμμα.
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;

    const context = canvas.getContext('2d');

    context.fillStyle = '#fff0c9';
    context.fillRect(0, 0, 256, 256);

    context.strokeStyle = '#6b4226';
    context.lineWidth = 12;
    context.strokeRect(8, 8, 240, 240);

    context.fillStyle = '#49301e';
    context.font = 'bold 170px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(letter, 128, 132);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const frontMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8
    });

    const front = new THREE.Mesh(
        new THREE.PlaneGeometry(0.62, 0.62),
        frontMaterial
    );

    front.position.set(x, size / 2, z + size / 2 + 0.003);
    front.userData.isBlockLabel = true;

    addGeneratedObject(scene, front);
}

function addStar(scene, x, z, requiresJump = false) {
    const shape = new THREE.Shape();

    const outerRadius = 0.38;
    const innerRadius = 0.17;

    for (let i = 0; i < 10; i++) {
        const angle = Math.PI / 2 + i * Math.PI / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;

        const starX = Math.cos(angle) * radius;
        const starY = Math.sin(angle) * radius;

        if (i === 0) {
            shape.moveTo(starX, starY);
        } else {
            shape.lineTo(starX, starY);
        }
    }

    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 2,
        steps: 1
    });

    const material = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0x664400,
        metalness: 0.2,
        roughness: 0.5
    });

    const star = new THREE.Mesh(geometry, material);

    // Τα αστέρια στο έδαφος και αυτά που απαιτούν άλμα
    // έχουν διαφορετικό ύψος.
    star.position.set(x, requiresJump ? 1.35 : 0.8, z);

    star.userData.isStar = true;
    star.userData.requiresJump = requiresJump;

    addGeneratedObject(scene, star);
}

function getBlockPositions(count) {
    const positions = [];
    let attempts = 0;

    while (positions.length < count && attempts < 1000) {
        attempts++;

        const candidate = {
            x: randomFloat(-12, 12),
            z: randomFloat(-6, 6)
        };

        // Αφήνουμε ελεύθερο τον χώρο γύρω από την αρχική θέση του Woody.
        if (Math.abs(candidate.x) < 2.2 &&
            Math.abs(candidate.z) < 2.2) {
            continue;
        }

        // Κρατάμε απόσταση μεταξύ των τουβλιών.
        if (positions.some(position =>
            distance2D(candidate, position) < 1.5
        )) {
            continue;
        }

        positions.push(candidate);
    }

    return positions;
}

function getFloorStarPositions(count, blockPositions, usedPositions) {
    const positions = [];
    let attempts = 0;

    while (positions.length < count && attempts < 1000) {
        attempts++;

        const candidate = {
            x: randomFloat(-14, 14),
            z: randomFloat(-7, 7)
        };

        // Δεν τοποθετούμε αστέρια ακριβώς δίπλα στην αρχική θέση.
        if (Math.abs(candidate.x) < 2 &&
            Math.abs(candidate.z) < 2) {
            continue;
        }

        // Τα αστέρια του εδάφους δεν πρέπει να καλύπτονται από τουβλάκια.
        if (blockPositions.some(block =>
            distance2D(candidate, block) < 1.5
        )) {
            continue;
        }

        if (usedPositions.some(position =>
            distance2D(candidate, position) < 2
        )) {
            continue;
        }

        positions.push(candidate);
        usedPositions.push(candidate);
    }

    return positions;
}

export function clearGeneratedLevel(scene) {
    for (const object of generatedObjects) {
        scene.remove(object);

        object.geometry?.dispose();

        if (Array.isArray(object.material)) {
            object.material.forEach(material => {
                material.map?.dispose();
                material.dispose();
            });
        } else if (object.material) {
            object.material.map?.dispose();
            object.material.dispose();
        }
    }

    generatedObjects.clear();
}

export function generateLevel(scene, difficulty) {
    clearGeneratedLevel(scene);

    const isHard = difficulty === 'hard';

    const blockCount = isHard ? 9 : 6;
    const floorStarCount = isHard ? 5 : 4;
    const jumpStarCount = isHard ? 3 : 2;

    const blockPositions = getBlockPositions(blockCount);

    // Δημιουργούμε τα τουβλάκια.
    blockPositions.forEach((position, index) => {
        const letter = greekLetters[index % greekLetters.length];
        const color = blockColors[index % blockColors.length];

        addWoodenBlock(
            scene,
            position.x,
            position.z,
            letter,
            color
        );
    });

    // Επιλέγουμε μερικά τουβλάκια για αστέρια που απαιτούν άλμα.
    const jumpBlockPositions = [...blockPositions]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(jumpStarCount, blockPositions.length));

    const usedPositions = [];

    for (const position of jumpBlockPositions) {
        addStar(scene, position.x, position.z, true);
        usedPositions.push(position);
    }

    // Προσθέτουμε αστέρια που βρίσκονται στο έδαφος.
    const floorPositions = getFloorStarPositions(
        floorStarCount,
        blockPositions,
        usedPositions
    );

    for (const position of floorPositions) {
        addStar(scene, position.x, position.z, false);
    }

    return {
        blockCount: blockPositions.length,
        starCount: jumpBlockPositions.length + floorPositions.length
    };
}
