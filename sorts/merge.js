import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

export async function theMergeSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    console.log(arrayToSort)
    await mergeSortIterativeWithSwap(arrayToSort);
    console.log(arrayToSort)
    onCompleteCallback()


    async function mergeSortIterativeWithSwap(arr) {
        const len = arr.length;

        for (let size = 1; size < len; size *= 2) {
            for (let left = 0; left < len - 1; left += 2 * size) {
                const mid = Math.min(left + size - 1, len - 1);
                const right = Math.min(left + 2 * size - 1, len - 1);

                // Merge the current chunks
                await mergeWithSwap(arr, left, mid, right);
            }
        }
    }

    async function mergeWithSwap(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k++] = leftArr[i++];
            } else {
                arr[k++] = rightArr[j++];
            }

            await swap(children[left + i], children[k - 1], sort_speed);
        }

        while (i < leftArr.length) {
            arr[k++] = leftArr[i++];
            await swap(children[left + i - 1], children[k - 1], sort_speed);
        }

        while (j < rightArr.length) {
            arr[k++] = rightArr[j++];
            await swap(children[mid + 1 + j - 1], children[k - 1], sort_speed);
        }
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