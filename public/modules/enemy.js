// Creates a simple enemy represented by a sphere for demonstration purposes
export function createEnemy(position, scene) {
  var enemy = BABYLON.MeshBuilder.CreateSphere("enemy", { diameter: 2 }, scene);
  enemy.position = position;

  // Define enemy stats
  enemy.health = 50;
  enemy.attackRange = 2;
  enemy.speed = 0.02;

  return enemy;
}

// Basic enemy AI update function
export function updateEnemy(enemy, player, scene, onHealthChange) {
  // Check if enemy is dead
  if (enemy.health <= 0) {
      enemy.isDead = true;
      enemy.dispose();
      return;
  }

  // Get positions
  var enemyPos = enemy.position;
  var playerPos = player.camera.position;
  var distance = BABYLON.Vector3.Distance(enemyPos, playerPos);

  if (distance < 15 && distance > enemy.attackRange) {
      // Move enemy toward the player by computing the normalized direction
      var direction = playerPos.subtract(enemyPos);
      direction.normalize();
      enemy.position.addInPlace(direction.scale(enemy.speed));
  } else if (distance <= enemy.attackRange) {
      // Attack the player when in range (if the player is not currently attacking)
      if (!player.isAttacking) {
          console.log("Enemy attacks player!");
          player.health -= 1; // Reduce player health
          if (onHealthChange) {
              onHealthChange(player.health); // Call the callback instead of direct function
          }
      }
  }
}