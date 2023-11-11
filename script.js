import { selectionSort } from './sorts/selection.js';
import { insertionSort } from './sorts/insertion.js';
import { bubbleSort } from './sorts/bubble.js';
import { theMergeSort } from './sorts/merge.js';

import { HTMLInterface } from './htmlInterface/htmlInterface.js';
import { SortSettings } from './htmlInterface/classes/sortSettings.js';
import { soundVolume } from '../htmlInterface/htmlInterface.js';
import { titleEffect } from '../htmlInterface/textScramble.js'

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
const BAR_GAP = 7; //gap between bars in px
const BAR_MAX_HEIGHT = 150; //max height in px
const BAR_COLOR = "217, 217, 217, 1"; //background in rgba
const DATA_VARIATION = BAR_COUNT ; //highest value a bar can be (lowest is default 0)
const BAR_GROWTH_SPEED = 0; //time for bar to grow from 0 to x height
const BAR_SPAWN_DELAY = 0; //time between each bar appearing
const IN_ORDER = "off";//bars will be in deceneding order if "on"

//default settings
let ds = 
{
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
    urlBarSettings = 
    {
        RESET: urlParams.get('reset'),
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

    if(urlBarSettings.IN_ORDER=='on')urlBarSettings.DATA_VARIATION = urlBarSettings.BAR_COUNT;
    
    //if URL setting exists, place it in the settings 
    for (const setting in urlBarSettings) {
        const value = urlBarSettings[setting];
        console.log(`%c${setting}`, "color: white; background-color: #007acc;", value);
        if(setting.toLowerCase() == "reset" && value== "on"){
            window.location.href = window.origin
            break;}
        if(value!=null && value!="")
        {ds[setting] = value;}
    }

    const DEFAULT_STYLES = {
        gap: ds.BAR_GAP,
        width: ds.BAR_WIDTH,
        maxHeight: ds.BAR_MAX_HEIGHT,
        color: ds.BAR_COLOR,
        grow: ds.BAR_GROWTH_SPEED != 0 ? true : false,
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
    const el = document.getElementById("title")
    titleEffect(el);

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
            
            let notMerge = htmlSortSelected!="merge";
            if(htmlSortSelected == "merge")
            {
                let newBarCount = closestPowerOf2(ds.BAR_COUNT)
                ds.DATA_VARIATION=newBarCount;
                container.innerHTML = "";
                await HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.BAR_SPAWN_DELAY, newBarCount, "on", newBarCount);
            }


            //generate new bars if they don't already exist
            else if(!barsHaveBeenGenerated && notMerge)
            {
                container.innerHTML = "";
                await HTMLInterface.generateBars(sharedArray.data, container, DEFAULT_STYLES, ds.BAR_SPAWN_DELAY, ds.BAR_COUNT, ds.IN_ORDER, ds.DATA_VARIATION);
            }

            let defaultBarColor = DEFAULT_STYLES.color;
            if(ds.BAR_GAP == "0" || ds.BAR_GAP == 0)
            {
                defaultBarColor = `linear-gradient(0deg, rgba(100,100,100,0.3), rgba(${DEFAULT_STYLES.color})`;
            }else{
                defaultBarColor = `rgba(${DEFAULT_STYLES.color})`;
            }
            console.log("Sorting Begun")
            sortingInProgress = true;
            selected_sort(sharedArray.data, ds.DATA_VARIATION, () => {
                sortingInProgress = false; // Reset the flag when sorting is complete.
                console.log("Sorting Finished")
                barsHaveBeenGenerated = false;
                e.target.className = 'sort';
            },
            defaultBarColor);
        }
    })
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