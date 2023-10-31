import { htmlInterface } from "../htmlInterface/htmlInterface.js";

export function mergeSort(arrayToSort, time, upperBoundBarVal, sound, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    let limit = 0;
    console.log(arrayToSort)
    sort(arrayToSort, 0, arrayToSort.length - 1);

    //@pre first <= mid <= last
    //@post array[first...last] is sorted
    async function sort(array, first, last)
    {
        if(first < last)
        {
            let mid = (first + last) / 2; // get midpoint of array
            sort(array, first, mid); // sort 1st array
            sort(array, mid + 1, last); // sort 2nd array
            merge(array, first, mid, last); // merge both arrays
        }
    }

     function merge(array, first, mid, last)
    {
        if(limit > 15){return;}
        limit++;
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
                first1++;
            }
            else{
                tempArray[index] = array[first2];
                first2++; 
            }
            index++;
        }

        //finish 1st array if required
        while(first1 <= last1)
        {
            tempArray[index] = array[first1];
            first1++;
            index++;
        }
        //finish 2nd array if required
        while(first2 <= last2)
        {
            tempArray[index] = array[first2];
            first2++;
            index++;
        }

        //sorting complete, copy tempArray to array
        for (let i = first; i <= last; i++) {
            arrayToSort[i] = tempArray[i];
// htmlInterface.swapElements(arrayToSort[i + 1], arrayToSort[i], time);
        }
        console.log(arrayToSort)
    }
}