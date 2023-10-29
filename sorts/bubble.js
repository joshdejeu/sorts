import { htmlInterface } from "../htmlInterface/htmlInterface.js";


export function bubbleSort(arrayToSort, time) {
    var container = document.getElementById("container");
    var children = container.children;
    let sortedCount = 0;
    let pos = 0;


    function sort(){
        if(sortedCount >= arrayToSort.length)return;//base case
        // htmlIn3terface.highlightElement(children[pos + 1], "rgba(255, 255, 255, 0.8)");
        if(pos != -1 && arrayToSort[pos+1] < arrayToSort[pos])
        {
            htmlInterface.swapElements(children[pos + 1], children[pos]);
            [arrayToSort[pos], arrayToSort[pos + 1]] = [arrayToSort[pos + 1], arrayToSort[pos]];
            
            
            htmlInterface.highlightElement(children[pos], "rgba(217, 70, 70, 0.8)");
            htmlInterface.highlightElement(children[pos + 1], "rgba(255, 255, 255, 0.8)");
            pos--;
        }else{
            sortedCount++;
            pos = sortedCount;
        }
        setTimeout(sort, time);
    }
    sort();
}