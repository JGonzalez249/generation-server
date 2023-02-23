let inputText;
let generateButton;
let inputString = "";
let index = 0;
let delay = 100;
let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  inputText = createInput();
  inputText.position(20, 20);

  generateButton = createButton("Generate Word Cloud");
  generateButton.position(inputText.x + inputText.width + 10, 20);
  generateButton.mousePressed(generateWordCloud);

  noStroke();
}

function draw() {
  background(255);

  const clusterSize = 10;

  for (let i = 0; i < shapes.length; i += clusterSize) {
    const cluster = shapes.slice(i, i + clusterSize);

    // Calculate the center of the cluster
    let centerX = 0;
    let centerY = 0;
    for (let j = 0; j < cluster.length; j++) {
      centerX += cluster[j].x;
      centerY += cluster[j].y;
    }
    centerX /= cluster.length;
    centerY /= cluster.length;

    // Move the shapes towards the center of the cluster
    for (let j = 0; j < cluster.length; j++) {
      const shape = cluster[j];
      const dx = centerX - shape.x;
      const dy = centerY - shape.y;
      const distance = sqrt(dx * dx + dy * dy);
      const speed = map(distance, 0, width, 0.5, 0.1);
      shape.x += dx * speed;
      shape.y += dy * speed;

      shape.display();
    }
  }
}

class Shape {
  constructor(x, y, size, word) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color(random(200, 255), random(200, 255), random(200, 255));
    this.word = word;
    this.rotation = random(TWO_PI); // Add a random rotation angle to the shape
  }

  intersects(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return d < (this.size + other.size) / 2;
  }

  display() {
    const sizeMultiplier = 1 + 0.1 * sin(frameCount / 10);
    const size = this.size * sizeMultiplier;

    fill(this.color);
    push(); // Save the current transformation matrix
    translate(this.x, this.y); // Move the origin to the center of the shape
    rotate(this.rotation); // Rotate the shape by the random angle
    ellipse(0, 0, size, size); // Draw the shape centered at the origin
    pop(); // Restore the previous transformation matrix

    textAlign(CENTER, CENTER);
    textSize(size / 4);
    fill(0);
    text(this.word, this.x, this.y);
  }
}

async function generateWordCloud() {
  inputString = inputText.value();
  shapes = [];

  const response = await fetch("http://localhost:3000/generate", { method: "post", body: { text: inputString } });
  const data = await response.json();
  const generatedText = data.text;

  const tokens = generatedText.trim().split(" ");
  const maxTokens = 100;
  const numShapes = min(tokens.length, maxTokens);

  const clusterSize = 10;
  const clusterPadding = random(100, 200);

// Top-left cluster
for (let i = clusterSize; i < numShapes; i++) {
  const word = tokens[i];
  const centerX = random(0, width / 2 - clusterPadding);
  const centerY = random(0, height / 2 - clusterPadding);
  const r = random(0, 500);
  const angle = random(0, TWO_PI);
  const x = centerX + r * cos(angle);
  const y = centerY + r * sin(angle);
  const size = map(word.length, 1, 10, 20, 200);
  const shape = new Shape(x, y, size, word);
  shapes.push(shape);
}

// Top-right cluster
for (let i = clusterSize; i < numShapes * 2; i++) {
  const word = tokens[i];
  const centerX = random(width / 2 + clusterPadding, width);
  const centerY = random(0, height / 2 - clusterPadding);
  const r = random(0, 500);
  const angle = random(0, TWO_PI);
  const x = centerX + r * cos(angle);
  const y = centerY + r * sin(angle);
  const size = map(word.length, 1, 10, 20, 200);
  const shape = new Shape(x, y, size, word);
  shapes.push(shape);
}

// Center cluster
for (let i = clusterSize * 2; i < numShapes * 3; i++) {
  const word = tokens[i];
  const centerX = random(width / 4, width * 3 / 4);
  const centerY = random(height / 4, height * 3 / 4);
  const r = random(0, 500);
  const angle = random(0, TWO_PI);
  const x = centerX + r * cos(angle);
  const y = centerY + r * sin(angle);
  const size = map(word.length, 1, 10, 20, 200);
  const shape = new Shape(x, y, size, word);
  shapes.push(shape);
}

// Bottom-left cluster
for (let i = clusterSize * 3; i < numShapes * 4; i++) {
  const word = tokens[i];
  const centerX = random(0, width / 2 - clusterPadding);
  const centerY = random(height / 2 + clusterPadding, height);
  const r = random(0, 500);
  const angle = random(0, TWO_PI);
  const x = centerX + r * cos(angle);
  const y = centerY + r * sin(angle);
  const size = map(word.length, 1, 10, 20, 200);
  const shape = new Shape(x, y, size, word);
  shapes.push(shape);
}

// Bottom-right cluster
for (let i = clusterSize * 4; i < numShapes * 5; i++) {
  const word = tokens[i];
  const centerX = random(width / 2 + clusterPadding, width);
  const centerY = random(height / 2 + clusterPadding, height);
  const r = random(0, 500);
  const angle = random(0, TWO_PI);
  const x = centerX + r * cos(angle);
  const y = centerY + r * sin(angle);
  const size = map(word.length, 1, 10, 20, 200);
  const shape = new Shape(x, y, size, word);
  shapes.push(shape);
}

  const inputTokens = inputString.trim().split(" ");
  for (let i = 0; i < inputTokens.length; i++) {
    const word = inputTokens[i];
    if (!tokens.includes(word)) {
      let x, y, size;
      let overlapping = true;
      while (overlapping) {
        x = random(width);
        y = random(height);
        size = map(word.length, 1, 10, 20, 200);
        let testShape = new Shape(x, y, size, word);
        overlapping = false;
        for (let j = 0; j < shapes.length; j++) {
          if (testShape.intersects(shapes[j], padding)) {
            overlapping = true;
            break;
          }
        }
      }
      shapes.push(new Shape(x, y, size, word));
    }
  }
}