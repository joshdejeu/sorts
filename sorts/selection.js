import { HTMLInterface } from "../htmlInterface/htmlInterface.js";
import { sound, sort_speed } from '../script.js'




export async function selectionSort(arrayToSort, upperBoundBarVal, onCompleteCallback) {
    var container = document.getElementById("container");
    var children = container.children;

    console.log(arrayToSort)
    

    let start = 0;
    //count of sorted items, start index, min val index
    async function sortLoop() {
        if (start < arrayToSort.length) {

            let newMin = start;
            let tmpStart = start + 1;
            async function min()
            {
                if(tmpStart < arrayToSort.length)
                {
                    HTMLInterface.highlightElement(children[tmpStart], "rgba(10, 130, 220, 0.8)");
                    setTimeout(()=>{}, sort_speed);

                    if (arrayToSort[tmpStart] < arrayToSort[newMin]) {
                        newMin = tmpStart;
                    }

                    await new Promise((resolve) => setTimeout(resolve, sort_speed/4));
                    // HTMLInterface.playSound(arrayToSort[tmpStart], upperBoundBarVal, "error", sort_speed);
                    HTMLInterface.highlightElement(children[tmpStart], "rgba(255, 255, 255, 0.8)");

                    tmpStart++;
                    await min();
                }
            }
            await min();


            let tmp = arrayToSort[start];
            arrayToSort[start] = arrayToSort[newMin];
            arrayToSort[newMin] = tmp;

            
            HTMLInterface.playSound(arrayToSort[start], upperBoundBarVal, sound, sort_speed);
            HTMLInterface.highlightElement(children[start], "rgba(217, 70, 70, 0.8)");
            await swap(children[start], children[newMin], sort_speed);
            // await HTMLInterface.swapElements(children[start], children[newMin], 19999);
            HTMLInterface.highlightElement(children[newMin], "rgba(255, 255, 255, 0.8)");

            start = start + 1;
            await sortLoop();
        }
    }
    
    await sortLoop();

   
    console.log(arrayToSort)
    onCompleteCallback();

    // HTMLInterface.playSound(arrayToSort[index2], upperBoundBarVal, sound);
    // HTMLInterface.highlightElement(children[index2], "rgba(217, 70, 70, 0.8)");
    // HTMLInterface.highlightElement(children[index1], "rgba(255, 255, 255, 0.8)");
    // await HTMLInterface.swapElements(children[index1], children[index2], time);
}

// old html swap doesn't work for some reason, replace it with this whenever and test
async function swap(e1, e2, time)
{
    return new Promise((resolve) => {
        const element1 = e1;
        const element2 = e2;

        if (element1 && element2) {
            const parent = element1.parentNode;
            const temp = document.createElement('div'); // Create a temporary element
            parent.insertBefore(temp, element2);
            parent.insertBefore(element2, element1);
            parent.insertBefore(element1, temp);
            parent.removeChild(temp);
        }
        let resolved = false;
        // Resolve the Promise after a minimum of `milliseconds`
        if(time != "0" || time != 0)
        {
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, time);
        }else{

            resolve();
        }
    });
}