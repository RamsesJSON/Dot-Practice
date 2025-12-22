/**
 * THE PRACTICE
 * "Attention is Form."
 */

// --- Data Constants ---
const LEVELS = {
    1: {
        id: 1,
        name: "The Dot",
        duration: 2 * 60,
        icon: 'level-dot',
        steps: [
            "Draw a single dot on white paper.",
            "Focus your undivided attention on the dot.",
            "When your mind wanders, return your focus to the dot."
        ]
    },
    2: {
        id: 2,
        name: "The Circle",
        duration: 4 * 60,
        icon: 'level-circle',
        steps: [
            "Draw a perfect circle around a new dot.",
            "Focus on the dot within the circle.",
            "Maintain unwavering attention on this form."
        ]
    },
    3: {
        id: 3,
        name: "The Square",
        duration: 6 * 60,
        icon: 'level-square',
        steps: [
            "Draw a perfect square around a new dot.",
            "Focus on the dot within the square.",
            "Maintain unwavering attention on this form."
        ]
    },
    4: {
        id: 4,
        name: "The Triangle",
        duration: 6 * 60,
        icon: 'level-triangle',
        steps: [
            "Draw a perfect triangle around a new dot.",
            "Focus on the dot within the triangle.",
            "Maintain unwavering attention on this form."
        ]
    },
    5: {
        id: 5,
        name: "God/Demon Sigil Practice",
        duration: 10 * 60,
        icon: 'level-sigil',
        steps: [
            "Select a God Sigil of your choice.",
            "Place the image before you.",
            "Focus on the Sigil’s visual center, with unwavering attention, then expand your attention to the entire pattern. Allow the pattern to be experienced by your attention.",
            "Do not break focus for the full 10 minutes."
        ],
        extra: "When this level is reached, your attention has become more stable—but now you have foundation to focus in general."
    }
};

// --- State Management ---
class StorageManager {
    constructor() {
        this.key = 'dot_practice_v1';
        this.state = this.load() || this.defaultState();
    }

    defaultState() {
        return {
            totalTime: 0,
            unlockedLevel: 5, // All levels unlocked by default now
            levelData: {
                1: { time: 0, mastered: false, history: [] },
                2: { time: 0, mastered: false, history: [] },
                3: { time: 0, mastered: false, history: [] },
                4: { time: 0, mastered: false, history: [] },
                5: { time: 0, mastered: false, history: [] }
            },
            sigilImage: null
        };
    }

    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Storage load failed", e);
            return null;
        }
    }

    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.state));
        } catch (e) {
            console.error("Storage save failed", e);
            // Handle quota exceeded for sigil images potentially
        }
    }

    updateTime(levelId, seconds) {
        if (!this.state.levelData[levelId].history) {
            this.state.levelData[levelId].history = [];
        }
        this.state.levelData[levelId].history.push({
            date: new Date().toISOString(),
            duration: seconds
        });

        // Recalculate totals
        this.state.levelData[levelId].time += seconds;
        this.state.totalTime += seconds;
        this.save();
    }

    markMastery(levelId) {
        if (this.state.levelData[levelId]) {
            this.state.levelData[levelId].mastered = true;
            this.save();
        }
    }
}

// --- View Controller ---
class ViewManager {
    constructor() {
        this.views = {
            intro: document.getElementById('view-intro'),
            dashboard: document.getElementById('view-dashboard'),
            instruction: document.getElementById('view-instruction'),
            practice: document.getElementById('view-practice'),
            debrief: document.getElementById('view-debrief')
        };
    }

    show(viewName) {
        // Hide all
        Object.values(this.views).forEach(el => {
            el.classList.remove('active');
            setTimeout(() => {
                if (!el.classList.contains('active')) el.classList.add('hidden');
            }, 800); // Match transition duration
        });

        // Show target
        const target = this.views[viewName];
        target.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        requestAnimationFrame(() => {
            target.classList.add('active');
        });
    }
}

