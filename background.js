console.log("Hello from background.js");

fetch(
  "https://raw.githubusercontent.com/EnergizedProtection/block/master/spark/formats/domains.txt"
)
  .then(response => response.text())
  .then(responseText => {
    var blockedUrl = responseText.split("\n").filter(url => url[0] !== "#");
    blockedUrl = blockedUrl.map(url => `*://${url}/*`);
    chrome.webRequest.onBeforeRequest.addListener(
      function(details) {
        return { cancel: true };
      },
      {
        urls: blockedUrl
      },
      ["blocking"]
    );
  });
