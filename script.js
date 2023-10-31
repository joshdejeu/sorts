import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { htmlInterface } from './htmlInterface/htmlInterface.js';
import { SortSettings } from './htmlInterface/classes/sortSettings.js';

// let defaultSettings = new SortSettings();
// console.log(defaultSettings.SORT_SPEED)

//TRUE for bars to decent in order (worst case), FALSE for random values
const IN_ORDER = false;

const SORT_TYPE = {
    "insertion": insertionSort,
    "bubble": bubbleSort,
    "merge": null,
}
const SORT_SPEED = 20;
const BAR_WIDTH = 15;
const BAR_GAP = 10;
const BAR_MAX_HEIGH = 150;
const BAR_COLOR = [255, 255, 255, 0.8];
const BAR_COUNT = 25;
const DATA_VARIATION = BAR_COUNT;
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
        if(IN_ORDER){arrayBar.push(BAR_COUNT-i)}
        else{arrayBar.push(Math.floor(Math.random() * DATA_VARIATION) + 1);}
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
    setTimeout(titleEffect,1000);

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
        if(e.target.className != "sort"){return;};
        // stopScramble = true;

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
            for (let i = 0; i < document.getElementsByClassName('sort').length; i++) {
                document.getElementsByClassName('sort')[i].className='sort';
            }
            e.target.className = 'sort active';
            let htmlSortSelected = e.target.getAttribute('data-sort')
            selected_sort = SORT_TYPE[htmlSortSelected];

            console.log("Sorting Begun")
            sortingInProgress = true;
            selected_sort(arrayBar, SORT_SPEED, BAR_UPPER_VALUE_LIMIT, sound, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                stopScramble = false;
                document.querySelector('body').append(titleEl);
                setTimeout(titleEffect,1000);
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





let titleEl = document.getElementById('text');
import { TextScramble } from './htmlInterface/textScramble.js'
function titleEffect()
{
    let phrases = [
        'Wake up, Neo...',
        'Select a Sort',
        'The Matrix Has You...',
        'Select a Sound Effect (bottom left)',
        'Follow The White Rabbit.',
        'Or Follow Me On LinkedIn',
        'Knock, Knock, Neo.',
    ]

    const el = document.getElementById("title")
    const fx = new TextScramble(el)
    let counter = 0
    let scramToggle = true;
    const next = () => {
        if(counter==6)
        {
            phrases = [
                'Select a Sort',
                'Select a Sound Effect (bottom left)',
                'Adjust Sort Settings (top left)',
            ]
            counter = 0;
        }
        if(phrases.length > 4 && scramToggle)
        {
            el.style.color = "#37ec3d";
            // el.style.backgroundImage = `linear-gradient(to bottom, #2abc33, #1def24 50%)`;
            el.style.textShadow = `
                0 0 calc(1px) #ffffff00, 
                0 0 calc(1.5px) #3cd24675, 
                0 0 calc(2px) #3cd24675, 
                0 0 calc(2.5px) #3cd24675, 
                0 0 calc(3px) #3cd24675, 
                0 0 calc(3.5px) #3cd24675, 
                0 0 calc(4px) #3cd24675;`
        }
        else
        {
            el.style.color = "white";
            // el.style.backgroundImage = 'linear-gradient(to bottom, white, white 50%)';
            el.style.textShadow = `
                0 0 0 #ffffff00, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675, 
                0 0 0 #3cd24675;`
        }

        if(stopScramble){
            clearTimeout(next);
            titleEl = el;
            el.remove();
        }
        fx.setText(phrases[counter]).then(() => {
            if(phrases.length > 4 && scramToggle)
            {setTimeout(next, 600);}
            else
            {setTimeout(next, 2500);}
            scramToggle = !scramToggle;
      })
      counter = (counter + 1) % phrases.length
    }
    next();
}