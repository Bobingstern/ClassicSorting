

class GrailComparator {
  constructor() {}
  compare(leftPair, rightPair) {
    if (leftPair < rightPair){
        return -1
    }
    else if (leftPair > rightPair) {
        return  1
    }
    else {
        return  0
    }
  }
}

class GrailPair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }

  getKey() {
    return this.key;
  }

  getValue() {
    return this.value;
  }
}




const Subarray = {
    LEFT : 1,
    RIGHT: 2,
};

// REWRITTEN GRAILSORT FOR JAVASCRIPT - A heavily refactored C/C++-to-JavaScript version of
//                                      Andrey Astrelin's GrailSort.h, aiming to be as
//                                      readable and intuitive as possible.
//
// ** Written and maintained by The Holy Grail Sort Project
//
// Primary author: Enver
//
// Current status: Finished. Potentially 100% working... Passing most tests, some tests capped by V8 Engine memory allocation limits

class GrailSort {
    static GRAIL_STATIC_EXT_BUF_LEN = 512;
    
    constructor(grailComp) {
        this.grailComp = grailComp;

        this.externalBuffer;
        this.externalBufferLen;
        
        this.currentBlockLen;
        this.currentBlockOrigin;
    }
    
    async grailSwap(array, a, b) {
        // let temp = array[a];
        // array[a] = array[b];
        // array[b] = temp;
        await swap(array, a, b)
        // anim.push([a, b])
    }
    
    async grailBlockSwap(array, a, b, blockLen) {
        for(let i = 0; i < blockLen; i++) {
            await this.grailSwap(array, a + i, b + i);
            await sleep(delay)
        }
    }

    // Object src, int srcPos, Object dest, int destPos, int length
    // Custom method for copying parts of the array either:
    //      within itself to a different destination, or
    //      to another array
    async arraycopy(srcArray, srcPos, destArray, destPos, copyLen) {
        if (srcArray === destArray) {
            srcArray.copyWithin(destPos, srcPos, srcPos + copyLen);
        } else {
            // FIXED INCORRECT MEMBER NAME BUG 'srcArray.copyLen': should be -> srcArray.length
            if (srcPos === 0 && copyLen === srcArray.length) {
                destArray = srcArray.slice();
            } else {
                for (let i = 0; i < copyLen; i++) {
                    destArray[destPos + i] = srcArray[srcPos + i];
                    await sleep(delay)
                }
            }
        }
    }
    
    async grailRotate(array, start, leftLen, rightLen) {
        while(leftLen > 0 && rightLen > 0) {
            if(leftLen <= rightLen) {
                await this.grailBlockSwap(array, start, start + leftLen, leftLen);
                start += leftLen;
                rightLen -= leftLen;
                states[start] = 1
                states[start+leftLen] = 1
            } 
            else {
                await this.grailBlockSwap(array, start + leftLen - rightLen, start + leftLen, rightLen);
                leftLen -= rightLen;
                states[start+leftLen] = 1
                states[leftLen-rightLen] = 1
            }
        }
    }
    
    // Variant of Insertion Sort that utilizes swaps instead of overwrites.
    // Also known as "Optimized Gnomesort".
    async grailInsertSort(array, start, length) {
        for(let item = 1; item < length; item++) {
            let left  = start + item - 1;
            let right = start + item;
            
            while(left >= start && this.grailComp.compare(array[ left],
                                                          array[right]) > 0) {
                await this.grailSwap(array, left, right);
                states[left] = 1
                states[right] = 1
                left--;
                right--;
            }
        }
    }

    async grailBinarySearchLeft(array, start, length, target) {
        let left  = 0;
        let right = length;
        while(left < right) {
            let middle = left + parseInt((right - left) / 2);
            if(this.grailComp.compare(array[start + middle], target) < 0) {
                left = middle + 1;
            }
            else {
                right = middle;
            }
        }
        return left;
    }
    // Credit to Anonymous0726 for debugging
    async grailBinarySearchRight(array, start, length, target) {
        let left  = 0;
        let right = length;
        while(left < right) {
            let middle = left + parseInt((right - left) / 2);
            if(this.grailComp.compare(array[start + middle], target) > 0) {
                right = middle;
            }
            else {
                left = middle + 1;
            }
        }
        // OFF-BY-ONE BUG FIXED: used to be `return right - 1;`
        return right;
    }
    
    // cost: 2 * length + idealKeys^2 / 2
    async grailCollectKeys(array, start, length, idealKeys) {
        let keysFound  = 1; // by itself, the first item in the array is our first unique key
        let firstKey   = 0; // the first item in the array is at the first position in the array
        let currentKey = 1; // the index used for finding potentially unique items ("keys") in the array
        
        while(currentKey < length && keysFound < idealKeys) {
            
            // Find the location in the key-buffer where our current key can be inserted in sorted order.
            // If the key at insertPos is equal to currentKey, then currentKey isn't unique and we move on.
            let insertPos = await this.grailBinarySearchLeft(array, start + firstKey, keysFound, array[start + currentKey]);
            
            // The second part of this conditional does the equal check we were just talking about; however,
            // if currentKey is larger than everything in the key-buffer (meaning insertPos == keysFound),
            // then that also tells us it wasn't *equal* to anything in the key-buffer. Magic! :) 
            if(insertPos == keysFound || this.grailComp.compare(array[start + currentKey            ],
                                                                array[start +   firstKey + insertPos]) != 0) {
                
                // First, rotate the key-buffer over to currentKey's immediate left...
                // (this helps save a TON of swaps/writes!!!)
                await this.grailRotate(array, start + firstKey, keysFound, currentKey - (firstKey + keysFound));
                
                // Update the new position of firstKey...
                firstKey = currentKey - keysFound;
                states[start+firstKey] = 1
                // Then, "insertion sort" currentKey to its spot in the key-buffer!
                await this.grailRotate(array, start + firstKey + insertPos, keysFound - insertPos, 1);
                
                // One step closer to idealKeys.
                keysFound++;
            }
            // Move on and test the next key...
            currentKey++;
            await sleep(delay)
        }
        
        // Bring however many keys we found back to the beginning of our array,
        // and return the number of keys collected.
        await this.grailRotate(array, start, firstKey, keysFound);
        return keysFound;
    }
    
