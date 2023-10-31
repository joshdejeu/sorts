import { htmlInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export function insertionSort(arrayToSort, time, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;

    let i = 1;
    let sortedCount = 0; // Initialize a counter for sorted elements

    function step() {
        // If 'i' is within the array bounds
        if (i < arrayToSort.length) {
            let key = arrayToSort[i];
            let j = i - 1;

            async function innerStep() {
                // Base case: Sorting is complete, call the onCompleteCallback

                // If 'j' is within array bounds and the element is greater than the 'key'
                if (j >= 0 && arrayToSort[j] > key) {
                    // Shift elements and perform related operations
                    arrayToSort[j + 1] = arrayToSort[j];
                    htmlInterface.playSound(arrayToSort[j + 1], upperBoundBarVal, sound);

                    // Highlight the element being moved in red
                    htmlInterface.highlightElement(children[j + 1], "rgba(217, 70, 70, 0.8)");

                    // Swap elements and apply time delay
                    await htmlInterface.swapElements(children[j + 1], children[j], time);

                    // Move to the previous element
                    j--;
                    innerStep();
                } else {
                    // Set the 'key' in its sorted position
                    arrayToSort[j + 1] = key;

                    // Reset the highlighting for the newly sorted element
                    htmlInterface.highlightElement(children[j + 1], "rgba(255, 255, 255, 0.8)");

                    // Move to the next 'i' and increment the sorted elements counter
                    i++;
                    sortedCount++;

                    // Continue the sorting process with or without a time delay
                    if (time != 0) {
                        step();
                    } else {
                        step();
                    }
                }
            }

            // Start the inner sorting process
             innerStep();
        }
        else if (sortedCount == arrayToSort.length - 1) {
            onCompleteCallback(); // Call the onCompleteCallback
        }
    }

    // Start the sorting process
    step();
}
