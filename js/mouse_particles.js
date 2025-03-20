let particles = [];
let currentEffect = 'trail';

// Generate Fibonacci sequence with 50 terms (for Fibonacci effect, if used)
const numberSequence = generateFibonacci(50);

function generateFibonacci(length) {
    let fib = [0, 1];
    for (let i = 2; i < length; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib;
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    let selectElement = document.getElementById('effect-select');
    selectElement.addEventListener('change', function() {
        currentEffect = selectElement.value;
    });
    textAlign(CENTER, CENTER); // Useful for text-based effects like Fibonacci
}

function draw() {
    background(0); // Black background
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

function mouseMoved() {
    // Handle particle creation based on selected effect
    if (currentEffect === 'trail') {
        particles.push(new TrailParticle(mouseX, mouseY));
    } else if (currentEffect === 'smoke') {
        particles.push(new SmokeParticle(mouseX, mouseY));
    } else if (currentEffect === 'fireworks') {
        particles.push(new FireworkParticle(mouseX, mouseY));
    } else if (currentEffect === 'fibonacci') {
        for (let i = 0; i < 5; i++) {
            particles.push(new FibonacciParticle(mouseX, mouseY));
        }
    } else if (currentEffect === 'lightning') {
        createLightning(mouseX, mouseY, 3); // Depth of 3 for branching
    } else if (currentEffect === 'fire') {
        for (let i = 0; i < 3; i++) {
            particles.push(new FireParticle(mouseX, mouseY));
        }
    } else if (currentEffect === 'rain') {
        for (let i = 0; i < 5; i++) {
            particles.push(new RainParticle(mouseX, mouseY));
        }
    } else if (currentEffect === 'snow') {
        for (let i = 0; i < 5; i++) {
            particles.push(new SnowParticle(mouseX, mouseY));
        }
    } else if (currentEffect === 'aurora') {
        for (let i = 0; i < 3; i++) {
            particles.push(new AuroraParticle(mouseX, mouseY));
        }
    } else if (currentEffect === 'fireflies') {
        for (let i = 0; i < 2; i++) {
            particles.push(new FireflyParticle(mouseX, mouseY));
        }
    }
}

// Base Particle class
class Particle {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector(0, 0);
        this.lifespan = 255; // Default lifespan
    }
    update() {
        this.position.add(this.velocity);
        this.lifespan -= 2;
    }
    display() {
        // Overridden by subclasses
    }
    isDead() {
        return this.lifespan < 0;
    }
}

// Placeholder classes for existing effects (replace with your implementations if they exist)
class TrailParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = p5.Vector.random2D();
    }
    display() {
        noStroke();
        fill(255, this.lifespan);
        ellipse(this.position.x, this.position.y, 5, 5);
    }
}

class SmokeParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = createVector(random(-0.5, 0.5), random(-1, 0));
        this.size = random(10, 20);
    }
    display() {
        noStroke();
        fill(100, this.lifespan);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

class FireworkParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = p5.Vector.random2D().mult(random(2, 5));
    }
    display() {
        noStroke();
        fill(random(255), random(255), random(255), this.lifespan);
        ellipse(this.position.x, this.position.y, 5, 5);
    }
}

class FibonacciParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = p5.Vector.random2D();
        this.number = numberSequence[floor(random(numberSequence.length))];
    }
    display() {
        noStroke();
        fill(255, this.lifespan);
        text(this.number, this.position.x, this.position.y);
    }
}

// New Particle Classes

class LightningParticle extends Particle {
    constructor(x, y, depth) {
        super(x, y);
        this.velocity = createVector(random(-5, 5), random(-5, 5));
        this.lifespan = 20; // Short lifespan for flash effect
        this.depth = depth;
        if (depth > 0 && random() < 0.5) {
            // Create child particles for branching
            for (let i = 0; i < 2; i++) {
                particles.push(new LightningParticle(this.position.x, this.position.y, depth - 1));
            }
        }
    }
    display() {
        stroke(255, 255, 0, this.lifespan); // Yellow with fading
        strokeWeight(2);
        line(this.position.x, this.position.y, this.position.x + this.velocity.x * 5, this.position.y + this.velocity.y * 5);
    }
}

class FireParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = createVector(random(-0.5, 0.5), random(-3, -1));
        this.size = random(5, 15);
    }
    update() {
        super.update();
        this.velocity.x += random(-0.1, 0.1); // Slight horizontal drift
    }
    display() {
        noStroke();
        let age = map(this.lifespan, 0, 255, 0, 1);
        let r = map(age, 0, 1, 255, 255); // Orange to yellow
        let g = map(age, 0, 1, 0, 255);
        let b = 0;
        fill(r, g, b, this.lifespan);
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

class RainParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = createVector(random(-0.5, 0.5), random(2, 4));
        this.size = random(2, 5);
    }
    display() {
        noStroke();
        fill(0, 0, 255, this.lifespan); // Blue raindrops
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

class SnowParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = createVector(random(-1, 1), random(0.5, 1.5));
        this.size = random(3, 7);
    }
    display() {
        noStroke();
        fill(255, this.lifespan); // White snowflakes
        ellipse(this.position.x, this.position.y, this.size, this.size);
    }
}

class AuroraParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = createVector(random(1, 3), 0); // Horizontal movement
        this.amplitude = random(20, 50);
        this.frequency = random(0.01, 0.05);
        this.color = color(random(0, 255), random(0, 255), random(0, 255));
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.amplitude * sin(this.position.x * this.frequency);
        this.lifespan -= 1; // Slower fade
    }
    display() {
        noStroke();
        fill(this.color, this.lifespan);
        ellipse(this.position.x, this.position.y, 10, 10);
    }
}

class FireflyParticle extends Particle {
    constructor(x, y) {
        super(x, y);
        this.velocity = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
        this.brightness = 255;
        this.pulseSpeed = random(0.05, 0.1);
    }
    update() {
        super.update();
        this.brightness = 128 + 127 * sin(frameCount * this.pulseSpeed); // Pulsing effect
    }
    display() {
        noStroke();
        fill(255, 255, 0, this.brightness); // Yellow glow
        ellipse(this.position.x, this.position.y, 5, 5);
    }
}

// Helper function for lightning branching
function createLightning(x, y, depth) {
    particles.push(new LightningParticle(x, y, depth));
}