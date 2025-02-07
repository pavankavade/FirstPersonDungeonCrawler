// public/modules/dungeon.js

export function createDungeon(scene) {
  const mazeWidth = 15;
  const mazeHeight = 15;
  const cellSize = 5;
  const wallWidthMultiplier = 2;

  const grid = initializeGrid(mazeWidth, mazeHeight);

  let connected = false;
  while (!connected) {
      resetVisited(grid);
      generateMaze(grid, 0, 0);
      connected = isConnected(grid, 0, 0, mazeWidth - 1, mazeHeight - 1);
  }

  create3DMaze(grid, cellSize, scene, wallWidthMultiplier);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: mazeWidth * cellSize * wallWidthMultiplier, height: mazeHeight * cellSize * wallWidthMultiplier }, scene);
  ground.checkCollisions = true;
  ground.position.x = (mazeWidth * cellSize * wallWidthMultiplier) / 2 - cellSize / 2;
  ground.position.z = (mazeHeight * cellSize * wallWidthMultiplier) / 2 - cellSize / 2;
}

function resetVisited(grid) {
  for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
          grid[y][x].visited = false;
      }
  }
}

function initializeGrid(width, height) {
  return Array(height).fill(null).map(() => Array(width).fill(null).map(() => ({
      north: true, south: true, east: true, west: true, visited: false
  })));
}

function generateMaze(grid, x, y) {
  grid[y][x].visited = true;
  const directions = shuffle(['north', 'south', 'east', 'west']);

  for (const direction of directions) {
      let nx = x, ny = y;
      switch (direction) {
          case 'north': ny -= 1; break;
          case 'south': ny += 1; break;
          case 'east': nx += 1; break;
          case 'west': nx -= 1; break;
      }
      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length && !grid[ny][nx].visited) {
          grid[y][x][direction] = false;
          grid[ny][nx][oppositeDirection(direction)] = false;
          generateMaze(grid, nx, ny);
      }
  }
}

function oppositeDirection(direction) {
  return { north: 'south', south: 'north', east: 'west', west: 'east' }[direction];
}

