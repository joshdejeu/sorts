import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { theMergeSort } from './sorts/merge.js';
import { selectionSort } from './sorts/selection.js';

import { HTMLInterface } from './htmlInterface/htmlInterface.js';
import { SortSettings } from './htmlInterface/classes/sortSettings.js';
import { soundVolume } from '../htmlInterface/htmlInterface.js';

// let defaultSettings = new SortSettings();
// console.log(defaultSettings.SORT_SPEED)

//TRUE for bars to decent in order (worst case), FALSE for random values
const IN_ORDER = false;

const SORT_TYPE = {
    "insertion": insertionSort,
    "bubble": bubbleSort,
    "merge": theMergeSort,
    "selection": selectionSort,
}
const SORT_SPEED = 150;
const BAR_WIDTH = 10;
const BAR_GAP = 7;
const BAR_MAX_HEIGH = 150;
const BAR_COLOR = [255, 255, 255, 0.8];
const BAR_COUNT = 10;
const DATA_VARIATION = BAR_COUNT*2;
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
let barsHaveBeenGenerated = true;

export { pause };
export { SORT_SPEED }
export { sound }

let selected_sort = SORT_TYPE["insert"];
let sortingInProgress = false;

const soundCookie = getCookie('soundCookie');
let sound = soundCookie; //variable to change sound while sorting is live

let openSettings = true;
window.addEventListener("load", ()=>{
    //click controls to open settings
    let settingsElement = document.getElementById('settings');
    document.getElementById('sort_controls').addEventListener('click', ()=>{
            openSettings ? HTMLInterface.openSettings(settingsElement) : HTMLInterface.closeSettings(settingsElement);    
            openSettings=!openSettings;
        }
    )



    try {
        highlightSound(document.getElementById(sound));
    } catch (error) {
        console.log(error)
        sound = clearAllCookies();
        highlightSound(document.getElementById(sound));
    }

    HTMLInterface.listenForVolumeChange();
    setTimeout(titleEffect,1000);

    container = document.getElementById("container");
    container.style.gap = BAR_GAP+"px";
    
    generateBars(arrayBar, container, DEFAULT_STYLES, false);
    
    document.querySelectorAll('.sound').forEach(sortElement => {
        sortElement.addEventListener('click', (e) => {
            let htmlSoundSelected = e.target.getAttribute('data-sound');
            sound = htmlSoundSelected;
            setCookie('soundCookie', sound, 30);

            //only play the sound sample if a sort is not live
            if(!sortingInProgress && !(htmlSoundSelected == false || htmlSoundSelected == 'false'))
            {
                const selectedAudio = new Audio(`./htmlInterface/sounds/${sound}.mp3`);
                selectedAudio.volume = soundVolume / 150;
                selectedAudio.play()
            }
            highlightSound(e.target);
        });
    });
    function highlightSound(e)
    {
        if(e === null)throw new TypeError("Sound cookie was null."); 
        for (let i = 0; i < document.getElementsByClassName('sound').length; i++) {
            document.getElementsByClassName('sound')[i].className='sound';
        }
        e.className = 'sound active';
    }
    

    document.getElementById('sort_selection')
    .addEventListener('click', (e) => {
        if(e.target.className != "sort"){return;};
        // stopScramble = true;

        if(sortingInProgress)
        {
            HTMLInterface.message(
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
            
            //generate new bars if they don't already exist
            if(!barsHaveBeenGenerated)
            {
                container.innerHTML = "";
                generateBars(arrayBar, container, DEFAULT_STYLES, false);
            }


            console.log("Sorting Begun")
            sortingInProgress = true;
            selected_sort(arrayBar, SORT_SPEED, BAR_UPPER_VALUE_LIMIT, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                stopScramble = false;
                barsHaveBeenGenerated = false;
                // document.querySelector('body').append(titleEl);
                // setTimeout(titleEffect,1000);
            });
        }
    })
});


// Set a cookie with a name, value, and optional parameters
function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); // Calculate expiration date
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Get the value of a cookie by its name
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return 'dream'; // Cookie not found
}

function clearAllCookies() {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
        const [name, _] = cookie.split('=');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
    setCookie('soundCookie', 'dream', 30); //set default sound
    return 'dream';//get new default cookie
}


//move this somewhere else
function generateBars(bars, container, styles, spawnTime = 0)
{
    populateBars();
    dataReady = false;
    let index = 0;

    function processNextBar() {
        if (index < bars.length) {
            HTMLInterface.generateHtmlBar(bars[index], container, styles, BAR_UPPER_VALUE_LIMIT);
            index++;
            if(spawnTime != 0){setTimeout(processNextBar, spawnTime);} // Set the delay (in milliseconds) between iterations
            else{processNextBar();}
        }
    }

    processNextBar(); // Start the processing
    dataReady = true;
} 




//move this somewhere else too
let titleEl = document.getElementById('text');
import { TextScramble } from './htmlInterface/textScramble.js'
function titleEffect()
{
    let phrases = [
        'Wake up, Neo...',
        'Select a Sort',
        'The Matrix Has You...',
        'Sound Effect (bottom left)',
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
                'Sound Effect (bottom left)',
                'Sort Settings (top left)',
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