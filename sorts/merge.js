import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export async function theMergeSort(arrayToSort, time, upperBoundBarVal, onCompleteCallback, SORT_SPEED) {
    var container = document.getElementById("container");
    var children = container.children;
    let limit = 0;
    console.log('original', arrayToSort)
    await mergeSort(arrayToSort, 0, arrayToSort.length - 1);
    console.log(arrayToSort)
    onCompleteCallback();

    //@pre first <= mid <= last
    //@post array[first...last] is sorted
    // Function to call mergeSort recursively and visualize the process
    async function mergeSort(array, start, end) {
        if (start >= end) {
            return [array[start]];
        }

        const middle = Math.floor((start + end) / 2);
        const left = await mergeSort(array, start, middle);
        const right = await mergeSort(array, middle + 1, end);

        return await merge(left, right, start, middle, end);
    }

    // Function to merge two sorted arrays with visualization
    async function merge(left, right, start, middle, end) {
        const merged = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex] < right[rightIndex]) {
                merged.push(left[leftIndex]);
                await highlightAndSwap(start + leftIndex, start + left.length + rightIndex);
                leftIndex++;
            } else {
                merged.push(right[rightIndex]);
                await highlightAndSwap(start + left.length + rightIndex, start + leftIndex);
                rightIndex++;
            }
        }

        while (leftIndex < left.length) {
            merged.push(left[leftIndex]);
            leftIndex++;
        }

        while (rightIndex < right.length) {
            merged.push(right[rightIndex]);
            rightIndex++;
        }

     

        return merged;
    }


    //highlight HTML element and swap it on the DOM
    async function highlightAndSwap(index1, index2) {
        HTMLInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound, SORT_SPEED);
        HTMLInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)", SORT_SPEED);
        HTMLInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)", SORT_SPEED);
        await HTMLInterface.swapElements(children[index1], children[index2], time); // Swap corresponding HTML elements
        HTMLInterface.highlightElement(children[index2], "rgba(255, 255, 255, 0.8)", SORT_SPEED);
        // htmlInterface.highlightElement(children[index1], "rgba(217, 70, 70, 0.8)");

    }
}