
let noDel = false


async function sleep(ms) {
  if (!noDel){
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
}
let nes = 0
let bsy = 200
async function swap(arr, a, b) {
  states[a] = 1
  states[b] = 1
  if (a % 1 != 0 || b % 1 !=0){
    console.log("WTF")
  }
  await DelayNew()

  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
}


async function DelayNew(){
  if (values.length > bsy){
    if (nes % floor(values.length/bsy) == 0){
      await sleep(delay);
      nes = 0
    }
  }
  else{
    await sleep(delay);
  }
  nes++
}

async function DelayDynamic(){
  if (values.length > bsy){
    if (nes % floor(values.length/bsy) == 0){
      await sleep(1);
      nes = 0
    }
  }
  else{
    await sleep(1);
  }
  nes++
}



//Merge Sort

async function merge(arr, l, m, r){
  let n1 = m-l+1
  let n2 = r-m

  let L = [];
  let R = [];

  for (var x=0;x<n1;x++){
    L.push(arr[l+x])
    
    
  }
  for (var y=0;y<n2;y++){
    R.push(arr[m+1+y])
    
  }
  x = 0
  y = 0
  let ene = 0
  while (y < n2 || x < n1){
    showData = "Checking"
    if (y < n2){
      y++
    }
    if (x < n1){
      x++
    }
    states[m+1+y] = 1
    states[l+x] = 1
    await DelayNew()
    ene++

  }

  let i=0
  let j=0;
  let k=l;
  while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            states[k] = 1
            //await sleep(1)
            i++;
        }
        else {
            arr[k] = R[j];
            states[k] = 1

            j++;
        }
        showData = "Merging"
        await DelayNew()
        k++;

    }
    while (i < n1) {
        arr[k] = L[i];
        showData = "Merging\nLeftovers"
        await DelayNew()
        i++;
        k++;
        states[k] = 1

    }

    while (j < n2) {
        arr[k] = R[j];
        showData = "Merging\nLeftovers"
        await DelayNew()
        j++;
        k++;
        states[k] = 1
    }

}

async function mergeSort(arr, l, r){
  if(l>=r){
        return;//returns recursively
    }
    let m = floor(l + (r-l)/2);


    await mergeSort(arr,l,m);
    await mergeSort(arr,m+1,r);
    await merge(arr,l,m,r);
}


//---------


//Quick Sort
async function quickSort(arr, start, end) {

  if (start >= end) {
    return;
  }
  showData = "Recursing"
  let index = await partition(arr, start, end);
  
  // Promise.all([quickSort(arr, start, index), quickSort(arr, index + 1, end)])
  
  await quickSort(arr, start, index)
  await quickSort(arr, index + 1, end)

}
async function partition(arr, low, high) {
  let p = floor((low+high)/2)
  let pivot = arr[p]

  let i=low-1
  let j=high+1
  showData = "partitioning"
  while (true){
    
    //states[i] = 1;
    //states[j] = 1;
    
    i++
    while (arr[i] < pivot){
      i++
      states[i] = 1
      states[p] = 1
      await DelayNew()
    }

    j--
    while (arr[j] > pivot){
      j--
      states[j] = 1
      states[p] = 1
      await DelayNew()
    }
    if (i >= j){
      return j
    }
    await swap(arr, i, j)



  }



}



//---


//Tim sort
let RUN = 10
async function insertionSort(arr, left, right)
{
    for (var i = left + 1; i <= right; i++)
    {
        let temp = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > temp)
        {
            arr[j+1] = arr[j];
            states[j+1] = 1
            showData = "Inserting\nSections"
            await DelayNew()
            j--;
        }
        arr[j+1] = temp;
        states[j+1] = 1
        await DelayNew()
    }
}

async function timSort(arr, n)
{

    // Sort individual subarrays of size RUN
    for (var i = 0; i < n; i+=RUN){
        await insertionSort(arr, i, min((i+RUN-1),(n-1)));
        //await quickSort(arr, i, min((i+RUN-1),(n-1)))
    }

    // Start merging from size RUN (or 32).
    // It will merge
    // to form size 64, then 128, 256
    // and so on ....
    for (var size = RUN; size < n;
                             size = 2*size)
    {

        // pick starting point of
        // left sub array. We
        // are going to merge
        // arr[left..left+size-1]
        // and arr[left+size, left+2*size-1]
        // After every merge, we
        // increase left by 2*size
        for (var left = 0; left < n;
                             left += 2*size)
        {

            // find ending point of
            // left sub array
            // mid+1 is starting point
            // of right sub array
            var mid = left + size - 1;
            var right = min((left + 2*size - 1),
                                            (n-1));

            // merge sub array arr[left.....mid] &
            // arr[mid+1....right]
              if(mid < right)
                await merge(arr, left, mid, right);

        }
    }
}



//----




//Radix Sort
let base = 4

