import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

export async function selectionSort(arrayToSort, upperBoundBarVal, onCompleteCallback, defaultBarColor) {
    var container = document.getElementById("container");
    var children = container.children;

    // Initialize the start index for sorting
    let start = 0;

    // Asynchronous function to perform the main sorting loop
    async function sortLoop() {
        if (start < arrayToSort.length) {
            // Initialize the index of the current minimum value
            let newMin = start;
            // Initialize a temporary start index
            let tmpStart = start + 1;

            // Asynchronous function to find the minimum value
            async function min() {
                if (tmpStart < arrayToSort.length) {
                    // Highlight the current element being checked
                    HTMLInterface.highlightElement(children[tmpStart], "rgba(10, 130, 220, 0.8)");

                    // Compare the current element with the current minimum
                    if (arrayToSort[tmpStart] < arrayToSort[newMin]) {
                        newMin = tmpStart;
                    }

                    // Highlight the current smallest value found
                    HTMLInterface.highlightElement(children[newMin], "rgba(10, 220, 13, 0.8)");

                    // Delay for sorting speed, if set
                    if (sort_speed != 0 || sort_speed != "0") await new Promise((resolve) => setTimeout(resolve, sort_speed / 4));

                    // Remove highlight from the checked element
                    HTMLInterface.highlightElement(children[tmpStart], defaultBarColor);
                    HTMLInterface.highlightElement(children[newMin], defaultBarColor);

                    // Move to the next element
                    tmpStart++;
                    await min(); // Recursively call the 'min' function
                }
            }
            await min(); // Start the 'min' function

            // Swap the values at the start index and the minimum value index
            let tmp = arrayToSort[start];
            arrayToSort[start] = arrayToSort[newMin];
            arrayToSort[newMin] = tmp;

            // Play a sound and highlight the swapped elements
            HTMLInterface.playSound(arrayToSort[newMin], upperBoundBarVal, sound);

            HTMLInterface.highlightElement(children[start], "rgba(217, 70, 70, 0.8)");

            // Perform the visual swap of elements
            await HTMLInterface.swap(children[start], children[newMin]);

            HTMLInterface.highlightElement(children[newMin], defaultBarColor);

            // Move to the next element
            start = start + 1;
            await sortLoop(); // Recursively call the 'sortLoop' function
        }
    }

    await sortLoop(); // Start the sorting process
    await HTMLInterface.bloop(arrayToSort, children, upperBoundBarVal, defaultBarColor)
    onCompleteCallback(); // Call the completion callback function
}