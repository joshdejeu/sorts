const audioDream = document.createElement('audio');
const audioError = document.createElement('audio');
const audioGuitar = document.createElement('audio');
const audioNotify = document.createElement('audio');
const audioPiano = document.createElement('audio');
const audioPluh = document.createElement('audio');
const audioTest = document.createElement('audio');

// Define a common base URL
const baseUrl = '../htmlInterface/sounds/';

// Set the src attribute for each audio element with versioning query parameter
audioDream.src = `${baseUrl}dream.mp3?v=2`;
audioError.src = `${baseUrl}error.mp3?v=2`;
audioGuitar.src = `${baseUrl}guitar.mp3?v=2`;
audioNotify.src = `${baseUrl}notify.mp3?v=2`;
audioPiano.src = `${baseUrl}piano.mp3?v=2`;
audioPluh.src = `${baseUrl}pluh.mp3?v=2`;
audioTest.src = `${baseUrl}soundTest.mp3?v=2`;

let audioFile = 
{
    dream: audioDream,
    error: audioError,
    guitar: audioGuitar,
    piano: audioPiano,
    notify: audioNotify,
    pluh: audioPluh,
    test: audioTest,
}

audioDream.controls = false; // Enable player controls (play, pause, volume, etc.)
audioDream.autoplay = false;  // Auto-play when the page loads 
audioDream.preload = 'auto'; // Preload the audio for optimal performance

audioError.controls = false;
audioError.autoplay = false;
audioError.preload = 'auto';

audioGuitar.controls = false;
audioGuitar.autoplay = false;
audioGuitar.preload = 'auto';

audioNotify.controls = false;
audioNotify.autoplay = false;
audioNotify.preload = 'auto';

audioPiano.controls = false;
audioPiano.autoplay = false;
audioPiano.preload = 'auto';

audioPluh.controls = false;
audioPluh.autoplay = false;
audioPluh.preload = 'auto';

audioTest.controls = false;
audioTest.autoplay = false;
audioTest.preload = 'auto';


// Export the audioFile object
export { audioFile };