async function QuadBuild(arr, output){
  let counters = []
  let countersOriginal = []
  showData = "Build\nArray"
  counters[0] = ceil((arr.length-1)/base)
  for (var i=1;i<base;i++){
    counters[i] = counters[i-1] + ceil((arr.length-1)/base)
  }
  counters[base-1] = arr.length
  countersOriginal = [...counters]
  let c = 1
  while(counters[0] > 0){
    counters[0]--
    states[counters[0]] = 1
    arr[counters[0]] = output[counters[0]]
    for (var j=0;j<counters.length;j++){

      if (counters[j] > 0 && counters[j] >= countersOriginal[j-1]){
        counters[j]--
        states[counters[j]] = 1
        arr[counters[j]] = output[counters[j]]
        await DelayNew()
      }
    }

  }
}


async function countingSort(arr, size, place){
  
  let output = new Array(size + 1).fill(0);
  let MAX = max(...arr);
  
  let freq = new Array(MAX + 1).fill(0);
  
  // Calculate count of elements
  for (let i = 0; i < size; i++){
      const num = floor(arr[i] / place) % base;
      
      freq[num]++;
      showData = "Counting\nelements"
  }
  
  // Calculate cummulative count
  for (let i = 1; i < base; i++){
      freq[i] += freq[i - 1];
      showData = "Cummulative\nCount"
  }

  // Place the elements in sorted order
  let f = [...freq]
  for (let i = size - 1; i >= 0; i--) {
      const num = floor(arr[i] / place) % base;
      output[freq[num] - 1] = arr[i];
      //states[freq[num] - 1] = 1
      showData = "Generating\nOutput"
      //await DelayNew()

      freq[num]--;
  }
  





  for (let i = 0; i < size; i++){

    states[i] = 1
    //arr[i] = output[i];
    showData = "Checking\nArray"
    await DelayNew()
    
  }

  await QuadBuild(arr, output)


}





async function radixSort(arr){
  let size = arr.length
  //Get the max element
  let MAX = max(...arr);
  
  //Sort the array using counting sort
  for(let i = 1; parseInt(MAX / i) > 0; i *= base){
    await countingSort(arr, size, i);
  }
}


//----

//Recursive Insetrtion
async function insertionSortRecursive(arr, n)
{   
    // Base case
    if (n <= 1)
        return;
  
    // Sort first n-1 elements
    await insertionSortRecursive(arr, n-1 );
  
    // Insert last element at its correct position
    // in sorted array.
    let last = arr[n-1];
    let j = n-2;
  
    /* Move elements of arr[0..i-1], that are
      greater than key, to one position ahead
      of their current position */
    while (j >= 0 && arr[j] > last)
    {   states[j+1] = 1
        await DelayNew()
        arr[j+1] = arr[j];
        j--;
    }
    arr[j+1] = last;
    await DelayNew()
}
//---

//Heap sort

async function heapify(arr, n, i){
    
    let largest = i; // Initialize largest as root
    let l = 2 * i + 1; // left = 2*i + 1
    let r = 2 * i + 2; // right = 2*i + 2
 
    // If left child is larger than root
    if (l < n && arr[l] > arr[largest]){
        largest = l;
    }    
 
    // If right child is larger than largest so far
    if (r < n && arr[r] > arr[largest]){
        largest = r;
    }
 
    // If largest is not root
    if (largest != i) {
        await swap(arr, i, largest);
        states[i] = 0
 
        // Recursively heapify the affected sub-tree
        await heapify(arr, n, largest);
    }
}


async function heapSort(arr, n)
{
    // Build heap (rearrange array)
    for (let i = n / 2 - 1; i >= 0; i--){
        showData = "Building Heap"
        await heapify(arr, n, i);

    }
 
    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        showData = "Re-Building"

        await swap(arr, 0, i);

 
        // call max heapify on the reduced heap
        await heapify(arr, i, 0);
    }
}

///-----Shell sort

async function ShellSort(arr, n){
  // Start with a big gap, then reduce the gap
    for (var gap = floor(n/2); gap > 0; gap = floor(gap/2))
    {
        // Do a gapped insertion sort for this gap size.
        // The first gap elements a[0..gap-1] are already in gapped order
        // keep adding one more element until the entire array is
        // gap sorted 
        for (var i = gap; i < n; i += 1)
        {
            // add a[i] to the elements that have been gap sorted
            // save a[i] in temp and make a hole at position i
            showData = "Gap is\n"+gap
            var temp = arr[i];
            states[i] = 1
  
            // shift earlier gap-sorted elements up until the correct 
            // location for a[i] is found
            var j;            
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap){
              arr[j] = arr[j - gap];
              states[j] = 1
              //await sleep(1)
            }
              
            //  put temp (the original a[i]) in its correct location
            arr[j] = temp;
            states[j] = 1
            if (values.length > bsy){
              if (nes % 2 == 0){
                await DelayNew()
              }
              nes++
            }
            else{
              await DelayNew()
            } 

        }
    }
}


///Comb sort
function is_array_sorted(arr) {
      var sorted = true;
      for (var i = 0; i < arr.length - 1; i++) {
          if (arr[i] > arr[i + 1]) {
              sorted = false;
              break;
          }
      }
      return sorted;
  }
