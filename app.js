// Get elements
const currentStreakEl = document.getElementById('currentStreak');
const bestStreakEl = document.getElementById('bestStreak');
const totalDaysEl = document.getElementById('totalDays');
const addDayBtn = document.getElementById('addDayBtn');
const oopsBtn = document.getElementById('oopsBtn');
const resetBtn = document.getElementById('resetBtn');
const calendarEl = document.getElementById('calendar');

// LocalStorage keys
const STORAGE_KEY = 'sugarStreak';

// Initialize data structure
const initializeData = () => {
    const defaultData = {
        currentStreak: 0,
        bestStreak: 0,
        totalDays: 0,
        history: [] // Array of dates with status
    };
    return defaultData;
};

// Get data from localStorage
const getData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initializeData();
};

// Save data to localStorage
const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

// Check if entry exists for today
const hasEntryToday = (data) => {
    const today = getTodayDate();
    return data.history.some(entry => entry.date === today);
};

// Add a sugar-free day
const addDay = () => {
    const data = getData();
    const today = getTodayDate();

    if (hasEntryToday(data)) {
        alert('⚠️ You already logged today! Check back tomorrow.');
        return;
    }

    data.currentStreak += 1;
    data.totalDays += 1;

    // Update best streak
    if (data.currentStreak > data.bestStreak) {
        data.bestStreak = data.currentStreak;
    }

    // Add to history
    data.history.push({
        date: today,
        status: 'success'
    });

    // Keep only last 35 days
    if (data.history.length > 35) {
        data.history.shift();
    }

    saveData(data);
    updateUI();

    // Celebration message
    showMessage(`🎉 Great! ${data.currentStreak} day streak!`);
};

// Log an accidental sugary drink
const logOops = () => {
    const data = getData();
    const today = getTodayDate();

    if (hasEntryToday(data)) {
        alert('⚠️ You already logged today! Check back tomorrow.');
        return;
    }

    data.currentStreak = 0; // Reset streak
    data.totalDays += 1;

    // Add to history
    data.history.push({
        date: today,
        status: 'failed'
    });

    // Keep only last 35 days
    if (data.history.length > 35) {
        data.history.shift();
    }

    saveData(data);
    updateUI();

    // Encouraging message
    showMessage(`😔 Streak reset to 0. But you got this! Start fresh today!`);
};

// Reset all data
const resetAll = () => {
    if (confirm('🚨 Are you sure? This will delete all your data and streaks!')) {
        localStorage.removeItem(STORAGE_KEY);
        updateUI();
        showMessage('🔄 All data has been reset!');
    }
};

// Update UI
const updateUI = () => {
    const data = getData();

    // Update stats
    currentStreakEl.textContent = data.currentStreak;
    bestStreakEl.textContent = data.bestStreak;
    totalDaysEl.textContent = data.totalDays;

    // Update calendar
    updateCalendar(data);
};

// Update calendar display
const updateCalendar = (data) => {
    calendarEl.innerHTML = '';

    // Create array of 35 days
    const today = new Date();
    const days = [];

    for (let i = 34; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }

    // Render days
    days.forEach(dateStr => {
        const entry = data.history.find(h => h.date === dateStr);
        const cell = document.createElement('div');
        cell.className = 'day-cell';

        if (entry) {
            if (entry.status === 'success') {
                cell.classList.add('day-success');
                cell.textContent = '✓';
            } else {
                cell.classList.add('day-failed');
                cell.textContent = '✗';
            }
        } else {
            cell.classList.add('day-empty');
            cell.textContent = '-';
        }

        calendarEl.appendChild(cell);
    });
};

// Show temporary message
const showMessage = (message) => {
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 2000);
};

// Add animation styles
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }

    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Event listeners
addDayBtn.addEventListener('click', addDay);
oopsBtn.addEventListener('click', logOops);
resetBtn.addEventListener('click', resetAll);

// Initial UI update
updateUI();