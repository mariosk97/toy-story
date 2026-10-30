
import * as THREE from 'three';

export function createRoom(scene) {

    // ------------------------------------
    // 3. Παιδικό δωμάτιο - πάτωμα
    // ------------------------------------

    const roomWidth = 40;
    const roomDepth = 20;
    const halfWidth = roomWidth / 2;
    const halfDepth = roomDepth / 2;

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

    // Ξύλινες σανίδες πατώματος
    for (let z = -9.5; z <= 9.5; z += 1) {
        const plank = new THREE.Mesh(
            new THREE.BoxGeometry(roomWidth, 0.04, 1),
            floorMaterials[Math.round(z + 9.5) % 2]
        );

        plank.position.set(0, -0.02, z);
        scene.add(plank);
    }

    // Γραμμές ανάμεσα στις σανίδες
    const floorLineMaterial = new THREE.MeshStandardMaterial({
        color: 0x68432f,
        roughness: 1
    });

    for (let z = -9; z <= 9; z += 1) {
        const line = new THREE.Mesh(
            new THREE.BoxGeometry(roomWidth, 0.015, 0.035),
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
    for (let x = -halfWidth + 0.5; x < halfWidth; x += 1) {
        const plank = new THREE.Mesh(
            new THREE.BoxGeometry(1, 8, 0.3),
            wallMaterials[Math.round(x + halfWidth - 0.5) % 2]
        );

        plank.position.set(x, 4, -halfDepth);
        scene.add(plank);
    }

    // Πλαϊνοί τοίχοι
    for (const side of [-1, 1]) {
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 8, roomDepth),
            wallMaterials[0]
        );

        wall.position.set(side * halfWidth, 4, 0);
        scene.add(wall);
    }

    // Κάθετες γραμμές πίσω τοίχου
    for (let x = -halfWidth + 0.5; x < halfWidth; x += 1) {
        const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.035, 8, 0.025),
            wallLineMaterial
        );

        line.position.set(x, 4, -halfDepth + 0.18);
        scene.add(line);
    }

    // ------------------------------------
    // 5. Παράθυρα
    // ------------------------------------

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
        const z = -halfDepth + 0.22;

        // Ουρανός
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

        // Λευκό πλαίσιο
        const frameZ = z + 0.13;
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
    // 6. Λωρίδες χαμηλά στους τοίχους
    // ------------------------------------

    const darkBrownMaterial = new THREE.MeshStandardMaterial({
        color: 0x593923,
        roughness: 1
    });

    const tealMaterial = new THREE.MeshStandardMaterial({
        color: 0x55b8bd,
        roughness: 1
    });

    const brownHeight = 0.5;
    const tealHeight = 2;

    const brownCenterY = brownHeight / 2;
    const tealCenterY = brownHeight + tealHeight / 2;

    // Πίσω τοίχος: καφέ λωρίδα
    const backBrownStrip = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, brownHeight, 0.08),
        darkBrownMaterial
    );

    backBrownStrip.position.set(0, brownCenterY, -halfDepth + 0.22);
    scene.add(backBrownStrip);

    // Πίσω τοίχος: θαλασσί λωρίδα
    const backTealStrip = new THREE.Mesh(
        new THREE.BoxGeometry(roomWidth, tealHeight, 0.08),
        tealMaterial
    );

    backTealStrip.position.set(0, tealCenterY, -halfDepth + 0.22);
    scene.add(backTealStrip);

    // Πλαϊνές λωρίδες
    for (const side of [-1, 1]) {

        const brownStrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, brownHeight, roomDepth),
            darkBrownMaterial
        );

        brownStrip.position.set(
            side * (halfWidth - 0.22),
            brownCenterY,
            0
        );

        scene.add(brownStrip);

        const tealStrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, tealHeight, roomDepth),
            tealMaterial
        );

        tealStrip.position.set(
            side * (halfWidth - 0.22),
            tealCenterY,
            0
        );

        scene.add(tealStrip);
    }

    // ------------------------------------
    // 7. Ζωγραφισμένα λουλούδια στον τοίχο
    // ------------------------------------

    function addFlower(x, y, petalColor) {
        const z = -halfDepth + 0.30;

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

        // Κέντρο
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

}