    async grailPairwiseSwaps(array, start, length) {
        let index;
        for(index = 1; index < length; index += 2) {
            let  left = start + index - 1;
            let right = start + index;

            if(this.grailComp.compare(array[left], array[right]) > 0) {
                await this.grailSwap(array,  left - 2, right);
                await this.grailSwap(array, right - 2,  left);
            }
            else {
                await this.grailSwap(array,  left - 2,  left);
                await this.grailSwap(array, right - 2, right);
            }
        }
        
        let left = start + index - 1;
        if(left < start + length) {
            await this.grailSwap(array, left - 2, left);
        }
    }
    async grailPairwiseWrites(array, start, length) {
        let index;
        for(index = 1; index < length; index += 2) {
            let  left = start + index - 1;
            let right = start + index;

            if(this.grailComp.compare(array[left], array[right]) > 0) {
                array[ left - 2] = array[right];
                array[right - 2] = array[ left];
                states[left-2] = 1
                states[right-2] = 1

            }
            else {
                array[ left - 2] = array[ left];
                array[right - 2] = array[right];
                states[left-2] = 1
                states[right-2] = 1
            }
            await sleep(delay)
        }
        
        let left = start + index - 1;
        if(left < start + length) {
            array[left - 2] = array[left];
            states[left-2] = 1
            await sleep(delay)
        }
    }
    
    // array[buffer .. start - 1] <=> "scrolling buffer"
    // 
    // "scrolling buffer" + array[start, middle - 1] + array[middle, end - 1]
    // --> array[buffer, buffer + end - 1] + "scrolling buffer"
    async grailMergeForwards(array, start, leftLen, rightLen, bufferOffset) {
        let   left = start;
        let middle = start  +  leftLen;
        let  right = middle;
        let    end = middle + rightLen;
        let buffer = start  - bufferOffset;
        
        while(right < end) {
            if(left == middle || this.grailComp.compare(array[ left],
                                                        array[right]) > 0) {
                
                await this.grailSwap(array, buffer, right);

                right++;
            }
            else {
                await this.grailSwap(array, buffer,  left);
                left++;
            }
            buffer++;
        }
        
        if(buffer != left) {
            await this.grailBlockSwap(array, buffer, left, middle - left);
        }
    }

    // credit to 666666t for thorough bug-checking/fixing
    async grailMergeBackwards(array, start, leftLen, rightLen, bufferOffset) {
        let   left = start  +  leftLen - 1;
        let middle = left;
        // OFF-BY-ONE BUG FIXED: used to be `let  right = middle + rightLen - 1;`
        let  right = middle + rightLen;
        let    end = start;
        // OFF-BY-ONE BUG FIXED: used to be `let buffer = right  + bufferOffset - 1;`
        let buffer = right  + bufferOffset;
        
        while(left >= end) {
            if(right == middle || this.grailComp.compare(array[ left],
                                                         array[right]) > 0) {
                
                await this.grailSwap(array, buffer,  left);
                left--;
            }
            else {
                await this.grailSwap(array, buffer, right);
                right--;
            }
            buffer--;
        }
        
        if(right != buffer) {
            while(right > middle) {
                await this.grailSwap(array, buffer, right);
                buffer--;
                right--;
            }
        }
    }

    // array[buffer .. start - 1] <=> "free space"    
    //
    // "free space" + array[start, middle - 1] + array[middle, end - 1]
    // --> array[buffer, buffer + end - 1] + "free space"
    //
    // FUNCTION RENAMED: More consistent with "out-of-place" being at the end
    async grailMergeOutOfPlace(array, start, leftLen, rightLen, bufferOffset) {
        let   left = start;
        let middle = start  +  leftLen;
        let  right = middle;
        let    end = middle + rightLen;
        let buffer = start  - bufferOffset;
        
        while(right < end) {
            if(left == middle || this.grailComp.compare(array[ left],
                                                        array[right]) > 0) {
                
                array[buffer] = array[right];
                states[buffer] = 1
                states[right] = 1
                right++;
            }
            else {
                array[buffer] = array[ left];
                states[buffer] = 1
                states[left] = 1
                left++;
            }
            await sleep(delay)
            buffer++;
        }
        
        if(buffer != left) {
            while(left < middle) {
                array[buffer] = array[left];
                states[buffer] = 1
                states[left] = 1
                buffer++;
                left++;
                await sleep(delay)
            }
        }
    }

