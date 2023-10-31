import { htmlInterface } from "../htmlInterface/htmlInterface.js";

export async function bubbleSort(arrayToSort, time, upperBoundBarVal, sound, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;

    console.log("Original Array", arrayToSort);
    let i = arrayToSort.length - 1;
    let sortedCount = 0;

    async function sort() {
        if (sortedCount >= arrayToSort.length) {
            onCompleteCallback();
            return;
        }

        if (i > 0) {
            let j = 0;

            async function innerSort() {
                if (j < i) {
                    if (arrayToSort[j] > arrayToSort[j + 1]) {
                        // Swap elements and perform related operations
                        [arrayToSort[j], arrayToSort[j + 1]] = [arrayToSort[j + 1], arrayToSort[j]];

                        // Highlight elements during the swap
                        htmlInterface.highlightElement(children[j], "rgba(217, 70, 70, 0.8)");
                        htmlInterface.highlightElement(children[j + 1], "rgba(255, 255, 255, 0.8)");

                        // Play sound and swap elements
                        htmlInterface.playSound(arrayToSort[j], upperBoundBarVal, sound);
                        await htmlInterface.swapElements(children[j + 1], children[j], time);

                        // Reset highlighting
                        htmlInterface.highlightElement(children[j], "rgba(255, 255, 255, 0.8)");
                        htmlInterface.highlightElement(children[j + 1], "rgba(255, 255, 255, 0.8)");

                        // Continue the inner sort
                        j++;
                        innerSort();
                    } else {
                        // No swap needed, move to the next element
                        j++;
                        innerSort();
                    }
                } else {
                    // Decrement the outer loop index and reset inner loop index
                    i--;
                    j = 0;
                    sortedCount++;

                    // Continue the outer sort
                    sort();
                }
            }

            // Start the inner sort
            innerSort();
        } else {
            // Decrement the outer loop index and reset inner loop index
            i--;
            sortedCount++;

            // Continue the outer sort
            sort();
        }
    }

    // Start the sorting process
    sort();
}