function shuffle(array) {
  const newArray = [...array]; // Create a copy to avoid modifying the original
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function isConnected(grid, startX, startY, endX, endY) {
  const visited = Array(grid.length).fill(null).map(() => Array(grid[0].length).fill(false));
  const stack = [[startX, startY]];

  while (stack.length > 0) {
      const [x, y] = stack.pop();
      if (x === endX && y === endY) return true;
      if (visited[y][x]) continue;
      visited[y][x] = true;

      const neighbors = [];
      if (!grid[y][x].north && y > 0) neighbors.push([x, y - 1]);
      if (!grid[y][x].south && y < grid.length - 1) neighbors.push([x, y + 1]);
      if (!grid[y][x].east && x < grid[0].length - 1) neighbors.push([x + 1, y]);
      if (!grid[y][x].west && x > 0) neighbors.push([x - 1, y]);

      for (const [nx, ny] of neighbors) {
          if (!visited[ny][nx]) stack.push([nx, ny]);
      }
  }
  return false;
}

function create3DMaze(grid, cellSize, scene, wallWidthMultiplier) {
  const wallHeight = 3;
  const wallThickness = 1;
  const actualCellSize = cellSize * wallWidthMultiplier;
  const wallMaterial = new BABYLON.StandardMaterial("wallMat", scene);
  wallMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);

  for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
          const cell = grid[y][x];
          const posX = x * actualCellSize;
          const posZ = y * actualCellSize;

          if (cell.north) {
              const wall = BABYLON.MeshBuilder.CreateBox("wall_n_" + x + "_" + y, { width: actualCellSize, height: wallHeight, depth: wallThickness }, scene);
              wall.position = new BABYLON.Vector3(posX + actualCellSize / 2, wallHeight / 2, posZ);
              wall.material = wallMaterial;
              wall.checkCollisions = true;
          }
          if (cell.south) {
              const wall = BABYLON.MeshBuilder.CreateBox("wall_s_" + x + "_" + y, { width: actualCellSize, height: wallHeight, depth: wallThickness }, scene);
              wall.position = new BABYLON.Vector3(posX + actualCellSize / 2, wallHeight / 2, posZ + actualCellSize);
              wall.material = wallMaterial;
              wall.checkCollisions = true;
          }
          if (cell.east) {
              const wall = BABYLON.MeshBuilder.CreateBox("wall_e_" + x + "_" + y, { width: wallThickness, height: wallHeight, depth: actualCellSize }, scene);
              wall.position = new BABYLON.Vector3(posX + actualCellSize, wallHeight / 2, posZ + actualCellSize / 2);
              wall.material = wallMaterial;
              wall.checkCollisions = true;
          }
          if (cell.west) {
              const wall = BABYLON.MeshBuilder.CreateBox("wall_w_" + x + "_" + y, { width: wallThickness, height: wallHeight, depth: actualCellSize }, scene);
              wall.position = new BABYLON.Vector3(posX, wallHeight / 2, posZ + actualCellSize / 2);
              wall.material = wallMaterial;
              wall.checkCollisions = true;
          }
      }
  }

  // --- Entry and Exit Points and Signs ---
  const exitX = grid[0].length - 1;
  const exitY = grid.length - 1;

  // Entry
  grid[0][0].north = false;
  const entryWall = scene.getMeshByName("wall_n_0_0");
  if (entryWall) entryWall.dispose();
  createSign("Entry", actualCellSize / 2, actualCellSize / 2, scene, actualCellSize);


  // Exit
  grid[exitY][exitX].south = false;
  const exitWall = scene.getMeshByName("wall_s_" + exitX + "_" + exitY);
  if (exitWall) exitWall.dispose();
  createSign("Exit", (exitX * actualCellSize) + actualCellSize / 2, (exitY * actualCellSize) + actualCellSize/2, scene, actualCellSize);


  // --- Adjust Camera Start Position ---
  const camera = scene.getCameraByName("UniversalCamera");
  if (camera) {
      camera.position.x = actualCellSize / 2;
      camera.position.z = actualCellSize / 2;
      camera.position.y = 44;
  }
}


function createSign(text, x, z, scene, actualCellSize) {
  // --- Sign Mesh ---
  const signPlane = BABYLON.MeshBuilder.CreatePlane(`sign_${text}`, { width: actualCellSize * 0.8, height: actualCellSize * 0.4 }, scene); // Adjust size as needed
  signPlane.position = new BABYLON.Vector3(x, 2, z); // Position above ground
  signPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y; // Face camera on Y axis

  // --- Sign Material and Texture ---
  const signMaterial = new BABYLON.StandardMaterial(`signMat_${text}`, scene);
  signPlane.material = signMaterial;

  // Create Dynamic Texture
  const dynamicTexture = new BABYLON.DynamicTexture(`signTexture_${text}`, {width:512, height:256}, scene, true);
  signMaterial.diffuseTexture = dynamicTexture;
  signMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // No specular reflection
  signMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1); // Make it glow
  dynamicTexture.hasAlpha = true; // in order to be able see through texture

  // Draw Text on Texture
  const ctx = dynamicTexture.getContext();
  ctx.font = "bold 96px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 128); // Center text
  dynamicTexture.update();


  // --- Glow Layer (Optional, for extra glow) ---
  // Only add glow layer once to the scene.  Add it to the createGameScene function
  // const gl = new BABYLON.GlowLayer("glow", scene);
  // gl.intensity = 0.5; // Adjust as desired

  // --- Optional: Add light source for sign ---
  const signLight = new BABYLON.PointLight(`signLight_${text}`, new BABYLON.Vector3(x, 3, z), scene);
  signLight.intensity = 0.8;
  signLight.diffuse = new BABYLON.Color3(0.8, 1, 0.8); // Greenish glow
  signLight.specular = new BABYLON.Color3(0, 0, 0);
}