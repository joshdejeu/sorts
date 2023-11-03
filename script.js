import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { selectionSort } from './sorts/selection.js';
import { theMergeSort } from './sorts/merge.js';

import { HTMLInterface } from './htmlInterface/htmlInterface.js';
import { SortSettings } from './htmlInterface/classes/sortSettings.js';
import { soundVolume } from '../htmlInterface/htmlInterface.js';
import { titleEffect } from '../htmlInterface/textScramble.js'

// let defaultSettings = new SortSettings();
// console.log(defaultSettings.SORT_SPEED)


const SORT_TYPE = {
    "insertion": insertionSort,
    "bubble": bubbleSort,
    "selection": selectionSort,
    "merge": theMergeSort,
}
//resest setting values
const BAR_COUNT = 20; //number of bars
const SORT_SPEED = 15; //timeout between each iteration (0 is none)
const BAR_WIDTH = 10; //width in px
const BAR_GAP = 7; //gap between bars in px
const BAR_MAX_HEIGHT = 150; //max height in px
const BAR_COLOR = "217, 217, 217, 1"; //background in rgba
const DATA_VARIATION = (BAR_COUNT * 2); //highest value a bar can be (lowest is default 0)
const BAR_GROWTH_SPEED = 0; //time for bar to grow from 0 to x height
const BAR_SPAWN_DELAY = 0; //time between each bar appearing
const IN_ORDER = "off";//bars will be in deceneding order if "on"

//default settings
let ds = 
{
    SORT_SPEED: SORT_SPEED,
    BAR_WIDTH: BAR_WIDTH,
    BAR_GAP: BAR_GAP,
    BAR_MAX_HEIGHT: BAR_MAX_HEIGHT,
    BAR_COLOR: BAR_COLOR,
    BAR_COUNT: BAR_COUNT,
    DATA_VARIATION: DATA_VARIATION,
    BAR_GROWTH_SPEED: BAR_GROWTH_SPEED,
    BAR_SPAWN_DELAY: BAR_SPAWN_DELAY,
    IN_ORDER: IN_ORDER,
}



window.sharedArray = {
    data: []
};

var container;
let pause;
let barsHaveBeenGenerated = true;

export { pause };
export { sound }

let selected_sort = SORT_TYPE["insert"];
let sortingInProgress = false;

const soundCookie = HTMLInterface.getCookie('soundCookie');
let sound = soundCookie; //variable to change sound while sorting is live

let openSettings = true;
window.addEventListener("load", ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    let urlBarSettings = 
    {
        RESET: urlParams.get('reset'),
        SORT_SPEED: urlParams.get('sort-speed'),
        BAR_WIDTH: urlParams.get('width'),
        BAR_GAP: urlParams.get('gap'),
        BAR_MAX_HEIGHT: urlParams.get('height'),
        BAR_COLOR: urlParams.get('color'),
        BAR_COUNT: urlParams.get('count'),
        DATA_VARIATION: urlParams.get('variation'),
        BAR_GROWTH_SPEED: urlParams.get('grow-speed'),
        BAR_SPAWN_DELAY: urlParams.get('spawn-delay'),
        IN_ORDER: urlParams.get('order'),
    }
    
    //if URL setting exists, place it in the settings 
    for (const setting in urlBarSettings) {
        const value = urlBarSettings[setting];
        if(setting.toLowerCase() == "reset" && value== "on"){
            window.location.href = window.origin
            break;}
        if(value!=null && value!="")
        {ds[setting] = value;}
    }
    console.log(ds)

    const DEFAULT_STYLES = {
        width: ds.BAR_WIDTH,
        maxHeight: ds.BAR_MAX_HEIGHT,
        color: ds.BAR_COLOR,
        grow: ds.BAR_GROWTH_SPEED != 0 ? true : false,
    }



    //click controls to open settings
    let settingsElement = document.getElementById('settings');
    document.getElementById('sort_controls').addEventListener('click', ()=>{
            // console.log('open')
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
    container.style.gap = ds.BAR_GAP+"px";
    
    HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.BAR_SPAWN_DELAY, ds.BAR_COUNT, ds.IN_ORDER, ds.DATA_VARIATION);
    
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
                HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.BAR_SPAWN_DELAY, ds.BAR_COUNT, ds.IN_ORDER, ds.DATA_VARIATION);
            }


            console.log("Sorting Begun")
            sortingInProgress = true;
            selected_sort(sharedArray.data, ds.SORT_SPEED, ds.DATA_VARIATION, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                barsHaveBeenGenerated = false;
            });
        }
    })
});