// Get elements
const currentStreakEl = document.getElementById('currentStreak');
const bestStreakEl = document.getElementById('bestStreak');
const totalDaysEl = document.getElementById('totalDays');
const addDayBtn = document.getElementById('addDayBtn');
const oopsBtn = document.getElementById('oopsBtn');
const resetBtn = document.getElementById('resetBtn');
const calendarDaysEl = document.getElementById('calendarDays');
const monthYearEl = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const monthSuccessEl = document.getElementById('monthSuccess');
const monthFailedEl = document.getElementById('monthFailed');

// Modal elements
const dateModal = document.getElementById('dateModal');
const closeModalBtn = document.getElementById('closeModal');
const modalDateEl = document.getElementById('modalDate');
const modalSuccessBtn = document.getElementById('modalSuccess');
const modalFailedBtn = document.getElementById('modalFailed');
const modalClearBtn = document.getElementById('modalClear');

// LocalStorage keys
const STORAGE_KEY = 'sugarStreak';

// Current month being displayed
let displayMonth = new Date();
let selectedDate = null;

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

// Check if entry exists for a date
const getEntryForDate = (data, dateStr) => {
    return data.history.find(entry => entry.date === dateStr);
};

// Check if entry exists for today
const hasEntryToday = (data) => {
    const today = getTodayDate();
    return getEntryForDate(data, today) !== undefined;
};

// Recalculate streak from history
const recalculateStreak = (data) => {
    if (data.history.length === 0) {
        data.currentStreak = 0;
        data.totalDays = 0;
        return;
    }

    // Sort history by date
    const sorted = [...data.history].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Find longest streak
    let bestStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].status === 'success') {
            currentStreak++;
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
            }
        } else {
            currentStreak = 0;
        }
    }

    // Calculate current streak (from today backwards)
    const today = getTodayDate();
    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const entry = getEntryForDate(data, dateStr);

        if (entry && entry.status === 'success') {
            streak++;
        } else {
            break;
        }

        checkDate.setDate(checkDate.getDate() - 1);
    }

    data.currentStreak = streak;
    data.bestStreak = bestStreak;
    data.totalDays = sorted.length;
};

// Add a sugar-free day
const addDay = () => {
    const data = getData();
    const today = getTodayDate();

    if (hasEntryToday(data)) {
        alert('⚠️ You already logged today! Check back tomorrow.');
        return;
    }

    data.history.push({
        date: today,
        status: 'success'
    });

    recalculateStreak(data);
    saveData(data);
    updateUI();

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

    data.history.push({
        date: today,
        status: 'failed'
    });

    recalculateStreak(data);
    saveData(data);
    updateUI();

    showMessage(`😔 Streak reset. But you got this! Start fresh today!`);
};

// Handle date click
const handleDateClick = (dateStr) => {
    // Don't allow clicking dates from other months
    const [year, month, day] = dateStr.split('-');
    if (parseInt(month) !== displayMonth.getMonth() + 1 || parseInt(year) !== displayMonth.getFullYear()) {
        return;
    }

    selectedDate = dateStr;
    const data = getData();
    const entry = getEntryForDate(data, dateStr);

    // Format date for display
    const dateObj = new Date(dateStr);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const displayText = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    
    modalDateEl.textContent = displayText;

    // Update button states
    modalSuccessBtn.classList.remove('selected');
    modalFailedBtn.classList.remove('selected');
    modalClearBtn.classList.remove('selected');

    if (entry) {
        if (entry.status === 'success') {
            modalSuccessBtn.classList.add('selected');
        } else {
            modalFailedBtn.classList.add('selected');
        }
    }

    dateModal.classList.add('active');
};

// Modal button handlers
const handleModalSuccess = () => {
    const data = getData();
    const entry = getEntryForDate(data, selectedDate);

    if (entry) {
        entry.status = 'success';
    } else {
        data.history.push({
            date: selectedDate,
            status: 'success'
        });
    }

    recalculateStreak(data);
    saveData(data);
    closeModal();
    updateUI();
    showMessage('✅ Marked as sugar-free!');
};

const handleModalFailed = () => {
    const data = getData();
    const entry = getEntryForDate(data, selectedDate);

    if (entry) {
        entry.status = 'failed';
    } else {
        data.history.push({
            date: selectedDate,
            status: 'failed'
        });
    }

    recalculateStreak(data);
    saveData(data);
    closeModal();
    updateUI();
    showMessage('😅 Marked as drank sugar!');
};

const handleModalClear = () => {
    const data = getData();
    data.history = data.history.filter(entry => entry.date !== selectedDate);

    recalculateStreak(data);
    saveData(data);
    closeModal();
    updateUI();
    showMessage('🗑️ Entry cleared!');
};

const closeModal = () => {
    dateModal.classList.remove('active');
    selectedDate = null;
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

// Get days in month
const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Get first day of month (0 = Sunday)
const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Format date as YYYY-MM-DD
const formatDate = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
};

// Update calendar display
const updateCalendar = (data) => {
    calendarDaysEl.innerHTML = '';

    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const daysInMonth = getDaysInMonth(displayMonth);
    const firstDay = getFirstDayOfMonth(displayMonth);

    // Update month/year header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;

    // Get today's date
    const today = getTodayDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'day-cell day-other-month';
        cell.textContent = '';
        calendarDaysEl.appendChild(cell);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(year, month, day);
        const entry = getEntryForDate(data, dateStr);

        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.dataset.date = dateStr;

        // Highlight today
        if (dateStr === today) {
            cell.classList.add('day-today');
        }

        if (entry) {
            if (entry.status === 'success') {
                cell.classList.add('day-success');
                cell.textContent = '✓';
            } else {
                cell.classList.add('day-failed');
                cell.textContent = '✗';
            }
        } else {
            cell.textContent = day;
            cell.style.color = '#999';
        }

        cell.addEventListener('click', () => handleDateClick(dateStr));
        calendarDaysEl.appendChild(cell);
    }

    // Update month stats
    updateMonthStats(data, year, month);
};

// Update month stats
const updateMonthStats = (data, year, month) => {
    const daysInMonth = getDaysInMonth(new Date(year, month));
    let success = 0;
    let failed = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDate(year, month, day);
        const entry = getEntryForDate(data, dateStr);

        if (entry) {
            if (entry.status === 'success') success++;
            else failed++;
        }
    }

    monthSuccessEl.textContent = success;
    monthFailedEl.textContent = failed;
};

// Navigate to previous month
const prevMonth = () => {
    displayMonth.setMonth(displayMonth.getMonth() - 1);
    updateUI();
};

// Navigate to next month
const nextMonth = () => {
    displayMonth.setMonth(displayMonth.getMonth() + 1);
    updateUI();
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
        z-index: 999;
        font-weight: 600;
        animation: slideDown 0.3s ease;
    `;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.animation = 'slideUpMsg 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 2000);
};

// Event listeners
addDayBtn.addEventListener('click', addDay);
oopsBtn.addEventListener('click', logOops);
resetBtn.addEventListener('click', resetAll);
prevMonthBtn.addEventListener('click', prevMonth);
nextMonthBtn.addEventListener('click', nextMonth);

// Modal event listeners
closeModalBtn.addEventListener('click', closeModal);
modalSuccessBtn.addEventListener('click', handleModalSuccess);
modalFailedBtn.addEventListener('click', handleModalFailed);
modalClearBtn.addEventListener('click', handleModalClear);

// Close modal on outside click
dateModal.addEventListener('click', (e) => {
    if (e.target === dateModal) {
        closeModal();
    }
});

// Initial UI update
updateUI();