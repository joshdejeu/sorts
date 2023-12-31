import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound } from '../script.js'

export function insertionSort(arrayToSort, onCompleteCallback, defaultBarColor) {
    var container = document.getElementById("container");
    var children = container.children;

    let i = 1;
    let sortedCount = 0; // Initialize a counter for sorted elements

    async function step() {
        // If 'i' is within the array bounds
        if (i < arrayToSort.length) {
            let key = arrayToSort[i];
            let j = i - 1;

            async function innerStep() {
                // Base case: Sorting is complete, call the onCompleteCallback

                HTMLInterface.highlightElement(children[i], "rgba(10, 130, 220, 0.8)");//highlight location of sort currently
                // If 'j' is within array bounds and the element is greater than the 'key'
                if (j >= 0 && arrayToSort[j] > key) {
                    // Shift elements and perform related operations
                    arrayToSort[j + 1] = arrayToSort[j];
                    HTMLInterface.playSound(arrayToSort[j + 1], sound);

                    // Highlight the element being moved in red
                    HTMLInterface.highlightElement(children[j + 1], "rgba(217, 70, 70, 0.8)");

                    // Swap elements and apply time delay
                    await HTMLInterface.swap(children[j + 1], children[j]);

                    // Move to the previous element
                    j--;
                    innerStep();
                } else {
                    // Set the 'key' in its sorted position
                    arrayToSort[j + 1] = key;

                    // Reset the highlighting for the newly sorted element
                    
                    HTMLInterface.highlightElement(children[j + 1], defaultBarColor);
                    // Move to the next 'i' and increment the sorted elements counter
                    i++;
                    sortedCount++;
                    step();
                }
                HTMLInterface.highlightElement(children[j + 1], defaultBarColor);
                // HTMLInterface.highlightElement(children[i-2], defaultBarColor);

            }

            // Start the inner sorting process
            innerStep();
        }
        else if (sortedCount == arrayToSort.length - 1) {
            await HTMLInterface.bloop(arrayToSort, children, defaultBarColor);
            onCompleteCallback(); // Call the onCompleteCallback
        }
    }

    // Start the sorting process
    step();
}