    async grailBuildInPlace(array, start, length, currentMerge, bufferLen) {    
        for(let mergeLen = currentMerge; mergeLen < bufferLen; mergeLen *= 2) {
            let mergeIndex;
            let mergeEnd = start + length - (2 * mergeLen);
            let bufferOffset = mergeLen;
    
            for(mergeIndex = start; mergeIndex <= mergeEnd; mergeIndex += (2 * mergeLen)) {
                await this.grailMergeForwards(array, mergeIndex, mergeLen, mergeLen, bufferOffset);
            }
    
            let leftOver = length - (mergeIndex - start);
    
            if(leftOver > mergeLen) {
                await this.grailMergeForwards(array, mergeIndex, mergeLen, leftOver - mergeLen, bufferOffset);
            }
            else {
                await this.grailRotate(array, mergeIndex - mergeLen, mergeLen, leftOver);
            }
    
            start -= mergeLen;
        }
    
        let finalBlock  = length % (2 * bufferLen);
        let finalOffset = start + length - finalBlock;
    
        if(finalBlock <= bufferLen) {
            await this.grailRotate(array, finalOffset, finalBlock, bufferLen);
        }
        else {
            await this.grailMergeBackwards(array, finalOffset, bufferLen, finalBlock - bufferLen, bufferLen);
        }
    
        for(let mergeIndex = finalOffset - (2 * bufferLen); mergeIndex >= start; mergeIndex -= (2 * bufferLen)) {
            await this.grailMergeBackwards(array, mergeIndex, bufferLen, bufferLen, bufferLen);
        }
    }

    async grailBuildOutOfPlace(array, start, length, bufferLen, externLen) {
        await this.arraycopy(array, start - externLen, this.externalBuffer, 0, externLen);
        
        await this.grailPairwiseWrites(array, start, length);
        start -= 2;
        
        let mergeLen;
        for(mergeLen = 2; mergeLen < externLen; mergeLen *= 2) {
            let mergeIndex;
            let mergeEnd = start + length - (2 * mergeLen);
            let bufferOffset = mergeLen;
    
            for(mergeIndex = start; mergeIndex <= mergeEnd; mergeIndex += (2 * mergeLen)) {
                await this.grailMergeOutOfPlace(array, mergeIndex, mergeLen, mergeLen, bufferOffset);
            }
    
            let leftOver = length - (mergeIndex - start);
    
            if(leftOver > mergeLen) {
                await this.grailMergeOutOfPlace(array, mergeIndex, mergeLen, leftOver - mergeLen, bufferOffset);
            }
            else {
                // TODO: Is this correct??
                for(let offset = 0; offset < leftOver; offset++) {
                    array[mergeIndex + offset - mergeLen] = array[mergeIndex + offset];
                    states[mergeIndex + offset - mergeLen] = 1
                    states[mergeIndex+offset] = 1
                    await sleep(delay)
                }
            }
    
            start -= mergeLen;
        }
        
        await this.arraycopy(this.externalBuffer, 0, array, start + length, externLen);
        await this.grailBuildInPlace(array, start, length, mergeLen, bufferLen);
    }

    // build blocks of length 'bufferLen'
    // input: [start - mergeLen, start - 1] elements are buffer
    // output: first 'bufferLen' elements are buffer, blocks (2 * bufferLen) and last subblock sorted
    async grailBuildBlocks(array, start, length, bufferLen) {
        if(this.externalBuffer != null) {
            let externLen;
            
            if(bufferLen < this.externalBufferLen) {
                externLen = bufferLen;
            }
            else {
                // max power of 2 -- just in case
                externLen = 1;
                while((externLen * 2) <= this.externalBufferLen) {
                    externLen *= 2;
                }
            }
            
            await this.grailBuildOutOfPlace(array, start, length, bufferLen, externLen);
        }
        else {
            await this.grailPairwiseSwaps(array, start, length);
            await this.grailBuildInPlace(array, start - 2, length, 2, bufferLen);
        }
    }

    // Returns the final position of 'medianKey'.
    async grailBlockSelectSort(array, keys, start, medianKey, blockCount, blockLen) {
        for(let block = 1; block < blockCount; block++) {
            let  left = block - 1;
            let right = left;

            for(let index = block; index < blockCount; index++) {
                let compare = this.grailComp.compare(array[start + (right * blockLen)],
                                                     array[start + (index * blockLen)]);

                if(compare > 0 || (compare == 0 && this.grailComp.compare(array[keys + right],
                                                                          array[keys + index]) > 0)) {
                    right = index;
                }
            }

            if(right != left) {
                // Swap the left and right selected blocks...
                await this.grailBlockSwap(array, start + (left * blockLen), start + (right * blockLen), blockLen);

                // Swap the keys...
                await this.grailSwap(array, keys + left, keys + right);

                // ...and follow the 'medianKey' if it was swapped

                // ORIGINAL LOC: if(midkey==u-1 || midkey==p) midkey^=(u-1)^p;
                // MASSIVE, MASSIVE credit to lovebuny for figuring this one out!
                if(medianKey == left) {
                    medianKey = right;
                }
                else if(medianKey == right) {
                    medianKey = left;
                }
            }
        }

        return medianKey;
    }
    
    // Swaps Grailsort's "scrolling buffer" from the right side of the array all the way back to 'start'.
    // Costs O(n) operations.
    //
    // OFF-BY-ONE BUG FIXED: used to be `int index = start + resetLen`; credit to 666666t for debugging
    async grailInPlaceBufferReset(array, start, resetLen, bufferLen) {
        for(let index = start + resetLen - 1; index >= start; index--) {
            await this.grailSwap(array, index, index - bufferLen);
        }
    }
    
