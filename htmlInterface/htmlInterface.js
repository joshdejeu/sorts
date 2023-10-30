const context = new AudioContext();

export class htmlInterface {
    static highlightElement(element, color) {
        element.style.backgroundColor = color;
    }

    static swapElements(element1, element2) {
        if (element1.parentNode === element2.parentNode) {
            const parent = element1.parentNode;
            const nextSibling = element1.nextSibling === element2 ? element1 : element2;
            parent.insertBefore(element1, nextSibling);
        } else {
            console.error("Elements have different parents, cannot swap.");
        }
    }

    static async playSound(valOfElementMoved, upperBoundBarVal, sound) {

        function mapValueToRange(value, n) {
            const oldRangeMin = 1;
            const oldRangeMax = n;
            const newRangeMin = 0.6;
            const newRangeMax = 2.0;
            
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
        }

        function playSample(sample, rate, volume = 0.1) {
            const source = context.createBufferSource();
            source.buffer = sample;
            const gainNode = context.createGain();
            source.connect(gainNode); // Connect source to the GainNode
            gainNode.connect(context.destination); // Connect GainNode to the audio destination
            source.playbackRate.value = rate;

            // Set the volume (gain)
            gainNode.gain.value = Math.max(0, Math.min(1, volume));;
            
            source.start(0);
        }

        loadSample('./htmlInterface/'+sound)
        .then(sample => playSample(sample, mapValueToRange(valOfElementMoved, upperBoundBarVal)));



        
    }

    static message(data)
    {
        const audioNotify = new Audio('./htmlInterface/notify.mp3');
        audioNotify.volume = 0.05;
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
}   