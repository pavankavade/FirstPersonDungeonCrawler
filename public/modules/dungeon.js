// Function to create a simple dungeon layout using basic meshes
export function createDungeon(scene) {
  // Create a floor for the dungeon
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
  ground.checkCollisions = true;

  // Define a simple material for walls
  var wallMaterial = new BABYLON.StandardMaterial("wallMat", scene);
  wallMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Grey color

  // Build a corridor by placing walls along two sides
  for (var i = -20; i < 20; i += 5) {
    // Left wall
    var wall = BABYLON.MeshBuilder.CreateBox("wall" + i, { width: 1, height: 3, depth: 5 }, scene);
    wall.position = new BABYLON.Vector3(-3, 1.5, i);
    wall.material = wallMaterial;
    wall.checkCollisions = true;
  }
  
  for (var i = -20; i < 20; i += 5) {
    // Right wall
    var wall = BABYLON.MeshBuilder.CreateBox("wall2_" + i, { width: 1, height: 3, depth: 5 }, scene);
    wall.position = new BABYLON.Vector3(3, 1.5, i);
    wall.material = wallMaterial;
    wall.checkCollisions = true;
  }

  // Create a simple room by adding extra wall segments
  var roomWall = BABYLON.MeshBuilder.CreateBox("roomWall", { width: 10, height: 3, depth: 1 }, scene);
  roomWall.position = new BABYLON.Vector3(0, 1.5, 10);
  roomWall.material = wallMaterial;
  roomWall.checkCollisions = true;

  var roomWall2 = roomWall.clone("roomWall2");
  roomWall2.position = new BABYLON.Vector3(0, 1.5, 15);
  roomWall2.rotation.y = Math.PI;
  roomWall2.checkCollisions = true;
}