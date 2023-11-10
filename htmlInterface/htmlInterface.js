const context = new AudioContext();

import { sound } from '../script.js';
import { audioFile } from './audioSetup.js';

let soundVolume = 25;
export { soundVolume };
export class HTMLInterface {

    static openSettings(e)
    {
        const urlParams = new URLSearchParams(window.location.search);
        let urlBarSettings = 
        {
            sortSpeed: urlParams.get('sort-speed'),
            width: urlParams.get('width'),
            gap: urlParams.get('gap'),
            height: urlParams.get('height'),
            color: urlParams.get('color'),
            count: urlParams.get('count'),
            variation: urlParams.get('variation'),
            growSpeed: urlParams.get('grow-speed'),
            spawnDelay: urlParams.get('spawn-delay'),
            order: urlParams.get('order'),
        }   
        const form = document.querySelector('#settings form');
        const inputElements = form.querySelectorAll('input');
        // inputElements.forEach((input) => {
        //     if(urlBarSettings[input.name] != null && urlBarSettings[input.name] != "")
        //     {
        //         // console.log(input.value = urlBarSettings[input.name]);
        //     }
        //     else{
        //         // console.log('null or empty')
        //     }
        // });
        
        e.style.display = 'flex'


    }

    static closeSettings(e)
    {
        e.style.display = 'none';
    }


    static async bloop(array, elements, upperBoundBarVal)
    {
        let i = 0;
        function highlight()
        {
            if(i < array.length)
            {
                HTMLInterface.highlightElement(elements[i], "rgba(27, 217, 70, 0.8)", 1);
                if(i>=5)
                {
                    HTMLInterface.highlightElement(elements[i-5], "rgba(255, 255, 255, 0.8)", 1);
                }
                HTMLInterface.playSound(i, upperBoundBarVal, sound, 1);
                setTimeout(highlight, (1500/array.length).toFixed(2));
            }
            else
            {
                for (let i = 0; i < array.length; i++) {
                    HTMLInterface.highlightElement(elements[i], "rgba(255, 255, 255, 0.8)", 1);
                }
            }
            i++;
        }
        highlight();
    }


    static highlightElement(element, color, SORT_SPEED) {
        if (SORT_SPEED == 0) { return; }
        element.style.backgroundColor = color;
    }

    //@pre element1 must first in order on the DOM above element2
    static async swapElements(element1, element2, milliseconds) {
        return new Promise((resolve) => {
            if (element1 === element2) {
                // Elements are the same
                // console.log(0)
                // return;
            }

            const parent = element1.parentElement;
            const children = Array.from(parent.children);
            const elementIndex = children.indexOf(element1);
            const targetIndex = children.indexOf(element2);
            if (elementIndex < targetIndex) {
                // Element is before the target
                // console.log(-1)
              } else {
                // Element is after the target
                // console.log(1)
              }



            if (element1.parentNode === element2.parentNode) {
                const parent = element1.parentNode;
                const nextSibling = element1.nextSibling === element2 ? element1 : element2;
                parent.insertBefore(element1, nextSibling);
            } else {
                console.error("Elements have different parents, cannot swap.");
            }

            // Use a flag to track if the Promise has already resolved
            let resolved = false;

            // Resolve the Promise after a minimum of `milliseconds`
            if(milliseconds != "0" || milliseconds != 0)
            {
                setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve();
                    }
                }, milliseconds);
            }else{

                resolve();
            }
            // Additional logic to resolve the Promise when needed
            // For example, you can call resolve() when some condition is met
            // For instance, when animations or other asynchronous tasks are complete.
        });
    }

    //creates individual html elements and styles width/height/color
    

    
    
    
    
    static generateHtmlBar(barVal, container, styles, barUpperLimit) {
        let bar = document.createElement('div');
        bar.className = 'bar';
        if (styles.grow) { bar.style.animation = "grow 0.5s ease-in forwards" }
        else { bar.style.animation = "grow 0.0s ease-in forwards"; }
        bar.style.width = styles.width + "px";
        bar.style.height = `${styles.maxHeight * (barVal / barUpperLimit)}px`;
        bar.style.background = `rgba(${styles.color})`;

        let barNum = document.createElement('p1');
        barNum.className = 'barNum';
        barNum.innerHTML = barVal;


        bar.append(barNum);
        container.append(bar);
    }








    static async playSound(valOfElementMoved, upperBoundBarVal, sound, SORT_SPEED) {
        if (SORT_SPEED == 0 || (sound == false || sound == 'false')) { return; }
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
