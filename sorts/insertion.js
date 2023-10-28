import { htmlInterface } from "../htmlInterface/htmlInterface.js";
import { pause } from "../script.js";

export function insertionSort(arrayToSort, time) {
    var container = document.getElementById("container");
    var children = container.children;
    console.log("Sorting begun", arrayToSort)

    // console.log("Original Array", arrayToSort);

    let i = 1;
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
                    // console.log("A iteration:", arrayToSort);
                    htmlInterface.highlightElement(children[j+1], "rgba(255, 255, 255, 0.8)"); // Highlight the element in 
                    
                    i++;
                    
                    if(time!=0){setTimeout(step, time);} // Call step function after
                    else{step();}
                    if (i === arrayToSort.length) {
                        Array.from(children).forEach(child => {
                            htmlInterface.highlightElement(child, "rgb(100,200,120)")
                        });
                    }
                }
            }

            innerStep();
        }
    }

    step();

}

// function swapElements(element1, element2) {
//     if (element1.parentNode === element2.parentNode) {
//         const parent = element1.parentNode;
//         const nextSibling = element1.nextSibling === element2 ? element1 : element2;
//         parent.insertBefore(element1, nextSibling);
//     } else {
//         console.error("Elements have different parents, cannot swap.");
//     }
// }
// function highlightElement(element, color) {
//     element.style.background = color;
// }