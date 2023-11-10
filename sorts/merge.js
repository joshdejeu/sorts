import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

export async function theMergeSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;
    console.log(arrayToSort)
    await mergeSort(arrayToSort);
    console.log(arrayToSort)
    onCompleteCallback()


    async function mergeSort(arr) {
        const n = arr.length;
        const temp = new Array(n);

        for (let size = 1; size < n; size *= 2) {
            for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * size) {
                const leftEnd = Math.min(leftStart + size - 1, n - 1);
                const rightStart = leftEnd + 1;
                const rightEnd = Math.min(leftStart + 2 * size - 1, n - 1);

                // Visualize the merge by swapping elements
                // await swap(children[leftStart], children[rightStart], 100); // Adjust the time delay as needed
                merge(arr, temp, leftStart, leftEnd, rightStart, rightEnd);
            }
        }

        return arr;
    }

    function merge(arr, temp, leftStart, leftEnd, rightStart, rightEnd) {
        let i = leftStart;
        let j = rightStart;
        let k = leftStart;

        while (i <= leftEnd && j <= rightEnd) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }

        while (i <= leftEnd) {
            temp[k++] = arr[i++];
        }

        while (j <= rightEnd) {
            temp[k++] = arr[j++];
        }

        for (let x = leftStart; x <= rightEnd; x++) {
            arr[x] = temp[x];
        }
    }

}


async function swap(element1, element2, time) {
    return new Promise((resolve) => {
      const parent = element1.parentNode;
      const temp = document.createElement('div'); // Create a temporary element
      parent.insertBefore(temp, element1);
      parent.insertBefore(element1, element2.nextSibling); // Use element2.nextSibling to correctly insert after element2
      parent.insertBefore(element2, temp);
      parent.removeChild(temp);
  
      // Resolve the Promise after a minimum of `time` milliseconds
      if (time !== 0) {
        setTimeout(() => {
          resolve();
        }, time);
      } else {
        resolve();
      }
    });
  }
  