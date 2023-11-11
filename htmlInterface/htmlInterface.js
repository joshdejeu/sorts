const context = new AudioContext();

import { sort_speed, sound, urlBarSettings } from '../script.js';
import { audioFile } from './audioSetup.js';

let soundVolume = 25;
let overRideSound = false;
export { soundVolume };
export class HTMLInterface {

    static openSettings(e)
    {
        // const urlParams = new URLSearchParams(window.location.search);
        let newURL = 
        {
            reset: urlBarSettings.RESET,
            order: urlBarSettings.IN_ORDER,
            count: urlBarSettings.BAR_COUNT,
            variation: urlBarSettings.DATA_VARIATION,
            width: urlBarSettings.BAR_WIDTH,
            gap: urlBarSettings.BAR_GAP,
            height: urlBarSettings.BAR_MAX_HEIGHT,
            growSpeed: urlBarSettings.BAR_GROWTH_SPEED,
            spawnDelay: urlBarSettings.BAR_SPAWN_DELAY,
            color: urlBarSettings.BAR_COLOR,
        }   

        const form = document.querySelector('#settings form');
        const inputElements = form.querySelectorAll('input');

        inputElements.forEach((input) => {
            // console.log(inputElements.name[input])
            if(newURL[input.name] != null)
            {
                input.value = newURL[input.name]; 
            }
        });
        
        e.style.display = 'flex'
    }

    static closeSettings(e)
    {
        e.style.display = 'none';
    }


    static async bloop(array, elements, upperBoundBarVal, defaultColor)
    {
        return new Promise((resolve) => {
            overRideSound = true;
            let amtToHighlight = Math.floor(array.length/3);
            let i = 0;
            function highlight()
            {
                if(i < array.length)
                {
                    let rgb = `linear-gradient(1800deg, rgba(20, 200, 50, 0.0), rgba(20, 200, 50, 0.8))`
                    elements[i].style.background = rgb;
                    if(i>=amtToHighlight)
                    {
                        elements[i-amtToHighlight].style.background = defaultColor;
                    }
                    HTMLInterface.playSound(i, upperBoundBarVal, sound);
                    setTimeout(highlight, (1000/array.length).toFixed(2));
                }
                else
                {
                    let j = i; 
                    function finishHighligth()
                    {
                        if(j < array.length + amtToHighlight)
                        {
                            elements[j-amtToHighlight].style.background = defaultColor;
                            j++;
                            setTimeout(finishHighligth, (1000/array.length).toFixed(2));
                        }
                    }
                    finishHighligth();
                    resolve();
                    overRideSound = false;
                }
                i++;
            }
            highlight();
        });
    }


    static highlightElement(element, color, resolver) {
        if (sort_speed == 0 || sort_speed == "0") { return; }
        try {
            element.style.background = color;
        } catch (error) {
            return resolver() || null;            
        }
    }

