import { selectionSort } from './sorts/selection.js';
import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { theMergeSort } from './sorts/merge.js';

import { HTMLInterface } from './htmlInterface/htmlInterface.js';
import { soundVolume } from '../htmlInterface/htmlInterface.js';
import { titleEffect } from '../htmlInterface/textScramble.js'

import { SortSettings } from './htmlInterface/classes/sortSettings.js';
// let defaultSettings = new SortSettings();
// console.log(defaultSettings.SORT_SPEED)


import { audioFile } from './htmlInterface/audioSetup.js';


const SORT_TYPE = {
    "selection": selectionSort,
    "insertion": insertionSort,
    "bubble": bubbleSort,
    "merge": theMergeSort,
}
//resest setting values
const SORT_SPEED = 50; //timeout between each iteration (0 is none)
const BAR_COUNT = 20; //number of bars
const BAR_WIDTH = 10; //width in px
const BAR_GAP = 1; //gap between bars in px
const BAR_MAX_HEIGHT = 150; //max height in px
const DATA_VARIATION = BAR_COUNT ; //highest value a bar can be (lowest is default 0)
const BAR_GROWTH_SPEED = 0; //time for bar to grow from 0 to x height
const BAR_SPAWN_DELAY = 0; //time between each bar appearing
const IN_ORDER = "off";//bars will be in deceneding order if "on"
const BAR_COLOR1 = "#2a2a2c"; //linear gradient background color1 in hex
const BAR_COLOR2 = "#d9d9d9"; //linear gradient background color2 in hex

//default settings
//@desc constantly changes settings based on URL/settings/etc, if a value is missing it set its deafult here
let ds = 
{
    reset: "off",
    order: IN_ORDER,
    count: BAR_COUNT,
    variation: DATA_VARIATION,
    width: BAR_WIDTH,
    gap: BAR_GAP,
    height: BAR_MAX_HEIGHT,
    growSpeed: BAR_GROWTH_SPEED,
    spawnDelay: BAR_SPAWN_DELAY,
    color1: BAR_COLOR1,
    color2 : BAR_COLOR2,
}

window.sharedArray = {
    data: []
};

var container;
let pause;
let barsHaveBeenGenerated = true;
let sort_speed = SORT_SPEED;


let selected_sort = SORT_TYPE["insert"];
let sortingInProgress = false;

const soundCookie = HTMLInterface.getCookie('soundCookie');
let sound = soundCookie; //variable to change sound while sorting is live

let openSettings = true;
let urlBarSettings = {}

export { pause, sound, sort_speed, ds, urlBarSettings };

window.addEventListener("load", ()=>{
    audioFile.test.volume = 0.0;
    audioFile.test.play();
    const urlParams = new URLSearchParams(window.location.search);

    const RESET_PARAM = urlParams.get('reset');
    if(RESET_PARAM == "off")window.location.href = window.origin

    urlBarSettings = 
    {
        order: urlParams.get('order'),
        width: urlParams.get('width'),
        gap: urlParams.get('gap'),
        height: urlParams.get('height'),
        color1: urlParams.get('color1'),
        color2: urlParams.get('color2'),
        count: urlParams.get('count'),
        variation: urlParams.get('variation'),
        growSpeed: urlParams.get('growSpeed'),
        spawnDelay: urlParams.get('spawnDelay'),
    }

    if(urlBarSettings.order=='on')urlBarSettings.variation = urlBarSettings.count;
    if(urlBarSettings.gap===null)urlBarSettings.gap = ds.gap;//sets gap to default if not found in URL
    
    //if URL setting exists, place it in the settings 
    for (const setting in urlBarSettings) {
        const value = urlBarSettings[setting];
        // console.log(`%c${setting}`, "color: white; background-color: #d22acc;", value);

        if(value!=null && value!="")
        {
            ds[setting] = value;
        }
    }

    for (const setting in ds) {
        if (Object.hasOwnProperty.call(ds, setting)) {
            console.log(`%c${setting}`, "color: white; background-color: #007acc;", ds[setting]);
            
        }
    }

    const DEFAULT_STYLES = {
        gap: ds.gap,
        width: ds.width,
        maxHeight: ds.height,
        color1: ds.color1,
        color2: ds.color2,
        grow: ds.growSpeed != 0 ? true : false,
    }

    let sort_speed_slider = document.getElementById("slider");
    let sort_speed_text = document.getElementById("sort_speed");
    sort_speed_slider.addEventListener('input', (e)=>
    {
        let speed = e.target.value
        sort_speed_text.innerHTML = speed + " ms";
        sort_speed = parseInt(speed);
    });

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

    container = document.getElementById("container");
    container.style.gap = urlBarSettings.gap+"px";
    
    HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.spawnDelay, ds.count, ds.order, ds.variation);
    
    document.querySelectorAll('.sound').forEach(sortElement => {
        sortElement.addEventListener('click', (e) => {
            let htmlSoundSelected = e.target.getAttribute('data-sound');
            sound = htmlSoundSelected;
            HTMLInterface.setCookie('soundCookie', sound, 30);

            //only play the sound sample if a sort is not live
            if(!sortingInProgress && !(htmlSoundSelected == false || htmlSoundSelected == 'false'))
            {
                // const selectedAudio = new Audio(`./htmlInterface/sounds/${sound}.mp3`);
                // selectedAudio.volume = soundVolume / 150;
                // selectedAudio.play();

                audioFile[sound].volume = soundVolume / 150;
                audioFile[sound].play();
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
    .addEventListener('click', async (e) => {
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
            
            let mergeSelected = htmlSortSelected=="merge";
            if(mergeSelected)
            {
                let newBarCount = closestPowerOf2(ds.count)
                console.log(newBarCount)
                urlBarSettings.variation = newBarCount;
                container.innerHTML = "";
                await HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.spawnDelay, newBarCount, "on", newBarCount);
            }


            //generate new bars if they don't already exist
            else if(!barsHaveBeenGenerated && !mergeSelected)
            {
                container.innerHTML = "";
                await HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.spawnDelay, ds.count, ds.order, ds.variation);
            }

            let computedGradient = `linear-gradient(0deg, ${DEFAULT_STYLES.color1}, ${DEFAULT_STYLES.color2})`;
            console.log("Sorting Begun")
            sortingInProgress = true;
            selected_sort(sharedArray.data, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                barsHaveBeenGenerated = false;
                e.target.className = 'sort';
            },
            computedGradient);
        }
    })

    const el = document.getElementById("title")
    setTimeout(() => {
        titleEffect(el);
    }, 500);
});

function closestPowerOf2(number) {
    // Find the exponent required to get the next and previous power of 2
    const nextExponent = Math.ceil(Math.log2(number));
    const prevExponent = Math.floor(Math.log2(number));

    // Calculate the closest powers of 2 using the exponents
    const closestNextPower = Math.pow(2, nextExponent);
    const closestPrevPower = Math.pow(2, prevExponent);

    // Determine which one is closer to the given number
    const nextDifference = Math.abs(closestNextPower - number);
    const prevDifference = Math.abs(closestPrevPower - number);

    // Return the closer power of 2
    return nextDifference < prevDifference ? closestNextPower : closestPrevPower;
}