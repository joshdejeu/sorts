import { SortSettings } from "./classes/sortSettings";

let settingsOpener = document.getElementById('sort_settings');
let toggleOpenSettings = false

settingsOpener.addEventListener('click', ()=>
{
    if(toggleOpenSettings)
    {
        SortSettings.openSettings();
    }
    toggleOpenSettings = !toggleOpenSettings;
});