async function combSort(arr)
{
 
 
  var iteration_count = 0;
  var gap = arr.length - 2;
  var decrease_factor = 1.25;
 
  // Repeat iterations Until array is not sorted
  
  while (!is_array_sorted(arr)) 
  {
      // If not first gap  Calculate gap
      if (iteration_count > 0)
         gap = (gap == 1) ? gap : Math.floor(gap / decrease_factor);
 
  // Set front and back elements and increment to a gap
      var front = 0;
      var back = gap;
      while (back <= arr.length - 1) 
      {
          // Swap the elements if they are not ordered
        
          if (arr[front] > arr[back])
          {
              var temp = arr[front];
              arr[front] = arr[back];
              states[front] = 1
              await DelayNew()
              states[back] = 1
              arr[back] = temp;
              await DelayNew()
          }
 
          // Increment and re-run swapping
        
          front += 1;
          back += 1;
          showData = "Gap is\n"+gap
      }
      iteration_count += 1;
  }
}



//Merge sort in place
let es = 0
async function swapNoDelay(arr, a, b) {
  states[a] = 1
  states[b] = 1
  if (es % 5==0){
    await DelayNew()
    es = 0
  }
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
  es++
}

async function insertSort(arr, l, h){
  let tmp
  let loc
  for (var i=l+1;i<h;i++){
    tmp = arr[i]
    loc = i-1
    while (loc >= l){
      if (arr[loc] > tmp){
        await swap(arr, loc, loc+1)
      }
      else{
        break
      }
      loc--
    }
  }
}

async function swapTo(arr, pos, dest){
  let dir
  if (pos < dest){
    dir = 1
  }
  else{
    dir = -1
  }
  let tmp

  while (pos != dest){
    tmp = pos+dir
    await swap(arr, pos, tmp)
    pos = tmp
  }
}




async function mergeShaker(arr, l, m, h){
  h--;
  let dir = true;
  while (l!=m && m<=h) {
    if (dir) {
      if (arr[l] > arr[m]) {
        await swapTo(arr, m, l);
        m++;
      }
      l++;
      dir = false;
    }
    else {
      if (arr[m - 1] > arr[h]) {
        await swapTo(arr, m - 1, h);
        m--;
      }
      h--;
      dir = true;
    }
  }
}


async function shakerMergeSort(arr, l, h){
  let m = floor((l+h) / 2)
  if (l >= m){
    return
  }
  await shakerMergeSort(arr, l, m)
  await shakerMergeSort(arr, m, h)
  await mergeShaker(arr, l, m, h)
}

//WEave

async function weaveMerge(arr, min, mid, max){
  let i = 1;
    let target = (mid - min);
      
      while(i <= target) {
          await swapTo(arr, mid + i, min + (i * 2) - 1);
          i++;
      }
  await insertSort(arr, min, max+1)
}

async function weaveMergeSort(arr, l, h){
  let m = floor((l+h) / 2)
  if (l >= m){
    return
  }
  await weaveMergeSort(arr, l, m)
  await weaveMergeSort(arr, m, h)
  await weaveMerge(arr, l, m, h)
}


//Gravity Sort
function analyzeMax(arr, l, h){
  let max = arr[l]
  let tmp
  for (let i = l + 1; i < h; i++) {
    tmp = arr[i];
    if (tmp > max)
      max = tmp;
  }

  return max;
}
async function GravitySort(arr, l, h){
  let max = analyzeMax(arr, l, h)
  let sz = h-l
  let abacus = new Array(sz)
  for (var i=0;i<sz;i++){
    abacus[i] = new Array(max)
  }
  for (let i = 0; i < sz; i++) {
    let tmp = arr[l + i];
    for (let j = 0; j < tmp; j++){
      abacus[i][j] = -1;
    }
    //Fill rest with zeroes
    for (let j = tmp; j < max; j++) {
      abacus[i][j] = 0;
    }
  }
  for (let i = max - 1; i >= 0; i--) {
    showData = "Magic"
    let sum = 0;
    for (let j = 0; j < sz; j++) {
      if (abacus[j][i]) {
        sum++;
        abacus[j][i] = 0;
        arr[l + j]--;
        states[l+j] = 1
        
        //await sleep(delay)
      }
      //await sleep(delay)
    }
    for (let j = sz - 1; j >= sz - sum; j--) {
      abacus[j][i] = -1;
      arr[l + j]++;
      //states[l+j] = 1

      
    }

    await DelayNew()
  }
}


//Quick Insertion



async function partitionQuickInsert(arr, low, high) {
  let p = floor((low+high)/2)
  let pivot = arr[p]
  let i=low-1
  let j=high+1
  if (high-low < 10){
    return false
  }

  while (true){
    
    states[i] = 1;
    states[j] = 1;
    i++
    while (arr[i] < pivot){
      i++
      states[i] = 1
      states[p] = 1
      await DelayNew()
    }

    j--
    while (arr[j] > pivot){
      j--
      states[j] = 1
      states[p] = 1
      await DelayNew()
    }
    if (i >= j){
      return j
    }
    await swap(arr, i, j)



  }

}

let xas

