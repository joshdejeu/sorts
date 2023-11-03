import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { theMergeSort } from './sorts/merge.js';
import { selectionSort } from './sorts/selection.js';

import { HTMLInterface } from './htmlInterface/htmlInterface.js';
import { SortSettings } from './htmlInterface/classes/sortSettings.js';
import { soundVolume } from '../htmlInterface/htmlInterface.js';
import { titleEffect } from '../htmlInterface/textScramble.js'

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
const SORT_SPEED = 15;
const BAR_WIDTH = 10;
const BAR_GAP = 7;
const BAR_MAX_HEIGH = 150;
const BAR_COLOR = [255, 255, 255, 0.8];
const BAR_COUNT = 20;
const DATA_VARIATION = BAR_COUNT*2;
const SPAWN_SPEED = 50;
const BAR_SPAWNN_TIME = 15;
const BAR_UPPER_VALUE_LIMIT = DATA_VARIATION;

const DEFAULT_STYLES = {
    width: BAR_WIDTH,
    maxHeight: BAR_MAX_HEIGH,
    color: BAR_COLOR,
    // grow: SPAWN_SPEED != 0 ? true : false,
    grow: false,
}

var arrayBar = [];
window.sharedArray = {
    data: []
};

var container;
let pause;
let barsHaveBeenGenerated = true;

export { pause };
export { SORT_SPEED }
export { sound }

let selected_sort = SORT_TYPE["insert"];
let sortingInProgress = false;

const soundCookie = HTMLInterface.getCookie('soundCookie');
let sound = soundCookie; //variable to change sound while sorting is live

let openSettings = true;
window.addEventListener("load", ()=>{
    //click controls to open settings
    let settingsElement = document.getElementById('settings');
    document.getElementById('sort_controls').addEventListener('click', ()=>{
            openSettings ? HTMLInterface.openSettings(settingsElement) : HTMLInterface.closeSettings(settingsElement);    
            openSettings =! openSettings;
        }
    )

    try {
        highlightSound(document.getElementById(sound));
    } catch (error) {
        console.log(error)
        sound = HTMLInterface.clearAllCookies();
        highlightSound(document.getElementById(sound));
    }

    HTMLInterface.listenForVolumeChange();
    const el = document.getElementById("title")
    setTimeout(titleEffect(el), 1000);

    container = document.getElementById("container");
    container.style.gap = BAR_GAP+"px";
    
    HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, BAR_SPAWNN_TIME, BAR_COUNT, IN_ORDER, DATA_VARIATION);
    
    document.querySelectorAll('.sound').forEach(sortElement => {
        sortElement.addEventListener('click', (e) => {
            let htmlSoundSelected = e.target.getAttribute('data-sound');
            sound = htmlSoundSelected;
            HTMLInterface.setCookie('soundCookie', sound, 30);

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
                HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, false, BAR_SPAWNN_TIME, BAR_COUNT, IN_ORDER, DATA_VARIATION);
            }


            console.log("Sorting Begun")
            sortingInProgress = true;
            selected_sort(sharedArray.data, SORT_SPEED, BAR_UPPER_VALUE_LIMIT, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                barsHaveBeenGenerated = false;
            });
        }
    })
});