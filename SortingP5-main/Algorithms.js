
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let nes = 0
let bsy = 200
async function swap(arr, a, b) {
  states[a] = 1
  states[b] = 1
  
  await DelayNew()

  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
  nes++
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
    if (y < n2){
      y++
    }
    if (x < n1){
      x++
    }
    states[m+1+y] = 1
    states[l+x] = 1
    if (values.length > bsy){
      if (ene % 2==0){
        await DelayNew()
      }
    }
    else{
      await DelayNew()
    }
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
        if (values.length > bsy){
          if (k%2==0){
            await DelayNew()
          }
        }
        else{
          await DelayNew()
        }
        k++;

    }
    while (i < n1) {
        arr[k] = L[i];
        if (values.length > bsy){
          if (k%2==0){
            await DelayNew()
          }
        }
        else{
          await DelayNew()
        }
        i++;
        k++;
        states[k] = 1

    }

    while (j < n2) {
        arr[k] = R[j];
        if (values.length > bsy){
          if (k%2==0){
            await DelayNew()
          }
        }
        else{
          await DelayNew()
        }
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
  let index = await partition(arr, start, end);
  //states[index] = -1;

  // Promise.all([quickSort(arr, start, index), quickSort(arr, index + 1, end)])
  await quickSort(arr, start, index)
  await quickSort(arr, index + 1, end)

}