// --- Practice Session Logic ---
class PracticeSession {
    constructor(levelId, onComplete, onAbort) {
        this.levelId = levelId;
        this.duration = LEVELS[levelId].duration;
        this.remaining = this.duration;
        this.active = false;
        this.onComplete = onComplete;
        this.onAbort = onAbort;

        this.startTime = null;
        this.elapsedBeforePause = 0;
        this.animationFrame = null;

        this.overlay = document.getElementById('exit-overlay');
        this.setupEscapeHandler();
    }

    start() {
        this.active = true;
        this.startTime = Date.now();
        this.run();
        this.enterImmersiveMode();
    }

    run() {
        if (!this.active) return;
        this.animationFrame = requestAnimationFrame(() => this.run());
    }

    handleInput(e) {
        // If click is on the overlay, ignore it so bubbles don't end session
        if (e && e.target.closest('#exit-overlay')) return;

        if (this.active) {
            this.pause();
        }
    }

    finish() {
        this.active = false;
        cancelAnimationFrame(this.animationFrame);
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.exitImmersiveMode();
        this.onComplete(elapsed);
        this.removeInputHandler();
    }

    pause() {
        if (!this.active) return;
        this.active = false;
        cancelAnimationFrame(this.animationFrame);
        this.elapsedBeforePause = Date.now() - this.startTime;
        this.overlay.classList.remove('hidden');
        document.exitPointerLock && document.exitPointerLock();
    }

    resume() {
        this.overlay.classList.add('hidden');
        // Restore the timer to the exact point it was paused
        this.startTime = Date.now() - this.elapsedBeforePause;
        this.active = true;
        this.enterImmersiveMode();
        this.run();
    }

    abort() {
        this.active = false;
        cancelAnimationFrame(this.animationFrame);
        this.exitImmersiveMode();
        this.onAbort();
    }

    enterImmersiveMode() {
        document.body.requestFullscreen().catch(err => console.log("Fullscreen blocked", err));
        // cursor hiding is handled by CSS on #view-practice
    }

    exitImmersiveMode() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    setupEscapeHandler() {
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement && this.active) {
                this.pause();
            }
        });

        this.inputHandler = (e) => this.handleInput(e);
        document.getElementById('view-practice').addEventListener('click', this.inputHandler);

        window.onbeforeunload = () => {
            if (this.active) return "Session in progress.";
        };
    }

    removeInputHandler() {
        document.getElementById('view-practice').removeEventListener('click', this.inputHandler);
    }
}

// --- App Controller ---
class App {
    constructor() {
        this.store = new StorageManager();
        this.view = new ViewManager();
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderDashboard();
    }

