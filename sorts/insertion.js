import { htmlInterface } from "../htmlInterface/htmlInterface.js";
import { pause } from "../script.js";

export function insertionSort(arrayToSort, time, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;

    let i = 1;
    let sortedCount = 0; // Initialize a counter for sorted elements

    function step() {
        if(pause)return;
        if (i < arrayToSort.length) {
            let key = arrayToSort[i];
            let j = i - 1;

            function innerStep() {
                if(pause){
                    clearTimeout(innerStep);
                    clearTimeout(step);    
                    return;
                }
                if (j >= 0 && arrayToSort[j] > key) {
                    arrayToSort[j + 1] = arrayToSort[j];
                    htmlInterface.swapElements(children[j + 1], children[j]);
                    htmlInterface.highlightElement(children[j], "rgba(217, 70, 70, 0.8)"); // Highlight the element in red
                    htmlInterface.sound(j+1);
                    j--;
                    if(time!=0){setTimeout(innerStep, time);} // Call innerStep function after 500ms
                    else{innerStep();}
                } else {
                    arrayToSort[j + 1] = key;
                    htmlInterface.highlightElement(children[j+1], "rgba(255, 255, 255, 0.8)"); // Highlight the element in 
                    
                    i++;
                    sortedCount++; // Increment the counter for sorted elements

                    if(time!=0){setTimeout(step, time);} // if no time delay chosen then no timeout
                    else{step();}
                    if (sortedCount === arrayToSort.length - 1) {
                        // Sorting is complete, call the onCompleteCallback
                        onCompleteCallback();
                    //     Array.from(children).forEach(child => {
                    //         htmlInterface.highlightElement(child, "rgb(100,200,120)")
                    //     });
                    }
                }
            }

            innerStep();
        }
    }
    step();
}