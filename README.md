# Formulario NAS v7.2 (Google Sheets · Full)

Centraliza los registros en **Google Sheets** usando un **Apps Script Web App** (doPost/doGet).
Incluye: inicio por centro (clave por iniciales o global), panel Admin (usuario `gllc007`, contraseña `Gl5351957C.`),
GRD, exclusiones 1a–23, zebra, duplicar, imprimir y exportar CSV.

## Despliegue
1. **Google Sheets**: crea hoja (ej. "NAS Registros").
2. **Apps Script** (Extensiones → Apps Script) y pega:
```javascript
const SHEET_NAME = 'nas_records';
function _headers(){ return ['timestamp','facility','created_at','identifier','shift','patient_status','unit','grd','total_score','codes','note']; }
function _getSheet(){ const ss=SpreadsheetApp.getActiveSpreadsheet(); let sh=ss.getSheetByName(SHEET_NAME); if(!sh){ sh=ss.insertSheet(SHEET_NAME); sh.appendRow(_headers()); } return sh; }
function doPost(e){ try{ const d=JSON.parse(e.postData.contents); const sh=_getSheet(); sh.appendRow([new Date(),d.facility||'',d.created_at||'',d.identifier||'',d.shift||'',d.patient_status||'',d.unit||'',d.grd||'',Number(d.total_score||0),d.codes||'',d.note||'']); return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);}catch(err){ return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);} }
function doGet(e){ const fac=(e.parameter.facility||'').trim(); const sh=_getSheet(); const values=sh.getDataRange().getValues(); const rows=values.slice(1).map(r=>({timestamp:r[0],facility:r[1],created_at:r[2],identifier:r[3],shift:r[4],patient_status:r[5],unit:r[6],grd:r[7],total_score:r[8],codes:r[9],note:r[10]})); const filtered=fac?rows.filter(r=>(r.facility||'')===fac):rows; filtered.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at))); return ContentService.createTextOutput(JSON.stringify({rows:filtered})).setMimeType(ContentService.MimeType.JSON); }
```
3. **Deploy → Web app**: *Execute as*: Me · *Who has access*: Anyone (o Anyone with link). Copia la **URL** `/exec`.
4. En `index.html`, pega la URL en `window.SHEETS_WEBAPP_URL`.
5. Sube `index.html` + `assets/` a GitHub Pages. Usa `?v=7.2` para forzar caché.

### Seguridad opcional
- Token secreto en doPost/doGet y validación en el front; puedo integrarlo si lo necesitas.
