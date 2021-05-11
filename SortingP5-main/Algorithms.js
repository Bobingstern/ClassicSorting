
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function swap(arr, a, b) {
  states[a] = 1
  states[b] = 1
  await sleep(delay);
  let temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;
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
  while (y < n2 || x < n1){
    if (y < n2){
      y++
    }
    if (x < n1){
      x++
    }
    states[m+1+y] = 1
    states[l+x] = 1
    await sleep(delay)

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
        await sleep(delay)
        k++;

    }

    while (i < n1) {
        arr[k] = L[i];
        await sleep(1)
        i++;
        k++;
        states[k] = 1

    }

    while (j < n2) {
        arr[k] = R[j];
        await sleep(1)
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
let RUN = 64
async function insertionSort(arr, left, right)
{
    for (var i = left + 1; i <= right; i++)
    {
        let temp = arr[i];
        let j = i - 1;
        while (j >= left && arr[j] > temp)
        {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = temp;
        await sleep(delay)
    }
}

async function timSort(arr, n)
{

    // Sort individual subarrays of size RUN
    for (var i = 0; i < n; i+=RUN)
        await insertionSort(arr, i, min((i+RUN-1),
                                    (n-1)));

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
let base = 6
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
      
      await sleep(delay)
     

      states[freq[num] - 1] = 1
      //await sleep(delay)
      //states[freq[num] - 1] = -1
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
      await sleep(delay)
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
        await sleep(delay)
        arr[j+1] = arr[j];
        j--;
    }
    arr[j+1] = last;
    await sleep(delay)
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
              //await sleep(1)
            }
              
            //  put temp (the original a[i]) in its correct location
            arr[j] = temp;
            states[j] = 1
            await sleep(delay)

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
              await sleep(delay)
              states[back] = 1
              arr[back] = temp;
              await sleep(delay)
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


async function weaveMerge(arr, l, m, h){
  let dist = h-m
  for (var i=0;i<dist;i++){
    await swapTo(arr, m+i, l+i*2)
  }
  insertSort(arr, l, h)
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


async function weaveMergeSort(arr, l, h){
  let m = floor((l+h) / 2)
  if (l >= m){
    return
  }
  await weaveMergeSort(arr, l, m)
  await weaveMergeSort(arr, m, h)
  await weaveMerge(arr, l, m, h)
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

    await sleep(delay)
  }
}


//Quick Insertion



async function partitionQuickInsert(arr, low, high) {
  let pivot = arr[low]
  let i=low-1
  let j=high+1
  if (high-low < 5){
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

let xas = 0

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
            await sleep(delay)
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
                await sleep(delay)
                j--;
            }
            values[j] = key;
            await sleep(delay)
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
