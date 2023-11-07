import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export async function theMergeSort(arrayToSort, time, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    console.log(arrayToSort)
    arrayToSort = await mergeSort(arrayToSort);
    console.log(arrayToSort)
    onCompleteCallback();


    async function mergeSort(array) {
        const half = array.length / 2

        if (array.length < 2) {
            return array
        }

        const left = array.splice(0, half)
        return await merge(await mergeSort(left), await mergeSort(array))
    }

    async function merge(left, right) {
        let arr = []

        while (left.length && right.length) {
            if (left[0] < right[0]) {
                let leftI = left.shift();
                let arrI = arr.length;
                // await swap(children[leftI], children[arrI])
                await swap(children[arrI], children[leftI])

                arr.push(leftI)
            } else {
                let rightI = right.shift();
                let arrI = arr.length;
                // await swap(children[rightI], children[arrI])
                await swap(children[arrI], children[rightI])
                
                arr.push(rightI)

            }
        }

        return [...arr, ...left, ...right]
    }




    //highlight HTML element and swap it on the DOM
    async function highlightAndSwap(index1, index2) {
        HTMLInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound, time);
        HTMLInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)", time);
        HTMLInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)", time);
        await HTMLInterface.swapElements(children[index1], children[index2], time); // Swap corresponding HTML elements
        HTMLInterface.highlightElement(children[index2], "rgba(255, 255, 255, 0.8)", time);
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