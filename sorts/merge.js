import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

export async function theMergeSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    console.log(arrayToSort)
    arrayToSort = await mergeSort(arrayToSort, children);
    console.log(arrayToSort)
    onCompleteCallback();


    async function mergeSort(array, children){
        if(array.length <= 1)
        {
            console.log(array)
            return [array, children];
        }

        const middleIndex = Math.floor(array.length / 2);
        const leftArr = array.slice(0, middleIndex);
        const rightArr = array.slice(middleIndex);

        const leftChildren = Array.from(children).slice(0, middleIndex);
        const rightChildren = Array.from(children).slice(middleIndex);

        return await merge(
            await mergeSort(leftArr, leftChildren),
            await mergeSort(rightArr, rightChildren),
        )
    }
    function intToArray(number) {
        if (Number.isInteger(number)) {
            return [number];
        } else {
            return number;
        }
    }
    async function merge(thing1, thing2) {
        const [leftArr, leftChildren] = thing1;
        const [rightArr, rightChildren] = thing2;

        const output = [];
        let leftIndex = 0;
        let rightIndex = 0;
        
        while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
            const leftEl = leftArr[leftIndex];
            const rightEl = rightArr[rightIndex];
    
            if (leftEl < rightEl) {
                // Swap the elements in the HTML
                await swap(rightChildren[rightIndex], rightChildren[leftIndex], sort_speed);
                output.push(leftEl);
                leftIndex++;
            } else {
                // Swap the elements in the HTML
                await swap(leftChildren[leftIndex], leftChildren[rightIndex], sort_speed);
                output.push(rightEl);
                rightIndex++;
            }
        }

         // Copy any remaining elements from leftArr and rightArr
        const remainingLeft = intToArray(leftArr).slice(leftIndex);
        const remainingRight = intToArray(rightArr).slice(rightIndex);

        output.push(...remainingLeft, ...remainingRight);

        return output;
    }


    //highlight HTML element and swap it on the DOM
    async function highlightAndSwap(index1, index2) {
        HTMLInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound, sort_speed);
        HTMLInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)", sort_speed);
        HTMLInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)", sort_speed);
        await HTMLInterface.swapElements(children[index1], children[index2], time); // Swap corresponding HTML elements
        HTMLInterface.highlightElement(children[index2], "rgba(255, 255, 255, 0.8)", sort_speed);
        // htmlInterface.highlightElement(children[index1], "rgba(217, 70, 70, 0.8)");

    }
}


async function swap(e1, e2, time) {
    return new Promise((resolve) => {
        const element1 = e1;
        const element2 = e2;

        if (element1 && element2) {
            const parent = element1.parentNode;
            const temp = document.createElement('div'); // Create a temporary element
            parent.insertBefore(temp, element2);
            parent.insertBefore(element2, element1);
            parent.insertBefore(element1, temp);
            parent.removeChild(temp);
        }
        let resolved = false;
        // Resolve the Promise after a minimum of `milliseconds`
        if (time != "0" || time != 0) {
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, time);
        } else {

            resolve();
        }
    });
}