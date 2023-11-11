import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

export async function theMergeSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;


    const mergeSort = async (arr) =>  {
        //Create two arrays for sorting
        let sorted = Array.from(arr);
        let n = sorted.length;
        let buffer = new Array(n);

        for (let size = 1; size < n; size *= 2) {
            for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {

                //Get the two sub arrays
                let left = leftStart,
                    right = Math.min(left + size, n),
                    leftLimit = right,
                    rightLimit = Math.min(right + size, n);

                //Merge the sub arrays
                await merge(left, right, leftLimit, rightLimit, sorted, buffer);
            }

            //Swap the sorted sub array and merge them
            let temp = sorted;
            sorted = buffer;
            buffer = temp;
        }

        return sorted;
    }

    const merge = async (left, right, leftLimit, rightLimit, sorted, buffer) => {
        let i = left;

        //Compare the two sub arrays and merge them in the sorted order
        while (left < leftLimit && right < rightLimit) {
            if (sorted[left] <= sorted[right]) {
                buffer[i++] = sorted[left++];
            } else {
                HTMLInterface.playSound(arrayToSort[i], upperBoundBarVal, sound, sort_speed);
                HTMLInterface.highlightElement(children[right], "rgba(217, 70, 70, 0.8)", sort_speed);
                await swap(children[i], children[right], sort_speed);
                HTMLInterface.highlightElement(children[i], "rgba(255, 255, 255, 0.8)", sort_speed);
                buffer[i++] = sorted[right++];
            }

        }

        //If there are elements in the left sub arrray then add it to the result
        while (left < leftLimit) {
            buffer[i++] = sorted[left++];
        }

        //If there are elements in the right sub array then add it to the result
        while (right < rightLimit) {
            buffer[i++] = sorted[right++];
        }
    }

    console.log(arrayToSort)
    arrayToSort = await mergeSort(arrayToSort);

    console.log(arrayToSort)
    onCompleteCallback()
}



async function swap(element1, element2, sort_speed) {
    return new Promise((resolve) => {
        const parent = element1.parentNode;
        const temp = document.createElement('div'); // Create a temporary element
        parent.insertBefore(temp, element1);
        parent.insertBefore(element1, element2.nextSibling); // Use element2.nextSibling to correctly insert after element2
        parent.insertBefore(element2, temp);
        parent.removeChild(temp);

        // Resolve the Promise after a minimum of `sort_speed` milliseconds
        if (sort_speed !== 0) {
            setTimeout(() => {
                resolve();
            }, sort_speed);
        } else {
            resolve();
        }
    });
}