    // Shifts entire array over 'bufferSize' spaces to make room for the out-of-place merging buffer.
    // Costs O(n) operations.
    //
    // OFF-BY-ONE BUG FIXED: used to be `int index = start + resetLen`; credit to 666666t for debugging
    async grailOutOfPlaceBufferReset(array, start, resetLen, bufferLen) {
        for(let index = start + resetLen - 1; index >= start; index--) {
            array[index] = array[index - bufferLen];
            states[index] = 1
            states[index - bufferLen] =1 
            await sleep(delay)
        }
    }
    
    // Rewinds Grailsort's "scrolling buffer" such that any items from a left subarray block left over by a "smart merge" are moved to
    // the right of the buffer. This is used to maintain stability and to continue an ongoing merge that has run out of buffer space.
    // Costs O(sqrt n) swaps in the *absolute* worst-case. 
    //
    // NAMING IMPROVED: the left over items are in the middle of the merge while the buffer is at the end
    async grailInPlaceBufferRewind(array, start, leftOvers, buffer) {
        while(leftOvers > start) {
            leftOvers--;
            buffer--;
            await this.grailSwap(array, buffer, leftOvers);
        }
    }
    
    // Rewinds Grailsort's out-of-place buffer such that any items from a left subarray block left over by a "smart merge" are moved to
    // the right of the buffer. This is used to maintain stability and to continue an ongoing merge that has run out of buffer space.
    // Costs O(sqrt n) writes in the *absolute* worst-case.
    //
    // INCORRECT ORDER OF PARAMETERS BUG FIXED: `leftOvers` should be the middle, and `buffer` should be the end
    async grailOutOfPlaceBufferRewind(array, start, leftOvers, buffer) {
        while(leftOvers > start) {
            leftOvers--;
            buffer--;
            array[buffer] = array[leftOvers];
            states[buffer] = 1
            states[leftOvers] = 1
            await sleep(delay)
        }
    }
    
    async grailGetSubarray(array, currentKey, medianKey) {
        if(this.grailComp.compare(array[currentKey], array[medianKey]) < 0) {
            return Subarray.LEFT;
        }
        else {
            return Subarray.RIGHT;
        }
    }

    // FUNCTION RENAMED: more clear *which* left blocks are being counted
    async grailCountFinalLeftBlocks(array, offset, blockCount, blockLen) {
        let leftBlocks = 0;
        
        let firstRightBlock = offset + (blockCount * blockLen);
        let prevLeftBlock   = firstRightBlock - blockLen;
        
        while(leftBlocks < blockCount && this.grailComp.compare(array[firstRightBlock],
                                                                array[  prevLeftBlock]) < 0) {
            leftBlocks++;
            prevLeftBlock -= blockLen;
        }
        
        return leftBlocks;
    }
    
    async grailSmartMerge(array, start, leftLen, leftOrigin, rightLen, bufferOffset) {
        let   left = start;
        let middle = start  +  leftLen;
        let  right = middle;
        let    end = middle + rightLen;
        let buffer = start  - bufferOffset;
        
        if(leftOrigin == Subarray.LEFT) {
            while(left < middle && right < end) {
                if(this.grailComp.compare(array[left], array[right]) <= 0) {
                    await this.grailSwap(array, buffer, left);
                    left++;
                }
                else {
                    await this.grailSwap(array, buffer, right);
                    right++;
                }
                buffer++;
            }
        }
        else {
            while(left < middle && right < end) {
                if(this.grailComp.compare(array[left], array[right]) <  0) {
                    await this.grailSwap(array, buffer, left);
                    left++;
                }
                else {
                    await this.grailSwap(array, buffer, right);
                    right++;
                }
                buffer++;
            }            
        }
        
        if(left < middle) {
            this.currentBlockLen = middle - left;
            await this.grailInPlaceBufferRewind(array, left, middle, end);
        }
        else {
            this.currentBlockLen = end - right;
            if(leftOrigin == Subarray.LEFT) {
                this.currentBlockOrigin = Subarray.RIGHT;
            }
            else {
                this.currentBlockOrigin = Subarray.LEFT;
            }
        }
    }

    async grailSmartLazyMerge(array, start, leftLen, leftOrigin, rightLen) {
        if(leftOrigin == Subarray.LEFT) {
            if(this.grailComp.compare(array[start + leftLen - 1], array[start + leftLen]) >  0) {
                while(leftLen != 0) {
                    let insertPos = await this.grailBinarySearchLeft(array, start + leftLen, rightLen, array[start]);
                    
                    if(insertPos != 0) {
                        await this.grailRotate(array, start, leftLen, insertPos);
                        start    += insertPos;
                        rightLen -= insertPos;
                    }
                    
                    if(rightLen == 0) {
                        this.currentBlockLen = leftLen;
                        return;
                    }
                    else {
                        do {
                            start++;
                            leftLen--;
                        } while(leftLen != 0 && this.grailComp.compare(array[start          ],
                                                                       array[start + leftLen]) <= 0);
                    }
                }
            }
        }
        else {
            if(this.grailComp.compare(array[start + leftLen - 1], array[start + leftLen]) >= 0) {
                while(leftLen != 0) {
                    let insertPos = await this.grailBinarySearchRight(array, start + leftLen, rightLen, array[start]);
                    
                    if(insertPos != 0) {
                        await this.grailRotate(array, start, leftLen, insertPos);
                        start    += insertPos;
                        rightLen -= insertPos;
                    }
                    
                    if(rightLen == 0) {
                        this.currentBlockLen = leftLen;
                        return;
                    }
                    else {
                        do {
                            start++;
                            leftLen--;
                        } while(leftLen != 0 && this.grailComp.compare(array[start          ],
                                                                       array[start + leftLen]) < 0);
                    }
                }
            }
        }
        
        this.currentBlockLen = rightLen;
        if(leftOrigin == Subarray.LEFT) {
            this.currentBlockOrigin = Subarray.RIGHT;
        }
        else {
            this.currentBlockOrigin = Subarray.LEFT;
        }
    }

