// ==UserScript==
// @name         Microsoft Store Installer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Install apps from the Microsoft Store without using the application.
// @author       CHAOSHAX
// @match        *://apps.microsoft.com/store/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

// Print our message on page load.
window.onload = function () {
    console.log(`\n
                 uuuuuuu
             uu$$$$$$$$$$$uu
          uu$$$$$$$$$$$$$$$$$uu
         u$$$$$$$$$$$$$$$$$$$$$u
        u$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$$$$$$$$$$$$$$$$$$$$u
       u$$$$$$"   "$$$"   "$$$$$$u
       "$$$$"      u$u       $$$$"
        $$$u       u$u       u$$$
        $$$u      u$$$u      u$$$
         "$$$$uu$$$   $$$uu$$$$"
          "$$$$$$$"   "$$$$$$$"
            u$$$$$$$u$$$$$$$u
             u$"$"$"$"$"$"$u
  uuu        $$u$ $ $ $ $u$$       uuu
 u$$$$        $$$$$u$u$u$$$       u$$$$
  $$$$$uu      "$$$$$$$$$"     uu$$$$$$
u$$$$$$$$$$$uu    """""    uuuu$$$$$$$$$$
$$$$"""$$$$$$$$$$uuu   uu$$$$$$$$$"""$$$"
 """      ""$$$$$$$$$$$uu ""$"""
           uuuu ""$$$$$$$$$$uuu
  u$$$uuu$$$$$$$$$uu ""$$$$$$$$$$$uuu$$$
  $$$$$$$$$$""""           ""$$$$$$$$$$$"
   "$$$$$"                      ""$$$$""
     $$$"                         $$$$"
\nCHAOSHAX - Microsoft Store Installer\nFreedom restored.\n\n\n`);
};

// Keep repeating so it works even when page changes.
const interval = setInterval(function () {
    initializeButtons();
}, 500);

function initializeButtons() {
    // Find all install buttons.
    var nodeList = document.querySelectorAll('[id^=getOrRemoveButton]');

    // Cycle through all of the button instances.
    for (let i = 0; i < nodeList.length; i++) {
        // Change the text of the button to Install via CHAOSHAX.
        nodeList[i].innerHTML = nodeList[i].innerHTML.replace("Get in Store app", "Install via CHAOSHAX");

        // Clone the element to remove the event listeners.
        nodeList[i].parentNode.replaceChild(nodeList[i].cloneNode(true), nodeList[i]);

        // Find our new button.
        var finalButton = document.getElementById(nodeList[i].id);

        // Inject our own click event listener on to the button.
        $(finalButton).one("click", buttonClick);

        // Change the IDs for later use so we know that it injected successfully.
        finalButton.id = finalButton.id.replace("getOrRemoveButton", "chaosInstallButton");
    }
}

var buttonClick = function () {
    // Create a btn variable to access later.
    var btn = this;

    // Create our new form data.
    const formData = new FormData();

    formData.set("type", "url");
    formData.set("url", document.location.href);
    formData.set("ring", "Retail");
    formData.set("lang", "en-US");

    // Compose a new HTTP request.
    GM_xmlhttpRequest({
        method: "POST",
        url: "https://store.rg-adguard.net/api/GetFiles",
        data: formData,
        onload: function (response) {
            // Append a new popup with an iframe for our data.
            $("body").append('                                                          \
                <div id="chaosInstallPopup">                                               \
                <form style="padding: 20px;"> <iframe id="chaosInstallPopupIframe" width="100%" height="500px"></iframe>\
                <hr/> \
                <button id="chaosInstallPopupClose" type="button">Close popup</button> \
                </form>                                                                  \
                </div>                                                                    \
            ' );

            // Select the iframe and its content window document.
            var doc = document.getElementById('chaosInstallPopupIframe').contentWindow.document;

            // Write the response content to the document.
            doc.open();
            doc.write(response.responseText);
            doc.close();

            // Make the close button work on click.
            $("#chaosInstallPopupClose").click(function () {
                // Add back the click function.
                $(btn).one("click", buttonClick);
                // Remove our popup.
                $("#chaosInstallPopup").remove();
            });

            // Add the CSS styles for the popup.
            GM_addStyle("                                                 \
                #chaosInstallPopup {                                         \
                    position: fixed; \
                    top: 50%; \
                    left: 50%; \
                    transform: translate(-50%, -50%); \
                    width: 70%; \
                    background:             powderblue;                     \
                    border:                 3px double black;               \
                    border-radius:          1ex;                            \
                    z-index:                777;                            \
                }                                                           \
                #chaosInstallPopup button{                                   \
                    cursor:                 pointer;                        \
                    margin:                 1em 1em 0;                      \
                    border:                 1px outset buttonface;          \
                }                                                           \
            " );
        }
    })
}
