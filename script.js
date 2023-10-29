import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';

const SORT_SPEED = 1;

const BAR_WIDTH = 15;
const BAR_MAX_HEIGH = 150;
const BAR_COLOR = [255, 255, 255, 0.8];
const BAR_COUNT = 15;
const DATA_VARIATION = 20;

const DEFAULT_STYLES = {
    width: BAR_WIDTH,
    maxHeight: BAR_MAX_HEIGH,
    color: BAR_COLOR,
    grow: false,
}

var arrayBar = [];
//populate random values into bars
function populateBars()
{
    arrayBar.length = 0;
    for(let i = 0; i < BAR_COUNT; i++)
    {
        arrayBar.push(Math.floor(Math.random() * DATA_VARIATION));
        // arrayBar.push(5-i)
        // arrayBar.push(i)
    }
};

var container = document.getElementById("container");
var dataReady = true;
let pause;
export { pause };

window.addEventListener("load", ()=>{
    let playBtn = document.getElementById("play");
    
    generateBars(arrayBar, container, DEFAULT_STYLES);

    let sorting = true;
    playBtn.addEventListener("click", function(){
        // Toggle button text and style
        if (sorting) {
            playBtn.style.background = "white";
            playBtn.style.color = "black";
            playBtn.innerHTML = "Stop";

            container = document.getElementById("container");
            container.innerHTML = '';

            console.log(container);

            DEFAULT_STYLES.grow = false;
            generateBars(arrayBar, container, DEFAULT_STYLES);

            // const SORT_TYPE = {
            //     insert: insertionSort(arrayBar, SORT_SPEED),
            //     bubble: bubbleSort(arrayBar, SORT_SPEED)
            // }


            if(dataReady) bubbleSort(arrayBar, SORT_SPEED);
        } else {
            pause = !sorting;
            playBtn.innerHTML = "Restart";
            playBtn.style.background = "transparent";
            playBtn.style.color = "white";
            container.innerHTML = '';
        }
        sorting = !sorting;

        // bubbleSort(arrayBar, SORT_SPEED);
    });

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


