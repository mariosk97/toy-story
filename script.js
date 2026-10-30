
import * as THREE from 'three';
import { createRoom } from './room.js';
import { createWoodyController } from './woody.js';
import { questionSets } from './questions.js';
import { generateLevel, clearGeneratedLevel } from './levelGenerator.js';

// ------------------------------------
// 1. Βασικές ρυθμίσεις
// ------------------------------------

const status = document.getElementById('status');
const scoreDisplay = document.getElementById('scoreDisplay');

const difficultyPanel = document.getElementById('difficultyPanel');
const questionPanel = document.getElementById('questionPanel');
const questionText = document.getElementById('questionText');
const answersContainer = document.getElementById('answersContainer');
const answerFeedback = document.getElementById('answerFeedback');

let score = 0;
let difficulty = null;
let activeStar = null;
let activeQuestion = null;
let totalStars = 0;
let levelCompleted = false;

const starStates = new WeakMap();

const questionQueues = {
    easy: [],
    hard: []
};

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
// 3. Δωμάτιο και Woody
// ------------------------------------

createRoom(scene);

const woodyController = createWoodyController({
    scene,
    camera,
    status
});

woodyController.setMovementLocked(true);
woodyController.load();


const completionPanel = document.createElement('div');

completionPanel.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(20, 25, 40, 0.75);
    align-items: center;
    justify-content: center;
    font-family: Arial, sans-serif;
    padding: 20px;
`;

completionPanel.innerHTML = `
    <div style="
        background: white;
        border-radius: 24px;
        padding: 35px;
        text-align: center;
        max-width: 460px;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 0 10px 35px rgba(0,0,0,0.3);
    ">
        <div style="font-size: 64px;">🏆</div>

        <h1 style="color: #e6a700; margin: 10px 0;">
            Τα κατάφερες!
        </h1>

        <p style="font-size: 22px; color: #333;">
            Συγκέντρωσες όλα τα αστέρια!
        </p>

        <p id="finalScore" style="
            font-size: 25px;
            font-weight: bold;
            color: #49301e;
        "></p>

        <button id="playAgainButton" style="
            display: block;
            width: 100%;
            padding: 15px;
            margin-top: 20px;
            border: none;
            border-radius: 12px;
            background: #4d91d0;
            color: white;
            font-size: 19px;
            font-weight: bold;
            cursor: pointer;
        ">
            Παίξε ξανά
        </button>

        <button id="chooseLevelButton" style="
            display: block;
            width: 100%;
            padding: 15px;
            margin-top: 10px;
            border: none;
            border-radius: 12px;
            background: #63a85c;
            color: white;
            font-size: 19px;
            font-weight: bold;
            cursor: pointer;
        ">
            Επιλογή επιπέδου
        </button>
    </div>
