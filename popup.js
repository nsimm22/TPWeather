var _AnalyticsCode = 'UA-170793850-1';
/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();
/**
 * Track a click on a button using the asynchronous tracking API.
 *
 * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
 * for information on how to use the asynchronous tracking API.
 */
function trackButtonClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', trackButtonClick);
  }
});

let changeColor = document.getElementById('submit');
let getData = document.getElementById("get")

changeColor.onclick = function(element) {
  console.log('submit')
    let address = document.getElementById('address').value
    let city = document.getElementById('city').value
    let datatype = document.querySelector("#myonoffswitch").checked
    console.log(datatype)

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id,{file: 'changeColor.js'}, function () {
        chrome.tabs.sendMessage(tabs[0].id, {scriptOptions: {"address": address,"city": city, "metric": datatype}})
       });
    });
  };

getData.onclick = function(element) {
  console.log('GET')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id,{file: 'changeColor.js'}, function () {
      chrome.tabs.sendMessage(tabs[0].id, {scriptOptions: {"address": "","city": ""}})
  })
 })
}