    // FUNCTION RENAMED: more consistent with other "out-of-place" merges
    async grailSmartMergeOutOfPlace(array, start, leftLen, leftOrigin, rightLen, bufferOffset) {
        let   left = start;
        let middle = start  +  leftLen;
        let  right = middle;
        let    end = middle + rightLen;
        let buffer = start  - bufferOffset;
        
        if(leftOrigin == Subarray.LEFT) {
            while(left < middle && right < end) {
                if(this.grailComp.compare(array[left], array[right]) <= 0) {
                    array[buffer] = array[left];
                    states[buffer] = 1
                    states[left] = 1
                    left++;
                }
                else {
                    array[buffer] = array[right];
                    states[buffer] = 1
                    states[right] = 1
                    right++;
                }
                await sleep(delay)
                buffer++;
            }
        }
        else {
            while(left < middle && right < end) {
                if(this.grailComp.compare(array[left], array[right]) <  0) {
                    array[buffer] = array[left];
                    left++;
                }
                else {
                    array[buffer] = array[right];
                    right++;
                }
                await sleep(delay)
                buffer++;
            }            
        }
        
        if(left < middle) {
            this.currentBlockLen = middle - left;
            await this.grailOutOfPlaceBufferRewind(array, left, middle, end);
        }
        else {
            this.currentBlockLen = end - right;
            if(leftOrigin == Subarray.LEFT) {
                this.currentBlockOrigin = Subarray.RIGHT;
            }
            else {
                this.currentBlockOrigin = Subarray.LEFT;
            }
        }
    }

    async grailMergeBlocks(array, keys, medianKey, start, blockCount, blockLen, finalLeftBlocks, finalLen) {
        let currentBlock;
        let blockIndex = blockLen;
        
        this.currentBlockLen    = blockLen;
        this.currentBlockOrigin = await this.grailGetSubarray(array, keys, medianKey);
        
        for(let keyIndex = 1; keyIndex < blockCount; keyIndex++, blockIndex += blockLen) {
            currentBlock = blockIndex - this.currentBlockLen;
            
            let nextBlockOrigin = await this.grailGetSubarray(array, keys + keyIndex, medianKey);
            
            if(nextBlockOrigin == this.currentBlockOrigin) {
                await this.grailBlockSwap(array, start + currentBlock - blockLen, start + currentBlock, this.currentBlockLen);
                currentBlock = blockIndex;
                
                this.currentBlockLen = blockLen;
            }
            else {
                await this.grailSmartMerge(array, start + currentBlock, this.currentBlockLen, this.currentBlockOrigin, blockLen, blockLen);
            }
        }
        
        currentBlock = blockIndex - this.currentBlockLen;
        
        if(finalLen != 0) {
            if(this.currentBlockOrigin == Subarray.RIGHT) {
                await this.grailBlockSwap(array, start + currentBlock - blockLen, start + currentBlock, this.currentBlockLen);
                currentBlock = blockIndex;
                
                this.currentBlockLen    = blockLen * finalLeftBlocks;
                this.currentBlockOrigin = Subarray.LEFT;
            }
            else {
                this.currentBlockLen += blockLen * finalLeftBlocks;
            }
            
            await this.grailMergeForwards(array, start + currentBlock, this.currentBlockLen, finalLen, blockLen);
        }
        else {
            await this.grailBlockSwap(array, start + currentBlock, start + currentBlock - blockLen, this.currentBlockLen);
        }
    }

    async grailLazyMergeBlocks(array, keys, medianKey, start, blockCount, blockLen, finalLeftBlocks, finalLen) {
        let currentBlock;
        let blockIndex = blockLen;
        
        this.currentBlockLen    = blockLen;
        this.currentBlockOrigin = await this.grailGetSubarray(array, keys, medianKey);
        
        for(let keyIndex = 1; keyIndex < blockCount; keyIndex++, blockIndex += blockLen) {
            currentBlock = blockIndex - this.currentBlockLen;
            
            let nextBlockOrigin = await this.grailGetSubarray(array, keys + keyIndex, medianKey);
            
            if(nextBlockOrigin == this.currentBlockOrigin) {
                currentBlock = blockIndex;
                
                this.currentBlockLen = blockLen;
            }
            else {
                // These checks were included in the original code... but why???
                if(blockLen != 0 && this.currentBlockLen != 0) {
                    await this.grailSmartLazyMerge(array, start + currentBlock, this.currentBlockLen, this.currentBlockOrigin, blockLen);
                }
            }
        }
        
        currentBlock = blockIndex - this.currentBlockLen;
        
        if(finalLen != 0) {
            if(this.currentBlockOrigin == Subarray.RIGHT) {
                currentBlock = blockIndex;
                
                this.currentBlockLen    = blockLen * finalLeftBlocks;
                this.currentBlockOrigin = Subarray.LEFT;
            }
            else {
                this.currentBlockLen += blockLen * finalLeftBlocks;
            }
            
            await this.grailLazyMerge(array, start + currentBlock, this.currentBlockLen, finalLen);
        }
    }