async function partition(arr, low, high) {
  let pivot = arr[low]
  let i=low-1
  let j=high+1


  while (true){
    
    states[i] = 1;
    states[j] = 1;
    i++
    while (arr[i] < pivot){
      i++
    }

    j--
    while (arr[j] > pivot){
      j--
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
async function countingSort(arr, size, place){
  
  let output = new Array(size + 1).fill(0);
  let MAX = max(...arr);
  
  let freq = new Array(MAX + 1).fill(0);
  
  // Calculate count of elements
  for (let i = 0; i < size; i++){
      const num = floor(arr[i] / place) % base;
      
      freq[num]++;
  }
  
  // Calculate cummulative count
  for (let i = 1; i < base; i++){
      freq[i] += freq[i - 1];
  }

  // Place the elements in sorted order
  let f = [...freq]
  for (let i = size - 1; i >= 0; i--) {
      const num = floor(arr[i] / place) % base;
      output[freq[num] - 1] = arr[i];
      states[freq[num] - 1] = 1
      
      await DelayNew()

      freq[num]--;
  }
  





  // while (e >= 0 || n < size){
  //   states[e] = 1
  //   states[n] = 1
  //   await sleep(delay)
  //   states[e] = -1
  //   states[n] =
  //   e--
  //   n++
  // }
  
  //Copy the output array
  




  for (let i = 0; i < size; i++){

    states[i] = 1
    arr[i] = output[i];
    if (i%2 == 0){
      await DelayNew()
    }
  }

  

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
async function heapifyShuffle(arr, n, i){

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
        await swapNoDelay(arr, i, largest);
        states[i] = 0
 
        // Recursively heapify the affected sub-tree
        await heapifyShuffle(arr, n, largest);
    }
}

async function heapSort(arr, n)
{
    // Build heap (rearrange array)
    for (let i = n / 2 - 1; i >= 0; i--){
        await heapify(arr, n, i);

    }
 
    // One by one extract an element from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
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
      }
      iteration_count += 1;
  }
}


///Introsort

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
  let pivot = arr[low]
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
    }

    j--
    while (arr[j] > pivot){
      j--
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
        await sleep(delay)
        n++;
    }
 
    // The utility function to swap two elements
    
 
    // To maxHeap a subtree rooted with node i which is
    // an index in a[]. heapN is size of heap
    async function maxHeap(i, heapN, begin)
    {
        let temp = values[begin + i - 1];
        let child;
 
        while (i <= floor(heapN / 2)) {
            child = 2 * i;
 
            if (child < heapN && values[begin + child - 1] < values[begin + child]){
                child++;
            }
 
            if (temp >= values[begin + child - 1]){
                break;
            }
 
            values[begin + i - 1] = values[begin + child - 1];
            await DelayNew()
            i = child;
        }
        values[begin + i - 1] = temp;
    }
 
    // Function to build the heap (rearranging the array)
    async function Heapify(begin, end, heapN)
    {
        for (let i = floor((heapN) / 2); i >= 1; i--){
            await maxHeap(i, heapN, begin);
        }
    }
 
    // main function to do heapsort
    async function HeapSort(begin, end)
    {
        let heapN = end - begin;
 
        // Build heap (rearrange array)
        await Heapify(begin, end, heapN);
 
        // One by one extract an element from heap
        for (let i = heapN; i >= 1; i--) {
 
            // Move current root to end
            await swap(values, begin, begin + i);
 
            // call maxHeap() on the reduced heap
            await maxHeap(1, i, begin);
        }
    }
 
    // function that implements insertion sort
    async function insertionSortIntro(left, right)
    {
 
        for (let i = left; i <= right; i++) {
            let key = values[i];
            let j = i;
 
            // Move elements of arr[0..i-1], that are
            // greater than the key, to one position ahead
            // of their current position
            while (j > left && values[j - 1] > key) {
              states[j] = 1
                values[j] = values[j - 1];
                await DelayNew()
                j--;
            }
            values[j] = key;
            await DelayNew()
        }
    }
 
    // Function for finding the median of the three elements
    async function findPivot(a1, b1, c1)
    {
        let max = Math.max(Math.max(values[a1], values[b1]), values[c1]);
        let min = Math.min(Math.min(values[a1], values[b1]), values[c1]);
        let median = max ^ min ^ values[a1] ^ values[b1] ^ values[c1];
        if (median == values[a1]){
            return a1;
        }
        if (median == values[b1]){
            return b1;
        }
        return c1;
    }
 
    // This function takes the last element as pivot, places
    // the pivot element at its correct position in sorted
    // array, and places all smaller (smaller than pivot)
    // to the left of the pivot
    // and greater elements to the right of the pivot
    async function Partition(low, high)
    {
 
        // pivot
         let pivot = values[high];
 
        // Index of smaller element
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
 
            // If the current element is smaller
            // than or equal to the pivot
            if (values[j] <= pivot) {
 
                // increment index of smaller element
                i++;
                await swap(values, i, j);
            }
        }
        await swap(values, i + 1, high);
        return (i + 1);

        

      
    }
 
    // The main function that implements Introsort
    // low  --> Starting index,
    // high  --> Ending index,
    // depthLimit  --> recursion level
    async function sortDataUtil(begin, end, depthLimit)
    {
        if (end - begin > 10) {
            if (depthLimit == 0) {
 
                // if the recursion limit is
                // occurred call heap sort
                await HeapSort(begin, end);
                return;
            }
 
            depthLimit = depthLimit - 1;
            let pivot = await findPivot(begin, begin + floor((end - begin) / 2) + 1,
                                           end);
            await swap(values, pivot, end);
 
            // p is partitioning index,
            // arr[p] is now at right place
            let p = await Partition(begin, end);
 
            // Separately sort elements before
            // partition and after partition
            await sortDataUtil(begin, p - 1, depthLimit);
            await sortDataUtil(p + 1, end, depthLimit);
        }
 
        else {
            // if the data set is small,
            // call insertion sort
            await insertionSortIntro(begin, end);
        }
    }
 
    // A utility function to begin the
    // Introsort module
    async function sortDataIntro()
    {
 
        // Initialise the depthLimit
        // as 2*log(length(data))
        let depthLimit = floor(2 * Math.floor(Math.log(n) /
                                  Math.log(2)));
 
        await sortDataUtil(0, n - 1, depthLimit);
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
let anim = []
async function grailSort(array, length){
  let comp = new GrailComparator()
  let extBuffer = new Array(512)
  let grail = new GrailSort(comp)
  let a = [...array]
  //grail.grailCommonSort(array, 0, length, extBuffer, extBuffer.length)
  grail.grailSortInPlace(array, 0, array.length)

}

