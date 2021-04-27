let values;
let w = 10
let states = [];
let selection;
let runButton;
let upButton;
let canRun = true;
function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  makeVals()

  selection = createSelect();
  selection.position(10, 10);
  selection.option('Quick Sort');
  selection.option('Merge Sort');
  selection.option('Tim Sort');
  selection.option('Radix Sort');
  selection.option('Insertion Sort');
  selection.selected('Quick Sort');
  

  runButton = createButton("Start")
  runButton.position(10, 30)
  runButton.mousePressed(Run)

  upButton = createButton("+")
  upButton.position(100, 30)

  upButton.mousePressed(function(){w = round(w/1.5)
                                  makeVals()})
  

}

function getBaseLog(x, y) {
  return log(y) / log(x);
}

function makeVals(){
  values = new Array(floor(width/w));
  for (let i = 0; i < values.length; i++) {
    values[i] = round(i*height/values.length)
    //values[i] = height-i*height/values.length
    states[i] = -1;
  }
  values = shuffle(values)
}

function Run() {
  let item = selection.value();
  if (canRun){
    canRun = false
    if (item == "Quick Sort"){
      quickSort(values, 0, values.length-1)
    }
    if (item == "Merge Sort"){
      mergeSort(values, 0, values.length-1)
    }
    if (item == "Tim Sort"){
      timSort(values, values.length-1)
    }

    if (item == "Radix Sort"){
      radixSort(values)
    }
    if (item == "Insertion Sort"){
      insertionSortRecursive(values, values.length-1)

    }
  }

}

function draw() {
  // put drawing code here
  background(56);
  for (let i = 0; i < values.length; i++) {
    noStroke();
    if (states[i] == 0) {
      fill('#E0777D');
    } else if (states[i] == 1) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(i * w, height - values[i], w, values[i]);
  }

}