    bindEvents() {
        // Intro
        document.getElementById('btn-enter').addEventListener('click', () => {
            this.view.show('dashboard');
        });

        // Dashboard Level Clicks
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', () => {
                const levelId = parseInt(card.dataset.level);
                this.handleLevelSelect(levelId);
            });
        });

        // Sigil Upload Logic
        const sigilInput = document.getElementById('sigil-input');
        if (sigilInput) {
            sigilInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.store.state.sigilImage = event.target.result;
                        this.store.save();
                        this.updateSigilPreview();
                        this.renderDashboard(); // refresh card icon
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Practice Controls
        document.getElementById('btn-begin-practice').addEventListener('click', () => {
            if (this.selectedLevelId === 5 && !this.store.state.sigilImage) {
                alert("Please upload a sigil first.");
                return;
            }
            this.startSession();
        });

        document.getElementById('btn-back-dashboard').addEventListener('click', () => {
            this.view.show('dashboard');
        });

        // Overlay Controls
        document.getElementById('btn-resume').addEventListener('click', () => {
            if (this.currentSession) this.currentSession.resume();
        });

        document.getElementById('btn-finish').addEventListener('click', () => {
            if (this.currentSession) this.currentSession.finish();
        });

        document.getElementById('btn-abort').addEventListener('click', () => {
            if (this.currentSession) this.currentSession.abort();
            this.view.show('dashboard');
        });

        // Debrief
        document.getElementById('btn-claim-mastery').addEventListener('click', () => {
            this.store.markMastery(this.selectedLevelId);
            this.renderDashboard();
            this.view.show('dashboard');
        });

        document.getElementById('btn-continue-training').addEventListener('click', () => {
            this.view.show('dashboard');
        });

        document.getElementById('btn-return-home').addEventListener('click', () => {
            this.view.show('dashboard');
        });
    }

    updateSigilPreview() {
        const preview = document.getElementById('sigil-preview');
        if (this.store.state.sigilImage) {
            preview.src = this.store.state.sigilImage;
            preview.classList.add('active');
        } else {
            preview.classList.remove('active');
        }
    }

    handleLevelSelect(levelId) {
        this.selectedLevelId = levelId;
        const level = LEVELS[levelId];

        document.getElementById('instruction-title').innerText = `LEVEL ${levelId}: ${level.name.toUpperCase()}`;
        document.getElementById('instruction-duration').innerText = `${level.duration / 60} MINUTES`;

        const p1 = document.getElementById('instruction-p1');
        const p2 = document.getElementById('instruction-p2');
        const p3 = document.getElementById('instruction-p3');
        const uploadView = document.getElementById('sigil-upload-view');
        const masteryInfo = document.getElementById('mastery-info');

        // Reset
        p1.innerText = ''; p2.innerText = ''; p3.innerText = '';
        masteryInfo.classList.add('hidden');

        // Populate steps
        if (level.steps[0]) p1.innerText = level.steps[0];
        if (level.steps[1]) p2.innerText = level.steps[1];
        if (level.steps[2]) p3.innerText = level.steps[2];

        // Level 5 specifics
        if (levelId === 5) {
            uploadView.classList.remove('hidden');
            this.updateSigilPreview();
            // Prefix with the 'extra' foundation text
            p1.innerText = level.extra;
            p2.innerText = level.steps[0] + " " + level.steps[1];
            p3.innerText = level.steps[2] + " " + level.steps[3];
        } else {
            uploadView.classList.add('hidden');
            masteryInfo.classList.remove('hidden'); // Show mastery criteria for preparatory levels
        }

        this.view.show('instruction');
    }

    startSession() {
        this.renderShape(this.selectedLevelId);
        this.view.show('practice');

        this.currentSession = new PracticeSession(
            this.selectedLevelId,
            (duration) => this.handleSessionComplete(duration),
            () => { }
        );

        setTimeout(() => this.currentSession.start(), 100);
    }

    handleSessionComplete(duration) {
        this.store.updateTime(this.selectedLevelId, duration);
        this.renderDashboard();

        const lvlData = this.store.state.levelData[this.selectedLevelId];

        // Update Session Summary UI
        const formatTime = (s) => {
            const m = Math.floor(s / 60);
            const rs = s % 60;
            return `${m}:${rs.toString().padStart(2, '0')}`;
        };

        document.getElementById('session-time-val').innerText = formatTime(duration);
        document.getElementById('cumulative-time-val').innerText = `${Math.floor(lvlData.time / 60)}m`;

        // Mastery Check Logic
        const minTimeForMastery = LEVELS[this.selectedLevelId].duration * 3;
        const masteryDiv = document.getElementById('mastery-check');
        const normalDiv = document.getElementById('normal-debrief');

        if (!lvlData.mastered && lvlData.time >= minTimeForMastery && this.selectedLevelId < 5) {
            masteryDiv.classList.remove('hidden');
            normalDiv.classList.add('hidden');
        } else {
            masteryDiv.classList.add('hidden');
            normalDiv.classList.remove('hidden');
        }

        this.view.show('debrief');
    }

    renderDashboard() {
        const totalSec = this.store.state.totalTime || 0;
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        document.getElementById('total-time-display').innerText = `${hrs}h ${mins}m`;

        const allSessions = [];

        document.querySelectorAll('.level-card').forEach(card => {
            const lid = parseInt(card.dataset.level);
            const data = this.store.state.levelData[lid];

            // All levels unlocked
            card.classList.remove('locked');

            const lMin = Math.floor(data.time / 60);
            const history = data.history || [];
            const timeDisplay = card.querySelector('.level-time');
            if (timeDisplay) timeDisplay.innerText = `Sessions: ${history.length} | Total: ${lMin}m`;

            // Aggregation for global log
            history.forEach(session => {
                allSessions.push({
                    levelName: LEVELS[lid].name.toUpperCase(),
                    date: new Date(session.date),
                    duration: session.duration
                });
            });

            // Render Icon
            const iconWrap = card.querySelector('.level-icon');
            iconWrap.innerHTML = '';
            if (lid === 5 && this.store.state.sigilImage) {
                const img = document.createElement('img');
                img.src = this.store.state.sigilImage;
                iconWrap.appendChild(img);
            } else {
                iconWrap.appendChild(this.getSVG(lid, 60, 2));
            }
        });

        // Sort sessions by date (newest first)
        allSessions.sort((a, b) => b.date - a.date);

        // Update Global Log UI
        const logList = document.getElementById('log-list');
        const lastSessionDisplay = document.getElementById('last-session-display');

        if (allSessions.length > 0) {
            logList.innerHTML = '';
            lastSessionDisplay.innerText = allSessions[0].levelName;

            allSessions.forEach(session => {
                const entry = document.createElement('div');
                entry.classList.add('log-entry');

                const timeStr = session.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
                    ' ' + session.date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

                const formatDuration = (s) => {
                    const m = Math.floor(s / 60);
                    const rs = s % 60;
                    return `${m}:${rs.toString().padStart(2, '0')}`;
                };

                entry.innerHTML = `
                    <span class="log-level">${session.levelName}</span>
                    <div class="log-meta">
                        <span class="log-date">${timeStr}</span>
                        <span class="log-duration">${formatDuration(session.duration)}</span>
                    </div>
                `;
                logList.appendChild(entry);
            });
        }
    }

    renderShape(levelId) {
        const container = document.getElementById('shape-container');
        container.innerHTML = '';

        const shapeWrap = document.createElement('div');
        shapeWrap.classList.add('practice-shape');

        if (levelId === 5) {
            const img = document.createElement('img');
            img.src = this.store.state.sigilImage;
            img.classList.add('p-sigil');
            shapeWrap.appendChild(img);
        } else {
            shapeWrap.appendChild(this.getSVG(levelId, 400, 3));
        }

        container.appendChild(shapeWrap);
    }

    getSVG(levelId, size, strokeWidth) {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

        const center = size / 2;
        const color = "white";

        // Dot
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", center);
        dot.setAttribute("cy", center);
        dot.setAttribute("r", levelId === 1 ? size * 0.05 : size * 0.015);
        dot.setAttribute("fill", color);

        let form = null;
        if (levelId === 2) {
            form = document.createElementNS(ns, "circle");
            form.setAttribute("cx", center);
            form.setAttribute("cy", center);
            form.setAttribute("r", size * 0.4);
        } else if (levelId === 3) {
            const s = size * 0.7;
            form = document.createElementNS(ns, "rect");
            form.setAttribute("x", center - s / 2);
            form.setAttribute("y", center - s / 2);
            form.setAttribute("width", s);
            form.setAttribute("height", s);
        } else if (levelId === 4) {
            const s = size * 0.8;
            const h = (Math.sqrt(3) / 2) * s;
            const top = center - (2 / 3) * h;
            const bottom = center + (1 / 3) * h;
            const left = center - s / 2;
            const right = center + s / 2;
            form = document.createElementNS(ns, "polygon");
            form.setAttribute("points", `${center},${top} ${right},${bottom} ${left},${bottom}`);
        }

        if (form) {
            form.setAttribute("fill", "none");
            form.setAttribute("stroke", color);
            form.setAttribute("stroke-width", strokeWidth);
            svg.appendChild(form);
        }
        svg.appendChild(dot);
        return svg;
    }

    toRoman(num) {
        const roman = ["I", "II", "III", "IV", "V"];
        return roman[num - 1] || num;
    }
}

// Start
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
