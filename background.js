const adUrlListHost =
  "https://raw.githubusercontent.com/EnergizedProtection/block/master/spark/formats/domains.txt";
const patternListHost =
  "https://raw.githubusercontent.com/easylist/easylist/master/easylist/easylist_general_block.txt";
let isAdBlockingActive = true;
let urlsToBlock = [];
let adBlockRequestCount = 0;

const fetchUrlsToBlockAndBlock = async () => {
  const hostResponse = await fetch(adUrlListHost);
  const hostText = await hostResponse.text();
  const adUrlList = hostText
    .split("\n")
    .filter(url => !url.startsWith("#"))
    .map(url => `*://${url}/*`);

  const patternHost = await fetch(patternListHost);
  const patternHostText = await patternHost.text();
  const patternList = patternHostText
    .split("\n")
    .filter(pattern => !pattern.startsWith("! ") && pattern !== "")
    .map(pattern => `*://*/*${pattern}*`);

  urlsToBlock = urlsToBlock.concat(adUrlList, patternList);
  enableAdBlocking();
};

fetchUrlsToBlockAndBlock();

const adBlockRequest = details => {
  adBlockRequestCount++;
  chrome.browserAction.setBadgeText({
    text: adBlockRequestCount.toString()
  });
  return { cancel: true };
};

const enableAdBlocking = () => {
  isAdBlockingActive = true;
  chrome.browserAction.setBadgeText({ text: "ON" });
  chrome.webRequest.onBeforeRequest.addListener(
    adBlockRequest,
    {
      urls: urlsToBlock
    },
    ["blocking"]
  );
};

const disableAdBlocking = () => {
  isAdBlockingActive = false;
  chrome.webRequest.onBeforeRequest.removeListener(adBlockRequest);
  chrome.browserAction.setBadgeText({ text: "OFF" });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggleAdBlocking") {
    if (isAdBlockingActive) {
      disableAdBlocking();
      sendResponse(false);
    } else {
      enableAdBlocking();
      sendResponse(true);
    }
  } else {
    sendResponse(isAdBlockingActive);
  }
});
