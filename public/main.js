import { AssetLoader } from './modules/assets.js';
import { createDungeon } from './modules/dungeon.js';
import { initPlayer } from './modules/player.js';
import { createEnemy, updateEnemy } from './modules/enemy.js';
import { initHUD } from './modules/hud.js';

// Game configuration
const CONFIG = {
    camera: {
        startPosition: new BABYLON.Vector3(0, 2, -10),
        speed: 0.5,
        ellipsoid: new BABYLON.Vector3(1, 1, 1)
    },
    scene: {
        gravity: new BABYLON.Vector3(0, -0.9, 0),
        clearColor: new BABYLON.Color3(0, 0, 0)
    }
};

// Initialize game systems
async function initGame(canvas) {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = await createGameScene(engine, canvas);
    
    setupEventListeners(canvas, engine);
    startRenderLoop(engine, scene);
    
    return { engine, scene };
}

// Create the main game scene
async function createGameScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = CONFIG.scene.clearColor;
    scene.gravity = CONFIG.scene.gravity;
    scene.collisionsEnabled = true;

    // Setup camera
    const camera = setupCamera(scene, canvas);
    
    // Setup lighting
    setupLighting(scene);

    try {
        // Initialize asset loader
        const assetLoader = new AssetLoader(scene);
        await assetLoader.loadMultipleAssets(['decorativeTree','sword']);

        // Create game elements
        createDungeon(scene);
        const player = initPlayer(camera, scene);
        const enemy = createEnemy(new BABYLON.Vector3(5, 1, 5), scene);
        initHUD(scene, player);

        // Setup game loop
        scene.registerBeforeRender(() => {
            updateEnemy(enemy, player, scene);
        });

        return scene;
    } catch (error) {
        console.error("Failed to create game scene:", error);
        throw error;
    }
}

// Camera setup
function setupCamera(scene, canvas) {
    const camera = new BABYLON.UniversalCamera(
        "UniversalCamera",
        CONFIG.camera.startPosition,
        scene
    );
    
    camera.attachControl(canvas, true);
    camera.speed = CONFIG.camera.speed;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = CONFIG.camera.ellipsoid;
    
    // WASD controls
    camera.keysUp = [87];    // W
    camera.keysDown = [83];  // S
    camera.keysLeft = [65];  // A
    camera.keysRight = [68]; // D
    
    return camera;
}

// Lighting setup
function setupLighting(scene) {
    const pointLight = new BABYLON.PointLight(
        "pointLight",
        new BABYLON.Vector3(0, 10, 0),
        scene
    );
    pointLight.intensity = 0.7;

    const hemisphericLight = new BABYLON.HemisphericLight(
        "hemisphericLight",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    hemisphericLight.intensity = 0.3;
}

// Event listeners setup
function setupEventListeners(canvas, engine) {
    window.addEventListener('resize', () => engine.resize());
    
    canvas.addEventListener("click", () => {
        const requestPointerLock = canvas.requestPointerLock || 
                                 canvas.msRequestPointerLock || 
                                 canvas.mozRequestPointerLock || 
                                 canvas.webkitRequestPointerLock;
        if (requestPointerLock) {
            requestPointerLock.call(canvas);
        }
    });
}

// Render loop
function startRenderLoop(engine, scene) {
    engine.runRenderLoop(() => scene.render());
}

// Start game when DOM loads
window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById("renderCanvas");
    try {
        await initGame(canvas);
    } catch (error) {
        console.error("Failed to initialize game:", error);
    }
});