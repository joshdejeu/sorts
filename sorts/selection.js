// Import necessary modules and variables from other files
import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'

// Define an asynchronous function for performing selection sort
export async function selectionSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
    // Get the container element from the HTML
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
                    HTMLInterface.highlightElement(children[tmpStart], "rgba(255, 255, 255, 0.8)");
                    HTMLInterface.highlightElement(children[newMin], "rgba(255, 255, 255, 0.8)");

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
            HTMLInterface.playSound(arrayToSort[newMin], upperBoundBarVal, sound, sort_speed);
            HTMLInterface.highlightElement(children[start], "rgba(217, 70, 70, 0.8)");

            // Perform the visual swap of elements
            await swap(children[start], children[newMin], sort_speed);
            HTMLInterface.highlightElement(children[newMin], "rgba(255, 255, 255, 0.8)");

            // Move to the next element
            start = start + 1;
            await sortLoop(); // Recursively call the 'sortLoop' function
        }
    }

    await sortLoop(); // Start the sorting process
    onCompleteCallback(); // Call the completion callback function
}

// Asynchronous function to swap two HTML elements visually
async function swap(e1, e2, time) {
    return new Promise((resolve) => {
        const element1 = e1;
        const element2 = e2;

        if (element1 && element2) {
            // Swap the positions of the two elements in the DOM
            const parent = element1.parentNode;
            const temp = document.createElement('div'); // Create a temporary element
            parent.insertBefore(temp, element2);
            parent.insertBefore(element2, element1);
            parent.insertBefore(element1, temp);
            parent.removeChild(temp);
        }

        let resolved = false;
        // Resolve the Promise after a minimum of `time` milliseconds
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
