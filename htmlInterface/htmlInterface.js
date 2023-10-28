
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
        const audioSource = audioContext.createMediaElementSource(audioElement);
        // const pitchShifter = new AudioWorkletNode(audioContext, 'pitch-shifter-processor');
        // pitchShifter.port.postMessage({ pitch: positionOfElement }); // Send pitch information

        // audioSource.connect(pitchShifter).connect(audioContext.destination);
        audioElement.play();
    }
}

