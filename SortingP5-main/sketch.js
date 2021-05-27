let values;
let w = 10
let states = [];
let selection;
let runButton;
let upButton;
let downButton
let shuff
let canRun = true;
let delay = 1
let delUp
let delDown
var osc
let sorted
let shuffType
let n
let muted
let mute
let showData = ""
let visualSelector
let visualizer = 0
function mousePressed(){
  
}

function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  
  osc = new p5.TriOsc();
  // Start silent
  osc.start();
  osc.amp(0);


  selection = createSelect();
  selection.position(10, 60);
  selection.option('Quick Sort');
  selection.option('Bubble Sort');
  selection.option('Dual-Pivot Quick Sort');
  selection.option('Quick-Insertion Sort');
  //selection.option('Quick-Merge Sort');
  selection.option('Merge Sort');
  selection.option('Grail Sort');
  selection.option('Grail Sort Out-of-Place');
  selection.option('Bitonic Merge Sort');
  //selection.option('Merge-Heap Sort');
  selection.option('Weaved Merge Sort');
  selection.option('Weave Merge Sort');
  selection.option('Shaker Merge Sort');
  selection.option('Tim Sort');
  selection.option('Radix Sort Base 4');
  selection.option('Radix Sort Base 8');
  selection.option('Radix Sort Base 10');

  selection.option('Insertion Sort');
  selection.option('Selection Sort');
  selection.option('Heap Sort');
  selection.option('Shell Sort');
  selection.option('Comb Sort');
  selection.option('Gravity Sort')
  //selection.option("Introsort")
  selection.option('IntroSort');
  selection.option('Bogo Sort');
  selection.option('Less Bogo Sort');
  selection.selected('Quick Sort');


  shuffType = createSelect();
  shuffType.position(480, 60);
  shuffType.option('Normal Shuffle');
  shuffType.option('Reverse Shuffle');
  shuffType.option("Heapifyed Shuffle")
  shuffType.option("Almost Sorted")
  //shuffType.option("Quick Sort Killer")
  shuffType.option("Sine Wave")
  shuffType.option("Mountain")
  shuffType.option("Scrambled Tail")
  shuffType.option("Scrambled Head")
  shuffType.selected('Normal Shuffle');


  visualSelector = createSelect()
  visualSelector.position(730, 60)
  visualSelector.option("Bar Graph")
  visualSelector.option("Dots")
  visualSelector.option("Rainbow")
  visualSelector.selected("Bar Graph")
  

  runButton = createButton("Start")
  runButton.position(900, 60)
  runButton.mousePressed(Run)

  upButton = createButton("+Size")
  upButton.position(390, 60)
  upButton.mousePressed(function(){w = round(w/1.5)
                                  makeSort();makeVals()})
  downButton = createButton("-Size")
  downButton.position(330, 60)
  downButton.mousePressed(function(){if (values.length > 5){w = round(w*1.5)
                                  makeSort();makeVals()}})

  delUp = createButton("+Delay")
  delUp.position(240, 60)
  delUp.mousePressed(function(){delay += 5})
  delDown = createButton("-Delay")
  delDown.position(180, 60)
  delDown.mousePressed(function(){if (delay > 5){delay -= 5}})


  shuff = createButton("Shuffle")
  shuff.position(610, 59)
  shuff.mousePressed(makeVals)

  muted = createCheckbox('mute sound', false)
  muted.position(1100, 60)
  muted.changed(checkED)
  makeVals()
  ew = [...values]
}
function checkED() {
  if (this.checked()) {
    mute = true
  } else {
    mute = false
  }
}

function playNote(note, duration) {
  osc.freq(midiToFreq(note));

  // Fade it in
  osc.fade(0.5,0);

  // If we sest a duration, fade it out
  if (duration) {
    setTimeout(function() {
      osc.fade(0,0.2);
    }, duration-50);
  }
}

function makeSort(){
  for (var i=0;i<states.length;i++){
        states[i] = -1
      }
    values = new Array(floor(width/w));
    for (let i = 0; i < values.length; i++) {
      values[i] = round(i*(height-90)/values.length)
      //values[i] = height-i*height/values.length
      states[i] = -1;
    }
    //shuffleArr(values)
    values = shuffle(values)
}

