/**
 * DOT MEDITATION
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
            "Focus on the Sigil's visual center, with unwavering attention, then expand your attention to the entire pattern. Allow the pattern to be experienced by your attention.",
            "Do not break focus for the full 10 minutes."
        ],
        extra: "When this level is reached, your attention has become more stable—but now you have foundation to focus in general."
    },
    6: {
        id: 6,
        name: "Custom Practice",
        duration: 20 * 60,
        icon: 'level-custom',
        steps: [
            "Configure your focus object.",
            "Select a shape that resonates with you.",
            "Apply animations to challenge your focus stability.",
            "Maintain unwavering attention regardless of the form's change."
        ]
    }
};

const SHAPES = {
    hexagon: { name: "Hexagon" },
    pentagon: { name: "Pentagon" },
    octagon: { name: "Octagon" },
    star: { name: "Star" },
    diamond: { name: "Diamond" },
    cross: { name: "Cross" },
    crescent: { name: "Crescent" },
    heart: { name: "Heart" },
    ruby: { name: "Ruby" },
    infinity: { name: "Infinity" }
};

const MOTIVATIONAL_MESSAGES = [
    "The mind sharpens with each session.",
    "Consistency forges strength — return tomorrow.",
    "Every second of focused attention rewires your brain.",
    "Stillness is a skill. You are building it.",
    "The scattered mind becomes a blade through practice.",
    "Your attention is your most powerful tool. Sharpen it.",
    "Today's effort is tomorrow's effortless focus.",
    "Progress is measured in presence, not perfection."
];

const THEMES = ['dark', 'light', 'ink'];

// --- State Management ---
class StorageManager {
    constructor() {
        this.key = 'dot_practice_v1';
        this.state = this.load() || this.defaultState();
    }

    defaultState() {
        return {
            totalTime: 0,
            unlockedLevel: 5,
            levelData: {
                1: { time: 0, mastered: false, history: [] },
                2: { time: 0, mastered: false, history: [] },
                3: { time: 0, mastered: false, history: [] },
                4: { time: 0, mastered: false, history: [] },
                5: { time: 0, mastered: false, history: [] },
                6: { time: 0, mastered: false, history: [] }
            },
            levelGoals: {
                1: { targetMinutes: 2, enabled: false, totalTargetHours: 10, totalEnabled: false },
                2: { targetMinutes: 4, enabled: false, totalTargetHours: 10, totalEnabled: false },
                3: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                4: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                5: { targetMinutes: 10, enabled: false, totalTargetHours: 10, totalEnabled: false },
                6: { targetMinutes: 20, enabled: false, totalTargetHours: 10, totalEnabled: false }
            },
            customConfig: {
                shape: 'hexagon',
                animations: { blink: false, bounce: false, rotate: false }
            },
            sigilImage: null,
            theme: 'dark'
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
        this.state.levelData[levelId].time += seconds;
        this.state.totalTime += seconds;
        this.save();
    }

    adjustTime(levelId, minutes) {
        const seconds = minutes * 60;
        if (!this.state.levelData[levelId].history) {
            this.state.levelData[levelId].history = [];
        }
        if (this.state.levelData[levelId].time + seconds < 0) {
            return false;
        }
        this.state.levelData[levelId].time += seconds;
        this.state.totalTime += seconds;
        this.save();
        return true;
    }

    exportData() {
        const dataStr = JSON.stringify(this.state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `dot_practice_export_${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    importData(jsonData) {
        try {
            const parsed = JSON.parse(jsonData);
            if (parsed && typeof parsed.totalTime === 'number' && parsed.levelData) {
                this.state = parsed;
                this.save();
                return true;
            }
        } catch (e) {
            console.error("Import failed", e);
        }
        return false;
    }

    resetData() {
        this.state = this.defaultState();
        this.save();
    }

    markMastery(levelId) {
        if (this.state.levelData[levelId]) {
            this.state.levelData[levelId].mastered = true;
            this.save();
        }
    }

    // Calculate streak (consecutive days with sessions)
    getStreak() {
        const allDates = new Set();
        for (let lid = 1; lid <= 6; lid++) {
            const history = this.state.levelData[lid]?.history || [];
            history.forEach(s => {
                if (!s.manual) {
                    const d = new Date(s.date);
                    allDates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
                }
            });
        }
        if (allDates.size === 0) return 0;

        // Sort dates and count consecutive from today backwards
        const today = new Date();
        let streak = 0;
        let checkDate = new Date(today);

        for (let i = 0; i < 365; i++) {
            const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
            if (allDates.has(key)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // Allow today to not count yet if no session today
                if (i === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }
        return streak;
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
        this.themeToggle = document.getElementById('theme-toggle');
    }

    show(viewName) {
        // Hide theme toggle during practice
        if (this.themeToggle) {
            if (viewName === 'practice') {
                this.themeToggle.style.opacity = '0';
                this.themeToggle.style.pointerEvents = 'none';
            } else {
                this.themeToggle.style.opacity = '1';
                this.themeToggle.style.pointerEvents = 'auto';
            }
        }

        // Hide all
        Object.values(this.views).forEach(el => {
            el.classList.remove('active');
            setTimeout(() => {
                if (!el.classList.contains('active')) el.classList.add('hidden');
            }, 800);
        });

        // Show target
        const target = this.views[viewName];
        target.classList.remove('hidden');
        requestAnimationFrame(() => {
            target.classList.add('active');
        });
    }
}

// --- Practice Session Logic ---
class PracticeSession {
    constructor(levelId, onComplete, onAbort, onGoalReached) {
        this.levelId = levelId;
        this.duration = LEVELS[levelId].duration;
        this.remaining = this.duration;
        this.active = false;
        this.onComplete = onComplete;
        this.onAbort = onAbort;
        this.onGoalReached = onGoalReached;

        this.startTime = null;
        this.elapsedBeforePause = 0;
        this.animationFrame = null;
        this.goalReached = false;
        this.goalTarget = null;

        this.overlay = document.getElementById('exit-overlay');
        this.goalOverlay = document.getElementById('goal-reached-overlay');
        this.elapsedTimerEl = document.getElementById('elapsed-timer');

        this.timerShowTimeout = null;
        this.timerHideTimeout = null;

        this.setupEscapeHandler();
    }

    setGoal(targetMinutes) {
        this.goalTarget = targetMinutes * 60;
    }

    start() {
        this.active = true;
        this.startTime = Date.now();
        this.run();
        this.enterImmersiveMode();
        this.showTimerBriefly();
    }

    run() {
        if (!this.active) return;

        // Update elapsed timer
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000) + Math.floor(this.elapsedBeforePause / 1000);
        this.updateTimerDisplay(elapsed);

        // Check for goal reached
        if (this.goalTarget && !this.goalReached) {
            if (elapsed >= this.goalTarget) {
                this.goalReached = true;
                this.showGoalReached();
                return;
            }
        }

        this.animationFrame = requestAnimationFrame(() => this.run());
    }

    updateTimerDisplay(totalSeconds) {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        this.elapsedTimerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    showTimerBriefly() {
        // Show timer for 5 seconds initially, then fade out
        this.elapsedTimerEl.classList.add('visible');
        this.elapsedTimerEl.classList.remove('peek');
        clearTimeout(this.timerHideTimeout);
        this.timerHideTimeout = setTimeout(() => {
            this.elapsedTimerEl.classList.remove('visible');
        }, 5000);
    }

    peekTimer() {
        // Briefly flash the timer on interaction (before pausing)
        this.elapsedTimerEl.classList.add('peek');
        clearTimeout(this.timerShowTimeout);
        this.timerShowTimeout = setTimeout(() => {
            this.elapsedTimerEl.classList.remove('peek');
        }, 3000);
    }

    showGoalReached() {
        this.active = false;
        cancelAnimationFrame(this.animationFrame);
        this.elapsedBeforePause = Date.now() - this.startTime;
        this.goalOverlay.classList.remove('hidden');
        document.exitPointerLock && document.exitPointerLock();
        if (this.onGoalReached) this.onGoalReached();
    }

    continueAfterGoal() {
        this.goalOverlay.classList.add('hidden');
        this.startTime = Date.now() - this.elapsedBeforePause;
        this.active = true;
        this.enterImmersiveMode();
        this.run();
    }

    finishAfterGoal() {
        this.goalOverlay.classList.add('hidden');
        const elapsed = Math.floor(this.elapsedBeforePause / 1000);
        this.exitImmersiveMode();
        this.hideTimer();
        this.onComplete(elapsed);
        this.removeInputHandler();
    }

    handleInput(e) {
        if (e && e.target.closest('#exit-overlay')) return;
        if (e && e.target.closest('#goal-reached-overlay')) return;

        if (this.active) {
            this.pause();
        }
    }

    finish() {
        this.active = false;
        cancelAnimationFrame(this.animationFrame);
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.overlay.classList.add('hidden');
        this.exitImmersiveMode();
        this.hideTimer();
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
        this.startTime = Date.now() - this.elapsedBeforePause;
        this.active = true;
        this.enterImmersiveMode();
        this.run();
        this.showTimerBriefly();
    }

    abort() {
        this.active = false;
        cancelAnimationFrame(this.animationFrame);
        this.overlay.classList.add('hidden');
        this.exitImmersiveMode();
        this.hideTimer();
        this.onAbort();
    }

    hideTimer() {
        this.elapsedTimerEl.classList.remove('visible', 'peek');
        clearTimeout(this.timerHideTimeout);
        clearTimeout(this.timerShowTimeout);
    }

    enterImmersiveMode() {
        document.body.requestFullscreen().catch(err => console.log("Fullscreen blocked", err));
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
        this.migrateState();
        this.init();
    }

    migrateState() {
        if (!this.store.state.levelGoals) {
            this.store.state.levelGoals = {
                1: { targetMinutes: 2, enabled: false, totalTargetHours: 10, totalEnabled: false },
                2: { targetMinutes: 4, enabled: false, totalTargetHours: 10, totalEnabled: false },
                3: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                4: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                5: { targetMinutes: 10, enabled: false, totalTargetHours: 10, totalEnabled: false }
            };
        } else {
            for (let i = 1; i <= 5; i++) {
                if (this.store.state.levelGoals[i].totalTargetHours === undefined) {
                    this.store.state.levelGoals[i].totalTargetHours = 10;
                    this.store.state.levelGoals[i].totalEnabled = false;
                }
            }

            if (!this.store.state.levelData[6]) {
                this.store.state.levelData[6] = { time: 0, mastered: false, history: [] };
            }
            if (!this.store.state.levelGoals[6]) {
                this.store.state.levelGoals[6] = { targetMinutes: 20, enabled: false, totalTargetHours: 10, totalEnabled: false };
            }
            if (!this.store.state.customConfig) {
                this.store.state.customConfig = {
                    shape: 'hexagon',
                    animations: { blink: false, bounce: false, rotate: false }
                };
            }
        }

        // Migrate theme from old 'light'/'dark' to new system
        if (this.store.state.theme === 'light') {
            this.store.state.theme = 'light';
        } else if (!THEMES.includes(this.store.state.theme)) {
            this.store.state.theme = 'dark';
        }

        this.store.save();
    }

    init() {
        this.bindEvents();
        this.renderDashboard();
        this.setupThemeToggle();
        this.setupCustomTimeModal();
        this.setupGoalModals();
        this.setupCustomConfig();
        this.setupKeyboardShortcuts();
        this.spawnParticles('intro-particles', 15);
        this.spawnParticles('dashboard-particles', 10);
    }

    // --- Ambient Particles ---
    spawnParticles(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.top = (50 + Math.random() * 50) + '%';
            p.style.animationDuration = (15 + Math.random() * 25) + 's';
            p.style.animationDelay = (Math.random() * 15) + 's';
            p.style.width = (1 + Math.random() * 2) + 'px';
            p.style.height = p.style.width;
            container.appendChild(p);
        }
    }

    // --- Keyboard Shortcuts ---
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Space to pause/resume during practice
            if (e.code === 'Space' && this.currentSession) {
                e.preventDefault();
                const exitOverlay = document.getElementById('exit-overlay');
                const goalOverlay = document.getElementById('goal-reached-overlay');

                if (!exitOverlay.classList.contains('hidden')) {
                    // Resume from pause
                    this.currentSession.resume();
                } else if (goalOverlay.classList.contains('hidden') && this.currentSession.active) {
                    // Pause
                    this.currentSession.pause();
                }
            }

            // Escape to go back / close modals
            if (e.code === 'Escape') {
                const customOverlay = document.getElementById('custom-time-overlay');
                const goalOverlay = document.getElementById('level-goal-overlay');

                if (!customOverlay.classList.contains('hidden')) {
                    this.closeCustomTimeModal();
                } else if (!goalOverlay.classList.contains('hidden')) {
                    this.closeLevelGoalModal();
                } else {
                    // Navigate back
                    const activeView = document.querySelector('.view.active');
                    if (activeView) {
                        if (activeView.id === 'view-instruction') {
                            this.view.show('dashboard');
                        } else if (activeView.id === 'view-debrief') {
                            this.view.show('dashboard');
                        }
                    }
                }
            }
        });
    }

    setupCustomConfig() {
        const grid = document.getElementById('shape-picker-grid');
        const config = this.store.state.customConfig;

        Object.entries(SHAPES).forEach(([key, val]) => {
            const btn = document.createElement('div');
            btn.classList.add('shape-btn');
            if (config.shape === key) btn.classList.add('selected');
            btn.title = val.name;
            const icon = this.getSVG(key, 40, 2);
            btn.appendChild(icon);

            btn.addEventListener('click', () => {
                this.store.state.customConfig.shape = key;
                this.store.save();
                grid.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });

            grid.appendChild(btn);
        });

        const bindAnim = (id, key) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.checked = config.animations[key];
            el.addEventListener('change', () => {
                this.store.state.customConfig.animations[key] = el.checked;
                this.store.save();
            });
        };

        bindAnim('anim-blink', 'blink');
        bindAnim('anim-bounce', 'bounce');
        bindAnim('anim-rotate', 'rotate');
    }

    setupCustomTimeModal() {
        this.customTimeOverlay = document.getElementById('custom-time-overlay');
        this.customMinutesInput = document.getElementById('custom-minutes-input');
        this.btnConfirm = document.getElementById('btn-custom-confirm');
        this.btnCancel = document.getElementById('btn-custom-cancel');
        this.pendingLevelId = null;

        this.btnConfirm.addEventListener('click', () => {
            const minutes = parseInt(this.customMinutesInput.value);
            if (!isNaN(minutes) && this.pendingLevelId !== null) {
                if (this.store.adjustTime(this.pendingLevelId, minutes)) {
                    this.renderDashboard();
                }
            }
            this.closeCustomTimeModal();
        });

        this.btnCancel.addEventListener('click', () => {
            this.closeCustomTimeModal();
        });

        this.customTimeOverlay.addEventListener('click', (e) => {
            if (e.target === this.customTimeOverlay) this.closeCustomTimeModal();
        });

        this.customMinutesInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.btnConfirm.click();
            }
        });
    }

    showCustomTimeModal(levelId) {
        this.pendingLevelId = levelId;
        this.customMinutesInput.value = '10';
        this.customTimeOverlay.classList.remove('hidden');
        setTimeout(() => this.customMinutesInput.focus(), 100);
    }

    closeCustomTimeModal() {
        this.customTimeOverlay.classList.add('hidden');
        this.pendingLevelId = null;
    }

    setupGoalModals() {
        this.levelGoalOverlay = document.getElementById('level-goal-overlay');
        this.levelSessionGoalInput = document.getElementById('level-session-goal-minutes');
        this.levelSessionGoalEnabled = document.getElementById('level-session-goal-enabled');
        this.levelPracticeGoalEnabled = document.getElementById('level-practice-goal-enabled');
        this.levelPracticeGoalHours = document.getElementById('level-practice-goal-hours');
        this.levelPracticeGoalMinutes = document.getElementById('level-practice-goal-minutes');
        this.levelAdjustHours = document.getElementById('level-adjust-hours');
        this.levelAdjustMinutes = document.getElementById('level-adjust-minutes');
        this.levelGoalTitle = document.getElementById('level-goal-title');
        this.pendingGoalLevelId = null;

        document.querySelectorAll('.btn-card-info').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const levelId = parseInt(btn.dataset.level);
                this.showLevelGoalModal(levelId);
            });
        });

        document.getElementById('btn-level-goal-save').addEventListener('click', () => {
            if (this.pendingGoalLevelId) {
                const sessionMinutes = parseInt(this.levelSessionGoalInput.value) || 5;
                this.store.state.levelGoals[this.pendingGoalLevelId].targetMinutes = Math.max(1, sessionMinutes);
                this.store.state.levelGoals[this.pendingGoalLevelId].enabled = this.levelSessionGoalEnabled.checked;

                const practiceHours = parseInt(this.levelPracticeGoalHours.value) || 0;
                const practiceMinutes = parseInt(this.levelPracticeGoalMinutes.value) || 0;
                const totalTargetHours = practiceHours + (practiceMinutes / 60);
                this.store.state.levelGoals[this.pendingGoalLevelId].totalTargetHours = Math.max(0.1, totalTargetHours);
                this.store.state.levelGoals[this.pendingGoalLevelId].totalEnabled = this.levelPracticeGoalEnabled.checked;

                this.store.save();
                this.renderDashboard();
            }
            this.closeLevelGoalModal();
        });

        document.getElementById('btn-level-goal-cancel').addEventListener('click', () => {
            this.closeLevelGoalModal();
        });

        const handleLevelTimeAdjust = (isAdd) => {
            if (!this.pendingGoalLevelId) return;
            const hours = parseInt(this.levelAdjustHours.value) || 0;
            const minutes = parseInt(this.levelAdjustMinutes.value) || 0;
            const totalMinutes = (hours * 60) + minutes;
            if (totalMinutes === 0) return;

            const adjustAmount = isAdd ? totalMinutes : -totalMinutes;
            if (this.store.adjustTime(this.pendingGoalLevelId, adjustAmount)) {
                this.updateLevelGoalModalProgress();
                this.levelAdjustHours.value = 0;
                this.levelAdjustMinutes.value = 0;
            }
        };

        document.getElementById('btn-level-add-time').addEventListener('click', () => handleLevelTimeAdjust(true));
        document.getElementById('btn-level-subtract-time').addEventListener('click', () => handleLevelTimeAdjust(false));

        this.levelGoalOverlay.addEventListener('click', (e) => {
            if (e.target === this.levelGoalOverlay) this.closeLevelGoalModal();
        });

        // Session Goal Toggle in Instruction View
        const sessionGoalEnabled = document.getElementById('session-goal-enabled');
        const sessionGoalInputWrap = document.getElementById('session-goal-input-wrap');
        const sessionGoalMinutes = document.getElementById('session-goal-minutes');

        sessionGoalEnabled.addEventListener('change', () => {
            if (sessionGoalEnabled.checked) {
                sessionGoalInputWrap.classList.remove('hidden');
            } else {
                sessionGoalInputWrap.classList.add('hidden');
            }
            if (this.selectedLevelId) {
                this.store.state.levelGoals[this.selectedLevelId].enabled = sessionGoalEnabled.checked;
                this.store.state.levelGoals[this.selectedLevelId].targetMinutes = parseInt(sessionGoalMinutes.value) || 5;
                this.store.save();
            }
        });

        sessionGoalMinutes.addEventListener('change', () => {
            if (this.selectedLevelId) {
                this.store.state.levelGoals[this.selectedLevelId].targetMinutes = parseInt(sessionGoalMinutes.value) || 5;
                this.store.save();
            }
        });

        // Goal Reached Overlay Buttons
        document.getElementById('btn-goal-continue').addEventListener('click', () => {
            if (this.currentSession) this.currentSession.continueAfterGoal();
        });

        document.getElementById('btn-goal-finish').addEventListener('click', () => {
            if (this.currentSession) this.currentSession.finishAfterGoal();
        });
    }

    showLevelGoalModal(levelId) {
        this.pendingGoalLevelId = levelId;
        const goal = this.store.state.levelGoals[levelId];
        const level = LEVELS[levelId];
        this.levelGoalTitle.innerText = `${level.name.toUpperCase()} SETTINGS`;

        this.levelSessionGoalInput.value = goal.targetMinutes;
        this.levelSessionGoalEnabled.checked = goal.enabled;

        const totalTarget = goal.totalTargetHours || 10;
        const practiceGoalMajor = Math.floor(totalTarget);
        const practiceGoalMinor = Math.round((totalTarget - practiceGoalMajor) * 60);

        this.levelPracticeGoalHours.value = practiceGoalMajor;
        this.levelPracticeGoalMinutes.value = practiceGoalMinor;
        this.levelPracticeGoalEnabled.checked = goal.totalEnabled || false;

        this.levelAdjustHours.value = 0;
        this.levelAdjustMinutes.value = 0;

        this.updateLevelGoalModalProgress();
        this.levelGoalOverlay.classList.remove('hidden');
    }

    updateLevelGoalModalProgress() {
        if (!this.pendingGoalLevelId) return;
        const levelId = this.pendingGoalLevelId;
        const data = this.store.state.levelData[levelId];
        const goal = this.store.state.levelGoals[levelId];

        const currentSeconds = data.time || 0;
        const currentHours = Math.floor(currentSeconds / 3600);
        const currentRemainingMinutes = Math.floor((currentSeconds % 3600) / 60);

        document.getElementById('level-current-total').innerText = `${currentHours}h ${currentRemainingMinutes}m`;
        document.getElementById('level-practice-current').innerText = `${currentHours}h ${currentRemainingMinutes}m`;

        const targetHours = goal.totalTargetHours || 10;
        const tMajor = Math.floor(targetHours);
        const tMinor = Math.round((targetHours - tMajor) * 60);
        document.getElementById('level-practice-target').innerText = `${tMajor}h ${tMinor}m`;

        const progressFill = document.getElementById('level-practice-progress-fill');
        const targetSeconds = targetHours * 3600;
        if (targetSeconds > 0) {
            const pct = Math.min(100, (currentSeconds / targetSeconds) * 100);
            progressFill.style.width = `${pct}%`;
        } else {
            progressFill.style.width = '0%';
        }
    }

    closeLevelGoalModal() {
        this.levelGoalOverlay.classList.add('hidden');
        this.pendingGoalLevelId = null;
        this.renderDashboard();
    }

    // --- Theme Toggle (3-state cycle) ---
    setupThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        const label = document.getElementById('theme-label');
        if (!btn) return;

        const THEME_NAMES = { dark: 'DARK', light: 'LIGHT', ink: 'INK & PAPER' };
        let labelTimer = null;

        const flashLabel = (theme) => {
            if (!label) return;
            label.textContent = THEME_NAMES[theme] || theme.toUpperCase();
            label.classList.add('show');
            clearTimeout(labelTimer);
            labelTimer = setTimeout(() => label.classList.remove('show'), 1500);
        };

        const applyTheme = (theme, animate = false) => {
            // Remove all theme classes
            document.body.classList.remove('theme-light', 'theme-ink');

            // Remove old invert div if present (migration from old code)
            const inv = document.getElementById('__inv');
            if (inv) inv.remove();

            // Apply new theme class
            if (theme === 'light') {
                document.body.classList.add('theme-light');
            } else if (theme === 'ink') {
                document.body.classList.add('theme-ink');
            }
            // 'dark' = no class needed (default)

            // Update toggle icon with rotation
            btn.querySelectorAll('.theme-icon').forEach(i => i.classList.remove('active'));
            const activeIcon = btn.querySelector(`.icon-${theme}`);
            if (activeIcon) activeIcon.classList.add('active');

            if (animate) {
                // Spin the icon briefly
                const svg = activeIcon;
                if (svg) {
                    svg.style.transform = 'rotate(180deg)';
                    requestAnimationFrame(() => {
                        setTimeout(() => { svg.style.transform = 'rotate(0deg)'; }, 50);
                    });
                }
                flashLabel(theme);
            }

            // Re-render dashboard to update SVG colors
            this.renderDashboard();
        };

        // Initial apply (no animation)
        const currentTheme = this.store.state.theme || 'dark';
        applyTheme(currentTheme, false);

        btn.addEventListener('click', () => {
            const currentIdx = THEMES.indexOf(this.store.state.theme || 'dark');
            const nextTheme = THEMES[(currentIdx + 1) % THEMES.length];
            this.store.state.theme = nextTheme;
            this.store.save();
            applyTheme(nextTheme, true);
        });
    }

    // Get current shape color based on theme
    getShapeColor() {
        const theme = this.store.state.theme || 'dark';
        if (theme === 'light') return '#101828';  // cool dark for light theme
        if (theme === 'ink') return '#2c2416';     // warm dark for ink theme
        return '#ffffff';  // white for dark theme
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
                        this.renderDashboard();
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

        // Manual Adjustment Buttons
        document.querySelectorAll('.btn-adjust').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const levelId = parseInt(btn.dataset.level);
                let minutes = 0;

                if (btn.classList.contains('btn-plus')) {
                    minutes = 1;
                } else if (btn.classList.contains('btn-minus')) {
                    minutes = -1;
                } else if (btn.classList.contains('btn-custom')) {
                    this.showCustomTimeModal(levelId);
                    return;
                }

                if (this.store.adjustTime(levelId, minutes)) {
                    this.renderDashboard();
                }
            });
        });

        // Data Management
        document.getElementById('btn-export').addEventListener('click', () => {
            this.store.exportData();
        });

        const importInput = document.getElementById('import-input');
        document.getElementById('btn-import').addEventListener('click', () => {
            importInput.click();
        });

        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (this.store.importData(event.target.result)) {
                        this.renderDashboard();
                        alert("Data imported successfully.");
                    } else {
                        alert("Failed to import data. Invalid format.");
                    }
                    importInput.value = '';
                };
                reader.readAsText(file);
            }
        });

        // Reset Data
        document.getElementById('btn-reset').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset ALL data? This cannot be undone.')) {
                if (confirm('This will permanently erase all sessions, goals, and settings. Continue?')) {
                    this.store.resetData();
                    this.renderDashboard();
                    alert('All data has been reset.');
                }
            }
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
        const customConfigView = document.getElementById('custom-config-view');
        const masteryInfo = document.getElementById('mastery-info');

        p1.innerText = ''; p2.innerText = ''; p3.innerText = '';
        masteryInfo.classList.add('hidden');
        uploadView.classList.add('hidden');
        if (customConfigView) customConfigView.classList.add('hidden');

        if (level.steps[0]) p1.innerText = level.steps[0];
        if (level.steps[1]) p2.innerText = level.steps[1];
        if (level.steps[2]) p3.innerText = level.steps[2];

        if (levelId === 5) {
            uploadView.classList.remove('hidden');
            this.updateSigilPreview();
            p1.innerText = level.extra;
            p2.innerText = level.steps[0] + " " + level.steps[1];
            p3.innerText = level.steps[2] + " " + level.steps[3];
        } else if (levelId === 6) {
            if (customConfigView) customConfigView.classList.remove('hidden');
            p2.innerText = level.steps[1] + " " + level.steps[2];
        } else {
            masteryInfo.classList.remove('hidden');
        }

        // Populate session goal settings
        const goal = this.store.state.levelGoals[levelId];
        const sessionGoalEnabled = document.getElementById('session-goal-enabled');
        const sessionGoalInputWrap = document.getElementById('session-goal-input-wrap');
        const sessionGoalMinutes = document.getElementById('session-goal-minutes');

        sessionGoalEnabled.checked = goal.enabled;
        sessionGoalMinutes.value = goal.targetMinutes;
        if (goal.enabled) {
            sessionGoalInputWrap.classList.remove('hidden');
        } else {
            sessionGoalInputWrap.classList.add('hidden');
        }

        this.view.show('instruction');
    }

    startSession() {
        this.renderShape(this.selectedLevelId);
        this.view.show('practice');

        this.currentSession = new PracticeSession(
            this.selectedLevelId,
            (duration) => this.handleSessionComplete(duration),
            () => { },
            () => { }
        );

        const goal = this.store.state.levelGoals[this.selectedLevelId];
        if (goal.enabled) {
            this.currentSession.setGoal(goal.targetMinutes);
        }

        setTimeout(() => this.currentSession.start(), 100);
    }

    handleSessionComplete(duration) {
        this.store.updateTime(this.selectedLevelId, duration);
        this.renderDashboard();

        const lvlData = this.store.state.levelData[this.selectedLevelId];

        const formatTime = (s) => {
            const m = Math.floor(s / 60);
            const rs = s % 60;
            return `${m}:${rs.toString().padStart(2, '0')}`;
        };

        document.getElementById('session-time-val').innerText = formatTime(duration);
        document.getElementById('cumulative-time-val').innerText = `${Math.floor(lvlData.time / 60)}m`;

        // Motivational message
        const motMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        document.getElementById('debrief-motivation').innerText = `"${motMsg}"`;

        // Streak
        const streak = this.store.getStreak();
        const streakEl = document.getElementById('debrief-streak');
        if (streak > 0) {
            streakEl.innerText = `🔥 ${streak} day${streak > 1 ? 's' : ''} streak`;
        } else {
            streakEl.innerText = '';
        }

        // Mastery Check
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

    // --- Helper: relative time ("2h ago", "3d ago") ---
    timeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHrs = Math.floor(diffMin / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        const diffWeeks = Math.floor(diffDays / 7);
        return `${diffWeeks}w ago`;
    }

    renderDashboard() {
        const totalSec = this.store.state.totalTime || 0;
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        document.getElementById('total-time-display').innerText = `${hrs}h ${mins}m`;

        // Streak
        const streak = this.store.getStreak();
        const streakCount = document.getElementById('streak-count');
        if (streakCount) streakCount.innerText = streak;

        // Total sessions count
        let totalSessionCount = 0;

        const allSessions = [];
        const RING_CIRCUMFERENCE = 2 * Math.PI * 35; // r=35

        document.querySelectorAll('.level-card').forEach(card => {
            const lid = parseInt(card.dataset.level);
            const data = this.store.state.levelData[lid];
            const levelGoal = this.store.state.levelGoals[lid];

            card.classList.remove('locked');

            // Mastery badge
            if (data.mastered) {
                card.classList.add('mastered');
            } else {
                card.classList.remove('mastered');
            }

            const lMin = Math.floor(data.time / 60);
            const history = data.history || [];
            totalSessionCount += history.filter(s => !s.manual).length;

            const timeDisplay = card.querySelector(`[data-time="${lid}"]`);
            if (timeDisplay) {
                const sessionCount = history.filter(s => !s.manual).length;
                const displayTime = lMin >= 60 ? `${Math.floor(lMin / 60)}h ${lMin % 60}m` : `${lMin}m`;
                timeDisplay.innerText = `Sessions: ${sessionCount} | Total: ${displayTime}`;
            }

            // Last practiced badge
            const lastPracticedEl = card.querySelector(`[data-last="${lid}"]`);
            if (lastPracticedEl) {
                const realSessions = history.filter(s => !s.manual);
                if (realSessions.length > 0) {
                    const lastDate = new Date(realSessions[realSessions.length - 1].date);
                    lastPracticedEl.textContent = `Last: ${this.timeAgo(lastDate)}`;
                    lastPracticedEl.classList.remove('hidden');
                } else {
                    lastPracticedEl.classList.add('hidden');
                }
            }

            // Progress Ring
            const ring = card.querySelector(`[data-ring="${lid}"]`);
            if (ring && levelGoal.totalEnabled) {
                const targetSeconds = (levelGoal.totalTargetHours || 10) * 3600;
                const pct = targetSeconds > 0 ? Math.min(1, data.time / targetSeconds) : 0;
                const dashOffset = RING_CIRCUMFERENCE * (1 - pct);
                ring.setAttribute('stroke-dasharray', RING_CIRCUMFERENCE);
                ring.setAttribute('stroke-dashoffset', dashOffset);
            } else if (ring) {
                ring.setAttribute('stroke-dasharray', RING_CIRCUMFERENCE);
                ring.setAttribute('stroke-dashoffset', RING_CIRCUMFERENCE);
            }

            // Card-Level Progress Bar
            const progressWrap = card.querySelector(`[data-progress="${lid}"]`);
            if (progressWrap) {
                if (levelGoal.totalEnabled) {
                    progressWrap.classList.remove('hidden');
                    const targetHours = levelGoal.totalTargetHours || 10;
                    const targetSeconds = targetHours * 3600;
                    const pct = targetSeconds > 0 ? Math.min(100, (data.time / targetSeconds) * 100) : 0;
                    const fill = progressWrap.querySelector(`[data-fill="${lid}"]`);
                    if (fill) fill.style.width = `${pct}%`;

                    const currentH = Math.floor(data.time / 3600);
                    const currentM = Math.floor((data.time % 3600) / 60);
                    const targetDisplay = targetHours >= 1 ? `${Math.floor(targetHours)}h` : `${Math.round(targetHours * 60)}m`;
                    const currentDisplay = currentH > 0 ? `${currentH}h ${currentM}m` : `${currentM}m`;

                    const plabel = progressWrap.querySelector(`[data-plabel="${lid}"]`);
                    if (plabel) plabel.textContent = `${currentDisplay} / ${targetDisplay}`;
                    const ppct = progressWrap.querySelector(`[data-ppct="${lid}"]`);
                    if (ppct) ppct.textContent = `${Math.round(pct)}%`;
                } else {
                    progressWrap.classList.add('hidden');
                }
            }

            // Goal status badges
            const goalStatus = card.querySelector('[data-goal-status]');
            if (goalStatus) {
                let statusHtml = '';
                if (levelGoal.totalEnabled) {
                    const targetHours = levelGoal.totalTargetHours || 10;
                    const lHours = Math.floor(lMin / 60);
                    statusHtml += `<span class="status-item practice">🏆 ${lHours}h/${targetHours}h</span>`;
                }
                if (levelGoal.enabled) {
                    if (statusHtml) statusHtml += ' <span class="separator">|</span> ';
                    statusHtml += `<span class="status-item session">🎯 ${levelGoal.targetMinutes}m</span>`;
                }
                if (statusHtml) {
                    goalStatus.classList.remove('hidden');
                    goalStatus.innerHTML = statusHtml;
                } else {
                    goalStatus.classList.add('hidden');
                }
            }

            // Sessions for global log
            history.forEach(session => {
                allSessions.push({
                    levelName: LEVELS[lid].name.toUpperCase(),
                    date: new Date(session.date),
                    duration: session.duration,
                    manual: session.manual
                });
            });

            // Render Icon
            const iconWrap = card.querySelector('.level-icon');
            const existingRing = iconWrap.querySelector('.progress-ring-wrap');
            iconWrap.innerHTML = '';
            if (existingRing) iconWrap.appendChild(existingRing);

            if (lid === 5 && this.store.state.sigilImage) {
                const img = document.createElement('img');
                img.src = this.store.state.sigilImage;
                iconWrap.appendChild(img);
            } else {
                iconWrap.appendChild(this.getSVG(lid, 60, 2));
            }
        });

        // Total sessions display
        const totalSessionsEl = document.getElementById('total-sessions-display');
        if (totalSessionsEl) totalSessionsEl.innerText = totalSessionCount;

        // Sort sessions newest first
        allSessions.sort((a, b) => b.date - a.date);

        // Update Log
        const logList = document.getElementById('log-list');
        const lastSessionDisplay = document.getElementById('last-session-display');

        if (allSessions.length > 0) {
            logList.innerHTML = '';
            // Show relative time for last session
            lastSessionDisplay.innerText = this.timeAgo(allSessions[0].date);

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
                    <span class="log-level">${session.levelName} ${session.manual ? '<span style="font-size: 0.6rem; opacity: 0.5;">(MANUAL)</span>' : ''}</span>
                    <div class="log-meta">
                        <span class="log-date">${timeStr}</span>
                        <span class="log-duration">${formatDuration(session.duration)}</span>
                    </div>
                `;
                logList.appendChild(entry);
            });
        } else {
            logList.innerHTML = '<div class="log-empty"><div class="log-empty-icon">◎</div><p>No sessions recorded yet. Select a level to begin.</p></div>';
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
        } else if (levelId === 6) {
            const config = this.store.state.customConfig;
            const size = 400;
            const ns = "http://www.w3.org/2000/svg";
            const color = this.getShapeColor();

            const svg = document.createElementNS(ns, "svg");
            svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

            const tempSvg = this.getSVG(config.shape, size, 3, false);
            const formNode = tempSvg.firstElementChild;

            if (formNode) {
                const anims = config.animations;
                let content = formNode;

                const wrap = (cls) => {
                    const g = document.createElementNS(ns, "g");
                    g.classList.add(cls);
                    g.style.transformOrigin = "center";
                    g.style.transformBox = "view-box";
                    g.appendChild(content);
                    content = g;
                };

                if (anims.blink) wrap('anim-wrapper-blink');
                if (anims.bounce) wrap('anim-wrapper-bounce');
                if (anims.rotate) wrap('anim-wrapper-rotate');

                svg.appendChild(content);
            }

            // Static Dot on top
            const dot = document.createElementNS(ns, "circle");
            const c = size / 2;
            dot.setAttribute("cx", c); dot.setAttribute("cy", c);
            dot.setAttribute("r", size * 0.02);
            dot.setAttribute("fill", color);
            svg.appendChild(dot);

            shapeWrap.appendChild(svg);
        } else {
            // Use practice-specific larger SVG
            shapeWrap.appendChild(this.getSVG(levelId, 400, 3));
        }

        container.appendChild(shapeWrap);
    }

    getSVG(type, size, strokeWidth, includeDot = true) {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

        const center = size / 2;
        const color = this.getShapeColor();

        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", center);
        dot.setAttribute("cy", center);
        dot.setAttribute("r", size * 0.02);
        dot.setAttribute("fill", color);

        let form = null;

        const createPoly = (sides, r) => {
            let pts = [];
            for (let i = 0; i < sides; i++) {
                const th = (Math.PI * 2 * i / sides) - Math.PI / 2;
                pts.push(`${center + r * Math.cos(th)},${center + r * Math.sin(th)}`);
            }
            return pts.join(' ');
        };

        if (type === 1) { /* Dot only */ }
        else if (type === 2) {
            form = document.createElementNS(ns, "circle");
            form.setAttribute("cx", center); form.setAttribute("cy", center);
            form.setAttribute("r", size * 0.4);
        }
        else if (type === 3) {
            const s = size * 0.7;
            form = document.createElementNS(ns, "rect");
            form.setAttribute("x", center - s / 2); form.setAttribute("y", center - s / 2);
            form.setAttribute("width", s); form.setAttribute("height", s);
        }
        else if (type === 4) {
            const r = size * 0.45;
            form = document.createElementNS(ns, "polygon");
            form.setAttribute("points", createPoly(3, r));
        }
        else if (type === 'hexagon') {
            form = document.createElementNS(ns, "polygon");
            form.setAttribute("points", createPoly(6, size * 0.4));
        }
        else if (type === 'pentagon') {
            form = document.createElementNS(ns, "polygon");
            form.setAttribute("points", createPoly(5, size * 0.4));
        }
        else if (type === 'octagon') {
            form = document.createElementNS(ns, "polygon");
            form.setAttribute("points", createPoly(8, size * 0.4));
        }
        else if (type === 'diamond') {
            form = document.createElementNS(ns, "polygon");
            const r = size * 0.4;
            form.setAttribute("points", `${center},${center - r} ${center + r * 0.7},${center} ${center},${center + r} ${center - r * 0.7},${center}`);
        }
        else if (type === 'star') {
            form = document.createElementNS(ns, "polygon");
            const outer = size * 0.45;
            const inner = size * 0.2;
            const pts = [];
            for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? outer : inner;
                const th = (Math.PI * 2 * i / 10) - Math.PI / 2;
                pts.push(`${center + r * Math.cos(th)},${center + r * Math.sin(th)}`);
            }
            form.setAttribute("points", pts.join(' '));
        }
        else if (type === 'cross') {
            form = document.createElementNS(ns, "path");
            const L = size * 0.4;
            const T = size * 0.12;
            form.setAttribute("d", `M${center - T},${center - L} H${center + T} V${center - T} H${center + L} V${center + T} H${center + T} V${center + L} H${center - T} V${center + T} H${center - L} V${center - T} H${center - T} Z`);
        }
        else if (type === 'crescent') {
            form = document.createElementNS(ns, "path");
            const r = size * 0.35;
            form.setAttribute("d", `M${center + r * 0.5},${center - r * 0.8} A${r},${r} 0 1,1 ${center + r * 0.5},${center + r * 0.8} A${r * 1.2},${r * 1.2} 0 1,0 ${center + r * 0.5},${center - r * 0.8} Z`);
        }
        else if (type === 'heart') {
            form = document.createElementNS(ns, "path");
            form.setAttribute("d", `M${center},${center + size * 0.35} C${center - size * 0.4},${center - size * 0.15} ${center - size * 0.4},${center - size * 0.45} ${center},${center - size * 0.25} C${center + size * 0.4},${center - size * 0.45} ${center + size * 0.4},${center - size * 0.15} ${center},${center + size * 0.35}`);
        }
        else if (type === 'ruby') {
            form = document.createElementNS(ns, "polygon");
            const w = size * 0.35;
            const h1 = size * 0.15;
            const h2 = size * 0.35;
            form.setAttribute("points", `${center - w * 0.6},${center - h1} ${center + w * 0.6},${center - h1} ${center + w},${center} ${center},${center + h2} ${center - w},${center}`);
        }
        else if (type === 'infinity') {
            form = document.createElementNS(ns, "path");
            const w = size * 0.35;
            const h = size * 0.15;
            form.setAttribute("d", `M${center},${center} C${center - w},${center - h * 4} ${center - w},${center + h * 4} ${center},${center} C${center + w},${center - h * 4} ${center + w},${center + h * 4} ${center},${center} Z`);
            form.setAttribute("fill", "none");
        }

        if (form) {
            if (!form.getAttribute("fill")) form.setAttribute("fill", "none");
            form.setAttribute("stroke", color);
            form.setAttribute("stroke-width", strokeWidth);
            svg.appendChild(form);
        }
        if (includeDot) {
            svg.appendChild(dot);
        }
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
