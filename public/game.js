const canvas = document.getElementById("gameCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Show loading screen
const loadingScreen = document.createElement('div');
loadingScreen.innerHTML = '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:24px;">Loading medieval environment...</div>';
document.body.appendChild(loadingScreen);

// GLB Validation Helpers
async function validateGLB(url) {
  try {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    
    // Check GLB header (first 4 bytes should be 'glTF')
    const header = new Uint8Array(data.slice(0, 4));
    if (String.fromCharCode(...header) !== 'glTF') {
      throw new Error('Invalid GLB file header');
    }
    
    // Check version (bytes 4-7, little-endian)
    const version = new DataView(data).getUint32(4, true);
    if (version !== 2) {
      throw new Error(`Unsupported GLB version: ${version}`);
    }
    
    return true;
  } catch (error) {
    console.error('GLB Validation Failed:', error);
    return false;
  }
}

const createScene = async () => {
    const scene = new BABYLON.Scene(engine);
    
    // Camera (First-Person Perspective)
    const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -5), scene);
    camera.attachControl(canvas, true);
    
    // Enhanced Lighting
    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.8;
    
    const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
    dirLight.intensity = 0.6;

    // Ground (Adjusted for medieval environment)
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
    ground.position.y = -0.5;

    // GLB File URL
    const modelUrl = 'http://127.0.0.1:5500/models/long_sword.glb';

    try {
        // Step 1: Validate GLB before loading
        const isValid = await validateGLB(modelUrl);
        if (!isValid) {
            throw new Error('Invalid GLB file format');
        }

        // Step 2: Load with explicit MIME type and fallback
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            "",
            "", // Empty string when using full URL
            modelUrl,
            scene,
            (progress) => {
                loadingScreen.innerHTML = `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:24px;">
                    Loading... ${Math.round((progress.loaded / progress.total) * 100)}%
                </div>`;
            },
            ".glb" // Explicit file extension
        );

        // Step 3: Post-load validation
        if (!result.meshes || result.meshes.length === 0) {
            throw new Error('Loaded model contains no meshes');
        }

        const environment = result.meshes[0];
        environment.position = new BABYLON.Vector3(0, 0, 0);
        environment.scaling = new BABYLON.Vector3(1, 1, 1);

        // Optimize performance
        environment.freezeWorldMatrix();
        environment.doNotSyncBoundingInfo = true;

        // Remove loading screen
        document.body.removeChild(loadingScreen);

    } catch (error) {
        console.error("Model Loading Error:", error);
        loadingScreen.innerHTML = `
            <div style="color:red; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);">
                Error loading model: ${error.message}<br>
                <button onclick="window.location.reload()">Retry</button>
            </div>`;
    }

    return scene;
};

// Initialize scene
createScene().then((scene) => {
    window.addEventListener("resize", () => engine.resize());
    engine.runRenderLoop(() => scene.render());
});