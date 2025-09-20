import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const app = initializeApp(window.FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);
signInAnonymously(auth).catch(err => console.error("Auth error", err));

const root = document.getElementById('appRoot');
root.innerHTML = `
  <section class="card">
    <h1>Formulario NAS (Firebase)</h1>
    <label>Identificador <input id="identifier"></label>
    <label>Turno <select id="shift"><option>Día</option><option>Noche</option></select></label>
    <button id="saveBtn">Guardar</button>
    <div id="history"></div>
  </section>
`;

document.getElementById('saveBtn').addEventListener('click', async () => {
  const identifier = document.getElementById('identifier').value;
  const shift = document.getElementById('shift').value;
  await addDoc(collection(db, "nas_records"), {
    identifier, shift, created_at: new Date().toISOString()
  });
  alert("Guardado en Firestore");
  loadHistory();
});

async function loadHistory(){
  const q = query(collection(db, "nas_records"), orderBy("created_at","desc"));
  const snap = await getDocs(q);
  const rows = snap.docs.map(d => d.data());
  document.getElementById('history').innerHTML = rows.map(r => `<p>${r.created_at} - ${r.identifier} (${r.shift})</p>`).join("");
}
loadHistory();
