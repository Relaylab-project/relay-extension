const FIRESTORE_URL = "https://firestore.googleapis.com/v1/projects/relay-project-ilyj/databases/(default)/documents/relay/context?key=AIzaSyAL3Vidfoq9X63nyOV7ACBnPR6M2yfvxGU";

const INPUT_SELECTORS = ['#prompt-textarea', 'div[contenteditable="true"]', 'textarea'];

function getInput() {
  for (const sel of INPUT_SELECTORS) {
    const el = document.querySelector(sel);
    if (el && el.offsetParent !== null) return el;
  }
  return null;
}

async function pushToCloud(text) {
  await fetch(FIRESTORE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { text: { stringValue: text }, updatedAt: { stringValue: new Date().toISOString() } } })
  });
}

async function pullFromCloud() {
  const res = await fetch(FIRESTORE_URL);
  const data = await res.json();
  return data.fields?.text?.stringValue || null;
}

document.addEventListener('keydown', async (e) => {
  if (e.key !== 'Enter' || e.shiftKey) return;
  const input = getInput();
  if (!input) return;
  const val = (input.value || input.innerText).toLowerCase();

  if (val.startsWith('/relay pull')) {
    e.preventDefault();
    const context = await pullFromCloud();
    if (context) {
       if (input.tagName === 'TEXTAREA') input.value = context;
       else input.innerText = context;
       input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
});
