// Asset configurations
const ASSETS = {
  decorativeTree: {
      path: "./models/",
      filename: "decorative_tree.glb",
      position: new BABYLON.Vector3(0, 0, 10),
      scaling: new BABYLON.Vector3(2, 2, 2)
  },
  sword: {
    path: "./models/",
    filename: "long_sword.glb",
    position: new BABYLON.Vector3(0, 0, 4),
    scaling: new BABYLON.Vector3(2, 2, 2)
},
};

class AssetLoader {
  constructor(scene) {
      this.scene = scene;
      this.loadedAssets = new Map();
  }

  async loadAsset(assetKey) {
      const asset = ASSETS[assetKey];
      if (!asset) {
          throw new Error(`Asset configuration not found for key: ${assetKey}`);
      }

      try {
          const container = await BABYLON.SceneLoader.LoadAssetContainerAsync(
              asset.path,
              asset.filename,
              this.scene
          );

          container.addAllToScene();

          if (container.meshes[0]) {
              container.meshes[0].position = asset.position;
              container.meshes[0].scaling = asset.scaling;
          }

          this.loadedAssets.set(assetKey, container);
          console.log(`${assetKey} loaded successfully!`);
          return container;
      } catch (error) {
          console.error(`Failed to load ${assetKey}:`, error);
          throw error;
      }
  }

  async loadMultipleAssets(assetKeys) {
      const promises = assetKeys.map(key => this.loadAsset(key));
      return Promise.all(promises);
  }

  getLoadedAsset(assetKey) {
      return this.loadedAssets.get(assetKey);
  }
}

// Export the module
export { AssetLoader, ASSETS };