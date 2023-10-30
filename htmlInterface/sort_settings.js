// import { SortSettings } from "./classes/sortSettings.js";

let settingsOpener = document.getElementById('sort_controls');
let toggleOpenSettings = false

settingsOpener.addEventListener('click', ()=>
{
    if(toggleOpenSettings)
    {
        // SortSettings.openSettings();
    }
    toggleOpenSettings = !toggleOpenSettings;
});


