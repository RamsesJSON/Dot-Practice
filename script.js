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
    },
    6: {
        id: 6,
        name: "Custom Practice",
        duration: 20 * 60, // Default duration, customizable? Let's stick to a base or make it flexible.
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
                5: { time: 0, mastered: false, history: [] },
                6: { time: 0, mastered: false, history: [] }
            },
            // Per-session goals (notify when X minutes reached during a session)
            levelGoals: {
                1: { targetMinutes: 2, enabled: false, totalTargetHours: 10, totalEnabled: false },
                2: { targetMinutes: 4, enabled: false, totalTargetHours: 10, totalEnabled: false },
                3: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                4: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                5: { targetMinutes: 10, enabled: false, totalTargetHours: 10, totalEnabled: false },
                6: { targetMinutes: 20, enabled: false, totalTargetHours: 10, totalEnabled: false }
            },
            // Level 6 Configuration
            customConfig: {
                shape: 'hexagon',
                animations: {
                    blink: false,
                    bounce: false,
                    rotate: false
                }
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

    adjustTime(levelId, minutes) {
        const seconds = minutes * 60;
        if (!this.state.levelData[levelId].history) {
            this.state.levelData[levelId].history = [];
        }

        // Don't allow negative total time for level
        if (this.state.levelData[levelId].time + seconds < 0) {
            return false;
        }

        // User requested not to add sessions for manual adjustments
        /*
        this.state.levelData[levelId].history.push({
            date: new Date().toISOString(),
            duration: seconds,
            manual: true
        });
        */

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
            // Basic validation: check if it has the expected structure
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
        this.setupEscapeHandler();
    }

    setGoal(targetMinutes) {
        this.goalTarget = targetMinutes * 60; // Convert to seconds
    }

    start() {
        this.active = true;
        this.startTime = Date.now();
        this.run();
        this.enterImmersiveMode();
    }

    run() {
        if (!this.active) return;

        // Check for goal reached
        if (this.goalTarget && !this.goalReached) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000) + Math.floor(this.elapsedBeforePause / 1000);
            if (elapsed >= this.goalTarget) {
                this.goalReached = true;
                this.showGoalReached();
                return;
            }
        }

        this.animationFrame = requestAnimationFrame(() => this.run());
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
        this.onComplete(elapsed);
        this.removeInputHandler();
    }

    handleInput(e) {
        // If click is on the overlay, ignore it so bubbles don't end session
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
        this.overlay.classList.add('hidden');
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
        this.migrateState(); // Ensure backwards compatibility
        this.init();
    }

    migrateState() {
        // Add missing properties for backwards compatibility
        if (!this.store.state.levelGoals) {
            this.store.state.levelGoals = {
                1: { targetMinutes: 2, enabled: false, totalTargetHours: 10, totalEnabled: false },
                2: { targetMinutes: 4, enabled: false, totalTargetHours: 10, totalEnabled: false },
                3: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                4: { targetMinutes: 6, enabled: false, totalTargetHours: 10, totalEnabled: false },
                5: { targetMinutes: 10, enabled: false, totalTargetHours: 10, totalEnabled: false }
            };
        } else {
            // Ensure all levels have new properties
            for (let i = 1; i <= 5; i++) {
                if (this.store.state.levelGoals[i].totalTargetHours === undefined) {
                    this.store.state.levelGoals[i].totalTargetHours = 10;
                    this.store.state.levelGoals[i].totalEnabled = false;
                }
            }

            // Level 6 Init
            if (!this.store.state.levelData[6]) {
                this.store.state.levelData[6] = { time: 0, mastered: false, history: [] };
            }
            if (!this.store.state.levelGoals[6]) {
                this.store.state.levelGoals[6] = { targetMinutes: 20, enabled: false, totalTargetHours: 10, totalEnabled: false };
            }
            if (!this.store.state.customConfig) {
                this.store.state.customConfig = {
                    shape: 'hexagon',
                    animations: {
                        blink: false,
                        bounce: false,
                        rotate: false
                    }
                };
            }
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
    }

    setupCustomConfig() {
        const grid = document.getElementById('shape-picker-grid');
        const config = this.store.state.customConfig;

        // Populate Shapes
        Object.entries(SHAPES).forEach(([key, val]) => {
            const btn = document.createElement('div');
            btn.classList.add('shape-btn');
            if (config.shape === key) btn.classList.add('selected');
            btn.title = val.name;

            // Render preview icon (small SVG)
            const icon = this.getSVG(key, 40, 2);
            // Normalize icon size/stroke for button?
            btn.appendChild(icon);

            btn.addEventListener('click', () => {
                this.store.state.customConfig.shape = key;
                this.store.save();

                // UI Update
                grid.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });

            grid.appendChild(btn);
        });

        // Bind Animations
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

        // Close on overlay click
        this.customTimeOverlay.addEventListener('click', (e) => {
            if (e.target === this.customTimeOverlay) this.closeCustomTimeModal();
        });

        // Handle Enter key
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
        // Level Goal Modal
        this.levelGoalOverlay = document.getElementById('level-goal-overlay');
        // Session Goal Inputs
        this.levelSessionGoalInput = document.getElementById('level-session-goal-minutes');
        this.levelSessionGoalEnabled = document.getElementById('level-session-goal-enabled');

        // Practice Goal Inputs
        this.levelPracticeGoalEnabled = document.getElementById('level-practice-goal-enabled');
        this.levelPracticeGoalHours = document.getElementById('level-practice-goal-hours');
        this.levelPracticeGoalMinutes = document.getElementById('level-practice-goal-minutes');

        // Adjust Inputs
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
                // Save Session Goal
                const sessionMinutes = parseInt(this.levelSessionGoalInput.value) || 5;
                this.store.state.levelGoals[this.pendingGoalLevelId].targetMinutes = Math.max(1, sessionMinutes);
                this.store.state.levelGoals[this.pendingGoalLevelId].enabled = this.levelSessionGoalEnabled.checked;

                // Save Practice Goal
                const practiceHours = parseInt(this.levelPracticeGoalHours.value) || 0;
                const practiceMinutes = parseInt(this.levelPracticeGoalMinutes.value) || 0;
                // Convert to floating point hours for storage or just store hours? 
                // Let's store totalTargetHours as a float if needed, but UI shows hours.
                // Simple approach: Store totalTargetHours. 
                // We'll treat the input as: Hours + (Minutes/60)
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

        // Time Adjustment Handlers within Modal
        const handleLevelTimeAdjust = (isAdd) => {
            if (!this.pendingGoalLevelId) return;
            const hours = parseInt(this.levelAdjustHours.value) || 0;
            const minutes = parseInt(this.levelAdjustMinutes.value) || 0;
            const totalMinutes = (hours * 60) + minutes;
            if (totalMinutes === 0) return;

            const adjustAmount = isAdd ? totalMinutes : -totalMinutes;

            if (this.store.adjustTime(this.pendingGoalLevelId, adjustAmount)) {
                // Update the modal UI immediately to show new total
                this.updateLevelGoalModalProgress();
                // Reset inputs
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
            // Update level goal settings
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

        // Session Goal
        this.levelSessionGoalInput.value = goal.targetMinutes;
        this.levelSessionGoalEnabled.checked = goal.enabled;

        // Practice Goal
        const totalTarget = goal.totalTargetHours || 10;
        const practiceGoalMajor = Math.floor(totalTarget);
        const practiceGoalMinor = Math.round((totalTarget - practiceGoalMajor) * 60);

        this.levelPracticeGoalHours.value = practiceGoalMajor;
        this.levelPracticeGoalMinutes.value = practiceGoalMinor;
        this.levelPracticeGoalEnabled.checked = goal.totalEnabled || false;

        // Reset Adjust Inputs
        this.levelAdjustHours.value = 0;
        this.levelAdjustMinutes.value = 0;

        // Update Progress UI
        this.updateLevelGoalModalProgress();

        this.levelGoalOverlay.classList.remove('hidden');
    }

    updateLevelGoalModalProgress() {
        if (!this.pendingGoalLevelId) return;
        const levelId = this.pendingGoalLevelId;
        const data = this.store.state.levelData[levelId];
        const goal = this.store.state.levelGoals[levelId];

        // Calculate current time
        const currentSeconds = data.time || 0;
        const currentHours = Math.floor(currentSeconds / 3600);
        const currentRemainingMinutes = Math.floor((currentSeconds % 3600) / 60);

        // Update Text
        document.getElementById('level-current-total').innerText = `${currentHours}h ${currentRemainingMinutes}m`;
        document.getElementById('level-practice-current').innerText = `${currentHours}h ${currentRemainingMinutes}m`;

        const targetHours = goal.totalTargetHours || 10;
        // Format target for display (e.g. 10.5 -> 10h 30m)
        const tMajor = Math.floor(targetHours);
        const tMinor = Math.round((targetHours - tMajor) * 60);
        document.getElementById('level-practice-target').innerText = `${tMajor}h ${tMinor}m`;

        // Update Progress Bar
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
        this.renderDashboard(); // Re-render to update dashboard stats if changed via adjust
    }

    setupThemeToggle() {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        const sunIcon = btn.querySelector('.sun-icon');
        const moonIcon = btn.querySelector('.moon-icon');

        const applyTheme = (theme) => {
            document.body.classList.toggle('light-theme', theme === 'light');
            if (theme === 'light') {
                if (!document.getElementById('__inv')) {
                    document.getElementById('app').insertAdjacentHTML(
                        'beforeend',
                        '<div id="__inv" style="position:absolute;inset:0;pointer-events:none;backdrop-filter:invert(1) hue-rotate(180deg);z-index:9999"></div>'
                    );
                }
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                const inv = document.getElementById('__inv');
                if (inv) inv.remove();
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        };

        // Initial apply
        applyTheme(this.store.state.theme || 'dark');

        btn.addEventListener('click', () => {
            const currentTheme = this.store.state.theme === 'light' ? 'dark' : 'light';
            this.store.state.theme = currentTheme;
            this.store.save();
            applyTheme(currentTheme);
        });
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

        // Manual Adjustment Buttons
        document.querySelectorAll('.btn-adjust').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent level card click
                const levelId = parseInt(btn.dataset.level);
                let minutes = 0;

                if (btn.classList.contains('btn-plus')) {
                    minutes = 1;
                } else if (btn.classList.contains('btn-minus')) {
                    minutes = -1;
                } else if (btn.classList.contains('btn-custom')) {
                    this.showCustomTimeModal(levelId);
                    return; // Modal handles the rest
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
                    importInput.value = ''; // Reset for next time
                };
                reader.readAsText(file);
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

        // Reset
        p1.innerText = ''; p2.innerText = ''; p3.innerText = '';
        masteryInfo.classList.add('hidden');
        uploadView.classList.add('hidden');
        if (customConfigView) customConfigView.classList.add('hidden');

        // Populate steps
        if (level.steps[0]) p1.innerText = level.steps[0];
        if (level.steps[1]) p2.innerText = level.steps[1];
        if (level.steps[2]) p3.innerText = level.steps[2];

        // Level Specific Views
        if (levelId === 5) {
            uploadView.classList.remove('hidden');
            this.updateSigilPreview();
            // Prefix with the 'extra' foundation text
            p1.innerText = level.extra;
            p2.innerText = level.steps[0] + " " + level.steps[1];
            p3.innerText = level.steps[2] + " " + level.steps[3];
        } else if (levelId === 6) {
            if (customConfigView) customConfigView.classList.remove('hidden');
            p2.innerText = level.steps[1] + " " + level.steps[2];
        } else {
            masteryInfo.classList.remove('hidden'); // Show mastery criteria for preparatory levels
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
            () => { } // onGoalReached - no special handling needed, UI handles it
        );

        // Set goal if enabled for this level
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
            const levelGoal = this.store.state.levelGoals[lid];

            // All levels unlocked
            card.classList.remove('locked');

            const lMin = Math.floor(data.time / 60);
            const history = data.history || [];
            const timeDisplay = card.querySelector('.level-time');
            if (timeDisplay) timeDisplay.innerText = `Sessions: ${history.length} | Total: ${lMin}m`;

            // Show goal status on card
            const goalStatus = card.querySelector('[data-goal-status]');
            if (goalStatus) {
                let statusHtml = '';

                // Practice Goal Status
                if (levelGoal.totalEnabled) {
                    const targetHours = levelGoal.totalTargetHours || 10;
                    const lHours = Math.floor(lMin / 60);
                    // Use a shorter format if space is tight
                    statusHtml += `<span class="status-item practice">🏆 ${lHours}h/${targetHours}h</span>`;
                }

                // Session Goal Status
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

            // Aggregation for global log
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
                    <span class="log-level">${session.levelName} ${session.manual ? '<span style="font-size: 0.6rem; opacity: 0.5;">(MANUAL)</span>' : ''}</span>
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
        } else if (levelId === 6) {
            const config = this.store.state.customConfig;
            const size = 400;
            const ns = "http://www.w3.org/2000/svg";

            // 6. Custom Practice: Separated Dot and Shape
            const svg = document.createElementNS(ns, "svg");
            svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

            // Get form element (without dot)
            // Note: getSVG(type, size, stroke, false) returns SVG with just the form
            const tempSvg = this.getSVG(config.shape, size, 3, false);
            const formNode = tempSvg.firstElementChild;

            if (formNode) {
                // Create Animation Hierarchy (Inner -> Outer)
                const anims = config.animations;
                let content = formNode;

                const wrap = (cls) => {
                    const g = document.createElementNS(ns, "g");
                    g.classList.add(cls);
                    // Fix transform origin for SVG elements
                    g.style.transformOrigin = "center";
                    g.style.transformBox = "view-box";
                    g.appendChild(content);
                    content = g;
                };

                // Apply animations
                if (anims.blink) wrap('anim-wrapper-blink');
                if (anims.bounce) wrap('anim-wrapper-bounce');
                if (anims.rotate) wrap('anim-wrapper-rotate');

                svg.appendChild(content);
            }

            // Static Dot (On Top)
            const dot = document.createElementNS(ns, "circle");
            const c = size / 2;
            dot.setAttribute("cx", c); dot.setAttribute("cy", c);
            dot.setAttribute("r", size * 0.02);
            dot.setAttribute("fill", "white");
            svg.appendChild(dot);

            shapeWrap.appendChild(svg);
        } else {
            shapeWrap.appendChild(this.getSVG(levelId, 400, 3));
        }

        container.appendChild(shapeWrap);
    }

    getSVG(type, size, strokeWidth, includeDot = true) {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

        const center = size / 2;
        const color = "white";

        // Dot (Always present for standard levels, what about custom? Steps say "focus object")
        // Level 6 implies "Custom Practice" -> "The Form". 
        // Let's include the dot if it's not a purely filled shape or if user expects it.
        // Standard forms (1-4) have a dot. Custom forms usually surround a dot or ARE the object.
        // Steps say "Select a shape... Focus on the dot within?" or "Select a shape that resonates".
        // Let's assume there's a dot for consistency unless the shape IS the focus.
        // I will add a dot for all linear shapes.

        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("cx", center);
        dot.setAttribute("cy", center);
        dot.setAttribute("r", size * 0.02);
        dot.setAttribute("fill", color);

        let form = null;

        // Helper for Regular Polygons
        const createPoly = (sides, r) => {
            let pts = [];
            for (let i = 0; i < sides; i++) {
                // -PI/2 to start at top
                const th = (Math.PI * 2 * i / sides) - Math.PI / 2;
                pts.push(`${center + r * Math.cos(th)},${center + r * Math.sin(th)}`);
            }
            return pts.join(' ');
        };

        if (type === 1) { /* Dot only */ }
        else if (type === 2) { // Circle
            form = document.createElementNS(ns, "circle");
            form.setAttribute("cx", center); form.setAttribute("cy", center);
            form.setAttribute("r", size * 0.4);
        }
        else if (type === 3) { // Square
            const s = size * 0.7;
            form = document.createElementNS(ns, "rect");
            form.setAttribute("x", center - s / 2); form.setAttribute("y", center - s / 2);
            form.setAttribute("width", s); form.setAttribute("height", s);
        }
        else if (type === 4) { // Triangle
            const r = size * 0.45;
            // 3 sides
            const pts = createPoly(3, r);
            form = document.createElementNS(ns, "polygon");
            form.setAttribute("points", pts);
        }
        // Custom Shapes
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
            // Rhombus: Rect rotated 45deg or polygon
            form = document.createElementNS(ns, "polygon");
            const r = size * 0.4;
            // top, right, bottom, left
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
            // Draw cross path
            form.setAttribute("d", `M${center - T},${center - L} H${center + T} V${center - T} H${center + L} V${center + T} H${center + T} V${center + L} H${center - T} V${center + T} H${center - L} V${center - T} H${center - T} Z`);
        }
        else if (type === 'crescent') {
            form = document.createElementNS(ns, "path");
            const r = size * 0.35;
            // Circle minus offset circle
            form.setAttribute("d", `M${center + r * 0.5},${center - r * 0.8} A${r},${r} 0 1,1 ${center + r * 0.5},${center + r * 0.8} A${r * 1.2},${r * 1.2} 0 1,0 ${center + r * 0.5},${center - r * 0.8} Z`);
        }
        else if (type === 'heart') {
            form = document.createElementNS(ns, "path");
            const s = size * 0.012; // scale factor
            // simple heart path centered roughly
            // M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 Z
            // Need to translate/scale to center
            const path = "M 25,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 75,30 Q 75,60 50,85 Q 25,60 25,30 Z";
            // Better to generate points or use a standard path string normalized to size
            // Using a simpler approximator logic
            form.setAttribute("d", `M${center},${center + size * 0.25} C${center},${center - size * 0.1} ${center - size * 0.5},${center - size * 0.3} ${center - size * 0.35},${center - size * 0.2} C${center - size * 0.1},${center - size * 0.05} ${center - size * 0.1},${center + size * 0.1} ${center},${center + size * 0.35} C${center + size * 0.1},${center + size * 0.1} ${center + size * 0.1},${center - size * 0.05} ${center + size * 0.35},${center - size * 0.2} C${center + size * 0.5},${center - size * 0.3} ${center},${center - size * 0.1} ${center},${center + size * 0.25} Z`);
            // Actually, standard Bezier heart:
            form.setAttribute("d", `M${center},${center + size * 0.15} C${center},${center - size * 0.1} ${center - size * 0.45},${center - size * 0.3} ${center - size * 0.45},${center - size * 0.1} C${center - size * 0.45},${center + size * 0.1} ${center - size * 0.2},${center + size * 0.25} ${center},${center + size * 0.4} C${center + size * 0.2},${center + size * 0.25} ${center + size * 0.45},${center + size * 0.1} ${center + size * 0.45},${center - size * 0.1} C${center + size * 0.45},${center - size * 0.3} ${center},${center - size * 0.1} ${center},${center + size * 0.15} Z`);
            // Inverting Y for SVG coords? No, SVG Y+ is down. 
            // Start at bottom tip?
            // M center, bottom
            // Let's use a standard path
            form.setAttribute("d", `M${center},${center + size * 0.35} C${center - size * 0.4},${center - size * 0.15} ${center - size * 0.4},${center - size * 0.45} ${center},${center - size * 0.25} C${center + size * 0.4},${center - size * 0.45} ${center + size * 0.4},${center - size * 0.15} ${center},${center + size * 0.35}`);
        }
        else if (type === 'ruby') {
            form = document.createElementNS(ns, "polygon");
            // Trapezoid top, triangle bot
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
