[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# VIEW MY VIEW  
## Real-Time Peer-to-Peer Visual Relay Platform

VIEW MY VIEW is a secure, browser-based peer-to-peer screen and camera sharing platform built using WebRTC and Socket.IO.  
It enables encrypted real-time visual collaboration without storing media on servers.

Designed and implemented by Raghavan S.

---

## Overview

VIEW MY VIEW establishes a direct browser-to-browser encrypted tunnel for:

- Screen sharing (Desktop)
- Camera streaming (Mobile/Desktop)
- Microphone relay
- Optional two-way voice collaboration (Duo Mode)

The backend server is used only for signaling.  
All video and audio data flows directly between peers using WebRTC.

---

## Architecture

### Frontend
- `index.html` – Dashboard and cinematic splash intro  
- `share.html` – Host transmission module  
- `join.html` – Viewer interface  
- `main.js` – Core WebRTC utilities  
- `style.css` – Immersive UI and animation system  

### Backend
- `server.js` – Express and Socket.IO signaling relay  

### Hosting
- Frontend: Netlify  
- Signaling Server: Render  
- STUN: Google STUN server  

---

## Security Model

### Viewer-First Handshake

The system enforces a viewer-first connection model:

1. Viewer enters access code  
2. Viewer clicks "Establish Connection"  
3. Host receives `viewer-ready`  
4. Host begins transmission  

This prevents blind broadcasting.

### No Persistent Sessions

- Access codes generated per session  
- No database  
- No authentication storage  
- No tracking  
- No recording  

### Media Never Touches the Server

The signaling server only relays connection metadata:

```js
socket.on('signal', (data) => {
    socket.to(data.code).emit('signal', {
        from: socket.id,
        signalData: data.signalData
    });
});
```

All media flows peer-to-peer through WebRTC.

---

## Host Module Features

### Desktop Mode
- Screen capture via `getDisplayMedia()`
- Optional system audio
- Optional microphone injection
- Dynamic track management

### Mobile Mode
- Camera streaming via `getUserMedia()`
- Front/back camera switching
- Mirroring support for front camera

### Smart Control System
- Video toggle
- Microphone toggle
- System audio toggle
- Duo Mode activation
- Camera flip (mobile)

### Duo Mode (Two-Way Voice)

Flow:

1. Host activates Duo Mode  
2. Viewer receives modal  
3. Viewer accepts  
4. Microphone track added to peer connection  
5. Host renegotiates connection  

---

## Viewer Module Features

- Access code validation  
- Offer/Answer exchange  
- ICE candidate exchange  
- Fullscreen immersive mode  
- Custom fullscreen overlay controls  
- Duo Mode acceptance  
- Host disconnection detection  

---

## WebRTC Flow

### Host
1. Generate access code  
2. Wait for `viewer-ready`  
3. Capture media  
4. Add tracks to peer connection  
5. Create offer  
6. Send offer through signaling server  
7. Receive answer  
8. Exchange ICE candidates  

### Viewer
1. Enter access code  
2. Join session  
3. Receive offer  
4. Set remote description  
5. Create answer  
6. Send answer  
7. Exchange ICE candidates  
8. Attach incoming tracks to video element  

---

## Local Development

### Backend

```bash
npm install
node server.js
```

Server runs on:

```
http://localhost:3000
```

### Frontend

Serve using:
- VS Code Live Server
- Netlify
- Any static host

Ensure signaling URL matches deployment:

```js
const socket = io("https://getmyscreen-server.onrender.com", {
    transports: ["websocket"]
});
```

---

## Constraints

- Corporate firewalls may block STUN  
- VPNs may interfere with peer discovery  
- Mobile browsers cannot share system audio  
- Cold starts on Render may delay first connection  

---

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- WebRTC API  
- Socket.IO  
- Express.js  
- Google STUN  
- Netlify  
- Render  

---

## License

This project is licensed under the MIT License.

---

## Author

Raghavan S  
System Architect and Developer  
2026
