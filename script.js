import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { htmlInterface } from './htmlInterface/htmlInterface.js';
import { SortSettings } from './htmlInterface/classes/sortSettings.js';

// let defaultSettings = new SortSettings();
// console.log(defaultSettings.SORT_SPEED)

const SORT_TYPE = {
    "insertion": insertionSort,
    "bubble": bubbleSort,
    "merge": null,
}
const SORT_SPEED = 150;
const BAR_WIDTH = 15;
const BAR_GAP = 10;
const BAR_MAX_HEIGH = 150;
const BAR_COLOR = [255, 255, 255, 0.8];
const BAR_COUNT = 5;
const DATA_VARIATION = 5;
const SPAWN_SPEED = 50;
const BAR_UPPER_VALUE_LIMIT = DATA_VARIATION;

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
        // arrayBar.push(Math.floor(Math.random() * DATA_VARIATION) + 1);
        arrayBar.push(BAR_COUNT-i)
        // arrayBar.push(i)
    }
};

var container;
var dataReady = true;
let pause;
let stopScramble = false;
let sound = 'dream.mp3';

export { pause };
export { SORT_SPEED }

let selected_sort = SORT_TYPE["insert"];
let sortingInProgress = false;

window.addEventListener("load", ()=>{
    titleEffect();

    container = document.getElementById("container");
    container.style.gap = BAR_GAP+"px";
    let playBtn = document.getElementById("play");
    
    generateBars(arrayBar, container, DEFAULT_STYLES, false);
    
    document.getElementById('sound_selection')
    .addEventListener('click', (e) => {
        let htmlSoundSelected = e.target.getAttribute('data-sound');
        sound = `${htmlSoundSelected}.mp3`;
        const selectedAudio = new Audio('./htmlInterface/sounds/'+sound);
        selectedAudio.volume = 0.6;
        selectedAudio.play()
        for (let i = 0; i < document.getElementsByClassName('sound').length; i++) {
            document.getElementsByClassName('sound')[i].className='sound';
        }
        e.target.className = 'sound active';
    });

    document.getElementById('sort_selection')
    .addEventListener('click', (e) => {
        for (let i = 0; i < document.getElementsByClassName('sort').length; i++) {
            document.getElementsByClassName('sort')[i].className='sort';
        }
        e.target.className = 'sort active'
        let htmlSortSelected = e.target.getAttribute('data-sort')
        selected_sort = SORT_TYPE[htmlSortSelected];
        stopScramble = true;


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
            sortingInProgress = true;
            selected_sort(arrayBar, SORT_SPEED, BAR_UPPER_VALUE_LIMIT, sound, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                stopScramble = false;
                document.querySelector('body').append(titleEl);
                titleEffect();
            });
        }
    })

});




function generateBars(bars, container, styles, spawnTime = 0)
{
    populateBars();
    dataReady = false;
    let index = 0;

    function processNextBar() {
        if (index < bars.length) {
            htmlInterface.generateHtmlBar(bars[index], container, styles, BAR_UPPER_VALUE_LIMIT);
            index++;
            if(spawnTime != 0){setTimeout(processNextBar, spawnTime);} // Set the delay (in milliseconds) between iterations
            else{processNextBar();}
        }
    }

    processNextBar(); // Start the processing
    dataReady = true;
} 





let titleEl;
import { TextScramble } from './htmlInterface/textScramble.js'
function titleEffect()
{
    const phrases = [
        'Wake up, Neo',
        'select a sort...',
    ]

    const el = document.getElementById("title")
    const fx = new TextScramble(el)
    let counter = 0
    const next = () => {
        if(stopScramble){
            clearTimeout(next);
            titleEl = el;
            el.remove();
        }
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 800)
      })
      counter = (counter + 1) % phrases.length
    }
    next();
}


