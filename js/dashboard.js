/* ==========================================================================
   NEUROFIT — GYM MEMBER PORTAL CONTROLLER SCRIPT
   Workout Splits, Exercise Checklist, Gym Fees, Diet, Water & Stopwatch
   ========================================================================== */

(function () {
  'use strict';

  // 1. Gym Workout Routines Database
  const gymWorkouts = {
    chest: {
      title: "Chest & Triceps Workout",
      subtitle: "DAY 1 • MONDAY ROUTINE",
      desc: "Warm-up: 5 minutes treadmill + arm circles. Heavy compound chest press followed by high-tension tricep isolation.",
      exercises: [
        { id: "ch-1", name: "Barbell Flat Bench Press", meta: "4 Sets • 10, 8, 8, 6 Reps (Progressive Overload)", tag: "Compound" },
        { id: "ch-2", name: "Incline Dumbbell Press (30° Angle)", meta: "4 Sets • 10–12 Reps • Focus on Upper Chest", tag: "Hypertrophy" },
        { id: "ch-3", name: "Pec Deck Machine Flyes", meta: "3 Sets • 15 Reps • 2s Squeeze at Peak", tag: "Isolation" },
        { id: "ch-4", name: "Bodyweight Dips or Weighted Dips", meta: "3 Sets • To Failure • Lean forward for lower chest", tag: "Bodyweight" },
        { id: "ch-5", name: "Tricep Cable Rope Pushdown", meta: "4 Sets • 12 Reps • Spread rope at bottom", tag: "Triceps" },
        { id: "ch-6", name: "Overhead EZ-Bar French Press", meta: "3 Sets • 10 Reps • Long head tricep stretch", tag: "Triceps" }
      ]
    },
    back: {
      title: "Back & Biceps Workout",
      subtitle: "DAY 2 • TUESDAY ROUTINE",
      desc: "Warm-up: Lat activation + bodyweight pull-ups. Focus on full lat width, spinal erection, and heavy bicep curls.",
      exercises: [
        { id: "bk-1", name: "Conventional Barbell Deadlift", meta: "4 Sets • 8, 6, 4, 4 Reps • Solid spinal form", tag: "King Lift" },
        { id: "bk-2", name: "Wide-Grip Lat Pulldown", meta: "4 Sets • 10–12 Reps • Pull to upper chest", tag: "Lat Width" },
        { id: "bk-3", name: "Bent-over Barbell Rows (Overhand)", meta: "4 Sets • 8–10 Reps • Full back thickness", tag: "Thickness" },
        { id: "bk-4", name: "Seated Low Cable Row (V-Grip)", meta: "3 Sets • 12 Reps • Squeeze shoulder blades", tag: "Mid Back" },
        { id: "bk-5", name: "Standing Barbell Bicep Curls", meta: "4 Sets • 10 Reps • Strict form, no swing", tag: "Biceps" },
        { id: "bk-6", name: "Incline Dumbbell Hammer Curls", meta: "3 Sets • 12 Reps • Brachialis & forearm thickness", tag: "Forearms" }
      ]
    },
    shoulders: {
      title: "Shoulders & Traps Workout",
      subtitle: "DAY 3 • WEDNESDAY ROUTINE",
      desc: "Warm-up: Rotator cuff warm-up. Build 3D boulder shoulders, capped lateral delts, and upper traps.",
      exercises: [
        { id: "sh-1", name: "Seated Dumbbell Overhead Shoulder Press", meta: "4 Sets • 10, 8, 8, 6 Reps • Full lockout", tag: "Compound" },
        { id: "sh-2", name: "Standing Dumbbell Lateral Raises", meta: "4 Sets • 15 Reps • Pause 1s at top for capped delts", tag: "Side Delt" },
        { id: "sh-3", name: "Barbell or EZ-Bar Front Raises", meta: "3 Sets • 12 Reps • Front delt isolation", tag: "Front Delt" },
        { id: "sh-4", name: "Cable Face Pulls with Rope", meta: "4 Sets • 15 Reps • Rear delts & shoulder health", tag: "Rear Delt" },
        { id: "sh-5", name: "Heavy Dumbbell or Barbell Shrugs", meta: "4 Sets • 12 Reps • Hold squeeze 2s at top", tag: "Traps" }
      ]
    },
    legs: {
      title: "Legs & Calves Workout",
      subtitle: "DAY 4 • THURSDAY ROUTINE",
      desc: "Warm-up: 5 minutes cycling + bodyweight squats. Never skip leg day — high testosterone release & quad hypertrophy.",
      exercises: [
        { id: "lg-1", name: "Barbell Back Squats (Deep Parallel)", meta: "4 Sets • 10, 8, 6, 6 Reps • Heavy compound", tag: "Quad Dominant" },
        { id: "lg-2", name: "45-Degree Incline Leg Press", meta: "4 Sets • 12 Reps • Deep knee flexion", tag: "Leg Mass" },
        { id: "lg-3", name: "Seated Leg Extension", meta: "3 Sets • 15 Reps • Quad teardrop burnout", tag: "Isolation" },
        { id: "lg-4", name: "Lying Hamstring Leg Curls", meta: "4 Sets • 12 Reps • Full hamstring stretch", tag: "Hamstrings" },
        { id: "lg-5", name: "Standing Machine Calf Raises", meta: "4 Sets • 20 Reps • Stretch deep at bottom", tag: "Calves" }
      ]
    },
    arms: {
      title: "Arms & Abs Workout (Supersets)",
      subtitle: "DAY 5 • FRIDAY ROUTINE",
      desc: "Warm-up: Light bicep & tricep pump. Target peak arm circumference followed by heavy core anti-flexion.",
      exercises: [
        { id: "arm-1", name: "EZ-Bar Preacher Curls (Biceps)", meta: "4 Sets • 10 Reps • Lower bicep peak", tag: "Biceps" },
        { id: "arm-2", name: "Lying Tricep Skull Crushers", meta: "4 Sets • 10 Reps • Lower bar to forehead", tag: "Triceps" },
        { id: "arm-3", name: "Incline Dumbbell Bicep Curls", meta: "3 Sets • 12 Reps • Deep long-head bicep stretch", tag: "Biceps" },
        { id: "arm-4", name: "Cable Tricep Overhead Extension", meta: "3 Sets • 12 Reps • Upper horseshoe tricep", tag: "Triceps" },
        { id: "arm-5", name: "Hanging Strict Leg Raises", meta: "3 Sets • 15 Reps • Lower abdominal focus", tag: "Abs" },
        { id: "arm-6", name: "Weighted Cable Abdominal Crunches", meta: "3 Sets • 20 Reps • Six-pack hypertrophy", tag: "Core" }
      ]
    },
    cardio: {
      title: "HIIT & Conditioning Session",
      subtitle: "DAY 6 • SATURDAY ROUTINE",
      desc: "Warm-up: Dynamic full-body mobility. High intensity fat shredding & cardiovascular endurance.",
      exercises: [
        { id: "cd-1", name: "Incline Treadmill Sprints", meta: "15 Mins • 30s Sprint / 30s Walk intervals", tag: "HIIT" },
        { id: "cd-2", name: "Heavy Battle Ropes Slams", meta: "4 Sets • 30 Seconds continuous waves", tag: "Conditioning" },
        { id: "cd-3", name: "Kettlebell Swings (16kg - 24kg)", meta: "4 Sets • 20 Reps • Explosive hip hinge", tag: "Power" },
        { id: "cd-4", name: "Assault Air Bike or Rowing Machine", meta: "10 Mins • Steady Zone 2 heart rate", tag: "Endurance" }
      ]
    }
  };

  let currentDay = 'chest';

  document.addEventListener('DOMContentLoaded', () => {
    initDashboardTabs();
    initWorkoutDays();
    initWorkoutChecklist();
    initGymStopwatch();
    initWaterTracker();
    initGymFeeManagement();
    syncUserData();
  });

  /* --------------------------------------------------------------------------
     1. Dashboard Tab Navigation
     -------------------------------------------------------------------------- */
  function initDashboardTabs() {
    const tabButtons = document.querySelectorAll('.dash-tab-btn');
    const tabPanes = document.querySelectorAll('.dash-tab-pane');

    function activateTab(tabId) {
      tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tabTarget === tabId);
      });

      tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane-${tabId}`);
      });

      if (history.replaceState) {
        history.replaceState(null, null, `?tab=${tabId}`);
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabTarget;
        if (target) activateTab(target);
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab && document.getElementById(`pane-${initialTab}`)) {
      activateTab(initialTab);
    }
  }

  /* --------------------------------------------------------------------------
     2. Gym Workout Days (Chest, Back, Legs, etc.)
     -------------------------------------------------------------------------- */
  function initWorkoutDays() {
    const dayBtns = document.querySelectorAll('.gym-day-btn');
    dayBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dayBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const day = btn.dataset.day;
        if (gymWorkouts[day]) {
          currentDay = day;
          renderWorkoutDay(day);
        }
      });
    });

    renderWorkoutDay(currentDay);
  }

  function renderWorkoutDay(dayKey) {
    const data = gymWorkouts[dayKey];
    if (!data) return;

    const titleEl = document.getElementById('workout-day-title');
    const subEl = document.getElementById('workout-day-subtitle');
    const descEl = document.getElementById('workout-day-desc');
    const container = document.getElementById('workout-checklist-container');

    if (titleEl) titleEl.textContent = data.title;
    if (subEl) subEl.textContent = data.subtitle;
    if (descEl) descEl.textContent = data.desc;

    if (!container) return;

    const storageKey = `neurofit_workout_${dayKey}_completed`;
    const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');

    let html = '';
    data.exercises.forEach(ex => {
      const isDone = completedList.includes(ex.id);
      html += `
        <div class="exercise-item ${isDone ? 'completed' : ''}" data-exercise-id="${ex.id}">
          <div class="exercise-left">
            <div class="exercise-checkbox">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </div>
            <div>
              <div class="exercise-name">${ex.name}</div>
              <div class="exercise-meta">${ex.meta}</div>
            </div>
          </div>
          <span class="tag-badge" style="font-size: 0.72rem;">${ex.tag}</span>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide) lucide.createIcons();
    bindChecklistClicks(dayKey);
    updateWorkoutStatusPill(dayKey, data.exercises.length);
  }

  function bindChecklistClicks(dayKey) {
    const container = document.getElementById('workout-checklist-container');
    if (!container) return;

    const storageKey = `neurofit_workout_${dayKey}_completed`;
    let completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const items = container.querySelectorAll('.exercise-item');

    items.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('completed');
        const id = item.dataset.exerciseId;
        const isCompleted = item.classList.contains('completed');

        if (isCompleted) {
          if (!completedList.includes(id)) completedList.push(id);
        } else {
          completedList = completedList.filter(x => x !== id);
        }

        localStorage.setItem(storageKey, JSON.stringify(completedList));
        updateWorkoutStatusPill(dayKey, items.length);
      });
    });
  }

  function updateWorkoutStatusPill(dayKey, totalCount) {
    const storageKey = `neurofit_workout_${dayKey}_completed`;
    const completedList = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const statusPill = document.getElementById('routine-status-pill');

    if (statusPill) {
      if (completedList.length === totalCount && totalCount > 0) {
        statusPill.textContent = `All ${totalCount} Done! Great Workout 💪`;
        statusPill.style.color = '#00FF88';
        statusPill.style.background = 'rgba(0, 255, 136, 0.2)';
      } else {
        statusPill.textContent = `${completedList.length} of ${totalCount} Done`;
        statusPill.style.color = 'var(--accent)';
        statusPill.style.background = 'rgba(0, 212, 255, 0.1)';
      }
    }
  }

  function initWorkoutChecklist() {
    const resetBtn = document.getElementById('btn-reset-workout');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm(`Reset exercises checkmarks for ${gymWorkouts[currentDay].title}?`)) {
          localStorage.removeItem(`neurofit_workout_${currentDay}_completed`);
          renderWorkoutDay(currentDay);
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. Gym Stopwatch / Rest Timer (120s count down)
     -------------------------------------------------------------------------- */
  function initGymStopwatch() {
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('btn-timer-start');
    const resetBtn = document.getElementById('btn-timer-reset');

    if (!timerDisplay || !startBtn) return;

    let timeLeft = 120;
    let timerInterval = null;

    function formatTime(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    startBtn.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.textContent = 'Resume';
        return;
      }

      startBtn.textContent = 'Pause';
      timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          timerDisplay.textContent = '00:00';
          timerDisplay.style.color = '#00FF88';
          startBtn.textContent = 'Start (2m)';
          alert('Time up! Rest period complete. Start your next heavy set!');
        }
      }, 1000);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 120;
        timerDisplay.textContent = '02:00';
        timerDisplay.style.color = 'var(--accent)';
        startBtn.textContent = 'Start (2m)';
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. Daily Water Intake Tracker (8 Glasses)
     -------------------------------------------------------------------------- */
  function initWaterTracker() {
    const container = document.getElementById('water-glasses-container');
    const countText = document.getElementById('water-count-text');
    if (!container) return;

    let count = parseInt(localStorage.getItem('neurofit_water_count') || '5', 10);

    function updateWaterUI() {
      const btns = container.querySelectorAll('.water-glass-btn');
      btns.forEach((btn, index) => {
        btn.classList.toggle('filled', index < count);
      });

      if (countText) {
        const litres = (count * 0.45).toFixed(1);
        countText.textContent = `${count} / 8 Glasses (${litres}L)`;
      }

      localStorage.setItem('neurofit_water_count', count.toString());
    }

    container.querySelectorAll('.water-glass-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        if (count === index + 1) {
          count = index; // toggle down
        } else {
          count = index + 1;
        }
        updateWaterUI();
      });
    });

    updateWaterUI();
  }

  /* --------------------------------------------------------------------------
     5. Gym Fee & Package Management
     -------------------------------------------------------------------------- */
  function initGymFeeManagement() {
    const form = document.getElementById('form-change-tier');
    const tierNameEl = document.getElementById('membership-plan-name');
    const tierBadgeEl = document.getElementById('dash-tier-label');

    const savedPackage = localStorage.getItem('neurofit_gym_package');
    if (savedPackage) {
      if (tierNameEl) tierNameEl.textContent = savedPackage;
      if (tierBadgeEl) tierBadgeEl.textContent = savedPackage.split('(')[0].trim();
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectTier = document.getElementById('select-tier');
        const newPackage = selectTier ? selectTier.value : 'Gold Monthly (Rs. 5,000/mo)';

        localStorage.setItem('neurofit_gym_package', newPackage);
        if (tierNameEl) tierNameEl.textContent = newPackage;
        if (tierBadgeEl) tierBadgeEl.textContent = newPackage.split('(')[0].trim();

        const modal = document.getElementById('upgrade-tier-modal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';

        alert(`Gym package successfully updated to ${newPackage}! Receipt and turnstile punch entry have been renewed.`);
      });
    }

    // Save Gym ID Card
    const btnSavePass = document.getElementById('btn-save-pass');
    if (btnSavePass) {
      btnSavePass.addEventListener('click', () => {
        alert('Official Gym ID Card downloaded! You can show this QR card at the gym entrance.');
      });
    }

    // WhatsApp Trainer Coach Consultation
    const coachForm = document.getElementById('form-coach-checkin');
    if (coachForm) {
      coachForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const modal = document.getElementById('consult-coach-modal');
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
        alert('Message sent to Coach Alex Morgan! Trainer will reply on your WhatsApp shortly.');
        coachForm.reset();
      });
    }
  }

  /* --------------------------------------------------------------------------
     6. Sync User Profile from Firebase or Storage
     -------------------------------------------------------------------------- */
  function syncUserData() {
    const storedUser = localStorage.getItem('neurofit_active_user');
    let name = 'Athlete';
    let email = 'member@neurofit.club';

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        name = parsed.displayName || name;
        email = parsed.email || email;
      } catch (e) {}
    }

    function applyUser(uName, uEmail, photoURL) {
      const nameEl = document.getElementById('dash-user-name');
      const emailEl = document.getElementById('dash-user-email');
      const keycardNameEl = document.getElementById('keycard-name');
      const avatarEl = document.getElementById('dash-user-avatar');

      if (nameEl) nameEl.textContent = uName;
      if (emailEl) emailEl.innerHTML = `${uEmail} &bull; Roll #NF-1042`;
      if (keycardNameEl) keycardNameEl.textContent = uName.toUpperCase();

      if (avatarEl) {
        if (photoURL) {
          avatarEl.innerHTML = `<img src="${photoURL}" alt="${uName}" class="dash-avatar-img">`;
        } else {
          avatarEl.innerHTML = `<span>${(uName.charAt(0) || 'U').toUpperCase()}</span>`;
        }
      }
    }

    applyUser(name, email);

    setTimeout(() => {
      if (window.auth && window.auth.currentUser) {
        const u = window.auth.currentUser;
        const displayName = u.displayName || u.email.split('@')[0];
        applyUser(displayName, u.email, u.photoURL);
        localStorage.setItem('neurofit_active_user', JSON.stringify({ displayName, email: u.email }));
      }
    }, 800);
  }

})();