    //@pre elements must have same parent
    //@desc swaps html elements, order of params does not matter
    static async  swap(e1, e2, time) {
        return new Promise((resolve) => {
            const element1 = e1;
            const element2 = e2;
    
            if (element1 && element2) {
                // Swap the positions of the two elements in the DOM
                const parent = element1.parentNode;
                const temp = document.createElement('div'); // Create a temporary element
                parent.insertBefore(temp, element2);
                parent.insertBefore(element2, element1);
                parent.insertBefore(element1, temp);
                parent.removeChild(temp);
            }
    
            let resolved = false;
            // Resolve the Promise after a minimum of `time` milliseconds
            if (sort_speed != "0" || sort_speed != 0) {
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }, sort_speed);
            } else {
                resolve();
            }
        });
    }
    

    //creates individual html elements and styles width/height/color
    

    
    
    
    
    static generateHtmlBar(barVal, container, styles, barUpperLimit) {
        let bar = document.createElement('div');
        bar.className = 'bar';
        if (styles.grow) { bar.style.animation = "grow 0.5s ease-in forwards" }
        else { bar.style.animation = "grow 0.0s ease-in forwards"; }
        bar.style.width = styles.width + "px";
        bar.style.height = `${1 + ((barVal - 1) / (barUpperLimit - 1)) * (styles.maxHeight - 1)}px`;
        bar.style.background = `rgba(${styles.color})`;

        if(styles.gap=="0" || styles.gap==0)
        {
            bar.style.background = `linear-gradient(0deg, rgba(100,100,100,0.3), rgba(${styles.color})`;
        }

        let barNum = document.createElement('p1');
        barNum.className = 'barNum';
        barNum.innerHTML = barVal;
        barNum.style.fontSize = parseInt(styles.width)+3 + "px";

        bar.append(barNum);
        container.append(bar);
    }








    static async playSound(valOfElementMoved, upperBoundBarVal, sound) {
        if ((sort_speed == 0 && !overRideSound) || (sound == false || sound == 'false')) { return; }
        //give a range 1 to n, map its values to a range with lower volume (newRangeMin) and upper volume (newRangeMax)
        function mapValueToRange(value, n) {
            const oldRangeMin = 1;
            const oldRangeMax = n;
            const newRangeMin = 0.3;
            const newRangeMax = 1.5;

            // Apply the linear mapping formula
            const mappedValue = newRangeMin + (value - oldRangeMin) * (newRangeMax - newRangeMin) / (oldRangeMax - oldRangeMin);

            // Ensure that the result is within the new range limits
            if (mappedValue < newRangeMin) {
                return newRangeMin;
            } else if (mappedValue > newRangeMax) {
                return newRangeMax;
            } else {
                return mappedValue;
            }
        }



        function loadSample(url) {
            return fetch(url)
                .then(response => response.arrayBuffer())
                .then(buffer => context.decodeAudioData(buffer));
            /*.then(buffer => 
                context.decodeAudioData((buffer) => { 
                    resolve(buffer); 
                }, (e) => { reject(e); });
            );*/
        }


        function playSample(sample, pitchMappedToRangeOfVolume) {
            const source = context.createBufferSource();
            source.buffer = sample;
            const gainNode = context.createGain();
            source.connect(gainNode); // Connect source to the GainNode
            gainNode.connect(context.destination); // Connect GainNode to the audio destination

            //pitch
            let pitch = calculateFrequencyForKey(mapValueToMiddlePianoKey(Number(valOfElementMoved), upperBoundBarVal) - 49);
            // source.playbackRate.value = 1
            source.playbackRate.value = pitch / 12
            // source.playbackRate.value = pitchMappedToRangeOfVolume;

            // voume

            if(soundVolume === null)soundVolume = 25;
            const clampedGain = Math.max(0, Math.min(1, soundVolume / 100)).toFixed(2);
            gainNode.gain.value = clampedGain;

            source.start(0);
        }

        loadSample(`./htmlInterface/sounds/${sound}.mp3`)
            .then(sample => playSample(sample, mapValueToRange(valOfElementMoved, upperBoundBarVal)));


        function mapValueToMiddlePianoKey(randomValue, n) {
            const upperEndPianoKey = 50;
            const lowerEndPianoKey = 20;
            // Define the range of the random value (from 1 to n)
            const randomRange = n - 1;

            // Define the range of the middle 40 piano keys (from 25 to 50)
            const middlePianoKeysRange = upperEndPianoKey - lowerEndPianoKey;

            // Calculate the mapped value within the middle key range
            const mappedValue = (randomValue - 1) * (middlePianoKeysRange / randomRange) + lowerEndPianoKey;

            // Ensure that the mapped value is within the middle piano key range
            if (mappedValue < 25) {
                return 25;
            } else if (mappedValue > 64) {
                return 64;
            } else {
                return Math.round(mappedValue); // Round to the nearest integer for piano keys
            }
        }

        function calculateFrequencyForKey(keyNumber) {
            // A440 is the reference frequency for key number 49
            const A440 = 440.0;

            // Calculate the frequency using the formula
            const frequency = A440 * Math.pow(2, (keyNumber - 49) / 12);

            return frequency;
        }




    }

    static message(data) {
        const audioNotify = new Audio('./htmlInterface/sounds/notify.mp3');
        audioNotify.volume = 0.6;
        audioNotify.play()

        let noti = document.createElement('div');
        noti.className = "notification";
        document.getElementById("notification_container").append(noti);

        let imgCont = document.createElement('div');
        imgCont.className = "notification_image_container";
        let img = document.createElement('img');
        img.className = "notification_image";
        img.src = "../htmlInterface/logo.png";
        imgCont.append(img);
        noti.append(imgCont);

        let ttl = document.createElement('div');
        ttl.className = "notification_title";
        ttl.innerHTML = data.title;
        imgCont.append(ttl);

        let time = document.createElement('div');
        time.className = "notification_time";
        time.innerHTML = "1m ago";
        imgCont.append(time);

        let msg = document.createElement('div');
        msg.className = "notification_message";
        msg.innerHTML = data.message;
        noti.append(msg);

        setTimeout(() => {
            noti.remove();
        }, 1500);
    }


    //listen for mouseDown, mouseDrag, mouseUp events to update sound volume
    static listenForVolumeChange() {
        soundVolume = this.getCookie('volumeCookie');
        if(soundVolume === null || soundVolume == "piano"){soundVolume = 25;}
        
        let volSlider = document.getElementById('volume');
        let indicator = volSlider.querySelector('.color-indicator');
        let volHover = document.getElementById('volume_hover');
        indicator.style.height = `${soundVolume}%`;

        let isDragging = false;
        let eagleHasLanded = false;
        let initialY, initialTop, initialPositionOnScale;
    
        let vol = document.createElement('div')
        vol.id = 'vol_level';

        volSlider.addEventListener('mousedown', (e) => {
            isDragging = eagleHasLanded = true;
            initialY = e.clientY;
            initialTop = volSlider.getBoundingClientRect().top;
            volSlider.style.cursor = 'pointer';
            const positionOnScale = ((initialY - initialTop) / volSlider.clientHeight) * 100;
            const clampedPosition = Math.min(100, Math.max(0, positionOnScale));
            indicator.style.height = `${(100-clampedPosition).toFixed(2)}%`;
            soundVolume = (100-clampedPosition).toFixed(2);
            vol.innerHTML = (100-clampedPosition).toFixed(0)+"%"
            volSlider.append(vol);
        });
    
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();// prevents highlighting page elements and stopping mousemove evenet
                initialY = e.clientY;
                initialTop = volSlider.getBoundingClientRect().top;
                let positionOnScale = ((initialY - initialTop) / volSlider.clientHeight) * 100;
                const clampedPosition = Math.min(100, Math.max(0, positionOnScale));
                volSlider.style.cursor = 'grabbing';
                indicator.style.height = `${100 - clampedPosition}%`;
                soundVolume = (100-clampedPosition).toFixed(2);
                vol.innerHTML = `${(100-clampedPosition).toFixed(0)}%`;
                volHover.style.display = 'block';
            }
        });
    
        document.addEventListener('mouseup', () => {
            vol.remove();
            isDragging = false;
            volSlider.style.cursor = 'pointer';
            volHover.style.display = 'none';
            if(eagleHasLanded)
            {
                const audioTest = new Audio(`./htmlInterface/sounds/soundTest.mp3`);
                audioTest.volume = soundVolume / 150;
                audioTest.play()
                eagleHasLanded = false
            }
            this.setCookie('volumeCookie', soundVolume, 30); //set volume cookie
        });
    }




    //populate random values into bars
    static populateBars(BAR_COUNT, IN_ORDER, DATA_VARIATION)
    {
        window.sharedArray.data.length = 0;
        for(let i = 0; i < BAR_COUNT; i++)
        {
            if(IN_ORDER=="on"){window.sharedArray.data.push(BAR_COUNT-i)}
            else{window.sharedArray.data.push(Math.floor(Math.random() * DATA_VARIATION) + 1);}
        }
    };

    static generateBars(bars, container, styles, spawnTime, BAR_COUNT, IN_ORDER, DATA_VARIATION) {
        HTMLInterface.populateBars(BAR_COUNT, IN_ORDER, DATA_VARIATION);
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function generateBarsAsync() {
            let index = 0;
    
            function processNextBar() {
                if (index < bars.length) {
                    HTMLInterface.generateHtmlBar(bars[index], container, styles, DATA_VARIATION);
                    index++;
                    if (spawnTime != 0) {
                        setTimeout(processNextBar, spawnTime);
                    } else {
                        processNextBar();
                    }
                }
            }
    
            processNextBar(); // Start the processing
    
            while (index < bars.length) {
                await delay(spawnTime);
                processNextBar();
            }
        }
        return generateBarsAsync();
    }
    







    // Set a cookie with a name, value, and optional parameters
    static setCookie(name, value, daysToExpire) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); // Calculate expiration date
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    // Get the value of a cookie by its name
    static getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return 'piano'; // Cookie not found
    }

    static clearAllCookies() {
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            const [name, _] = cookie.split('=');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        setCookie('soundCookie', 'piano', 30); //set default sound
        return 'piano';//get new default cookie
    }

}   