async function QISort(){
  await QuickInsert(values, 0, values.length-1)
  await insertSort(values, 0, values.length)
}
async function QuickInsert(arr, start, end){

  if (start >= end) {
    
    return;
  }
  let index = await partitionQuickInsert(arr, start, end);
  

  if (!index){
    //await insertSort(values, start, end)
    //await HeapSort(start, end)
    //await mergeSort(arr, start, end)
    return
  }
  //states[index] = -1;

  // Promise.all([quickSort(arr, start, index), quickSort(arr, index + 1, end)])
  await QuickInsert(arr, start, index)
  await QuickInsert(arr, index + 1, end)
}


//IntroSort


 
 
    // The utility function to insert the data
    async function dataAppend(temp)
    {
        values[n] = temp;
        await DelayNew()
        n++;
    }
 
    // The utility function to swap two elements
    
 
    // To maxHeap a subtree rooted with node i which is
    // an index in a[]. heapN is size of heap
    async function maxHeap(array, i, heapN, begin)
    {
        let temp = array[begin + i - 1];
        let child;
 
        while (i <= floor(heapN / 2)) {
            child = 2 * i;
 
            if (child < heapN && array[begin + child - 1] < array[begin + child]){
                child++;
            }
 
            if (temp >= array[begin + child - 1]){
                break;
            }
 
            array[begin + i - 1] = array[begin + child - 1];
            await DelayNew()
            i = child;
        }
        array[begin + i - 1] = temp;
    }
 
    // Function to build the heap (rearranging the array)
    async function Heapify(array, begin, end, heapN)
    {
        for (let i = floor((heapN) / 2); i >= 1; i--){
            await maxHeap(array, i, heapN, begin);
        }
    }
 
    // main function to do heapsort
    async function HeapSort(array, begin, end)
    {
        let heapN = end - begin;
 
        // Build heap (rearrange array)
        await Heapify(array, begin, end, heapN);
 
        // One by one extract an element from heap
        for (let i = heapN; i >= 1; i--) {
 
            // Move current root to end
            await swap(array, begin, begin + i);
 
            // call maxHeap() on the reduced heap
            await maxHeap(array, 1, i, begin);
        }
    }
 
  async function floorLogBaseTwo(a) {
        return floor(Math.floor(Math.log(a) / Math.log(2)));
    }
    
    // Swaps the median of arr[left], arr[mid], and arr[right] to index left.
    // taken from gcc source code found here: https://gcc.gnu.org/onlinedocs/gcc-4.7.2/libstdc++/api/a01462_source.html
    async function gccmedianof3(arr, left, mid, right) {
        if (arr[left] < arr[mid]) {
            if (arr[mid] < arr[right]) {
                await swap(arr, left, mid);
            }
            else if (arr[left] < arr[right]) {
                await swap(arr, left, right);
            }
        }
        else if (arr[left] < arr[right]) {
            middle = left;
            states[left] = 1
            return arr[left];
        }
        else if (arr[mid] < arr[right]) {
            await swap(arr, left, right);
        }
        else {
            await swap(arr, left, mid);
        }
        middle = left;
        states[left] = 1
        return arr[left];
    }
    
    async function medianof3(arr, left, mid, right) {
        if(arr[right] < arr[left]) {
            await swap(arr, left, right); 
        }
        if(arr[mid] < arr[left]) {
            await swap(arr, mid, left);
        }
        if(arr[right] < arr[mid]) {
            await swap(arr, right, mid);
        }
        middle = mid;
        states[mid] = 1
        return arr[mid];
    }
    
    
    let sizeThresh = 16
    async function introsortLoop (a, lo, hi, depthLimit) {
        while (hi - lo > sizeThresh) {
            if (depthLimit == 0) {
                await HeapSort(a, lo, hi)
                return;
            }
            depthLimit--;
            let p = await partition(a, lo, hi);
            await introsortLoop(a, p+1, hi, depthLimit);
            hi = p;
        }
        return;
    }
    
    async function sortDataIntro(array, length) {

        await introsortLoop(array, 0, length, 2 * await floorLogBaseTwo(length));
        await insertSort(array, 0, length+1)
    }

//Quick-Merge Sort
let RUNQ = 64
async function quickMergeSort(arr, n)
{

    // Sort individual subarrays of size RUN
    for (var i = 0; i < n; i+=RUNQ){
        //await insertionSort(arr, i, min((i+RUN-1),(n-1)));
        await quickSort(arr, i, min((i+RUNQ-1),(n-1)))
    }

    // Start merging from size RUN (or 32).
    // It will merge
    // to form size 64, then 128, 256
    // and so on ....
    for (var size = RUNQ; size < n;
                             size = 2*size)
    {

        // pick starting point of
        // left sub array. We
        // are going to merge
        // arr[left..left+size-1]
        // and arr[left+size, left+2*size-1]
        // After every merge, we
        // increase left by 2*size
        for (var left = 0; left < n;
                             left += 2*size)
        {

            // find ending point of
            // left sub array
            // mid+1 is starting point
            // of right sub array
            var mid = left + size - 1;
            var right = min((left + 2*size - 1),
                                            (n-1));

            // merge sub array arr[left.....mid] &
            // arr[mid+1....right]
              if(mid < right)
                await merge(arr, left, mid, right);
        }
    }
}
let RUNH = 32
async function mergeHeapSort(arr, n)
{

    // Sort individual subarrays of size RUN
    for (var i = 0; i < n; i+=RUNH){
        //await insertionSort(arr, i, min((i+RUN-1),(n-1)));
        await HeapSort(i, min((i+RUNH-1),(n-1)))
    }

    // Start merging from size RUN (or 32).
    // It will merge
    // to form size 64, then 128, 256
    // and so on ....
    for (var size = RUNH; size < n;
                             size = 2*size)
    {

        // pick starting point of
        // left sub array. We
        // are going to merge
        // arr[left..left+size-1]
        // and arr[left+size, left+2*size-1]
        // After every merge, we
        // increase left by 2*size
        for (var left = 0; left < n;
                             left += 2*size)
        {

            // find ending point of
            // left sub array
            // mid+1 is starting point
            // of right sub array
            var mid = left + size - 1;
            var right = min((left + 2*size - 1),
                                            (n-1));

            // merge sub array arr[left.....mid] &
            // arr[mid+1....right]
              if(mid < right)
                await merge(arr, left, mid, right);
        }
    }
}