    async grailMergeBlocksOutOfPlace(array, keys, medianKey, start, blockCount, blockLen, finalLeftBlocks, finalLen) {
        let currentBlock;
        let blockIndex = blockLen;
        
        this.currentBlockLen    = blockLen;
        this.currentBlockOrigin = await this.grailGetSubarray(array, keys, medianKey);
        
        for(let keyIndex = 1; keyIndex < blockCount; keyIndex++, blockIndex += blockLen) {
            currentBlock = blockIndex - this.currentBlockLen;
            
            let nextBlockOrigin = await this.grailGetSubarray(array, keys + keyIndex, medianKey);
            
            if(nextBlockOrigin == this.currentBlockOrigin) {
                await this.arraycopy(array, start + currentBlock, array, start + currentBlock - blockLen, this.currentBlockLen);
                currentBlock = blockIndex;
                
                this.currentBlockLen = blockLen;
            }
            else {
                await this.grailSmartMergeOutOfPlace(array, start + currentBlock, this.currentBlockLen, this.currentBlockOrigin, blockLen, blockLen);
            }
        }
        
        currentBlock = blockIndex - this.currentBlockLen;
        
        if(finalLen != 0) {
            if(this.currentBlockOrigin == Subarray.RIGHT) {
                await this.arraycopy(array, start + currentBlock, array, start + currentBlock - blockLen, this.currentBlockLen);
                currentBlock = blockIndex;
                
                this.currentBlockLen    = blockLen * finalLeftBlocks;
                this.currentBlockOrigin = Subarray.LEFT;
            }
            else {
                this.currentBlockLen += blockLen * finalLeftBlocks;
            }
            
            await this.grailMergeOutOfPlace(array, start + currentBlock, this.currentBlockLen, finalLen, blockLen);
        }
        else {
            await this.arraycopy(array, start + currentBlock, array, start + currentBlock - blockLen, this.currentBlockLen);
        }
    }

    //TODO: Double-check "Merge Blocks" arguments
    async grailCombineInPlace(array, keys, start, length, subarrayLen, blockLen, mergeCount, lastSubarray, buffer) {
        for(let mergeIndex = 0; mergeIndex < mergeCount; mergeIndex++) {
            let offset = start + (mergeIndex * (2 * subarrayLen));
            let blockCount = parseInt((2 * subarrayLen) / blockLen);
            
            await this.grailInsertSort(array, keys, blockCount);
    
            // INCORRECT PARAMETER BUG FIXED: `block select sort` should be using `offset`, not `start`
            let medianKey = parseInt(subarrayLen / blockLen);
            medianKey = await this.grailBlockSelectSort(array, keys, offset, medianKey, blockCount, blockLen);
            
            if(buffer) {
                await this.grailMergeBlocks(array, keys, keys + medianKey, offset, blockCount, blockLen, 0, 0);
            }
            else {
                await this.grailLazyMergeBlocks(array, keys, keys + medianKey, offset, blockCount, blockLen, 0, 0);
            }
        }
    
        // INCORRECT CONDITIONAL/PARAMETER BUG FIXED: Credit to 666666t for debugging.
        if(lastSubarray != 0) {
            let offset = start + (mergeCount * (2 * subarrayLen));
            let rightBlocks = parseInt(lastSubarray / blockLen);
            
            await this.grailInsertSort(array, keys, rightBlocks + 1);
            
            // INCORRECT PARAMETER BUG FIXED: `block select sort` should be using `offset`, not `start`
            let medianKey = parseInt(subarrayLen / blockLen);
            medianKey = await this.grailBlockSelectSort(array, keys, offset, medianKey, rightBlocks, blockLen);
    
            // MISSING BOUNDS CHECK BUG FIXED: `lastFragment` *can* be 0 if the `lastSubarray` is evenly
            //                                 divided into blocks. This prevents Grailsort from going
            //                                 out of bounds.
            let lastFragment = lastSubarray % blockLen;
            let leftBlocks;
            if(lastFragment != 0) {
                leftBlocks = await this.grailCountFinalLeftBlocks(array, offset, rightBlocks, blockLen);
            }
            else {
                leftBlocks = 0;
            }
    
            let blockCount = rightBlocks - leftBlocks;
            
            //TODO: Double-check if this micro-optimization works correctly like the original
            if(blockCount == 0) {
                let leftLength = leftBlocks * blockLen;
                
                // INCORRECT PARAMETER BUG FIXED: these merges should be using `offset`, not `start`
                if(buffer) {
                    await this.grailMergeForwards(array, offset, leftLength, lastFragment, blockLen);
                }
                else {
                    await this.grailLazyMerge(array, offset, leftLength, lastFragment);
                }
            }
            else {
                if(buffer) {
                    await this.grailMergeBlocks(array, keys, keys + medianKey, offset, blockCount, blockLen, leftBlocks, lastFragment);
                }
                else {
                    await this.grailLazyMergeBlocks(array, keys, keys + medianKey, offset, blockCount, blockLen, leftBlocks, lastFragment);
                }
            }
        }
    
        if(buffer) {
            await this.grailInPlaceBufferReset(array, start, length, blockLen);
        }
    }

