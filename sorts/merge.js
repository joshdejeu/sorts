import { htmlInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export async function mergeSort(arrayToSort, time, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    let limit = 0;
    console.log('original',arrayToSort)
    await sort(arrayToSort, 0, arrayToSort.length - 1);
    console.log(arrayToSort)
    onCompleteCallback();

    //@pre first <= mid <= last
    //@post array[first...last] is sorted
    async function sort(array, first, last)
    {
        if(first < last)
        {
            let mid = Math.floor((first + last) / 2); // get midpoint of array
            await sort(array, first, mid); // sort 1st array
            await sort(array, mid + 1, last); // sort 2nd array
            await merge(array, first, mid, last); // merge both arrays
        }
    }

    async function merge(array, first, mid, last)
    {
        let tempArray = new Array(arrayToSort.length); // Create an empty array
    
        let first1 = first;     //start of array1
        let last1 = mid;        //end of array2
        let first2 = mid + 1;   //start of array2
        let last2 = last;       //end of array2

        //while both arrays are not empty
        //sort items to tempArray
        let index = first1;
        while((first1 <= last1) && (first2 <= last2))
        {
            if(array[first1] <= array[first2])
            {
                tempArray[index] = array[first1];
                await highlightAndSwap(index, first1);
                first1++;
            }
            else{
                tempArray[index] = array[first2];
                await highlightAndSwap(index, first1);
                first2++; 
            }
            index++;
        }

        //finish 1st array if required
        while(first1 <= last1)
        {
            tempArray[index] = array[first1];
            await highlightAndSwap(index, first1);
            first1++;
            index++;
        }
        //finish 2nd array if required
        while(first2 <= last2)
        {
            tempArray[index] = array[first2];
            await highlightAndSwap(index, first2);
            first2++;
            index++;
        }
    }

    //highlight HTML element and swap it on the DOM
    async function highlightAndSwap(index1, index2)
    {
        htmlInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound);
        htmlInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)");
        htmlInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)");
        await htmlInterface.swapElements(children[index1], children[index2], time); // Swap corresponding HTML elements
        htmlInterface.highlightElement(children[index2], "rgba(255, 255, 255, 0.8)");
        // htmlInterface.highlightElement(children[index1], "rgba(217, 70, 70, 0.8)");
    
    }
}