// Array to store all particles
let particles = [];

// Generate Fibonacci sequence with 50 terms
const numberSequence = generateFibonacci(50);

function generateFibonacci(length) {
  let fib = [0, 1];
  for (let i = 2; i < length; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib;
}

function setup() {
  // Create a canvas that fills the browser window
  createCanvas(windowWidth, windowHeight);
  // Set text alignment for better positioning
  textAlign(CENTER, CENTER);
}

function draw() {
  // Clear the background with black
  background(0);
  
  // Spawn new particles every 5 frames
  if (frameCount % 5 === 0) {
    for (let i = 0; i < 6; i++) { // Create 6 particles at a time
      particles.push(new Particle(random(0, width), 0));
    }
  }
  
  // Update and display all particles, remove them if faded
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

// Particle class to define behavior of each particle
class Particle {
  constructor(x, y) {
    this.x = x;              // Random x position across the top
    this.y = y;              // Start at top (y = 0)
    this.vx = random(-0.5, 0.5); // Slight random x velocity for wobble
    this.vy = random(1, 3);  // Positive y velocity for downward dripping
    this.lifespan = 255;     // Starting alpha value (fully opaque)
    this.sequenceIndex = 0;  // Start at the beginning of the sequence
    this.number = numberSequence[this.sequenceIndex]; // Initial number
    this.changeTimer = 0;    // Timer to control number changes
  }

  update() {
    // Move particle based on velocity
    this.x += this.vx;
    this.y += this.vy;
    // Decrease lifespan slowly
    this.lifespan -= 1;      // Set to -= 1 as requested
    
    // Update number every 10 frames
    this.changeTimer += 1;
    if (this.changeTimer >= 10) {
      this.sequenceIndex = (this.sequenceIndex + 1) % numberSequence.length;
      this.number = numberSequence[this.sequenceIndex];
      this.changeTimer = 0;
    }
  }

  display() {
    // Draw particle as a number with fading alpha
    noStroke();
    fill(255, this.lifespan); // White with alpha based on lifespan
    textSize(16);             // Size of the number
    text(this.number, this.x, this.y); // Display the current number
  }

  isDead() {
    // Particle is dead when fully transparent
    return this.lifespan <= 0;
  }
}