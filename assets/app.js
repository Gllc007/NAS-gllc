import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

/* ==================== Firebase ==================== */
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDC-7Fagf2JtaiUyzHM87ZCSfUcv50fRYQ",
    authDomain: "nas-gllc.firebaseapp.com",
    projectId: "nas-gllc",
    storageBucket: "nas-gllc.firebasestorage.app",
    messagingSenderId: "380143309126",
    appId: "1:380143309126:web:07c6c8ace3748aa7d95547",
    measurementId: "G-KH9996N47T"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
/* ==================== Catálogo NAS ==================== */
const NAS = {
  "1a": { label: "Control de Signos Vitales por horario", weight: 4.5 },
  "1b": { label: "Observación continua o activa durante 2 horas o más", weight: 12.1 },
  "1c": { label: "Observación continua o activa 4 horas o más", weight: 19.6 },
  "2":  { label: "Control de exámenes de laboratorio, bioquímicos y microbiológicos", weight: 4.3 },
  "3":  { label: "Medicación excepto medicamentos vasoactivos", weight: 5.6 },
  "4a": { label: "Procedimientos de higiene básica", weight: 4.1 },
  "4b": { label: "Procedimientos de higiene con duración > 2 horas", weight: 16.5 },
  "4c": { label: "Procedimientos de higiene con duración > 4 horas", weight: 20.0 },
  "5":  { label: "Cuidados de drenajes, excepto SNG", weight: 1.8 },
  "6a": { label: "Movilización y cambios de posición; sentar en sillón hasta 3 veces", weight: 5.5 },
  "6b": { label: "Movilización y cambios de posición; más de 3 veces/d o con 2 enfermeros", weight: 12.4 },
  "6c": { label: "Movilización y cambios de posición; con 3 o más enfermeras/os", weight: 17.0 },
  "7a": { label: "Apoyo y cuidado a familiares. Una hora de dedicación", weight: 4.0 },
  "7b": { label: "Apoyo y cuidado a familiares. Al menos tres horas de dedicación", weight: 32.0 },
  "8a": { label: "Tareas administrativas o de gestión: básicas", weight: 4.2 },
  "8b": { label: "Tareas administrativas o de gestión hasta 2 horas", weight: 23.2 },
  "8c": { label: "Tareas administrativas o de gestión más de 4 horas", weight: 30.0 },
  "9":  { label: "Asistencia ventilatoria, cualquier forma", weight: 1.4 },
  "10": { label: "Cuidados de vía aérea artificial", weight: 1.8 },
  "11": { label: "Tratamientos para mejorar la función respiratoria", weight: 4.4 },
  "12": { label: "Medicación vasoactiva", weight: 1.2 },
  "13": { label: "Reposición intravenosa de gran cantidad de líquidos (>3 L por día)", weight: 2.5 },
  "14": { label: "Monitorización de aurícula izquierda (PICCO, Swan-Ganz, Vigileo, etc.)", weight: 1.7 },
  "15": { label: "RCP tras parada cardiorrespiratoria en las últimas 24 h", weight: 7.1 },
  "16": { label: "Técnicas de depuración extrarrenal (Diálisis, Novalung, etc.)", weight: 7.7 },
  "17": { label: "Cuantificación de diuresis", weight: 7.0 },
  "18": { label: "Medición de la presión intracraneal", weight: 1.6 },
  "19": { label: "Tratamiento de complicaciones metabólicas (acidosis/alcalosis)", weight: 1.3 },
  "20": { label: "Nutrición parenteral", weight: 2.9 },
  "21": { label: "Nutrición enteral", weight: 1.3 },
  "22": { label: "Intervenciones específicas en UCI (instalación CVC, PICC, etc.)", weight: 2.8 },
  "23": { label: "Intervenciones específicas fuera de la UCI (TAC, RNM, RX, etc.)", weight: 1.9 },
};
const ORDER = ["1a","1b","1c","2","3","4a","4b","4c","5","6a","6b","6c","7a","7b","8a","8b","8c","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
const EXCLUSIVE_SETS = [
  new Set(["1a","1b","1c"]),
  new Set(["4a","4b","4c"]),
  new Set(["6a","6b","6c"]),
  new Set(["7a","7b"]),
  new Set(["8a","8b","8c"]),
];

/* ==================== Utilidades ==================== */
const $ = s => document.querySelector(s);
const root = document.getElementById("appRoot");
function normalizeStr(s){ return s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function computeInitials(name){
  const stop = new Set(["de","del","la","las","los","y","da","do","das","dos"]);
  const tokens = normalizeStr(name).split(/\s+/).filter(Boolean);
  const letters = tokens.filter(t => !stop.has(t.toLowerCase())).map(t => t[0].toUpperCase());
  return letters.join("");
}
function slugify(name){ return normalizeStr(name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function numberToComma(n){ return n.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

/* ==================== Config Admin (local) ==================== */
const DEFAULT_CENTERS = [
  "Clínica Alemana","Clínica Las Condes","Clínica Santa María","Clínica Dávila","Clínica Indisa",
  "Clínica Universidad de los Andes","Clínica Bupa Santiago","Clínica Vespucio","Clínica Bicentenario",
  "Clínica Cordillera","Clínica Tabancura","Clínica RedSalud Santiago","Clínica RedSalud Providencia",
  "Clínica UC San Carlos de Apoquindo","Hospital Clínico UC","Hospital del Salvador","Hospital Sótero del Río",
  "Hospital San Juan de Dios","Hospital Barros Luco Trudeau","Hospital Félix Bulnes","Hospital Roberto del Río",
  "Hospital Exequiel González Cortés","Hospital Calvo Mackenna","Hospital San Borja Arriarán","Hospital La Florida Eloísa Díaz",
  "Hospital Padre Hurtado","Hospital El Pino","Hospital Metropolitano","Hospital Militar de Santiago",
  "Hospital de Carabineros","Instituto Nacional del Tórax","Instituto Nacional del Cáncer","Instituto de Neurocirugía (INCA)",
  "Hospital del Trabajador (ACHS)","Mutual de Seguridad (Hospital del Trabajador)","Otro / Centro privado"
];
const DEFAULT_GRD = [
  "Insuficiencia respiratoria aguda","Neumonía adquirida en la comunidad","Sepsis bacteriana",
  "Shock séptico","EPOC reagudizado","IRA postquirúrgica","Traumatismo craneoencefálico",
  "Pancreatitis aguda","IAM sin elevación ST","IAM con elevación ST"
];
const DEFAULTS = {
  centers: DEFAULT_CENTERS,
  grd: DEFAULT_GRD,
  shift: ["Día","Noche"],
  patient: ["N/A","Ingreso","Egreso"],
  unit: ["UCI","UTI"],
  auth_mode: "initials", // "initials" | "global"
  global_key: "NAS2025"
};
function loadAdmin(){
  const raw = localStorage.getItem("nas_admin_config");
  if (!raw) return { ...DEFAULTS };
  try {
    const cfg = JSON.parse(raw);
    return { ...DEFAULTS, ...cfg };
  } catch { return { ...DEFAULTS }; }
}
function saveAdmin(cfg){
  localStorage.setItem("nas_admin_config", JSON.stringify(cfg));
}

/* ==================== Vistas ==================== */
function renderLogin(){
  const cfg = loadAdmin();
  root.innerHTML = `
    <section class="card">
      <h1>Inicio</h1>
      <p class="helper">Seleccione su centro y escriba la clave de acceso (${cfg.auth_mode==="initials"?"iniciales del centro":"clave global"}).</p>
      <div class="row">
        <label>Clínica / Hospital
          <select id="facilitySelect">${cfg.centers.map(c=>`<option value="${c}">${c}</option>`).join("")}</select>
        </label>
        <label>Clave
          <input id="accessKey" type="password" placeholder="${cfg.auth_mode==="initials"?"Ej.: Clínica Santa María → CSM":"Clave global"}">
        </label>
      </div>
      <div class="mt12">
        <button id="enterBtn">Entrar</button>
        <button id="adminBtn" class="secondary">Acceso admin</button>
        <span id="authMsg" class="helper"></span>
      </div>
    </section>
  `;
  $("#enterBtn").addEventListener("click", () => {
    const facility = $("#facilitySelect").value;
    const key = ($("#accessKey").value || "").trim();
    const ok = cfg.auth_mode==="initials"
      ? (normalizeStr(key).toUpperCase() === computeInitials(facility))
      : (key === cfg.global_key);
    if (!ok){ $("#authMsg").textContent = "Clave incorrecta."; return; }
    localStorage.setItem("nas_auth", JSON.stringify({ facility, ts: Date.now() }));
    renderApp();
  });
  $("#adminBtn").addEventListener("click", renderAdminLogin);
  $("#logoutBtn").style.display = "none";
  $("#facilityBadge").style.display = "none";
}

function renderAdminLogin(){
  root.innerHTML = `
    <section class="card">
      <h1>Acceso admin</h1>
      <div class="row">
        <label>Usuario <input id="admUser" placeholder="usuario"></label>
        <label>Contraseña <input id="admPass" type="password" placeholder="contraseña"></label>
      </div>
      <div class="mt12">
        <button id="admGo">Entrar</button>
        <button class="secondary" id="admBack">Volver</button>
        <span id="admMsg" class="helper"></span>
      </div>
    </section>
  `;
  $("#admBack").addEventListener("click", renderLogin);
  $("#admGo").addEventListener("click", () => {
    const u = $("#admUser").value.trim();
    const p = $("#admPass").value.trim();
    if (u==="gllc007" && p==="Gl5351957C."){
      renderAdminPanel();
    } else {
      $("#admMsg").textContent = "Credenciales inválidas.";
    }
  });
}

function renderAdminPanel(){
  const cfg = loadAdmin();
  root.innerHTML = `
    <section class="card">
      <h1>Panel de administración</h1>
      <h2>Centros (uno por línea)</h2>
      <textarea id="centersBox" rows="8">${cfg.centers.join("\n")}</textarea>
      <h2 class="mt12">Modo de clave</h2>
      <label><input type="radio" name="authmode" value="initials" ${cfg.auth_mode==="initials"?"checked":""}> Iniciales del centro</label>
      <label><input type="radio" name="authmode" value="global" ${cfg.auth_mode==="global"?"checked":""}> Clave global</label>
      <div class="row">
        <label>Clave global (si se usa)
          <input id="globalKey" type="text" value="${cfg.global_key}">
        </label>
      </div>

      <h2 class="mt12">Opciones del formulario</h2>
      <div class="row">
        <label>Turnos (separados por coma)
          <input id="shiftList" type="text" value="${cfg.shift.join(", ")}">
        </label>
        <label>Paciente (separados por coma)
          <input id="patientList" type="text" value="${cfg.patient.join(", ")}">
        </label>
        <label>Unidad (separados por coma)
          <input id="unitList" type="text" value="${cfg.unit.join(", ")}">
        </label>
      </div>
      <label>Diagnósticos GRD (uno por línea)
        <textarea id="grdBox" rows="8">${cfg.grd.join("\n")}</textarea>
      </label>

      <div class="mt12">
        <button id="saveAdmin">Guardar cambios</button>
        <button id="backAdmin" class="secondary">Volver</button>
        <span id="admSaveMsg" class="helper"></span>
      </div>
    </section>
  `;
  $("#saveAdmin").addEventListener("click", () => {
    const centers = $("#centersBox").value.split("\n").map(s=>s.trim()).filter(Boolean);
    const grd = $("#grdBox").value.split("\n").map(s=>s.trim()).filter(Boolean);
    const shift = $("#shiftList").value.split(",").map(s=>s.trim()).filter(Boolean);
    const patient = $("#patientList").value.split(",").map(s=>s.trim()).filter(Boolean);
    const unit = $("#unitList").value.split(",").map(s=>s.trim()).filter(Boolean);
    const auth_mode = document.querySelector("input[name='authmode']:checked").value;
    const global_key = $("#globalKey").value.trim() || "NAS2025";
    saveAdmin({ centers, grd, shift, patient, unit, auth_mode, global_key });
    $("#admSaveMsg").textContent = "Guardado.";
  });
  $("#backAdmin").addEventListener("click", renderLogin);
}

function renderApp(){
  const authState = JSON.parse(localStorage.getItem("nas_auth") || "{}");
  const cfg = loadAdmin();
  root.innerHTML = `
    <h1>Aplicación de la Escala NAS</h1>
    <p class="helper">Historial centralizado por centro (Firestore). Orden 1a→23. Ítems excluyentes en gris.</p>

    <form id="nasForm">
      <section class="card">
        <h2>Datos de aplicación</h2>
        <div class="row">
          <label>Identificador (RUT u otro)
            <input type="text" name="identifier" placeholder="Opcional">
          </label>
          <label>Turno
            <select name="shift">
              ${cfg.shift.map(s=>`<option value="${s}">${s}</option>`).join("")}
            </select>
          </label>
          <label>Fecha y hora de evaluación
            <input type="datetime-local" name="created_at">
          </label>
          <label>Paciente
            <select name="patient_status">
              ${cfg.patient.map(s=>`<option value="${s}">${s}</option>`).join("")}
            </select>
          </label>
          <label>Unidad
            <select name="unit">
              ${cfg.unit.map(s=>`<option value="${s}">${s}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="row">
          <label>Diagnóstico GRD
            <input list="grdList" name="grd" placeholder="Escribe o elige…">
            <datalist id="grdList">
              ${cfg.grd.map(g=>`<option value="${g}">`).join("")}
            </datalist>
          </label>
        </div>
        <label>Nota (opcional)
          <textarea name="note" rows="3" placeholder="Observaciones, procedimientos, etc."></textarea>
        </label>
      </section>

      <section class="card">
        <h2>Ítems NAS</h2>
        <div id="catalogGrid" class="grid zebra"></div>
      </section>

      <section class="card">
        <h2>Resumen</h2>
        <p><strong>Puntaje total:</strong> <span id="totalScore">0,0</span></p>
        <div class="row">
          <button type="submit">Guardar evaluación</button>
          <button type="button" id="dupLast">Duplicar última</button>
          <button type="button" id="printBtn">Imprimir</button>
          <button type="button" id="exportCsv">Exportar CSV</button>
        </div>
      </section>
    </form>

    <section class="card">
      <h2>Historial (este centro)</h2>
      <div id="history"></div>
    </section>
  `;

  // topbar
  const badge = document.getElementById('facilityBadge');
  badge.textContent = authState.facility;
  badge.style.display = "inline-block";
  document.getElementById('logoutBtn').style.display = "inline-block";
  document.getElementById('logoutBtn').onclick = () => { localStorage.removeItem("nas_auth"); renderLogin(); };

  renderCatalog();
  setDefaultDateTime();
  refreshSummary();

  document.getElementById("nasForm").addEventListener("submit", onSubmit);
  document.addEventListener("change", e => {
    if (e.target.matches('input[type=checkbox][data-nas]')) { exclusiveAuto(e); refreshSummary(); }
  });
  document.getElementById("dupLast").addEventListener("click", restoreLast);
  document.getElementById("printBtn").addEventListener("click", ()=>window.print());
  document.getElementById("exportCsv").addEventListener("click", exportCSV);

  loadHistory(); // Firestore
}

/* ==================== Catálogo & cálculo ==================== */
function renderCatalog(){
  const grid = $("#catalogGrid");
  const items = ORDER.map(code => [code, NAS[code]]);
  grid.innerHTML = items.map(([code, meta]) => `
    <label class="item ${isExclusive(code)?'exclusive':''}">
      <span class="badge">${isExclusive(code)?'Excluyente':''}</span>
      <input type="checkbox" value="${code}" data-nas>
      <strong>${code}</strong> ${meta.label} <em>(${meta.weight})</em>
    </label>
  `).join("");
}
function isExclusive(code){ return EXCLUSIVE_SETS.some(set => set.has(code)); }
function exclusiveAuto(e){
  const code = e.target.value;
  for (const g of EXCLUSIVE_SETS){
    if (g.has(code)){
      document.querySelectorAll('input[type=checkbox][data-nas]').forEach(cb => {
        if (cb.value !== code && g.has(cb.value)) cb.checked = false;
      });
      break;
    }
  }
}
function getSelectedCodes(){
  return Array.from(document.querySelectorAll('input[type=checkbox][data-nas]:checked')).map(cb => cb.value);
}
function computeScore(codes){
  return codes.reduce((acc, c) => acc + (NAS[c]?.weight || 0), 0);
}
function refreshSummary(){
  const total = computeScore(getSelectedCodes());
  $("#totalScore").textContent = numberToComma(total);
}
function setDefaultDateTime(){
  const f = $("#nasForm");
  if (f && !f.created_at.value){
    const now = new Date();
    const pad = n => String(n).padStart(2,'0');
    const local = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    f.created_at.value = local;
  }
}

/* ==================== Firestore helpers ==================== */
function currentFacility(){
  const a = JSON.parse(localStorage.getItem("nas_auth") || "{}");
  return a.facility || "default";
}
function facilityPath(){
  return `facilities/${slugify(currentFacility())}/records`;
}

/* Save */
async function onSubmit(e){
  e.preventDefault();
  const f = e.target;
  const codes = getSelectedCodes();
  const payload = {
    facility: currentFacility(),
    created_at: (f.created_at.value || new Date().toISOString().slice(0,16)).replace("T"," "),
    identifier: f.identifier.value || "",
    shift: f.shift.value || "",
    patient_status: f.patient_status.value || "N/A",
    unit: f.unit.value || "UCI",
    grd: f.grd.value || "",
    note: f.note.value || "",
    codes,
    total_score: computeScore(codes),
    ts: Date.now()
  };
  await addDoc(collection(db, facilityPath()), payload);
  alert("Guardado en Firestore");
  f.reset(); renderCatalog(); setDefaultDateTime(); refreshSummary();
  await loadHistory();
}

/* Load */
let lastRow = null;
async function loadHistory(){
  const qSnap = await getDocs(query(collection(db, facilityPath()), orderBy("created_at","desc")));
  const rows = qSnap.docs.map(d => d.data());
  lastRow = rows[0] || null;
  const table = [`<table><thead><tr>
    <th>Fecha</th><th>Identificador</th><th>Turno</th><th>Paciente</th><th>Unidad</th><th>GRD</th><th>Puntaje</th><th>Ítems</th><th>Nota</th>
  </tr></thead><tbody>`];
  for (const r of rows){
    table.push(`<tr>
      <td>${r.created_at||"—"}</td>
      <td>${r.identifier||"—"}</td>
      <td>${r.shift||"—"}</td>
      <td>${r.patient_status||"N/A"}</td>
      <td>${r.unit||"—"}</td>
      <td>${r.grd||"—"}</td>
      <td>${numberToComma(r.total_score||0)}</td>
      <td>${Array.isArray(r.codes)?r.codes.join(", "):"—"}</td>
      <td>${r.note||"—"}</td>
    </tr>`);
  }
  table.push("</tbody></table>");
  $("#history").innerHTML = table.join("");
}

/* Duplicate last */
function restoreLast(){
  if (!lastRow){ alert("No hay registros previos en este centro."); return; }
  const f = $("#nasForm");
  f.identifier.value = lastRow.identifier || "";
  f.shift.value = lastRow.shift || "Día";
  f.note.value = lastRow.note || "";
  f.patient_status.value = lastRow.patient_status || "N/A";
  f.unit.value = lastRow.unit || "UCI";
  if (lastRow.grd) f.grd.value = lastRow.grd;
  if (lastRow.created_at) f.created_at.value = lastRow.created_at.replace(" ","T");
  const prev = lastRow.codes || [];
  document.querySelectorAll('input[type=checkbox][data-nas]').forEach(cb => cb.checked = prev.includes(cb.value));
  refreshSummary();
}

/* Export CSV */
async function exportCSV(){
  const qSnap = await getDocs(query(collection(db, facilityPath()), orderBy("created_at","desc")));
  const rows = qSnap.docs.map(d => d.data());
  if (rows.length === 0){ alert("No hay datos para exportar."); return; }
  const headers = ["facility","created_at","identifier","shift","patient_status","unit","grd","total_score","codes","note"];
  const csv = [headers.join(",")].concat(rows.map(r => [
    `"${(r.facility||"").replace(/"/g,'""')}"`,
    r.created_at,
    `"${(r.identifier||"").replace(/"/g,'""')}"`,
    `"${(r.shift||"").replace(/"/g,'""')}"`,
    `"${(r.patient_status||"N/A").replace(/"/g,'""')}"`,
    `"${(r.unit||"—").replace(/"/g,'""')}"`,
    `"${(r.grd||"").replace(/"/g,'""')}"`,
    (r.total_score ?? 0),
    `"${(Array.isArray(r.codes)?r.codes.join(" "):"").replace(/"/g,'""')}"`,
    `"${(r.note||"").replace(/"/g,'""')}"`
  ].join(","))).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `nas_export_${new Date().toISOString().slice(0,10)}_${slugify(currentFacility())}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ==================== Bootstrap ==================== */
document.addEventListener("DOMContentLoaded", () => {
  const a = JSON.parse(localStorage.getItem("nas_auth") || "{}");
  if (a && a.facility){ renderApp(); } else { renderLogin(); }
});