//Dueling Quick Sort
  
    async function dualPivot(array, left, right, divisor) {
        let length = right - left;
        
        // insertion sort for tiny array
        if(length < 10) {
          await insertSort(array, left, right+1)
          return;
        }
        
        let third = ceil(length / divisor)
        
        // "medians"
        let med1 = left  + third;
        let med2 = right - third;
        
        if(med1 <= left) {
            med1 = left + 1;
        }
        if(med2 >= right) {
            med2 = right - 1;
        }
        if(array[med1] < array[med2]) {
            await swap(array, med1, left,);
            await swap(array, med2, right);
        }
        else {
            await swap(array, med1, right);
            await swap(array, med2, left);
        }
        
        // pivots
        let pivot1 = array[left];
        let pivot2 = array[right];
        
        // pointers
        let less  = left  + 1;
        let great = right - 1;
        
        // sorting
        for(let k = less; k <= great; k++) {
            if(array[k] < pivot1) {
                await swap(array, k, less++);
            }
            else if(array[k] > pivot2 == 1) {
                while(k < great && array[great] > pivot2) {
                    great--;
                    await DelayNew()
                    states[great] = 1
                }
                await swap(array, k, great--);
                
                if(array[k]<pivot1) {
                    await swap(array, k, less++);
                }
            }
        }
        
        // swaps
        let dist = great - less;
        
        if(dist < 13) {
            divisor++;
        }
        await swap(array, less  - 1, left);
        await swap(array, great + 1, right);
        
        // subarrays
        await dualPivot(array, left,   less - 2, divisor);
        if(pivot1 < pivot2) {
            await dualPivot(array, less, great, divisor);
        }
        await dualPivot(array, great + 2, right, divisor);
    }
    
    async function DuelPivotQuickSort(array, sortLength){
        await dualPivot(array, 0, sortLength - 1, 3);
    }



//Bitonic Hell


async function exchange(arr, i, j, d){

  if (d==(arr[i] > arr[j])){
    await swap(arr, i, j)
  }

}

function greatestPowerOfTwoLessThan(n)
{
        let k=1;
        while (k>0 && k<n){
            k=k<<1;
          }
        return k>>>1;
}


async function mergeBit(arr, l, c, d)  
{  
    let k,i;  
    if (c>1)  
    {  
        k = round(greatestPowerOfTwoLessThan(c));  
        for (i=l; i<l+c-k; i++){ 
            await exchange(arr, i, i+k, d);  
        }
        await mergeBit(arr, l, k, d);  
        await mergeBit(arr, l+k, c-k, d);  
    }  
} 


async function bitonicSort(arr, l, c, d)  
{  
    let k;  
    if (c>1)  
    {  
        k = round(c/2);  
        await bitonicSort(arr, l, k, !d);  
        await bitonicSort(arr, l+k, k, d);  
        await mergeBit(arr,l, c, d);  
    }  
}  
   
async function BitonicSort(arr, n, order)  
{  
    await bitonicSort(arr, 0, n, order);  
    await insertSort(values, 0, values.length)
}  



//Bubble Sort
async function bubbleSort(arr)
{
  for (i = 0; i < arr.length-1; i++)      

     // Last i elements are already in place   
     for (j = 0; j < arr.length-i-1; j++)
     {
         if(arr[j] > arr[j+1]){
             await swap(arr, j, j+1);
          }
     }
} 


//Bogo Sort

function is_array_sortedMin(arr, l, r) {
      var sorted = true;
      for (var i = l; i < r; i++) {
          if (arr[i] > arr[i + 1]) {
              sorted = false;
              break;
          }
      }
      return sorted;
  }


function bogoShuffle(arr, l, r){
  
    for (var i=l;i<r;i++){
      let a = i
      let b = round(random(i, r))

      let temp = arr[i];
      arr[a] = arr[b];
      arr[b] = temp;
    }
  
}


async function BogoSort(arr){
    while (!is_array_sorted(arr)){
      bogoShuffle(arr, 0, arr.length-1)
      await sleep(delay)
      states[round(random(0, arr.length-1))] = 1
    }
  
}


