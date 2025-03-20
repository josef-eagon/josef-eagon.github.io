const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + // Latin and numbers
                  "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" + // Cyrillic
                  "你好世界大家早上好晚上好" + // Chinese (simplified)
                  "カタカナハニホヘトチリヌルヲ" + // Japanese katakana
                  "αβγδεζηθικλμνξοπρστυφχψω" + // Greek (lowercase)
                  "♠♣♥♦★☆♫♪∞∑∏∆√∫≠≤≥"; // Symbols
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

// Arrays to manage colors for each column
const colorOffsets = [];
const colorIncrements = [];
for (let x = 0; x < columns; x++) {
    colorOffsets[x] = Math.random() * 360;          // Random starting hue (0–360)
    colorIncrements[x] = 0.05 + Math.random() * 0.1; // Random speed (0.05–0.15)
}

function draw() {
    // Fade the previous frame
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font (assuming fontSize is defined)
    ctx.font = fontSize + 'px monospace';

    // Update hues for all columns
    for (let i = 0; i < colorOffsets.length; i++) {
        colorOffsets[i] = (colorOffsets[i] + colorIncrements[i]) % 360;
    }

    // Draw characters with per-column colors
    for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = `hsl(${colorOffsets[i]}, 100%, 50%)`;
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop when it reaches the bottom (assuming existing logic)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(draw, 33);