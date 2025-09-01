#!/usr/bin/env python3
"""
Test script for AI Sleep Hygiene Scheduler API
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {data['status']} (v{data['version']})")
            return True
        else:
            print(f"❌ Health Check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check error: {e}")
        return False

def test_sleep_analysis():
    """Test sleep analysis endpoint"""
    print("\n📊 Testing Sleep Analysis...")
    try:
        response = requests.get(f"{BASE_URL}/api/sleep-analysis")
        if response.status_code == 200:
            data = response.json()
            analysis = data['analysis']
            print("✅ Sleep Analysis Results:")
            print(f"   📈 Total Records: {analysis['total_records']}")
            print(f"   😴 Average Sleep Hours: {analysis['average_sleep_hours']:.2f}")
            print(f"   🌟 Average Sleep Quality: {analysis['average_sleep_quality']:.2f}")
            print(f"   😊 Average Mood: {analysis['average_mood']:.2f}")
            print(f"   😟 Average Stress: {analysis['average_stress']:.2f}")
            print(f"   🎯 Average Productivity: {analysis['average_productivity']}")
            print(f"   👥 Gender Distribution: {analysis['gender_distribution']}")
            return True
        else:
            print(f"❌ Sleep Analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Sleep Analysis error: {e}")
        return False

def test_personalized_insights():
    """Test personalized insights endpoint"""
    print("\n🎯 Testing Personalized Insights...")
    try:
        # Test with sample data
        age = 30
        gender = "male"
        response = requests.get(f"{BASE_URL}/api/sleep-insights/{age}/{gender}")
        if response.status_code == 200:
            data = response.json()
            insights = data['insights']
            print("✅ Personalized Insights Results:")
            print(f"   👤 Profile: {age} year old {gender}")
            print(f"   😴 Average Sleep Hours: {insights['average_sleep_hours']:.2f}")
            print(f"   🌟 Average Sleep Quality: {insights['average_sleep_quality']:.2f}")
            print(f"   📊 Sample Size: {insights['sample_size']}")
            print(f"   💡 Recommendations: {len(insights['recommendations'])} suggestions")
            if insights['recommendations']:
                print(f"   📝 Sample Recommendation: {insights['recommendations'][0]}")
            return True
        else:
            print(f"❌ Personalized Insights failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Personalized Insights error: {e}")
        return False

def test_sleep_profile_analysis():
    """Test sleep profile analysis endpoint"""
    print("\n🧠 Testing Sleep Profile Analysis...")
    try:
        # Sample sleep profile
        profile_data = {
            "bedtime": "22:30",
            "wakeTime": "06:30",
            "sleepGoal": 8,
            "lifestyle": "moderate",
            "sleepIssues": ["anxiety", "screen-time"]
        }

        response = requests.post(
            f"{BASE_URL}/api/sleep-profile",
            json=profile_data,
            headers={'Content-Type': 'application/json'}
        )

        if response.status_code == 200:
            data = response.json()
            analysis = data['analysis']
            recommendations = data['recommendations']
            print("✅ Sleep Profile Analysis Results:")
            print(f"   🕐 Sleep Duration: {analysis['sleep_duration']} hours")
            print(f"   💰 Sleep Debt: {analysis['sleep_debt']} hours")
            print(f"   🔄 Circadian Alignment: {analysis['circadian_alignment']}%")
            print(f"   💡 AI Recommendations: {len(recommendations)} suggestions")
            if recommendations:
                print(f"   📝 First Recommendation: {recommendations[0]['title']}")
            return True
        else:
            print(f"❌ Sleep Profile Analysis failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Sleep Profile Analysis error: {e}")
        return False

def main():
    """Run all API tests"""
    print("🚀 AI Sleep Hygiene Scheduler API Test Suite")
    print("=" * 50)

    tests = [
        test_health_check,
        test_sleep_analysis,
        test_personalized_insights,
        test_sleep_profile_analysis
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        if test():
            passed += 1

    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")

    if passed == total:
        print("🎉 All API endpoints are working correctly!")
        print("\n🌐 Your AI Sleep Hygiene Scheduler is ready!")
        print("   Open http://localhost:5000 in your browser to use the application.")
    else:
        print("⚠️  Some tests failed. Please check the server logs for details.")

if __name__ == "__main__":
    main()
