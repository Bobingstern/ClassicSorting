
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function swap(arr, a, b) {
  states[a] = 1
  states[b] = 1
  await sleep(delay);
  states[a] = -1
  states[b] = -1
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
    states[m+1+y] = -1
    states[l+x] = -1
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
        states[k] = -1
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
  for (var n=0;n<states.length;n++){
      states[n] = -1
    }
  if (start >= end) {
    return;
  }
  let index = await partition(arr, start, end);
  states[index] = -1;

  // Promise.all([quickSort(arr, start, index), quickSort(arr, index + 1, end)])
  await quickSort(arr, start, index)
  await quickSort(arr, index + 1, end)

}

async function partition(arr, low, high) {
  let pivot = arr[low]
  let i=low-1
  let j=high+1


  while (true){
    for (var n=0;n<states.length;n++){
      states[n] = -1
    }
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
let base = 5
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
  for (let i = size - 1; i >= 0; i--) {
      const num = floor(arr[i] / place) % base;
      output[freq[num] - 1] = arr[i];
      freq[num]--;
  }
  
  //Copy the output array
  for (let i = 0; i < size; i++){
    states[i] = 1
    arr[i] = output[i];
    await sleep(delay)
    states[i] = -1
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
{   for (var i=0;i<states.length;i++){
      states[i] = -1
    }
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
        states[j+1] = -1
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
            states[j] = -1
            states[i] = -1
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
              states[front] = -1
              states[back] = 1
              arr[back] = temp;
              await sleep(delay)
              states[back] = -1
          }
 
          // Increment and re-run swapping
        
          front += 1;
          back += 1;
      }
      iteration_count += 1;
  }
}


///Introsort


async function InsertionSort(arr, begin, end){
  let left = begin - arr
  let right = end - arr

  for (var i=left+1;i<=right;i++){
    let key = arr[i]
    let j = i-1

    while (j >= left && arr[j] > key)
        {
            arr[j+1] = arr[j];
            j = j-1;
        }
        arr[j+1] = key;
  }
}






