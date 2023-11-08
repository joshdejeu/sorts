import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

export function insertionSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
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
                    HTMLInterface.playSound(arrayToSort[j + 1], upperBoundBarVal, sound, sort_speed);

                    // Highlight the element being moved in red
                    HTMLInterface.highlightElement(children[j + 1], "rgba(217, 70, 70, 0.8)", sort_speed);

                    // Swap elements and apply time delay
                    await HTMLInterface.swapElements(children[j + 1], children[j], sort_speed);

                    // Move to the previous element
                    j--;
                    innerStep();
                } else {
                    // Set the 'key' in its sorted position
                    arrayToSort[j + 1] = key;

                    // Reset the highlighting for the newly sorted element
                    HTMLInterface.highlightElement(children[j + 1], "rgba(255, 255, 255, 0.8)", sort_speed);

                    // Move to the next 'i' and increment the sorted elements counter
                    i++;
                    sortedCount++;
                    step();
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