async function LessBogoSort(arr){
  for (let i = 0; i < arr.length; i++) {
            let ex = arr.slice(i, arr.length)
            let m = Math.min.apply(Math, ex)
            while (arr[i] != m){
                bogoShuffle(arr, i, arr.length-1)
                states[i] = 1
                states[round(random(i, arr.length-1))] = 1
                await sleep(delay)
            }

      }
}


//Weaved Merge sort ...?

async function WeavedMerge(array, tmp, length, residue, modulus) {
        if (residue+modulus >= length){
            return;
          }
            
        let low = residue;
        let high = residue+modulus;
        let dmodulus = floor(modulus<<1);

        await WeavedMerge(array, tmp, length, low, dmodulus);
        await WeavedMerge(array, tmp, length, high, dmodulus);

        states[high] = 1
        states[low] = 1
        let nxt = residue;
        for (; low < length && high < length; nxt+=modulus) {
            if (array[low] > array[high] || array[low] == array[high] && low > high) {
              tmp[nxt] = array[high]
              high += dmodulus;
            } else {
                tmp[nxt] = array[low]
                low += dmodulus;
            }
        }

        if (low >= length) {
            while (high < length) {
              tmp[nxt] = array[high]

                nxt += modulus;
                high += dmodulus;
            }
        } else {
            while (low < length) {
              tmp[nxt] = array[low]
                nxt += modulus;
                low += dmodulus;
            }
        }


        for (let i = residue; i < length; i+=modulus) {
          array[i] = tmp[i]
          states[i] = 1
          await DelayNew()
        }
    }


//Diamond Sort
async function DiamondSort(arr, start, stop, merge){
        if (stop - start == 2) {
            if (arr[start] > arr[stop-1]){
              await swap(arr, start, stop-1)
            }
        } else if (stop - start >= 3) {
            let div = (stop - start) / 4;
            let mid = floor((stop - start) / 2 + start)
            if (merge) {
                await DiamondSort(arr, start, mid, true);
                await DiamondSort(arr, mid, stop, true);
            }
            await DiamondSort(arr, floor(div) + start, floor(div * 3) + start, false);
            await DiamondSort(arr, start, mid, false);
            await DiamondSort(arr, mid, stop, false);
            await DiamondSort(arr, floor(div) + start, floor(div * 3) + start, false);

          }
}


//Grail
async function grailSort(array, length){
  let comp = new GrailComparator()
  let extBuffer = new Array(512)
  let grail = new GrailSort(comp)
  //grail.grailCommonSort(array, 0, length, extBuffer, extBuffer.length)
  grail.grailSortInPlace(array, 0, array.length)

}


async function grailSortOut(array, length){
  let comp = new GrailComparator()
  let extBuffer = new Array(512)
  let grail = new GrailSort(comp)
  grail.grailCommonSort(array, 0, length, extBuffer, extBuffer.length)
  //grail.grailSortInPlace(array, 0, array.length)

}


//Binary Insertion
async function binarySearch(a, item,
                 low, high)
{

    if (high <= low){
        if(item > a[low]){
          return (low+1)
        }
        else{
          return low
        }
    }
 
    let mid = floor((low + high) / 2);
    states[mid] = 1
    states[low] =  1
    states[high] = 1
    await DelayNew()
    if (item == a[mid]){
        return mid + 1;
    }
 
    if (item > a[mid]){
        return await binarySearch(a, item,
                            mid + 1, high);
    }
    return await binarySearch(a, item, low, mid - 1);
}
 
// Function to sort an array a[] of size 'n'
async function insertionSortBinary(a, s, n)
{
    let i, loc, j, k, selected;
 
    for (i = s+1; i < n; ++i)
    {
        j = i - 1;
        selected = a[i];
 
        // find location where selected sould be inseretd
        loc = await binarySearch(a, selected, s, j);
 
        // Move all elements after location to create space
        while (j >= loc)
        {
            await DelayNew()
            a[j + 1] = a[j];
            states[j+1] = 1
            states[j] = 1
            j--;
        }
        a[j + 1] = selected;
    }
}


//Selection Sort finally
async function selectionSort(arr, n) 
{ 
    let i, j, min_idx; 
  
    // One by one move boundary of unsorted subarray 
    for (i = 0; i < n-1; i++) 
    { 
        // Find the minimum element in unsorted array 
        min_idx = i; 
        for (j = i+1; j < n; j++){
          if (arr[j] < arr[min_idx]){ 
              min_idx = j; 
              states[j] = 1
              await DelayNew()
            }
        }
  
        // Swap the found minimum element with the first element 
        await swap(arr, min_idx, i); 
    } 
} 

//Room Sort
async function insertTo(array, a, b) {
        let val = array[a];
        a--;
        while (a >= b && array[a] > val) {
          array[a+1] = array[a]
          states[a+1] = 1
          states[a] = 1
            a--;
            await DelayNew()
        }
        array[a+1] = val
    }
    
    
    async function roomSort(array, currentLength) {
        let roomLen = floor(Math.sqrt(currentLength)) + 1;

        let end, i;
        for (end = currentLength; end > roomLen; end -= roomLen) {
          await insertSort(array, 0, roomLen)
            for (i = roomLen; i < end; i++) {
                await insertTo(array, i, i - roomLen);
            }
        }
        await insertSort(array, 0, end)
    }