    async grailCombineOutOfPlace(array, keys, start, length, subarrayLen, blockLen, mergeCount, lastSubarray) {
        await this.arraycopy(array, start - blockLen, this.externalBuffer, 0, blockLen);

        for(let mergeIndex = 0; mergeIndex < mergeCount; mergeIndex++) {
            let offset = start + (mergeIndex * (2 * subarrayLen));
            let blockCount = parseInt((2 * subarrayLen) / blockLen);
            
            await this.grailInsertSort(array, keys, blockCount);

            // INCORRECT PARAMETER BUG FIXED: `block select sort` should be using `offset`, not `start`
            let medianKey = parseInt(subarrayLen / blockLen);
            medianKey = await this.grailBlockSelectSort(array, keys, offset, medianKey, blockCount, blockLen);
            
            await this.grailMergeBlocksOutOfPlace(array, keys, keys + medianKey, offset, blockCount, blockLen, 0, 0);
        }

        // INCORRECT CONDITIONAL/PARAMETER BUG FIXED: Credit to 666666t for debugging.
        if(lastSubarray != 0) {
            let offset = start + (mergeCount * (2 * subarrayLen));
            let rightBlocks = parseInt(lastSubarray / blockLen);
            
            await this.grailInsertSort(array, keys, rightBlocks + 1);

            // INCORRECT PARAMETER BUG FIXED: `block select sort` should be using `offset`, not `start`
            let medianKey = subarrayLen / blockLen;
            medianKey = await this.grailBlockSelectSort(array, keys, offset, medianKey, rightBlocks, blockLen);

            // MISSING BOUNDS CHECK BUG FIXED: `lastFragment` *can* be 0 if the `lastSubarray` is evenly
            //                                 divided into blocks. This prevents Grailsort from going
            //                                 out of bounds.
            let lastFragment = lastSubarray % blockLen;
            let leftBlocks;
            if(lastFragment != 0) {
                leftBlocks = await this.grailCountFinalLeftBlocks(array, offset, rightBlocks, blockLen);
            }
            else {
                leftBlocks = 0;
            }
            
            let blockCount = rightBlocks - leftBlocks;
            
            if(blockCount == 0) {
                // INCORRECT PARAMETER BUG FIXED: this merge should be using `offset`, not `start`
                let leftLength = leftBlocks * blockLen;
                await this.grailMergeOutOfPlace(array, offset, leftLength, lastFragment, blockLen);
            }
            else {
                await this.grailMergeBlocksOutOfPlace(array, keys, keys + medianKey, offset, blockCount, blockLen, leftBlocks, lastFragment);
            }
        }

        await this.grailOutOfPlaceBufferReset(array, start, length, blockLen);
        await this.arraycopy(this.externalBuffer, 0, array, start - blockLen, blockLen);
    }

    // 'keys' are on the left side of array. Blocks of length 'subarrayLen' combined. We'll combine them in pairs
    // 'subarrayLen' is a power of 2. (2 * subarrayLen / blockLen) keys are guaranteed
    async grailCombineBlocks(array, keys, start, length, subarrayLen, blockLen, buffer) {
        let   mergeCount = parseInt(length / (2 * subarrayLen));
        let lastSubarray = parseInt(length % (2 * subarrayLen));
    
        if(lastSubarray <= subarrayLen) {
            length -= lastSubarray;
            lastSubarray = 0;
        }
    
        // INCOMPLETE CONDITIONAL BUG FIXED: In order to combine blocks out-of-place, we must check if a full-sized
        //                                   block fits into our external buffer.
        if(buffer && blockLen <= this.externalBufferLen) {
            await this.grailCombineOutOfPlace(array, keys, start, length, subarrayLen, blockLen, mergeCount, lastSubarray);
        }
        else {
            await this.grailCombineInPlace(array, keys, start, length, subarrayLen, blockLen, mergeCount, lastSubarray, buffer);
        }
    }

    // "Classic" in-place merge sort using binary searches and rotations
    //
    // cost: min(leftLen, rightLen)^2 + max(leftLen, rightLen)
    async grailLazyMerge(array, start, leftLen, rightLen) {
        if(leftLen < rightLen) {
            while(leftLen != 0) {
                let insertPos = await this.grailBinarySearchLeft(array, start + leftLen, rightLen, array[start]);

                if(insertPos != 0) {
                    await this.grailRotate(array, start, leftLen, insertPos);
                    start    += insertPos;
                    rightLen -= insertPos;
                }

                if(rightLen == 0) {
                    break;
                }
                else {
                    do {
                        start++;
                        leftLen--;
                    } while(leftLen != 0 && this.grailComp.compare(array[start          ],
                                                                   array[start + leftLen]) <= 0);
                }
            }
        } else {
            let end = start + leftLen + rightLen - 1;
            while(rightLen != 0) {            
                let insertPos = await this.grailBinarySearchRight(array, start, leftLen, array[end]);

                if(insertPos != leftLen) {
                    await this.grailRotate(array, start + insertPos, leftLen - insertPos, rightLen);
                    end    -= leftLen - insertPos;
                    leftLen = insertPos;
                }

                if(leftLen == 0) {
                    break;
                }
                else {
                    let leftEnd = start + leftLen - 1;
                    do {
                        rightLen--;
                        end--;
                    } while(rightLen != 0 && this.grailComp.compare(array[leftEnd],
                                                                    array[    end]) <= 0);
                }
            }
        }
    }
    
