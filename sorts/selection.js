import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export async function selectionSort(arrayToSort, time, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;


    function getMin(start, min)
    {
        if(start < arrayToSort.length)
        {
            //check each for min
            if(arrayToSort[min] > arrayToSort[start])
            {
                min = start;                
            }
            getMin(start + 1, min);
        }
        return min;
    }

    async function sortLoop(sortedCount, start, newMin)
    {
        if(sortedCount < arrayToSort.length)
        {
            newMin = getMin(start, newMin);
            console.log(arrayToSort[newMin])

            // [arrayToSort[sortedCount], arrayToSort[m]] = [arrayToSort[m], arrayToSort[sortedCount]];
            let tmp = arrayToSort[sortedCount];
            arrayToSort[sortedCount] = arrayToSort[newMin];
            arrayToSort[newMin] = tmp;

            await HTMLInterface.swapElements(children[sortedCount], children[newMin], time);

            await sortLoop(sortedCount + 1, start + 1, newMin);
        }
    }
    await sortLoop(0, 0, 0);


    console.log(arrayToSort)
    onCompleteCallback();

    // HTMLInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound);
    // HTMLInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)");
    // HTMLInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)");
    // await HTMLInterface.swapElements(children[index1], children[index2], time);
}