//---- Andrey Sort

async function aSort(arr, a, b){
  while (b>1){
    let k = 0
    for (var i=1;i<b;i++){
      if (arr[a+k] > arr[a+i]){
        k = i
      }
    }
    await swap(arr, a, a+k)
    a++
    b--
  }
}

async function aSwap(arr, arr1, arr2, l){
  while (l-- > 0){
    await swap(arr, arr1++, arr2++)
  }
}


async function backmerge(arr, arr1, l1, arr2, l2) {
        let arr0 = arr2 + l1;
        for(;;) {
            if(arr[arr1] > arr[arr2]) { 
                await swap(arr, arr1--, arr0--);
                if(--l1 == 0) {
                    return 0;
                }
            }
            else {
                await swap(arr, arr2--, arr0--);
                if(--l2 == 0) {
                    break;
                }
            }
        }
        let res = l1;
        do {
            await swap(arr, arr1--, arr0--);
        } while(--l1 != 0);
        return res;
    }


 async function rmerge(arr, a, l, r) {
        for(let i = 0; i < l; i += r) {
            // select smallest arr[p0+n*r]
            let q = i;
            for(let j = i + r; j < l; j += r) {
                if(arr[a + q] > arr[a + j]) {
                    q = j;
                    await DelayNew()
                    states[a+q] = 1
                    states[a+j] = 1
                }
            }       
            if(q != i) {
                await aSwap(arr, a + i, a + q, r); // swap it with current position
            }
            if(i != 0) {
                await aSwap(arr, a + l, a + i, r);  // swap current position with buffer
                await backmerge(arr, a + (l + r - 1), r, a + (i - 1), r); // buffer :merge: arr[i-r..i) -> arr[i-r..i+r)
            }
        }
    }


    async function rbnd(len) {
        len = floor(len / 2);
        let k = 0;
        for(let i = 1; i < len; i *= 2) {
            k++;
        }
        len /= k;

        for(k = 1; k <= len; k *= 2){;
          return k
        };
    }



async function msort(arr, a, len) {
        if(len < 12) {
            await aSort(arr, a, len);
            return;
        }
        
        let r = await rbnd(len);
        let lr = floor((len / r - 1) * r);
        
        for(let p = 2; p <= lr; p += 2) {
            if(arr[a + (p - 2)] > arr[a + (p - 1)]) {
                await swap(arr, a + (p - 2), a + (p - 1));
            }
            if((p & 2) != 0) {
                continue;
            }
            
            await aSwap(arr, a + (p - 2), a + p, 2);
            
            let m = len - p;
            let q = 2;
            
            for(;;) {
                let q0 = floor(2 * q);
                if(q0 > m || (p & q0) != 0) {
                    break;
                }
                await backmerge(arr, a + (p - q - 1), q, a + (p + q - 1), q);
                q = q0;
            }
            
            await backmerge(arr, a + (p + q - 1), q, a + (p - q - 1), q);
            let q1 = q;
            q *= 2;
            
            while((q & p) == 0) {
                q *= 2;
                await rmerge(arr, a + (p - q), q, q1);
            }
        }
        
        let q1 = 0;
        for(let q = r; q< lr; q *= 2) {
            if((lr & q) != 0) {
                q1 += q;
                if(q1 != q) {
                    await rmerge(arr, a + (lr - q1), q1, r);
                }
            }
        }
        
        let s = len - lr;
        await msort(arr, a + lr, s);
        await aSwap(arr, a, a + lr, s);
        s += await backmerge(arr, a + (s - 1), s, a + (lr - 1), lr - s);
        await msort(arr, a, s);
    }
    


//BPM Buffered Merge Sort


