import { SORT_SPEED } from '../script.js';
const context = new AudioContext();

let soundVolume = "25.0";
export { soundVolume };
export class HTMLInterface {

    static openSettings(e)
    {
        e.style.display = 'block;'
    }

    static closeSettings(e)
    {
        e.style.display = 'none';
    }



    static highlightElement(element, color) {
        if (SORT_SPEED == 0) { return; }
        element.style.backgroundColor = color;
    }

    //@pre element1 must first in order on the DOM above element2
    static async swapElements(element1, element2, milliseconds) {
        return new Promise((resolve) => {
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
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, milliseconds);

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
        bar.style.color = `rgba(${styles.color[0]}, ${styles.color[1]}, ${styles.color[2]}, ${styles.color[3]})`;
        bar.style.width = styles.width + "px";
        bar.style.height = `${styles.maxHeight * (barVal / barUpperLimit)}px`;

        let barNum = document.createElement('p1');
        barNum.className = 'barNum';
        barNum.innerHTML = barVal;


        bar.append(barNum);
        container.append(bar);
    }








    static async playSound(valOfElementMoved, upperBoundBarVal, sound) {
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


        function playSample(sample, pitchMappedToRangeOfVolume, volume) {
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
            gainNode.gain.value = Math.max(0, Math.min(1, volume / 100));;

            source.start(0);
        }

        loadSample(`./htmlInterface/sounds/${sound}.mp3`)
            .then(sample => playSample(sample, mapValueToRange(valOfElementMoved, upperBoundBarVal), soundVolume / 3));//Sound Volume here


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

        let volSlider = document.getElementById('volume');
        let indicator = volSlider.querySelector('.color-indicator');
        let volHover = document.getElementById('volume_hover');

        let isDragging = false;
        let eagleHasLanded = false;
        let initialY, initialTop, initialPositionOnScale;
    
        volSlider.addEventListener('mousedown', (e) => {

        });

        volSlider.addEventListener('mousedown', (e) => {
            isDragging = eagleHasLanded = true;
            initialY = e.clientY;
            initialTop = volSlider.getBoundingClientRect().top;
            volSlider.style.cursor = 'pointer';
            const positionOnScale = ((initialY - initialTop) / volSlider.clientHeight) * 100;
            const clampedPosition = Math.min(100, Math.max(0, positionOnScale));
            indicator.style.height = `${(100-clampedPosition).toFixed(2)}%`;
            soundVolume = (100-clampedPosition).toFixed(2);
            audioTest.volume = soundVolume / 150;
            audioTest.play()
        });
    
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                initialY = e.clientY;
                initialTop = volSlider.getBoundingClientRect().top;
                let positionOnScale = ((initialY - initialTop) / volSlider.clientHeight) * 100;
                const clampedPosition = Math.min(100, Math.max(0, positionOnScale));
                volSlider.style.cursor = 'grabbing';
                indicator.style.height = `${100 - clampedPosition}%`;
                soundVolume = (100-clampedPosition).toFixed(2);
                volHover.style.display = 'block';

            }
        });
    
        document.addEventListener('mouseup', () => {
            isDragging = false;
            volSlider.style.cursor = 'pointer';
            volHover.style.display = 'none';
            if(eagleHasLanded)
            {
                audioTest.volume = soundVolume / 150;
                audioTest.play()
                eagleHasLanded = false
            }
        });
    }
}   
const audioTest = new Audio(`./htmlInterface/sounds/soundTest.mp3`);
