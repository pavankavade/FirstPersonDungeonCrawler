let hudGUI;

// Initialize the HUD using Babylon GUI
export function initHUD(scene, player) {
    // Create a fullscreen GUI texture
    hudGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create a text block to display player health
    var healthText = new BABYLON.GUI.TextBlock("healthText", "Health: " + player.health);
    healthText.color = "white";
    healthText.fontSize = 24;
    healthText.top = "-40%";
    healthText.left = "-40%";
    healthText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    healthText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    hudGUI.addControl(healthText);

    // Create a text block to display player score
    var scoreText = new BABYLON.GUI.TextBlock("scoreText", "Score: " + player.score);
    scoreText.color = "white";
    scoreText.fontSize = 24;
    scoreText.top = "-40%";
    scoreText.left = "20%";
    scoreText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    scoreText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    hudGUI.addControl(scoreText);

    // Save text block references globally for HUD updates
    window.healthText = healthText;
    window.scoreText = scoreText;
}

// Helper function to update HUD health display
export function updateHUDHealth(newHealth) {
    if (window.healthText) {
        window.healthText.text = "Health: " + newHealth;
    }
}

// Helper function to update HUD score display
export function updateHUDScore(newScore) {
    if (window.scoreText) {
        window.scoreText.text = "Score: " + newScore;
    }
}