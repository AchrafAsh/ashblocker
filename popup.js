chrome.runtime.sendMessage({ popupOpen: true }, response => {
  document.getElementById("togBtn").checked = response;
});

document.getElementById("togBtn").addEventListener("click", e => {
  chrome.runtime.sendMessage({ type: "toggleAdBlocking" }, response => {
    document.getElementById("togBtn").checked = response;
  });
});