function getBaseLog(x, y) {
  return log(y) / log(x);
}
async function shuffleArr(arr, e, x){
  if (!x){
    for (var i=0;i<e;i++){
      let a = i
      let b = round(random(i, arr.length-1))
      
      await DelayDynamic()
      let temp = arr[i];
      arr[a] = arr[b];
      arr[b] = temp;
    }
  }
  if (x){
    for (var i=0;i<e;i++){
        let a = round(random(0, arr.length-1))
        let b = round(random(0, arr.length-1))
        if (a != b){
          await DelayDynamic()
          let temp = arr[a];
          arr[a] = arr[b];
          arr[b] = temp;
        }
      }
  }
}

async function makeVals(){
  showData = "Shuffling"
  canRun = true
  for (var i=0;i<states.length;i++){
      states[i] = -1
    }
  osc.fade(0, 0.1)
  let item = shuffType.value()
  for (var i=0;i<states.length;i++){
        states[i] = -1
      }
    values = new Array(floor(width/w));
    for (let i = 0; i < values.length; i++) {
      values[i] = round(i*(height-90)/values.length)
      //values[i] = height-i*height/values.length
      states[i] = -1;
    }
    n = values.length

    if (values.length % 2 != 0){
    values.splice(values.length-1, 1)
  }

  if (item == "Reverse Shuffle"){
    
    values = values.reverse()
  }

  if (item == "Normal Shuffle"){
    shuffleArr(values, values.length, false)
  }

  if (item == "Heapifyed Shuffle"){
    let n = values.length
    for (let i = n / 2 - 1; i >= 0; i--){
        heapify(values, n, i);
        //await sleep(1)

    }
  }
  if (item == "Almost Sorted"){
    shuffleArr(values, round(values.length/10), true)
  }

  if (item == "Scrambled Head"){
    for (var i=0;i<floor(values.length/5);i++){
      let a = i
      let b = round(random(i, floor(values.length/5)))
      if (i % 5 == 0){
      }

      let temp = values[i];
      values[a] = values[b];
      values[b] = temp;

    }
  }
  if (item == "Scrambled Tail"){
    for (var i=values.length-floor(values.length/5);i<values.length;i++){
      let a = i
      let b = round(random(i, values.length-1))
      if (i % 5 == 0){
      }

      let temp = values[a];
      values[a] = values[b];
      values[b] = temp;

    }
  }


  if (item == "Mountain"){
    var newArr = [...values]
    newArr.reverse()
    for (var i=floor(values.length/2);i<values.length;i++){
      values[i] = newArr[i]
    }
    for (var i=0;i<values.length;i++){
      values[i] = values[i]*2
    }
  }

  if (item == "Sine Wave"){
    for (var i=0;i<values.length;i++){
      values[i] = round(sin(i/(values.length/10)) * ((height-90)/3) + (height-90)/2)
      if (i % 5 == 0){
        //await sleep(1)
      }
    }
  }

  if (item == "Quick Sort Killer"){
    let currl = values.length
     for (var j=currl-currl%2-2, i=j;i>=0;i-=2,j--){
        swap(values, i, j)
     } 
     
  }
  osc.fade(0, 0.1)
    
}
let now = new Date()
async function Run() {
  nes = 0
  if (values.length % 2 != 0){
    values.splice(values.length-1, 1)
  }
  for (var i=0;i<states.length;i++){
      states[i] = -1
    }
  xas =  Math.floor(2 * Math.floor(Math.log(values.length) /
                                  Math.log(2)));
  userStartAudio();
  let item = selection.value();
  ew = [...values]
  if (canRun){
    canRun = false
    if (item == "Quick Sort"){
      
      quickSort(values, 0, values.length-1)      
    }
    if (item == "Grail Sort"){
      grailSort(values, values.length)
    }
    if (item == "Grail Sort Out-of-Place"){
      grailSortOut(values, values.length)
    }
    if (item == "Bubble Sort"){
      bubbleSort(values)
    }
    if (item == "Bogo Sort"){
      BogoSort(values)
    }
    if (item == "Less Bogo Sort"){
      LessBogoSort(values)
    }
    if (item == "Dual-Pivot Quick Sort"){
      DuelPivotQuickSort(values, values.length)
    }
    if (item == "Quick-Insertion Sort"){
      QISort()
    }
    if (item == "Quick-Merge Sort"){
      quickMergeSort(values, values.length)
    }
    if (item == "Merge-Heap Sort"){
      mergeHeapSort(values, values.length)
    }
    if (item == "Merge Sort"){
      mergeSort(values, 0, values.length-1)

    }
    if (item == "Weaved Merge Sort"){
      let tmp = new Array(values.length)
      WeavedMerge(values, tmp, values.length, 0, 1)
    }
    if (item == "Bitonic Merge Sort"){
      let b = true
      BitonicSort(values, values.length-1, b)
    }
    if (item == "Tim Sort"){
      timSort(values, values.length)
    }

    if (item == "Radix Sort Base 4"){
      base = 4
      radixSort(values)
    }
    if (item == "Radix Sort Base 8"){
      base = 8
      radixSort(values)
    }
    if (item == "Radix Sort Base 10"){
      base = 10
      radixSort(values)
    }
    if (item == "Insertion Sort"){
      insertionSortRecursive(values, values.length)

    }
    if (item == "Selection Sort"){
      selectionSort(values, values.length)

    }
    if (item == "Heap Sort"){
      heapSort(values, values.length)

    }
    if (item == "Shell Sort"){
      ShellSort(values, values.length)

    }
    if (item == "Comb Sort"){
      combSort(values)

    }
    if (item == "IntroSort"){
      await sortDataIntro()
      await insertSort(values, 0, values.length)

    }
    if (item == "Weave Merge Sort"){
      weaveMergeSort(values, 0, values.length)
    }
    if (item == "Shaker Merge Sort"){
      shakerMergeSort(values, 0, values.length)
    }
    if (item == "Gravity Sort"){
      GravitySort(values, 0, values.length)
    }

  }

}

