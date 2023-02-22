let inputText;
let generateButton;

let inputString = "";
let index = 0;
let delay = 100;
let shapes = [];

function setup() {
  createCanvas(400, 400);
  
  inputText = createInput();
  inputText.position(20, 20);
  
  generateButton = createButton('Generate Word Cloud');
  generateButton.position(inputText.x + inputText.width + 10, 20);
  generateButton.mousePressed(generateWordCloud);
  
  noStroke();
}

function draw() {
  background(255);
  for (let i = 0; i < shapes.length; i++) {
    shapes[i].display();
  }
}

class Shape {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color(random(255), random(255), random(255));
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

async function generateWordCloud() {
  inputString = inputText.value();
  shapes = [];
  
  const response = await fetch("http://localhost:3000/generate", 
  {method: "post", body: {text: inputString}});
  
  const data = await response.json();
  inputString = data.text;
  delay = Math.floor(Math.random() * 200) + 50;
  let words = inputString.split(" ");
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word.length > 4) {
      let x = random(width);
      let y = random(height);
      let size = word.length * 10;
      shapes.push(new Shape(x, y, size));
    }
  }
}
