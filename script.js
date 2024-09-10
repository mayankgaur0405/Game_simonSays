const colors = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userPattern = [];
let level = 0;
let gameStarted = false;
let currentScore = 0;
let bestScore = localStorage.getItem("bestScore") || 0;

// Set the best score from localStorage at the beginning
document.getElementById("bestScore").innerText = bestScore;

// Play sound associated with the button
function playSound(color) {
    const sound = new Audio(`sounds/${color}.mp3`);
    sound.play();
}

// Flash button when clicked or when Simon shows the pattern
function flashButton(color) {
    const button = document.getElementById(color);
    
    // Temporarily change the background color for more visibility
    const originalColor = button.style.backgroundColor;
    button.style.backgroundColor = 'white';  // Flash to white
    button.classList.add("flash");  // Add flash effect

    // Restore original color after 300ms
    setTimeout(() => {
        button.style.backgroundColor = originalColor;
        button.classList.remove("flash");
    }, 300);

    // Play sound associated with the button
    playSound(color);
}

// Generate the next sequence in the game pattern


function nextSequence() {
    userPattern = [];
    level++;
    document.querySelector("h1").innerText = "Level " + level;
    
    const randomColor = colors[Math.floor(Math.random() * 4)];
    gamePattern.push(randomColor);
    
    flashButton(randomColor);
    playSound(randomColor);
}


// function nextSequence() {
//     userPattern = [];
//     level++;
//     currentScore = level - 1; // Current score is the number of successfully completed levels
//     document.getElementById("currentScore").innerText = currentScore;
//     document.querySelector("h1").innerText = "Level " + level;
    
//     let i = 0;
    
//     const intervalId = setInterval(() => {
//         if (i < gamePattern.length) {
//             const color = gamePattern[i];
            
//             // Show the current system-selected color
//             document.getElementById("currentSelection").innerText = "Simon selected: " + color;
            
//             flashButton(color);
//             i++;
//         } else {
//             clearInterval(intervalId);
            
//             // Clear the selection message after the sequence is shown
//             document.getElementById("currentSelection").innerText = "";
//         }
//     }, 600);  // 600ms interval between flashes
// }

// Check the user's input against the game pattern
// function checkAnswer(currentLevel) {
//     if (userPattern[currentLevel] === gamePattern[currentLevel]) {
//         if (userPattern.length === gamePattern.length) {
//             setTimeout(nextSequence, 1000);
//         }
//     } else {
//         gameOver();
//     }
// }


function checkAnswer(currentLevel) {
    if (userPattern[currentLevel] === gamePattern[currentLevel]) {
        // Check if the user completed the entire sequence
        if (userPattern.length === gamePattern.length) {
            // Update the current score
            currentScore = level;
            document.getElementById("currentScore").innerText = currentScore;

            // Check if current score is the best score
            if (currentScore > bestScore) {
                bestScore = currentScore;
                localStorage.setItem("bestScore", bestScore); // Save the best score
                document.getElementById("bestScore").innerText = bestScore;
            }
            
            // Move to the next sequence after a short delay
            setTimeout(nextSequence, 1000);
        }
    } else {
        gameOver();
    }
}


// Game over scenario
function gameOver() {
    document.querySelector("h1").innerText = "Game Over, Press Start!";
    gamePattern = [];
    gameStarted = false;
    
    // Check and update the best score
    if (currentScore > bestScore) {
        bestScore = currentScore;
        localStorage.setItem("bestScore", bestScore); // Save best score in localStorage
        document.getElementById("bestScore").innerText = bestScore; // Update the display
    }

    currentScore = 0;
    document.getElementById("currentScore").innerText = currentScore;
    level = 0;
}

// When user clicks on a color button
document.querySelectorAll(".button").forEach((button) => {
    button.addEventListener("click", (event) => {
        if (gameStarted) {
            const userChosenColor = event.target.id;
            userPattern.push(userChosenColor);
            
            playSound(userChosenColor);  // Play sound when the user clicks
            flashButton(userChosenColor);  // Flash the button
            
            checkAnswer(userPattern.length - 1);
        }
    });
});

// Start button event listener
document.getElementById("startButton").addEventListener("click", () => {
    if (!gameStarted) {
        document.querySelector("h1").innerText = "Level 0";
        gameStarted = true;
        nextSequence();
    }
});