function draw() {
  // put drawing code here
  if (visualSelector.value() == "Bar Graph"){
    visualizer = 0
  }
  else if (visualSelector.value() == "Dots"){
    visualizer = 1
  }
  else if (visualSelector.value() == "Rainbow"){
    visualizer = 2
  }
  background(56);
  push()
  fill(0)
  rect(0, 0, width, 90)
  pop()
  push()
  textSize(30)
  stroke(255)
  fill(255)
  text("Delay:"+delay, 160, 50)
  text("Algorithm", 10, 50)
  text("Size: "+values.length, 320, 50)
  text("Shuffle", 480, 50)
  text("Start", 890, 50)
  text("Mute Sound", 1030, 50)
  text("Visualizer", 720, 50)
  //text(showData, 1100, 50)
  pop()

  if (visualizer == 0){
    for (let i = 0; i < values.length; i++) {
      noStroke();
      if (states[i] == 0) {
        fill('#E0777D');
      } else if (states[i] == 1) {
        if (!mute){
          let key = (map(values[i], 1, height, 1, 41))
          playNote(key+40)  
        }
        else{
          osc.fade(0, 0.1)
        }

        fill(255, 0, 0);
      } else {
        fill(255);
        //osc.fade(0, 1)
      }

      rect(i * w, height - values[i], w, values[i]);
      states[i] = -1
    }
  }
  else if (visualizer == 1){
    for (let i = 0; i < values.length; i++) {
      noStroke();
      if (states[i] == 0) {
        stroke('#E0777D');

      } else if (states[i] == 1) {
        if (!mute){
          let key = (map(values[i], 1, height, 1, 41))
          playNote(key+40)  
        }
        else{
          osc.fade(0, 0.1)
        }

        
        push()
        fill(255, 0, 0);
        noFill()
        strokeWeight(3)
        stroke(255, 0, 0)
        rect(i*w-w, height-values[i]-w, w*2, w*2)
        pop()
      } else {
        fill(255);
        //osc.fade(0, 1)
      }

      //rect(i * w, height - values[i], w, values[i]);
      circle(i*w, height-values[i], w)
      states[i] = -1
    }
  }
  else if (visualizer == 2){
    let off = 130
    for (var i=0;i<values.length;i++){
      colorMode(HSB)

      fill(values[i]*255/height+off, values[i]*255/height+off, values[i]*255/height+off)
      rect(i*w, 90, w, height)
    }
  }



  if (is_array_sorted(values) || canRun){
    osc.fade(0, 0.1)
    
  }
  if (is_array_sorted(values)){
    showData = "Done"
  }
 




}
