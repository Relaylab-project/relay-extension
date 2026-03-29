document.getElementById('openBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://relay-project-ilyj.web.app' });
});