    async grailLazyStableSort(array, start, length) {
        for(let index = 1; index < length; index += 2) {
            let  left = start + index - 1;
            let right = start + index; 
            
            if(this.grailComp.compare(array[left], array[right]) > 0) {
                await this.grailSwap(array, left, right);
            }
        }
        for(let mergeLen = 2; mergeLen < length; mergeLen *= 2) {
            let mergeIndex;
            let mergeEnd = length - (2 * mergeLen);
            
            for(mergeIndex = 0; mergeIndex <= mergeEnd; mergeIndex += (2 * mergeLen)) {
                await this.grailLazyMerge(array, start + mergeIndex, mergeLen, mergeLen);
            }
            
            let leftOver = length - mergeIndex;
            if(leftOver > mergeLen) {
                await this.grailLazyMerge(array, start + mergeIndex, mergeLen, leftOver - mergeLen);
            }
        }
    }
    
    static calcMinKeys(numKeys, blockKeysSum) {
        let minKeys = 1;
        while(minKeys < numKeys && blockKeysSum != 0) {
           minKeys *= 2;
           blockKeysSum = parseInt(blockKeysSum / 8);
        }
        return minKeys; 
     }
    
    async grailCommonSort(array, start, length, extBuf, extBufLen) {
        if(length < 16) {
            await this.grailInsertSort(array, start, length);
            return;
        }
        else {
            let blockLen = 1;

            // find the smallest power of two greater than or equal to
            // the square root of the input's length
            while((blockLen * blockLen) < length) {
                blockLen *= 2;
            }

            // '((a - 1) / b) + 1' is actually a clever and very efficient
            // formula for the ceiling of (a / b)
            //
            // credit to Anonymous0726 for figuring this out!
            let keyLen = parseInt((length - 1) / blockLen) + 1;

            // Grailsort is hoping to find `2 * sqrt(n)` unique items
            // throughout the array
            let idealKeys = keyLen + blockLen;
            
            //TODO: Clean up `start +` offsets
            let keysFound = await this.grailCollectKeys(array, start, length, idealKeys);
            
            let idealBuffer;
            if(keysFound < idealKeys) {
                if(keysFound < 4) {
                    // GRAILSORT STRATEGY 3 -- No block swaps or scrolling buffer; resort to Lazy Stable Sort
                    await this.grailLazyStableSort(array, start, length);
                    return;
                }
                else {
                    // GRAILSORT STRATEGY 2 -- Block swaps with small scrolling buffer and/or lazy merges
                    keyLen = blockLen;
                    blockLen = 0;
                    idealBuffer = false;

                    while(keyLen > keysFound) {
                        keyLen = parseInt(keyLen / 2);
                    }
                }
            }
            else {
                // GRAILSORT STRATEGY 1 -- Block swaps with scrolling buffer
                idealBuffer = true;
            }
            
            let bufferEnd = blockLen + keyLen;
            let bufferLen;
            if(idealBuffer) {
                bufferLen = blockLen;
            }
            else {
                bufferLen = keyLen;
            }
            
            if(idealBuffer && extBuf != null) {
                // GRAILSORT + EXTRA SPACE
                this.externalBuffer = extBuf;
                this.externalBufferLen = extBufLen;
            }
            
            await this.grailBuildBlocks(array, start + bufferEnd, length - bufferEnd, bufferLen);
            
            while((length - bufferEnd) > (2 * bufferLen)) {
                bufferLen *= 2;

                let currentBlockLen = blockLen;
                let scrollingBuffer = idealBuffer;

                if(!scrollingBuffer) {
                    if(keyLen > 4 && (parseInt(keyLen / 8) * keyLen) >= bufferLen) {
                        currentBlockLen = parseInt(keyLen / 2);
                        scrollingBuffer = true;
                    }
                    else {
                        let blockKeysSum = parseInt(bufferLen * keysFound) / 2;
                        let minKeys = GrailSort.calcMinKeys(keyLen, blockKeysSum);

                        currentBlockLen = parseInt(2 * bufferLen) / minKeys;
                    }
                }

                await this.grailCombineBlocks(array, start, start + bufferEnd, length - bufferEnd, bufferLen, currentBlockLen, scrollingBuffer);
                await sleep(delay)
            }
            
            await this.grailInsertSort(array, start, bufferEnd);
            await this.grailLazyMerge(array, start, bufferEnd, length - bufferEnd);
        }
    }
    
    async grailSortInPlace(array, start, length) {
        await this.grailCommonSort(array, start, length, null, 0);
    }
    /*
    grailSortStaticOOP(array, start, length) {
        let buffer = Array.newInstance(array[0].getClass(), GRAIL_STATIC_EXT_BUF_LEN);
        this.grailCommonSort(array, start, length, buffer, GRAIL_STATIC_EXT_BUF_LEN);
    }
    
    grailSortDynamicOOP(array, start, length) {
        let bufferLen = 1;
        while((bufferLen * bufferLen) < length) {
            bufferLen *= 2;
        }
        let buffer = Array.newInstance(array[0].getClass(), bufferLen);
        this.grailCommonSort(array, start, length, buffer, bufferLen);
    }*/
}
