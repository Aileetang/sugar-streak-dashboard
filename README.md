# 🍬 Sugar Streak Dashboard

A mobile-friendly web app to track your sugar-free streak! Keep track of how many days you've gone without sugary drinks, with local browser storage so your data stays on your phone.

## Features

✅ **Streak Counter** - See how many consecutive days you've stayed sugar-free  
✅ **Accidental Drink Tracker** - Log when you accidentally drink something sugary (resets streak)  
✅ **Best Streak Record** - Track your personal best streak  
✅ **Daily History** - Visual calendar showing last 35 days of your progress  
✅ **Total Days Tracked** - See how many total days you've been tracking  
✅ **Local Storage** - All data saved locally on your phone, no internet needed  
✅ **Mobile Optimized** - Responsive design perfect for phone use  

## How to Use

1. Open `index.html` in your mobile browser
2. **Add Day (No Sugar)** - Click the green button to log a sugar-free day
3. **Oops (Drank Sugar)** - Click the red button if you accidentally had something sugary
4. **View History** - See your last 35 days marked as ✓ (success) or ✗ (failed)
5. **Reset** - Clear all data and start over (with confirmation)

## Data Storage

All data is saved in your phone's browser local storage:
- Current streak count
- Best streak record
- Daily history (last 35 days shown)
- Total days tracked

**Note:** Clearing browser data/cache will delete your progress.

## Installation

### Option 1: GitHub Pages (Hosted)
This repo can be deployed to GitHub Pages for easy mobile access via URL.

### Option 2: Local File
Simply download the files and open `index.html` in your mobile browser.

## Tips

💡 Only one entry per day is allowed  
💡 Streak resets to 0 if you log a sugary drink  
💡 Best streak is preserved even if current streak resets  
💡 Calendar shows last 35 days of history  
💡 Data persists between browser sessions  

## Files

- `index.html` - Main HTML structure
- `style.css` - Mobile-responsive styling
- `app.js` - Streak tracking logic and local storage
- `README.md` - This file

Enjoy tracking your sugar-free journey! 🔥