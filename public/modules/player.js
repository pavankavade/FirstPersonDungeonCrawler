// =========== FILE: public/modules/player.js ===========

export async function initPlayer(scene, camera) {
    const player = {
      health: 100,
      score: 0,
      isAttacking: false,
      attackCooldown: false,
      mesh: null,
    };
  
    try {
      const result = await BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "dummy3.babylon", scene);
      player.mesh = result.meshes[0];
      // --- SCALE UP: Increase the scaling values ---
      player.mesh.scaling = new BABYLON.Vector3(0.4, 0.4, 0.4); // Increased from 0.25
      player.mesh.checkCollisions = true;
  
      camera.parent = player.mesh;
      // --- FIRST-PERSON POSITION: Inside the head (adjust as needed) ---
      camera.position = new BABYLON.Vector3(0, 2.5, 0); // Higher Y value
  
      if (result.animationGroups.length > 0) {
        result.animationGroups[0].play(true);
      }
  
    } catch (error) {
      console.error("Error loading player model:", error);
      const errorText = new BABYLON.GUI.TextBlock();
      errorText.text = "Error loading player model. Check console.";
      errorText.color = "red";
      errorText.fontSize = 24;
      const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      advancedTexture.addControl(errorText);
      return;
    }
  
    scene.onPointerObservable.add((pointerInfo) => {
      if (
        pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN &&
        pointerInfo.event.button === 0 &&
        !player.attackCooldown
      ) {
        playerAttack(player, scene);
      }
    });
  
    return player;
  }
  // Private helper function
  function playerAttack(player, scene) {
    player.isAttacking = true;
    console.log("Player attacks!");
  
    // Simulate an attack duration and cooldown
    setTimeout(() => {
      player.isAttacking = false;
    }, 300);
  
    player.attackCooldown = true;
    setTimeout(() => {
      player.attackCooldown = false;
    }, 800);
  }