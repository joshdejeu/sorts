
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

    static sound(positionOfElement) {
        const audioContext = new AudioContext();
        const audioElement = new Audio('./htmlInterface/sound.mp3');
        audioElement.volume = 0.1;
        // const audioSource =lay(); audioContext.createMediaElementSource(audioElement);
        // const pitchShifter = new AudioWorkletNode(audioContext, 'pitch-shifter-processor');
        // pitchShifter.port.postMessage({ pitch: positionOfElement }); // Send pitch information

        // audioSource.connect(pitchShifter).connect(audioContext.destination);
        audioElement.play();
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
        }, 1000);
    }
}   