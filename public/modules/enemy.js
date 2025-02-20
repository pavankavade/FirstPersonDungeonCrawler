// =========== FILE: public/modules/enemy.js ===========

export function createEnemy(position, scene) {
    var enemy = BABYLON.MeshBuilder.CreateSphere("enemy", { diameter: 2 }, scene);
    enemy.position = position;
    enemy.health = 50;
    enemy.attackRange = 2;
    enemy.speed = 0.02;
    return enemy;
  }
  
  export function updateEnemy(enemy, player, scene, onHealthChange) {
    if (enemy.health <= 0) {
      enemy.isDead = true;
      enemy.dispose();
      return;
    }
  
    // --- CORRECTED: Check for BOTH player.mesh AND player.mesh.position ---
    if (player.mesh && player.mesh.position) {
        var enemyPos = enemy.position;
        var playerPos = player.mesh.position; // Use mesh position, NOT camera position
        var distance = BABYLON.Vector3.Distance(enemyPos, playerPos);
  
        if (distance < 15 && distance > enemy.attackRange) {
            var direction = playerPos.subtract(enemyPos);
            direction.normalize();
            enemy.position.addInPlace(direction.scale(enemy.speed));
        } else if (distance <= enemy.attackRange) {
            if (!player.isAttacking) {
                console.log("Enemy attacks player!");
                player.health -= 1;
                if (onHealthChange) {
                    onHealthChange(player.health);
                }
            }
        }
    }
  }