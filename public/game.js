const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    
    // Camera (First-Person Perspective)
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -5), scene);
    camera.attachControl(canvas, true);
    
    // Lighting
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    
    // Ground (Empty World Base)
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, scene);
    
    // Player Cube (Test Object)
    const cube = BABYLON.MeshBuilder.CreateBox("playerCube", { size: 1 }, scene);
    cube.position.y = 0.5; // Raise above ground
    
    // Simple Rotation Animation
    scene.onBeforeRenderObservable.add(() => {
        cube.rotation.y += 0.01;
    });
    
    return scene;
};

const scene = createScene();

// Handle Window Resizing
window.addEventListener("resize", () => {
    engine.resize();
});

// Start Render Loop
engine.runRenderLoop(() => {
    scene.render();
});