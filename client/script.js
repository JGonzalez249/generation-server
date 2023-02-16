const { text } = require('express');

let inputString = "";
let index = 0;
let delay = 100;


function setup() {
  createCanvas(400, 400);
  textSize(32);
  getTextFromAPI();
}

function draw() {
  background(255);
  stroke(0)
  let points = []
  points = JSON.parse(`[
  [0, 0],
  [0, 100],
  [50, 100],
  [50, 50],
  [100, 50],
  [100, 100],
  [150, 100],
  [150, 0],
  [0, 0]
]`)

  // console.log(points)
  beginShape();
  for(let i of points) {
    vertex(i[0], i[1])
  }
  
  endShape(CLOSE)
  let displayString = "";
  let words = inputString.split(" ");
  let currentLine = "";
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (textWidth(currentLine + word) < width - 50) {
      currentLine += word + " ";
    } else {
      displayString += currentLine + "\n";
      currentLine = word + " ";
    }
  }
  displayString += currentLine;
  let lines = displayString.split("\n");
  let lineHeight = textAscent() + textDescent();
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let y = (height + lineHeight) / 2 + lineHeight * i;
    text(line, 50, y);
  }
}

let interval;
async function getTextFromAPI() {
  const response = await fetch("http://localhost:3000/generate", 
  {method: "post", body: {text:"Little red riding hood went to the forest and "}});
  const data = await response.json();
  inputString = data.text;
  delay = Math.floor(Math.random() * 200) + 50;
  interval = setInterval(function() {
    index++;
    if (index > inputString.length) {
      clearInterval(interval);
    }
  }, delay);
}
