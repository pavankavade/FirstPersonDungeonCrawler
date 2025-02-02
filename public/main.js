// main.js

// Start the application once the DOM loads
window.addEventListener('DOMContentLoaded', async function() {
  // Get the canvas element from the DOM
  var canvas = document.getElementById("renderCanvas");

  // Generate the Babylon.js Engine
  var engine = new BABYLON.Engine(canvas, true);

  // Create our scene
  var createScene = async function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0); // Dark background

    // Create a UniversalCamera for a first-person perspective
    var camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 2, -10), scene);
    camera.attachControl(canvas, true);
    
    // Configure movement speed, collisions, and gravity
    camera.speed = 0.5;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);  // Collision ellipsoid

    // Set up WASD keys for camera movement using key codes
    camera.keysUp = [87];    // W
    camera.keysDown = [83];  // S
    camera.keysLeft = [65];  // A
    camera.keysRight = [68]; // D

    // (Optional) Set the camera target so the enemy is in view initially:
    // camera.setTarget(new BABYLON.Vector3(5, 1, 5));

    // Enable gravity for the scene and configure collisions globally
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    // Set up lights for atmosphere
    var pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, 0), scene);
    pointLight.intensity = 0.7;
    var hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemisphericLight.intensity = 0.3;

    // Build the dungeon environment using the dungeon module
    createDungeon(scene);
      // Inside createScene function
      try {
    // Load external assets from our assetLoader module.
    loadAssetsAsync(scene);
    } catch (error) {
        console.error("Failed to load tree model:", error);
    }
  // Load assets

    var player = initPlayer(camera, scene);

    // Create an enemy sample in the scene (position can be adjusted)
    var enemy = createEnemy(new BABYLON.Vector3(5, 1, 5), scene);

    // Set up the HUD overlay with player information
    initHUD(scene, player);

    // Main game loop updates (e.g., enemy AI, collision checks)
    scene.registerBeforeRender(function() {
      updateEnemy(enemy, player, scene);
      // Additional game updates can be handled here.
    });

    return scene;
  };

  // Create the scene
  try {
    var scene = await createScene();

    // Listen for browser/canvas resize events
    window.addEventListener('resize', function() {
      engine.resize();
    });

    // Request pointer lock when canvas is clicked
    canvas.addEventListener("click", function() {
      var requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (requestPointerLock) {
        requestPointerLock.call(canvas);
      }
    }, false);

    // Start the render loop
    engine.runRenderLoop(function() {
      scene.render();
    });
  } catch (error) {
    console.error("Error creating scene:", error);
  }
});