async function shiftBW(array, a, m, b) {
    while(m > a){await swap(array, --b, --m)};
  }
  
  async function multiSwap(array, a, b, len) {
    for(let i = 0; i < len; i++)
      await swap(array, a+i, b+i);
  }
    
    async function rotateBPM(array, a, m, b) {
        let l = m-a
        let r = b-m;
    
        while(l > 0 && r > 0) {
      if(r < l) {
        await multiSwap(array, m-r, m, r);
        b -= r;
        m -= r;
        l -= r;
            }
            else {
        await multiSwap(array, a, m, l);
        a += l;
        m += l;
        r -= l;
            }
        }
    }
  
  async function inPlaceMerge(array, a, m, b) {
    let i = a, j = m, k;
    while(i < j && j < b) {
      if(array[i] > array[j]) {
        k = j;
        while(++k < b && array[i] > array[k]){;
        
        await rotateBPM(array, i, j, k);
        }
        i += k-j;
        j = k;

      } 
      else i++;
    }
  }
  
  async function medianOfThree(array, a, b) {
    let m = a+floor((b-1-a)/2);
    if(array[a] > array[m])
      await swap(array, a, m);
    
    if(array[m] > array[b-1]) {
      await swap(array, m, b-1);
      
      if(array[a] > array[m])
        return;
    }
    
    await swap(array, a, m);
  }
  
  //lite version
  async function medianOfMedians(array, a, b, s) {
    let end = b
    let start = a
    let i = 0
    let j = 0;
    let ad = true;
    
    while(end - start > 1) {
      j = start;
      for(i = start; i+2*s <= end; i+=s) {
        i = floor(i)
        await insertSort(array, i, i+s);
        await swap(array, j++, floor(i+s/2));
      }
      if(i < end) {
        await insertSort(array, i, end);
        await swap(array, j++, floor(i+(end-(ad ? 1 : 0)-i)/2));
        if((end-i)%2 == 0) ad = !ad;
      }
      end = j;
    }
  }
  
  async function partitionBPM(array, a, b) {
        let i = a
        let j = b;
        states[a] = 1
        while(true) {
          do {
            i++;
            states[i] = 1
            await DelayNew()
                  
          }
          while(i < j && array[i] > array[a]);
          
          do {
            j--;
            states[j] = 1
            await DelayNew()
          }
            while(j >= i && array[j] < array[a]){;
        
            if(i < j) {
              await swap(array, i, j)
            }
            else      {
              return j
            }
          }
        } 
    }
  
  async function quickSelect(array, a, b, m) {
    let badPartition = false, mom = false;
    let m1 = floor((m+b+1)/2);
    
    while(true) {
      if(badPartition) {
        await medianOfMedians(array, a, b, 5);
        mom = true;
      }
      else await medianOfThree(array, a, b);
      
      let p = await partitionBPM(array, a, b);
      await swap(array, a, p);
      
      let l = Math.max(1, p-a);
      let r = Math.max(1, b-(p+1));
      badPartition = !mom && (l/r >= 16 || r/l >= 16);
      if(p >= m && p < m1) return p;
      else if(p < m) a = p+1;
      else           b = p;
    }
  }
  
  async function mergeBPM(array, a, m, b, p) {
    let i = a
    let j = m;
    
    while(i < m && j < b) {
      if(array[i] <= array[j])
        await swap(array, p++, i++);
      else 
        await swap(array, p++, j++);
    }
    
    while(i < m) await swap(array, p++, i++);
    while(j < b) await swap(array, p++, j++);
  }
  
  async function mergeFW(array, p, a, m, b) {
    let i = a, j = m;
    while(i < m && j < b) {
      if(array[i] <= array[j])
        await swap(array, p++, i++);
      else 
        await swap(array, p++, j++);
    }
    
    if(i < m) return i;
    else      return j;
  }
  
  async function getMinLevel(n) {
    while(n >= 32) {n = floor((n+3)/4)};
    return n;
  }
  
  async function mergeSortBPM(array, a, b, p) {
    let len = b-a;
    if(len < 2) return;
    
    let i, pos, j = await getMinLevel(len);
    
    for(i = a; i+j <= b; i+=j)
      await insertionSortBinary(array, i, i+j);
    await insertionSortBinary(array, i, b);
    
    while(j < len) {
      pos = p;
      for(i = a; i+2*j <= b; i+=2*j, pos+=2*j){
        //console.log("ee")
        await mergeBPM(array, floor(i), floor(i+j), floor(i+2*j), floor(pos));
      }
      if(i + j < b)
        await mergeBPM(array, floor(i), floor(i+j), floor(b), floor(pos));
      else
        while(i < b) await swap(array, i++, pos++);
      
      j *= 2;
      
      pos = a;
      for(i = p; i+2*j <= p+len; i+=2*j, pos+=2*j)
        await mergeBPM(array, floor(i), floor(i+j), floor(i+2*j), floor(pos));
      if(i + j < p+len)
        await mergeBPM(array, floor(i), floor(i+j), floor(p+len), floor(pos));
      else
        while(i < p+len) await swap(array, i++, pos++);
      
      j *= 2;
    }
  }
  
  async function BPMsort(array, a, b) {
    let minLvl = floor(Math.sqrt(b-a));
    let m = floor((a+b+1)/2);
    await mergeSortBPM(array, m, b, a);
    
    while(m-a > minLvl) {
      let m1 = floor((a+m+1)/2);
      m1 = floor(await quickSelect(array, a, m, m1));
      await mergeSortBPM(array, m1, m, a);
      
      let bSize = floor(m1-a);
      let m2 = floor(Math.min(m1+bSize, b));
      m1 = floor(await mergeFW(array, a, m1, m, m2));
      
      while(m1 < m) {
        await shiftBW(array, m1, m, m2);
        m1 = floor(m2-(m-m1));
        a  = floor(m1-bSize);
        m  = floor(m2);
        
        if(m == b) break;
        
        m2 = floor(Math.min(m2+bSize, b));
        m1 = floor(await mergeFW(array, a, m1, m, m2));
      }
      m = floor(m1);
      a = floor(m1-bSize);
    }
    await insertionSortBinary(array, a, m);
    await inPlaceMerge(array, a, m, b);
    await insertionSortBinary(array, a, b);
  }
    
    async function BPM(array, length) {
      await BPMsort(array, 0, length);
    }

