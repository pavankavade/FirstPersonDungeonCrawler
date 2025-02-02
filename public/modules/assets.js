// public/modules/assetLoader.js

// Use the correct asynchronous loading function (LoadAssetContainerAsync on BABYLON.SceneLoader)
async function loadAssetsAsync(scene) {
  try {
    // LoadAssetContainerAsync returns a promise that resolves with an asset container
    const container = await BABYLON.SceneLoader.LoadAssetContainerAsync("./models/", "decorative_tree.glb", scene);

    // Add all the loaded assets to the scene
    container.addAllToScene();

    // For example, adjust the first mesh in the container if desired
    const tree = container.meshes[0];
    if (tree) {
      tree.position = new BABYLON.Vector3(0, 0, 5);
      tree.scaling = new BABYLON.Vector3(2, 2, 2);
    }
    
    console.log("Decorative tree loaded successfully using LoadAssetContainerAsync!");
  } catch (error) {
    console.error("Failed to load asset container:", error);
  }
}

// Expose the function globally so that main.js can access it
window.loadAssetsAsync = loadAssetsAsync;