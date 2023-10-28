import { htmlInterface } from "../htmlInterface/htmlInterface.js";


export function bubbleSort(arrayToSort, time) {
    let sortedCount = 0;
    let pos = 0;
    while(sortedCount < arrayToSort.length)
    {
        //if pos is in unsorted region
        //AND right is less than left
        //AND indexPosition isn't at 0 (meaning its been shifted all the way)
        if(pos != -1 && arrayToSort[pos+1] < arrayToSort[pos])
        {
            [arrayToSort[pos], arrayToSort[pos + 1]] = [arrayToSort[pos + 1], arrayToSort[pos]];
            pos--;
        }else{
            sortedCount++;
            pos = sortedCount;
        }
        disp.innerHTML = arrayToSort;
    }

}