`;

document.body.appendChild(completionPanel);

function completeLevel() {
    if (levelCompleted) return;

    levelCompleted = true;

    woodyController.setMovementLocked(true);

    questionPanel.classList.add('hidden');

    activeStar = null;
    activeQuestion = null;

    document.getElementById('finalScore').textContent =
        `Αστέρια: ${score} / ${totalStars}`;

    completionPanel.style.display = 'flex';

    status.textContent = 'Ολοκλήρωσες το επίπεδο!';
}

document.getElementById('playAgainButton').addEventListener('click', () => {
    completionPanel.style.display = 'none';
    startGame(difficulty);
});

document.getElementById('chooseLevelButton').addEventListener('click', () => {
    completionPanel.style.display = 'none';
    questionPanel.classList.add('hidden');
    difficultyPanel.classList.remove('hidden');

    woodyController.setMovementLocked(true);

    difficulty = null;
    activeStar = null;
    activeQuestion = null;

    status.textContent = 'Επίλεξε επίπεδο δυσκολίας.';
});

// ------------------------------------
// 4. Επιλογή επιπέδου δυσκολίας
// ------------------------------------

function startGame(selectedDifficulty) {
    if (!questionSets[selectedDifficulty]?.length) {
        status.textContent = 'Δεν υπάρχουν ερωτήσεις για αυτό το επίπεδο.';
        return;
    }

    difficulty = selectedDifficulty;
	
	clearGeneratedLevel(scene);

	const levelInfo = generateLevel(scene, selectedDifficulty);
	totalStars = levelInfo.starCount;
	levelCompleted = false;

    difficultyPanel.classList.add('hidden');
    questionPanel.classList.add('hidden');

    score = 0;
    scoreDisplay.textContent = 'Αστέρια: 0';

    questionQueues.easy = [];
    questionQueues.hard = [];


    woodyController.setMovementLocked(false);

    status.textContent =
        difficulty === 'easy'
            ? 'Επίπεδο: Εύκολο. Βρες τα αστέρια!'
            : 'Επίπεδο: Δύσκολο. Βρες τα αστέρια!';
}

document.getElementById('easyButton').addEventListener('click', () => {
    startGame('easy');
});

document.getElementById('hardButton').addEventListener('click', () => {
    startGame('hard');
});

// ------------------------------------
// 5. Τυχαία σειρά ερωτήσεων
// ------------------------------------

function shuffle(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function getNextQuestion() {
    const selectedQuestions = questionSets[difficulty];

    if (questionQueues[difficulty].length === 0) {
        questionQueues[difficulty] = shuffle(selectedQuestions);
    }

    return questionQueues[difficulty].pop();
}

// ------------------------------------
// 6. Εμφάνιση ερώτησης
// ------------------------------------

function openQuestion(star) {

    const state = starStates.get(star);

    if (!state || state.questionAsked || state.unlocked) {
        return;
    }

    state.questionAsked = true;
    activeStar = star;
    activeQuestion = getNextQuestion();

    woodyController.setMovementLocked(true);

    // Εμφάνιση ερώτησης με χρωματιστές επιλογές.
    questionText.replaceChildren();

    if (
        activeQuestion.type === 'typing' &&
        Array.isArray(activeQuestion.choices) &&
        activeQuestion.choices.length >= 2
    ) {
        questionText.append(
            document.createTextNode(activeQuestion.question + ' ')
        );

        activeQuestion.choices.forEach((choice, index) => {
            const span = document.createElement('span');

            span.textContent = choice;

            // Πρώτη επιλογή: πράσινη.
            // Δεύτερη επιλογή: μπλε.
            span.style.setProperty(
                'color',
                index === 0 ? '#218838' : '#1976D2',
                'important'
            );

            span.style.fontSize = '32px';
            span.style.fontWeight = 'bold';

            questionText.appendChild(span);

            if (index < activeQuestion.choices.length - 1) {
                questionText.append(
                    document.createTextNode(' ή ')
                );
            }

            questionText.append(
                document.createTextNode(' ')
            );
        });
    } else {
        questionText.textContent = activeQuestion.question;
    }

    answersContainer.replaceChildren();

    answerFeedback.textContent = '';
    answerFeedback.className = '';

    // Ερωτήσεις πληκτρολόγησης.
    if (activeQuestion.type === 'typing') {
        const input = document.createElement('input');

        input.type = 'text';
        input.id = 'typingAnswer';
        input.placeholder = 'Γράψε την απάντησή σου...';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-label', 'Η απάντησή σου');

        input.style.width = '100%';
        input.style.padding = '14px';
        input.style.fontSize = '22px';
        input.style.border = '3px solid #b98750';
        input.style.borderRadius = '12px';
        input.style.marginBottom = '12px';

        const submitButton = document.createElement('button');

        submitButton.type = 'button';
        submitButton.className = 'answerButton';
        submitButton.textContent = 'Έλεγχος απάντησης';
        submitButton.style.width = '100%';
        submitButton.style.background = '#3c9b59';

        submitButton.addEventListener('click', () => {
            checkAnswer(input.value);
        });

        input.addEventListener('keydown', event => {
            event.stopPropagation();

            if (event.key === 'Enter') {
                event.preventDefault();
                checkAnswer(input.value);
            }
        });

        answersContainer.append(input, submitButton);

        questionPanel.classList.remove('hidden');
        status.textContent = 'Πληκτρολόγησε τη σωστή απάντηση.';

        input.focus();
        return;
    }

    // Ερωτήσεις πολλαπλής επιλογής.
    activeQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'answerButton';
        button.textContent = answer;

        button.addEventListener('click', () => {
            checkAnswer(index);
        });

        answersContainer.appendChild(button);
    });

    questionPanel.classList.remove('hidden');
    status.textContent = 'Απάντησε σωστά για να ξεκλειδώσεις το αστέρι.';
}

// ------------------------------------
// 7. Έλεγχος απάντησης
// ------------------------------------

function normalizeAnswer(answer) {
    return answer
        .trim()
        .toLocaleLowerCase('el')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
}

function checkAnswer(answer) {
    if (!activeQuestion || !activeStar) return;

    let isCorrect = false;

    if (activeQuestion.type === 'typing') {
        const userAnswer = normalizeAnswer(answer);

        isCorrect = activeQuestion.answers.some(
            correctAnswer =>
                normalizeAnswer(correctAnswer) === userAnswer
        );
    } else {
        isCorrect = answer === activeQuestion.correctAnswer;
    }

    if (!isCorrect) {
        answerFeedback.textContent = 'Δοκίμασε ξανά!';
        answerFeedback.className = 'wrong';
        return;
    }

    const state = starStates.get(activeStar);

    if (state) {
        state.unlocked = true;
    }

    questionPanel.classList.add('hidden');

    activeStar = null;
    activeQuestion = null;

    answerFeedback.textContent = '';
    answerFeedback.className = '';

    status.textContent = 'Σωστά! Πλησίασε το αστέρι για να το μαζέψεις.';

    woodyController.playCelebration();
}

// ------------------------------------
// 8. Αστέρια και συλλογή
// ------------------------------------

const QUESTION_DISTANCE = 1.4;
const COLLECTION_DISTANCE = 0.45;

function updateStars() {
	if (levelCompleted) return;	
	
    const woody = woodyController.getWoody();

    if (
        !woody ||
        !difficulty ||
        !questionPanel.classList.contains('hidden')
    ) {
        return;
    }

    const stars = scene.children.filter(
        object => object.userData.isStar
    );

    for (const star of stars) {
		//if (star.userData.requiresJump && woody.position.y < 0.65) {
		//	continue;
		//}
        if (!starStates.has(star)) {
            starStates.set(star, {
                questionAsked: false,
                unlocked: false,
                collected: false
            });
        }

        const state = starStates.get(star);

        if (state.collected) continue;

        const dx = woody.position.x - star.position.x;
        const dz = woody.position.z - star.position.z;
        const distance = Math.hypot(dx, dz);

        if (!state.questionAsked && distance < QUESTION_DISTANCE) {
            openQuestion(star);
            return;
        }

		if (state.unlocked && distance < COLLECTION_DISTANCE) {
			state.collected = true;
			scene.remove(star);

			score++;
			scoreDisplay.textContent = `Αστέρια: ${score}`;

			if (score >= totalStars) {
				completeLevel();
				return;
			}

			status.textContent = 'Μάζεψες ένα αστέρι!';

			return;
		}
    }
}

// ------------------------------------
// 9. Κεντρικός βρόχος παιχνιδιού
// ------------------------------------

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    woodyController.update(delta);
    updateStars();
    woodyController.updateCamera(delta);

    renderer.render(scene, camera);
}

// ------------------------------------
// 10. Προσαρμογή οθόνης
// ------------------------------------

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
