import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export async function bubbleSort(arrayToSort, onCompleteCallback, defaultBarColor) {
    var container = document.getElementById("container");
    var children = container.children;

    let i = arrayToSort.length - 1;
    let sortedCount = 0;

    async function sort() {
        if (sortedCount >= arrayToSort.length) {
            await HTMLInterface.bloop(arrayToSort, children, defaultBarColor)
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
                        HTMLInterface.highlightElement(children[j], "rgba(217, 70, 70, 0.8)");
                        HTMLInterface.highlightElement(children[j + 1], defaultBarColor);

                        // Play sound and swap elements
                        HTMLInterface.playSound(arrayToSort[j], sound);
                        await HTMLInterface.swap(children[j + 1], children[j]);

                        // Reset highlighting
                        HTMLInterface.highlightElement(children[j], defaultBarColor);
                        HTMLInterface.highlightElement(children[j + 1], defaultBarColor);

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


