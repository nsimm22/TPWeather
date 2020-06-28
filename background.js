chrome.runtime.onInstalled.addListener(function() {
  console.log('installed')
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'app.trainingpeaks.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id,{file: 'changeColor.js'}, function () {
      chrome.tabs.sendMessage(tabs[0].id, {scriptOptions: {"address": "","city": ""}})
   });
  })
})

