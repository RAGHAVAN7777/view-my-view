const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "*"
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://getmyscreen-server.onrender.com"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Access Code -> Host Socket ID
const activeSessions = new Map();

io.on('connection', (socket) => {
    console.log('[Connection] User connected:', socket.id);

    // 1. Host Initializing a Session
    socket.on('host-join', (code) => {
        if (!code) return;

        activeSessions.set(code, socket.id);
        socket.join(code);
        console.log(`[Session Created] Host ${socket.id} started session: ${code}`);
    });

    // 2. Viewer Attempting to Join a Session
    socket.on('viewer-join', (code) => {
        if (!code) return;

        if (activeSessions.has(code)) {
            socket.join(code);
            console.log(`[Session Joined] Viewer ${socket.id} joined session: ${code}`);

            // Notify success to viewer
            socket.emit('session-info', { status: 'success', host: activeSessions.get(code) });

            // Notify host that a viewer is ready (Phase 4 preparation)
            socket.to(activeSessions.get(code)).emit('viewer-ready', { viewerId: socket.id });
        } else {
            console.warn(`[Join Failed] Viewer ${socket.id} attempted invalid code: ${code}`);
            socket.emit('session-info', { status: 'error', message: 'Session not found. Please check your code.' });
        }
    });

    // 3. Selective Signaling Relay (Phase 4 Preparation)
    socket.on('signal', (data) => {
        // data should contain: { code, to, signalData }
        if (data.to) {
            // Direct targeted relay
            io.to(data.to).emit('signal', {
                from: socket.id,
                signalData: data.signalData
            });
        } else if (data.code) {
            // Broadcast to room (Phase 4 fallback)
            socket.to(data.code).emit('signal', {
                from: socket.id,
                signalData: data.signalData
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('[Disconnection] User disconnected:', socket.id);

        // Find if this socket was a host
        for (const [code, hostId] of activeSessions.entries()) {
            if (hostId === socket.id) {
                console.log(`[Session Closed] Host ${socket.id} left. Closing session: ${code}`);
                activeSessions.delete(code);

                // Notify everyone in the room that the host left
                io.to(code).emit('host-left');
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[Ready] Refined Signaling Server running on port ${PORT}`);
});
