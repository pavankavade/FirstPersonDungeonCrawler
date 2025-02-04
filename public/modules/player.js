// Private helper function
function playerAttack(player, scene) {
  player.isAttacking = true;
  console.log("Player attacks!");

  // Simulate an attack duration
  setTimeout(function() {
      player.isAttacking = false;
  }, 300);

  // Prevent spamming attacks with a cooldown
  player.attackCooldown = true;
  setTimeout(function() {
      player.attackCooldown = false;
  }, 800);
}

// Exported player initialization function
export function initPlayer(camera, scene) {
  // Initialize basic player stats and link with the camera
  var player = {
      health: 100,
      score: 0,
      camera: camera,
      isAttacking: false,
      attackCooldown: false
  };

  // Set up attack handling
  scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          if (pointerInfo.event.button === 0) {
              if (!player.attackCooldown) {
                  playerAttack(player, scene);
              }
          }
      }
  });

  return player;
}