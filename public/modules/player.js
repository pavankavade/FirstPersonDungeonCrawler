// modules/player.js

// Initializes player properties and sets up attack input handling
function initPlayer(camera, scene) {
  // Initialize basic player stats and link with the camera
  var player = {
    health: 100,
    score: 0,
    camera: camera,
    isAttacking: false,
    attackCooldown: false
  };

  // Remove spacebar attack: (we now handle left mouse click for attack)
  // Instead, add a pointer down event on the scene for left click attack.
  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      // evt.button == 0 for left mouse button
      if (pointerInfo.event.button === 0) {
        if (!player.attackCooldown) {
          playerAttack(player, scene);
        }
      }
    }
  });

  return player;
}

// Simulated attack logic – you can later add animations and collision checks
function playerAttack(player, scene) {
  player.isAttacking = true;
  console.log("Player attacks!");

  // Simulate an attack duration
  setTimeout(function() {
    player.isAttacking = false;
  }, 300); // Animation duration in milliseconds

  // Prevent spamming attacks with a cooldown
  player.attackCooldown = true;
  setTimeout(function() {
    player.attackCooldown = false;
  }, 800);
  
  // Future enhancements: create a sword swing effect or animation here
}