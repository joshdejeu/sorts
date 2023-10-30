import { htmlInterface } from "../htmlInterface/htmlInterface.js";


export function bubbleSort(arrayToSort, time, upperBoundBarVal, sound, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;

    console.log("Original Array",arrayToSort);
    let i = 0;
    // let sorted = false;
    let sortedCount = 0;
    function sort()
    {
        //base case
        if(sortedCount >= arrayToSort.length){onCompleteCallback();return;}

        //if index isn't at the very end
        //AND left is greater than right
        if(i <= arrayToSort.length && arrayToSort[i] > arrayToSort[i + 1])
        {
            //swap left with right
            // [arrayToSort[i], arrayToSort[i + 1]] = [arrayToSort[i + 1], arrayToSort[i]];
            let tmp = arrayToSort[i];
            arrayToSort[i] = arrayToSort[i+1];
            arrayToSort[i+1]=tmp;
            htmlInterface.swapElements(children[i + 1], children[i]);
            console.log(arrayToSort)
            //left is bigger than right
            let j = i + 1; //new position of left item
            function innerSort()
            {
                //if jndex isn't at the very end
                //AND left is still greater than right
                if(j <= arrayToSort.length && arrayToSort[j] > arrayToSort[j + 1])
                {
                    let tmp2 = arrayToSort[j];
                    arrayToSort[j] = arrayToSort[j+1];
                    arrayToSort[j+1]=tmp;
                    htmlInterface.swapElements(children[j + 1], children[j]);
                    console.log("INNER",arrayToSort)
                    // [arrayToSort[j], arrayToSort[j + 1]] = [arrayToSort[j + 1], arrayToSort[j]];
                }
                else{return;}
                j++;
                setTimeout(innerSort, time);
            }
            innerSort();
        }
        else
        {
            i++;
            sortedCount++;
        }
        setTimeout(sort, time);
    }
    sort();

}