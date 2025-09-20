# Formulario NAS v7.1 (Firebase · Full)

Esta versión guarda los **registros NAS en Firestore** de forma **centralizada** y mantiene:
- Pantalla de inicio con **centro** + validación por **iniciales** o **clave global** (configurable).
- **Panel admin** (usuario: `gllc007`, contraseña: `Gl5351957C.`) para editar centros, modo de clave y listas (Turno, Paciente, Unidad, GRD).
- Formulario completo con **GRD**, orden **1a→23**, exclusión automática (1a/1b/1c, 4a/4b/4c, 6a/6b/6c, 7a/7b, 8a/8b/8c), franjas zebra.
- **Historial por centro** (consulta a Firestore), **Duplicar última**, **Imprimir**, **Exportar CSV**.

## ⚙️ Pasos para implementar Firebase
1) Crea tu proyecto en **Firebase Console** → *Add project* (Analytics opcional).
2) Activa **Firestore Database** → *Create database* → **Production mode** → región cercana.
3) Activa **Authentication** → *Get started* → habilita **Anonymous** (o configura email/contraseña si prefieres).
4) En *Project settings → General → Your apps (Web)* registra tu app y copia el bloque de configuración.
5) Abre `index.html` y reemplaza el objeto:
```js
window.FIREBASE_CONFIG = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};
```
6) **Reglas de seguridad** (Firestore → Rules). Publica algo como:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Registros NAS por centro
    match /facilities/{facility}/records/{doc} {
      allow read, write: if request.auth != null; // requiere usuario autenticado (anónimo sirve)
    }
  }
}
```
> Si luego quieres restringir por dominio de tu sitio o por roles, te ayudo a afinar las reglas.

## 🗃️ Estructura en Firestore
Los registros se guardan en subcolecciones por centro:
```
facilities/{slug-del-centro}/records/{autoid}
```
Cada documento incluye:
`facility, created_at, identifier, shift, patient_status, unit, grd, note, codes[], total_score, ts`.

## 🚀 Publicar
- Sube `index.html` y la carpeta `assets/` a tu repo en GitHub Pages / Netlify / Vercel.
- Si no ves cambios, abre con `?v=7.1` al final de la URL para evitar caché.

## 🔐 Admin
- Botón **Acceso admin** en la pantalla inicial.
- Usuario: **gllc007** · Contraseña: **Gl5351957C.**
- Configuración guardada en `localStorage` bajo `nas_admin_config`.

¿Quieres que además agreguemos **filtros por fecha** en el historial y un **dashboard** con gráficos? Puedo incorporarlo.
