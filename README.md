# AI Sleep Hygiene Scheduler

## Description
AI Sleep Hygiene Scheduler is a personalized sleep optimization web application powered by AI. It helps users improve their sleep quality by generating customized sleep schedules and evidence-based recommendations based on their sleep profile, lifestyle, and sleep challenges.

## Features
- **Personalized sleep schedule generation** based on user input
- **AI-driven recommendations** for sleep hygiene improvements
- **Sleep profile customization** including bedtime, wake time, sleep goal, activity level, and sleep challenges
- **Progress dashboard** to track completion rate, tasks done, high priority tasks, and day streak
- **Evidence-based sleep tips** and insights to improve sleep quality
- **Data analysis** from sleep cycle and productivity datasets
- **RESTful API backend** for data processing and analysis
- **Responsive design** with dark mode support

## How to Use

### Option 1: Frontend Only 
1. Open `index.html` in a modern web browser.
2. Fill in your sleep profile details including bedtime, wake time, sleep goal, activity level, and any sleep challenges.
3. Click the "Generate AI Schedule" button to receive personalized sleep recommendations.
4. Follow the schedule and track your progress using the dashboard.

### Option 2: Full Stack (Recommended)
1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the backend server:**
   ```bash
   python app.py
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

4. **Use the application as described above.**

## Project Structure
```
/
/app.py              - Python Flask backend server with API endpoints
/requirements.txt    - Python dependencies
/index.html          - Main web page with embedded JavaScript and styles
/sleepAI.js          - Advanced AI sleep hygiene logic (JavaScript)
/sleep_data/         - Directory containing sleep-related data files
  └── sleep_cycle_productivity.csv - Dataset with sleep and productivity data
/README.md           - This file
```

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /` - Serve the main application
- `GET /api/sleep-data` - Get raw sleep data from CSV
- `GET /api/sleep-analysis` - Get statistical analysis of sleep data
- `GET /api/sleep-insights/<age>/<gender>` - Get personalized insights
- `POST /api/sleep-profile` - Analyze user sleep profile and generate recommendations
- `GET /api/health` - Health check endpoint

## Technologies Used

### Frontend
- HTML5, CSS3
- JavaScript (ES6+)
- Font Awesome for icons

### Backend
- Python 3.8+
- Flask web framework
- Pandas for data analysis
- NumPy for numerical computations

## Data Analysis Features

The backend provides advanced data analysis capabilities:

- **Statistical Analysis**: Average sleep hours, quality scores, productivity metrics
- **Demographic Insights**: Age and gender-based sleep pattern analysis
- **Personalized Recommendations**: AI-generated sleep improvement suggestions
- **Sleep Profile Analysis**: Comprehensive analysis of user sleep patterns
- **Health Metrics**: Sleep efficiency, circadian alignment, sleep debt calculation

## Installation & Setup

1. **Clone or download the project files**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure the sleep data file exists:**
   - The `sleep_data/sleep_cycle_productivity.csv` file should be present
   - Contains sample sleep and productivity data for analysis

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Access the application:**
   - Open http://localhost:5000 in your web browser

## Development

### Adding New Features
- Frontend features can be added to `index.html` (JavaScript) or `sleepAI.js`
- Backend features should be added to `app.py` with appropriate API endpoints
- Data analysis functions should be added to the backend for better performance

### Data Format
The sleep data CSV should have the following columns:
- Age, Gender, Total Sleep Hours, Sleep Quality
- Exercise (mins/day), Caffeine Intake (mg), Screen Time Before Bed (mins)
- Work Hours (hrs/day), Productivity Score, Mood Score, Stress Level

## License
This project is open source and free to use.
