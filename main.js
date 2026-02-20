// ==============================
// ShareScreen Core Utilities
// ==============================

function generateAccessCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let part1 = "";
    let part2 = "";

    for (let i = 0; i < 4; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${part1}-${part2}`;
}

async function startScreenCapture() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                frameRate: 30
            },
            audio: false
        });

        return stream;

    } catch (error) {
        console.error("Screen capture denied or failed:", error);
        return null;
    }
}

// ==============================
// Phase 4: WebRTC Base
// ==============================

function createPeerConnection() {
    const pc = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" }
        ]
    });

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("[ICE] Candidate generated");
        }
    };

    return pc;
}

