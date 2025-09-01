from flask import Flask, jsonify, request, send_from_directory, render_template
import pandas as pd
import os
import json
from datetime import datetime
import numpy as np

app = Flask(__name__)

# Path to the sleep data CSV
SLEEP_DATA_PATH = 'sleep_data/sleep_cycle_productivity.csv'

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory('.', filename)

@app.route('/api/sleep-data')
def get_sleep_data():
    """API endpoint to get sleep data from CSV"""
    try:
        if os.path.exists(SLEEP_DATA_PATH):
            df = pd.read_csv(SLEEP_DATA_PATH)
            # Convert to dictionary format
            data = df.to_dict('records')
            return jsonify({
                'success': True,
                'data': data,
                'count': len(data)
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Sleep data file not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sleep-analysis')
def get_sleep_analysis():
    """API endpoint for sleep data analysis"""
    try:
        if not os.path.exists(SLEEP_DATA_PATH):
            return jsonify({
                'success': False,
                'error': 'Sleep data file not found'
            }), 404

        df = pd.read_csv(SLEEP_DATA_PATH)

        # Basic statistical analysis
        analysis = {
            'total_records': len(df),
            'average_sleep_hours': round(df['Total Sleep Hours'].mean(), 2),
            'average_sleep_quality': round(df['Sleep Quality'].mean(), 2),
            'average_productivity': round(df['Productivity Score'].mean(), 2),
            'average_mood': round(df['Mood Score'].mean(), 2),
            'average_stress': round(df['Stress Level'].mean(), 2),
            'sleep_hours_range': {
                'min': float(df['Total Sleep Hours'].min()),
                'max': float(df['Total Sleep Hours'].max())
            },
            'gender_distribution': df['Gender'].value_counts().to_dict(),
            'age_distribution': {
                'min': int(df['Age'].min()),
                'max': int(df['Age'].max()),
                'average': round(df['Age'].mean(), 1)
            }
        }

        return jsonify({
            'success': True,
            'analysis': analysis
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sleep-insights/<int:age>/<gender>')
def get_personalized_insights(age, gender):
    """API endpoint for personalized sleep insights based on age and gender"""
    try:
        if not os.path.exists(SLEEP_DATA_PATH):
            return jsonify({
                'success': False,
                'error': 'Sleep data file not found'
            }), 404

        df = pd.read_csv(SLEEP_DATA_PATH)

        # Filter data by age range and gender
        age_range = 5
        age_filtered = df[(df['Age'] >= age - age_range) & (df['Age'] <= age + age_range)]
        if gender.lower() != 'all':
            age_filtered = age_filtered[age_filtered['Gender'].str.lower() == gender.lower()]

        if len(age_filtered) == 0:
            return jsonify({
                'success': False,
                'error': 'No data found for the specified criteria'
            }), 404

        # Generate insights
        insights = {
            'average_sleep_hours': round(age_filtered['Total Sleep Hours'].mean(), 2),
            'average_sleep_quality': round(age_filtered['Sleep Quality'].mean(), 2),
            'average_productivity': round(age_filtered['Productivity Score'].mean(), 2),
            'average_mood': round(age_filtered['Mood Score'].mean(), 2),
            'average_stress': round(age_filtered['Stress Level'].mean(), 2),
            'sample_size': len(age_filtered),
            'recommendations': generate_recommendations(age_filtered, age, gender)
        }

        return jsonify({
            'success': True,
            'insights': insights
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_recommendations(df, age, gender):
    """Generate personalized recommendations based on data analysis"""
    recommendations = []

    avg_sleep = df['Total Sleep Hours'].mean()
    avg_quality = df['Sleep Quality'].mean()
    avg_productivity = df['Productivity Score'].mean()

    # Sleep duration recommendations
    if avg_sleep < 7:
        recommendations.append("Consider aiming for 7-9 hours of sleep per night for optimal health")
    elif avg_sleep > 9:
        recommendations.append("While longer sleep can be beneficial, ensure it's quality sleep")

    # Sleep quality recommendations
    if avg_quality < 7:
        recommendations.append("Focus on improving sleep environment: cool, dark, quiet bedroom")
        recommendations.append("Establish a consistent bedtime routine")

    # Productivity correlation
    if avg_productivity > 85:
        recommendations.append("Your sleep patterns are supporting high productivity - maintain consistency")
    elif avg_productivity < 75:
        recommendations.append("Poor sleep may be affecting productivity - prioritize sleep hygiene")

    # Age-specific recommendations
    if age < 30:
        recommendations.append("Young adults often need 7-9 hours of sleep for cognitive performance")
    elif age > 50:
        recommendations.append("Older adults may need consistent sleep timing for better health")

    return recommendations

@app.route('/api/sleep-profile', methods=['POST'])
def analyze_sleep_profile():
    """API endpoint to analyze a user's sleep profile"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'error': 'No profile data provided'
            }), 400

        # Extract profile data
        profile = {
            'bedtime': data.get('bedtime', '22:00'),
            'wakeTime': data.get('wakeTime', '06:00'),
            'sleepGoal': data.get('sleepGoal', 8),
            'lifestyle': data.get('lifestyle', 'moderate'),
            'sleepIssues': data.get('sleepIssues', [])
        }

        # Calculate sleep metrics
        analysis = calculate_sleep_metrics(profile)

        # Generate AI recommendations
        recommendations = generate_ai_recommendations(profile, analysis)

        return jsonify({
            'success': True,
            'profile': profile,
            'analysis': analysis,
            'recommendations': recommendations
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def calculate_sleep_metrics(profile):
    """Calculate sleep metrics from profile"""
    bedtime = profile['bedtime']
    wake_time = profile['wakeTime']
    sleep_goal = profile['sleepGoal']

    # Parse times
    bedtime_hour = int(bedtime.split(':')[0])
    wake_hour = int(wake_time.split(':')[0])

    # Calculate sleep duration
    if wake_hour < bedtime_hour:
        sleep_duration = (24 - bedtime_hour) + wake_hour
    else:
        sleep_duration = wake_hour - bedtime_hour

    # Calculate sleep debt
    sleep_debt = max(0, sleep_goal - sleep_duration)

    return {
        'sleep_duration': sleep_duration,
        'sleep_debt': sleep_debt,
        'sleep_efficiency': min(100, (sleep_duration / sleep_goal) * 100),
        'circadian_alignment': calculate_circadian_alignment(bedtime_hour, wake_hour)
    }

def calculate_circadian_alignment(bedtime_hour, wake_hour):
    """Calculate circadian rhythm alignment score"""
    # Optimal sleep window is typically 10 PM - 6 AM
    optimal_bedtime = 22
    optimal_wake = 6

    bedtime_score = max(0, 100 - abs(bedtime_hour - optimal_bedtime) * 10)
    wake_score = max(0, 100 - abs(wake_hour - optimal_wake) * 10)

    return round((bedtime_score + wake_score) / 2)

def generate_ai_recommendations(profile, analysis):
    """Generate AI-powered sleep recommendations"""
    recommendations = []

    # Base recommendations
    recommendations.append({
        'id': 'wind-down',
        'title': 'Wind-down Routine',
        'description': 'Begin relaxing activities 1-2 hours before bed',
        'time': calculate_time_offset(profile['bedtime'], -2, 0),
        'priority': 'high',
        'category': 'routine'
    })

    recommendations.append({
        'id': 'screen-cutoff',
        'title': 'Digital Sunset',
        'description': 'Turn off screens and blue light devices',
        'time': calculate_time_offset(profile['bedtime'], -1, 0),
        'priority': 'high',
        'category': 'environment'
    })

    # Issue-specific recommendations
    for issue in profile['sleepIssues']:
        if issue == 'anxiety':
            recommendations.append({
                'id': 'anxiety-relief',
                'title': 'Anxiety Management',
                'description': 'Practice deep breathing or meditation',
                'time': calculate_time_offset(profile['bedtime'], -1, 30),
                'priority': 'high',
                'category': 'mental-health'
            })
        elif issue == 'temperature':
            recommendations.append({
                'id': 'temperature-control',
                'title': 'Temperature Optimization',
                'description': 'Set bedroom to 65-68°F',
                'time': calculate_time_offset(profile['bedtime'], -1, 0),
                'priority': 'high',
                'category': 'environment'
            })

    return recommendations

def calculate_time_offset(base_time, hour_offset, minute_offset):
    """Calculate time with offset"""
    hour = int(base_time.split(':')[0]) + hour_offset
    minute = int(base_time.split(':')[1]) + minute_offset

    # Handle hour overflow
    while hour >= 24:
        hour -= 24
    while hour < 0:
        hour += 24

    # Handle minute overflow
    if minute >= 60:
        hour += 1
        minute -= 60
    if minute < 0:
        hour -= 1
        minute += 60

    return f"{hour:02d}:{minute:02d}"

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("🚀 Starting AI Sleep Hygiene Scheduler Backend...")
    print("📊 Loading sleep data...")
    print("🌙 Backend ready! Open http://localhost:5000 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000)
