import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { htmlInterface } from './htmlInterface/htmlInterface.js';
const SORT_TYPE = {
    "insert": insertionSort,
    "bubble": bubbleSort,
    "merge": null,
}
const SORT_SPEED = 1;
const BAR_WIDTH = 10;
const BAR_GAP = 10;
const BAR_MAX_HEIGH = 100;
const BAR_COLOR = [255, 255, 255, 0.8];
const BAR_COUNT = 55;
const DATA_VARIATION = 20;
const SPAWN_SPEED = 50;

const DEFAULT_STYLES = {
    width: BAR_WIDTH,
    maxHeight: BAR_MAX_HEIGH,
    color: BAR_COLOR,
    // grow: SPAWN_SPEED != 0 ? true : false,
    grow: false,
}

var arrayBar = [];
//populate random values into bars
function populateBars()
{
    arrayBar.length = 0;
    for(let i = 0; i < BAR_COUNT; i++)
    {
        arrayBar.push(Math.floor(Math.random() * DATA_VARIATION) + 1);
        // arrayBar.push(BAR_COUNT-i)
        // arrayBar.push(i)
    }
};

var container;
var dataReady = true;
let pause;

export { pause };
export { SORT_SPEED }

let selected_sort = SORT_TYPE["insert"];
let sortingInProgress = false;

window.addEventListener("load", ()=>{
    container = document.getElementById("container");
    container.style.gap = BAR_GAP+"px";
    let playBtn = document.getElementById("play");
    
    generateBars(arrayBar, container, DEFAULT_STYLES, false);
    
    document.getElementById('sort_selection')
    .addEventListener('click', (e) => {
        htmlInterface.playSound(1.0);

        //get the 'data-sort' attribute of the element clicked
        //plug its value into the mapping of the sort funcitons and call that function
        selected_sort = SORT_TYPE[e.target.getAttribute('data-sort')];

        if(sortingInProgress)
        {
            htmlInterface.message(
                {
                    title: "Sorting Algorithm",
                    message: "Can't sort, a sorting algorithm is already in progress"
                }
            )
        }
        else
        {
            console.log("Sorting Begun")
            let sound = 'sound.mp3';
            
            sortingInProgress = true;
            selected_sort(arrayBar, SORT_SPEED, Math.max(...arrayBar), sound, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
            });
        }
    })

    // titleEffect("Insertion Sort");
});



function generateBars(bars, container, styles, spawnTime = 0)
{
    populateBars();
    dataReady = false;
    let index = 0;

    function processNextBar() {
        if (index < bars.length) {
            generateHtmlBar(bars[index], container, styles);
            index++;
            if(spawnTime != 0){setTimeout(processNextBar, spawnTime);} // Set the delay (in milliseconds) between iterations
            else{processNextBar();}
        }
    }

    processNextBar(); // Start the processing
    dataReady = true;
} 


function generateHtmlBar(barVal, container, styles)
{
    let bar = document.createElement('div');
    bar.className = 'bar';
    if(styles.grow){bar.style.animation = "grow 0.5s ease-in forwards"}
    else{bar.style.animation = "grow 0.0s ease-in forwards";}
    bar.style.color = `rgba(${styles.color[0]}, ${styles.color[1]}, ${styles.color[2]}, ${styles.color[3]})`;
    bar.style.width = styles.width+"px";
    let greatestBarValue = Math.max(...arrayBar)
    bar.style.height = `${styles.maxHeight * (barVal/greatestBarValue)}px`;



    let barNum = document.createElement('p1');
    barNum.className = 'barNum';
    barNum.innerHTML = barVal;


    bar.append(barNum);
    container.append(bar);
}


function titleEffect(str)
{
    str = str.toLowerCase();
    let title = document.getElementById('title');
    title.innerHTML = "";
    for (let i = 0; i < str.length; i++) {
        if(str[i] != " ")
        {
            title.innerHTML += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65);
        }else
        {
            title.innerHTML += " ";
        }
    }
}


