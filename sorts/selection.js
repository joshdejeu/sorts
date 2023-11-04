import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export async function selectionSort(arrayToSort, time, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    console.log(arrayToSort)

    //count of sorted items, start index, min val index
    async function sortLoop(start) {
        if (start < arrayToSort.length) {
            let newMin = start;
            let tmpStart = start;
            while (tmpStart < arrayToSort.length) {
                if (arrayToSort[tmpStart] < arrayToSort[newMin]) {
                    newMin = tmpStart;
                }
                tmpStart++;
            }
    
            console.log("min", newMin, start);
    
            let tmp = arrayToSort[start];
            arrayToSort[start] = arrayToSort[newMin];
            arrayToSort[newMin] = tmp;
    
            HTMLInterface.playSound(arrayToSort[start], upperBoundBarVal, sound, time);
            await HTMLInterface.swapElements(children[newMin], children[start], 555);
    
            await sortLoop(start + 1);
        }
    }
    
    await sortLoop(0);

   
    console.log(arrayToSort)
    onCompleteCallback();

    // HTMLInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound);
    // HTMLInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)");
    // HTMLInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)");
    // await HTMLInterface.swapElements(children[index1], children[index2], time);
}
