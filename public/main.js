// =========== FILE: public/main.js ===========

import { AssetLoader } from "./modules/assets.js";
import { createDungeon } from "./modules/dungeon.js";
import { initPlayer } from "./modules/player.js";
import { createEnemy, updateEnemy } from "./modules/enemy.js";
import { initHUD } from "./modules/hud.js";
import { updateHUDHealth, updateHUDScore } from "./modules/hud.js";

const CONFIG = {
    camera: {
        speed: 0.3,
        ellipsoid: new BABYLON.Vector3(1, 1, 1),
    },
    scene: {
        gravity: new BABYLON.Vector3(0, -0.9, 0),
        clearColor: new BABYLON.Color3(0, 0, 0),
    },
};

async function initGame(canvas) {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = await createGameScene(engine, canvas);
    setupEventListeners(canvas, engine);
    startRenderLoop(engine, scene);
    return { engine, scene };
}

async function createGameScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = CONFIG.scene.clearColor;
    scene.gravity = CONFIG.scene.gravity;
    scene.collisionsEnabled = true;

    const camera = setupCamera(scene, canvas);
    setupLighting(scene);

    try {
        const assetLoader = new AssetLoader(scene);
        // await assetLoader.loadMultipleAssets(['decorativeTree','sword']);

        createDungeon(scene);
        const player = await initPlayer(scene, camera);
        const enemy = createEnemy(new BABYLON.Vector3(5, 1, 5), scene);
        initHUD(scene, player);

        const playerInput = {
            forward: false,
            backward: false,
            left: false,
            right: false,
        };

        scene.onBeforeRenderObservable.add(() => {
            if (player.mesh) {
                let moveDirection = BABYLON.Vector3.Zero();

                if (playerInput.forward) moveDirection.z += 1;
                if (playerInput.backward) moveDirection.z -= 1;
                if (playerInput.left) moveDirection.x += 1; // Correct: Add for left
                if (playerInput.right) moveDirection.x -= 1; // Correct: Subtract for right

                if (!moveDirection.equals(BABYLON.Vector3.Zero())) {
                    moveDirection = moveDirection.normalize().scale(CONFIG.camera.speed);

                    // Get camera's forward direction, flatten the Y component
                    let forward = camera.getDirection(BABYLON.Vector3.Forward());
                    forward.y = 0;
                    forward = forward.normalize();

                    // Calculate the RIGHT vector (cross product of forward and up)
                    let right = BABYLON.Vector3.Cross(forward, BABYLON.Vector3.Up()).normalize();

                    // --- CORRECT FINAL MOVEMENT CALCULATION ---
                    let finalDirection = forward.scale(moveDirection.z).add(right.scale(moveDirection.x));

                    player.mesh.moveWithCollisions(finalDirection);
                }
                // Rotate the player mesh to match the camera's Y rotation
                player.mesh.rotation.y = camera.rotation.y;
            }
        });

        // Key down event listener
        window.addEventListener("keydown", (event) => {
           if (event.code === "KeyW") playerInput.forward = true;
            else if (event.code === "KeyS") playerInput.backward = true;
            else if (event.code === "KeyA") playerInput.left = true;
            else if (event.code === "KeyD") playerInput.right = true;
        });

        // Key up event listener
        window.addEventListener("keyup", (event) => {
            if (event.code === "KeyW") playerInput.forward = false;
            else if (event.code === "KeyS") playerInput.backward = false;
            else if (event.code === "KeyA") playerInput.left = false;
            else if (event.code === "KeyD") playerInput.right = false;
        });

        scene.registerBeforeRender(() => {
            if (player.mesh) {
                updateEnemy(enemy, player, scene, updateHUDHealth);
            }
        });

        return scene;

    } catch (error) {
        console.error("Failed to create game scene:", error);
        throw error;
    }
}
function setupCamera(scene, canvas) {
    const camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 1, 0), scene);
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = CONFIG.camera.ellipsoid;

    return camera;
}

// Lighting setup (no changes)
function setupLighting(scene) {
    const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, 0), scene);
    pointLight.intensity = 0.7;
    const hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.3;
}
// Event listeners setup (no changes)
function setupEventListeners(canvas, engine) {
    window.addEventListener('resize', () => engine.resize());
    canvas.addEventListener("click", () => {
        const requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (requestPointerLock) {
            requestPointerLock.call(canvas);
        }
    });
}

// Render loop (no changes)
function startRenderLoop(engine, scene) {
    engine.runRenderLoop(() => scene.render());
}

// Start game (no changes)
window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById("renderCanvas");
    try {
        await initGame(canvas);
    } catch (error) {
        console.error("Failed to initialize game:", error);
    }
});