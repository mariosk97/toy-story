import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export function createWoodyController({ scene, camera, status }) {
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
	let groundHeight = 0;
	let characterHeight = 1;
	const collisionRadius = 0.2;

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
			characterHeight = bounds.max.y - bounds.min.y;

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

		mixer.update(delta);

		const blocks = scene.children.filter(
			object => object.userData.isWoodenBlock
		);

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

			woody.rotation.y = Math.atan2(moveX, moveZ);
		}

		// Έλεγχος αν ο Woody βρίσκεται πάνω από ένα τουβλάκι
		function isOverBlock(x, z, block) {
			const half = 0.4;

			const closestX = THREE.MathUtils.clamp(
				x, block.position.x - half, block.position.x + half
			);

			const closestZ = THREE.MathUtils.clamp(
				z, block.position.z - half, block.position.z + half
			);

			const dx = x - closestX;
			const dz = z - closestZ;

			return dx * dx + dz * dz < collisionRadius * collisionRadius;
		}

		// Έλεγχος σύγκρουσης με τα πλαϊνά ενός τουβλιού
		function hitsBlock(x, z) {
			for (const block of blocks) {
				const top = block.position.y + 0.4;
				const bottom = block.position.y - 0.4;

				const verticalOverlap =
					woody.position.y < top - 0.02 &&
					woody.position.y + characterHeight > bottom + 0.02;

				if (
					verticalOverlap &&
					isOverBlock(x, z, block)
				) {
					return true;
				}
			}

			return false;
		}

		// Κίνηση σε ξεχωριστούς άξονες, ώστε να μην περνά
		// μέσα από τις γωνίες των τουβλιών
		if (moving) {
			const nextX =
				woody.position.x + moveX * moveSpeed * delta;

			if (!hitsBlock(nextX, woody.position.z)) {
				woody.position.x = nextX;
			}

			const nextZ =
				woody.position.z + moveZ * moveSpeed * delta;

			if (!hitsBlock(woody.position.x, nextZ)) {
				woody.position.z = nextZ;
			}
		}

		// Αν περπατήσει έξω από ένα τουβλάκι, αρχίζει να πέφτει
		if (isGrounded && groundHeight > 0) {
			const stillSupported = blocks.some(block =>
				Math.abs(block.position.y + 0.4 - groundHeight) < 0.02 &&
				isOverBlock(woody.position.x, woody.position.z, block)
			);

			if (!stillSupported) {
				isGrounded = false;
				verticalVelocity = 0;
			}
		}

		// Animations όταν βρίσκεται στο έδαφος
		if (isGrounded) {
			if (moving) {
				playAnimation('walk');
			} else {
				playAnimation('idle');
			}
		}

		// Φυσική άλματος και βαρύτητας
		if (!isGrounded) {
			const previousY = woody.position.y;

			verticalVelocity -= gravity * delta;
			woody.position.y += verticalVelocity * delta;

			let landed = false;

			// Προσγείωση στην κορυφή ενός τουβλιού
			if (verticalVelocity <= 0) {
				for (const block of blocks) {
					const top = block.position.y + 0.4;

					const crossedTop =
						previousY >= top - 0.001 &&
						woody.position.y <= top;

					if (
						crossedTop &&
						isOverBlock(
							woody.position.x,
							woody.position.z,
							block
						)
					) {
						woody.position.y = top;
						groundHeight = top;
						landed = true;
						break;
					}
				}
			}

			// Προσγείωση στο πάτωμα
			if (!landed && woody.position.y <= 0) {
				woody.position.y = 0;
				groundHeight = 0;
				landed = true;
			}

			if (landed) {
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


    return {
        load: loadGame,
        update: updateMovement,
        updateCamera
    };
}
