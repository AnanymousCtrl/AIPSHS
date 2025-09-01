/**
 * SLEEP HYGIENE AI MODEL
 * Advanced AI system for personalized sleep optimization
 * 
 * Features:
 * - Circadian rhythm analysis
 * - Behavioral pattern recognition
 * - Evidence-based recommendations
 * - Adaptive scheduling algorithms
 * - Sleep debt calculation
 * - Environmental optimization
 */

class SleepHygieneAI {
    constructor() {
        this.version = "2.0.0";
        this.recommendations = new Map();
        this.userProfile = null;
        this.sleepPatterns = [];
        this.evidenceBase = this.initializeEvidenceBase();
        this.personalityFactors = new Map();
        
        console.log(`Sleep Hygiene AI v${this.version} initialized`);
    }

    /**
     * Initialize evidence-based sleep science knowledge base
     */
    initializeEvidenceBase() {
        return {
            circadianOptimalWindow: { start: 22, end: 6 },
            caffeineHalfLife: 6, // hours
            exerciseImpactWindow: 4, // hours before bed
            lightExposureThreshold: 10000, // lux for morning
            temperatureOptimal: { min: 65, max: 68 }, // Fahrenheit
            screenBlueLight: { cutoff: 1 }, // hours before bed
            melatoninOnset: 2, // hours before sleep
            sleepDebtThreshold: 1, // hours below goal
            windDownDuration: { min: 60, max: 120 }, // minutes
            hydrationCutoff: 2 // hours before bed
        };
    }

    /**
     * Main AI analysis engine - processes user profile and generates recommendations
     */
    analyzeProfile(profile) {
        console.log('AI analyzing sleep profile...', profile);
        
        this.userProfile = profile;
        const sleepMetrics = this.calculateSleepMetrics(profile);
        const recommendations = [];
        
        // Core recommendation generation
        recommendations.push(...this.generateCoreRecommendations(profile, sleepMetrics));
        recommendations.push(...this.generatePersonalizedRecommendations(profile, sleepMetrics));
        recommendations.push(...this.generateCircadianOptimization(profile, sleepMetrics));
        recommendations.push(...this.generateEnvironmentalRecommendations(profile));
        
        // AI-driven prioritization and scheduling
        const optimizedSchedule = this.optimizeSchedule(recommendations, sleepMetrics);
        
        console.log(`AI generated ${optimizedSchedule.length} personalized recommendations`);
        return optimizedSchedule;
    }

    /**
     * Calculate comprehensive sleep metrics
     */
    calculateSleepMetrics(profile) {
        const bedtime = this.parseTime(profile.bedtime);
        const wakeTime = this.parseTime(profile.wakeTime);
        
        // Calculate sleep opportunity window
        const sleepDuration = wakeTime.decimal < bedtime.decimal ? 
            (24 - bedtime.decimal) + wakeTime.decimal : 
            wakeTime.decimal - bedtime.decimal;
        
        // Calculate sleep debt
        const sleepDebt = Math.max(0, profile.sleepGoal - sleepDuration);
        
        // Circadian alignment score
        const circadianScore = this.calculateCircadianAlignment(bedtime.hour, wakeTime.hour);
        
        // Sleep efficiency prediction
        const sleepEfficiency = this.predictSleepEfficiency(profile);
        
        return {
            bedtime,
            wakeTime,
            sleepDuration,
            sleepDebt,
            circadianScore,
            sleepEfficiency,
            optimalBedtime: this.calculateOptimalBedtime(profile),
            chronotype: this.detectChronotype(bedtime.hour, wakeTime.hour)
        };
    }

    /**
     * Parse time string into useful formats
     */
    parseTime(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return {
            hour: hours,
            minute: minutes,
            decimal: hours + (minutes / 60),
            formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        };
    }

    /**
     * Generate core evidence-based recommendations
     */
    generateCoreRecommendations(profile, metrics) {
        const recommendations = [];
        const bedtimeHour = metrics.bedtime.hour;
        const wakeHour = metrics.wakeTime.hour;

        // Wind-down routine (critical for sleep onset)
        recommendations.push({
            id: 'wind-down-start',
            title: 'Begin Wind-Down Ritual',
            description: 'Start calming activities: dim lights, gentle music, reading',
            time: this.calculateOptimalTime(bedtimeHour, -2, 0),
            priority: this.calculatePriority('high', profile.sleepIssues),
            category: 'routine',
            icon: 'fas fa-leaf',
            evidenceBased: true,
            aiReasoning: 'Wind-down period activates parasympathetic nervous system'
        });

        // Screen cutoff (blue light impact)
        const screenCutoff = profile.sleepIssues.includes('racing-thoughts') ? 2 : 1;
        recommendations.push({
            id: 'digital-sunset',
            title: 'Digital Sunset',
            description: `Turn off all screens and blue light devices`,
            time: this.calculateOptimalTime(bedtimeHour, -screenCutoff, 0),
            priority: 'high',
            category: 'environment',
            icon: 'fas fa-mobile-alt',
            evidenceBased: true,
            aiReasoning: `Blue light suppresses melatonin production for ${screenCutoff} hours`
        });

        // Morning light exposure (circadian entrainment)
        recommendations.push({
            id: 'morning-light-therapy',
            title: 'Circadian Light Exposure',
            description: 'Get 10-15 minutes of bright light within 30 minutes of waking',
            time: this.calculateOptimalTime(wakeHour, 0, 15),
            priority: 'high',
            category: 'circadian',
            icon: 'fas fa-sun',
            evidenceBased: true,
            aiReasoning: 'Light exposure anchors circadian rhythm and improves sleep quality'
        });

        return recommendations;
    }

    /**
     * Generate personalized recommendations based on user issues and lifestyle
     */
    generatePersonalizedRecommendations(profile, metrics) {
        const recommendations = [];
        const bedtimeHour = metrics.bedtime.hour;

        // Lifestyle-based recommendations
        switch(profile.lifestyle) {
            case 'active':
                recommendations.push({
                    id: 'exercise-optimization',
                    title: 'Exercise Timing Window',
                    description: 'Complete intense workouts 4+ hours before bed to allow core temperature to drop',
                    time: this.calculateOptimalTime(bedtimeHour, -4, 0),
                    priority: 'medium',
                    category: 'lifestyle',
                    icon: 'fas fa-dumbbell',
                    aiReasoning: 'Exercise raises core body temperature; cooling period needed for sleep onset'
                });
                
                recommendations.push({
                    id: 'post-workout-nutrition',
                    title: 'Post-Workout Recovery',
                    description: 'Hydrate and eat protein within 2 hours of exercise',
                    time: this.calculateOptimalTime(bedtimeHour, -2, 0),
                    priority: 'low',
                    category: 'nutrition',
                    icon: 'fas fa-apple-alt',
                    aiReasoning: 'Proper recovery nutrition supports muscle repair during sleep'
                });
                break;

            case 'sedentary':
                recommendations.push({
                    id: 'gentle-movement',
                    title: 'Evening Movement',
                    description: 'Take a 10-15 minute gentle walk or do light stretching',
                    time: this.calculateOptimalTime(bedtimeHour, -2, 30),
                    priority: 'medium',
                    category: 'lifestyle',
                    icon: 'fas fa-walking',
                    aiReasoning: 'Light movement promotes better circulation and sleep quality'
                });
                break;
        }

        // Issue-specific AI recommendations
        profile.sleepIssues.forEach(issue => {
            const issueRecs = this.generateIssueSpecificRecommendations(issue, bedtimeHour, profile);
            recommendations.push(...issueRecs);
        });

        return recommendations;
    }

    /**
     * Generate issue-specific recommendations using AI logic
     */
    generateIssueSpecificRecommendations(issue, bedtimeHour, profile) {
        const recommendations = [];

        switch(issue) {
            case 'anxiety':
                recommendations.push({
                    id: 'anxiety-management',
                    title: 'Anxiety Reduction Protocol',
                    description: 'Practice 4-7-8 breathing or progressive muscle relaxation',
                    time: this.calculateOptimalTime(bedtimeHour, -1, 15),
                    priority: 'high',
                    category: 'mental-health',
                    icon: 'fas fa-heart',
                    aiReasoning: 'Activates parasympathetic nervous system, reduces cortisol'
                });

                recommendations.push({
                    id: 'worry-journal',
                    title: 'Thought Download',
                    description: 'Write down worries and tomorrow\'s tasks to clear mental space',
                    time: this.calculateOptimalTime(bedtimeHour, -1, 45),
                    priority: 'medium',
                    category: 'mental-health',
                    icon: 'fas fa-edit',
                    aiReasoning: 'Externalization of thoughts reduces cognitive load'
                });
                break;

            case 'temperature':
                recommendations.push({
                    id: 'thermal-regulation',
                    title: 'Temperature Optimization',
                    description: 'Set room to 65-68°F, use breathable bedding, consider cooling mattress pad',
                    time: this.calculateOptimalTime(bedtimeHour, -1, 0),
                    priority: 'high',
                    category: 'environment',
                    icon: 'fas fa-thermometer-half',
                    aiReasoning: 'Core temperature drop signals sleep onset; cool environment facilitates this'
                });

                recommendations.push({
                    id: 'warm-bath',
                    title: 'Thermal Contrast Therapy',
                    description: 'Take warm bath/shower 90 minutes before bed',
                    time: this.calculateOptimalTime(bedtimeHour, -1, 30),
                    priority: 'medium',
                    category: 'routine',
                    icon: 'fas fa-bath',
                    aiReasoning: 'Warming then cooling effect enhances natural temperature drop'
                });
                break;

            case 'noise':
                recommendations.push({
                    id: 'acoustic-environment',
                    title: 'Sound Environment Setup',
                    description: 'Use white noise, earplugs, or noise-canceling devices',
                    time: this.calculateOptimalTime(bedtimeHour, 0, 30),
                    priority: 'medium',
                    category: 'environment',
                    icon: 'fas fa-volume-mute',
                    aiReasoning: 'Consistent sound masks disruptive noise variations'
                });
                break;

            case 'racing-thoughts':
                recommendations.push({
                    id: 'cognitive-clearing',
                    title: 'Mind Quieting Protocol',
                    description: 'Practice mindfulness meditation or guided imagery',
                    time: this.calculateOptimalTime(bedtimeHour, -1, 30),
                    priority: 'high',
                    category: 'mental-health',
                    icon: 'fas fa-brain',
                    aiReasoning: 'Meditation reduces default mode network activity, calming racing thoughts'
                });

                recommendations.push({
                    id: 'brain-dump',
                    title: 'Mental Declutter',
                    description: 'Write stream-of-consciousness for 10 minutes to clear mental chatter',
                    time: this.calculateOptimalTime(bedtimeHour, -2, 0),
                    priority: 'medium',
                    category: 'mental-health',
                    icon: 'fas fa-pen',
                    aiReasoning: 'Expressive writing reduces intrusive thoughts and mental rumination'
                });
                break;

            case 'caffeine':
                const sensitiveCutoff = 8; // More conservative for sensitive individuals
                recommendations.push({
                    id: 'caffeine-sensitive-cutoff',
                    title: 'Caffeine Restriction (Sensitive)',
                    description: 'Last caffeinated beverage - you have caffeine sensitivity',
                    time: this.calculateOptimalTime(bedtimeHour, -sensitiveCutoff, 0),
                    priority: 'high',
                    category: 'nutrition',
                    icon: 'fas fa-coffee',
                    aiReasoning: `Caffeine has 6-8 hour half-life; sensitive individuals need longer clearance`
                });
                break;
        }

        return recommendations;
    }

    /**
     * Generate circadian rhythm optimization recommendations
     */
    generateCircadianOptimization(profile, metrics) {
        const recommendations = [];
        const bedtimeHour = metrics.bedtime.hour;

        // Meal timing optimization
        recommendations.push({
            id: 'circadian-nutrition',
            title: 'Circadian Nutrition Timing',
            description: 'Finish large meals 3 hours before bed to aid digestion',
            time: this.calculateOptimalTime(bedtimeHour, -3, 0),
            priority: 'medium',
            category: 'nutrition',
            icon: 'fas fa-utensils',
            aiReasoning: 'Late eating disrupts circadian clocks in digestive organs'
        });

        // Standard caffeine cutoff (if not caffeine sensitive)
        if (!profile.sleepIssues.includes('caffeine')) {
            const standardCutoff = Math.max(14, bedtimeHour - 6);
            recommendations.push({
                id: 'standard-caffeine-cutoff',
                title: 'Caffeine Management',
                description: 'Last chance for coffee/tea to avoid sleep disruption',
                time: this.calculateOptimalTime(standardCutoff, 0, 0),
                priority: 'medium',
                category: 'nutrition',
                icon: 'fas fa-coffee',
                aiReasoning: 'Caffeine blocks adenosine receptors for 6+ hours'
            });
        }

        // Hydration management
        recommendations.push({
            id: 'hydration-strategy',
            title: 'Strategic Hydration',
            description: 'Reduce fluid intake to minimize sleep disruptions',
            time: this.calculateOptimalTime(bedtimeHour, -2, 0),
            priority: 'low',
            category: 'nutrition',
            icon: 'fas fa-tint',
            aiReasoning: 'Reduces nocturia while maintaining adequate hydration'
        });

        // Light exposure optimization
        if (metrics.circadianScore < 80) {
            recommendations.push({
                id: 'evening-light-management',
                title: 'Circadian Light Protocol',
                description: 'Use warm light (<2700K) and dim gradually 2 hours before bed',
                time: this.calculateOptimalTime(bedtimeHour, -2, 0),
                priority: 'high',
                category: 'circadian',
                icon: 'fas fa-lightbulb',
                aiReasoning: 'Gradual light reduction supports natural melatonin production'
            });
        }

        return recommendations;
    }

    /**
     * Generate environmental optimization recommendations
     */
    generateEnvironmentalRecommendations(profile) {
        const recommendations = [];
        const bedtimeHour = parseInt(profile.bedtime.split(':')[0]);

        // Bedroom environment setup
        recommendations.push({
            id: 'sleep-sanctuary',
            title: 'Sleep Sanctuary Setup',
            description: 'Optimize bedroom: cool, dark, quiet, comfortable',
            time: this.calculateOptimalTime(bedtimeHour, -1, 0),
            priority: 'medium',
            category: 'environment',
            icon: 'fas fa-bed',
            aiReasoning: 'Environmental cues signal brain to prepare for sleep'
        });

        // Air quality optimization
        if (profile.sleepIssues.includes('temperature') || profile.lifestyle === 'active') {
            recommendations.push({
                id: 'air-circulation',
                title: 'Air Quality Enhancement',
                description: 'Ensure good ventilation or use air purifier for optimal breathing',
                time: this.calculateOptimalTime(bedtimeHour, -1, 30),
                priority: 'low',
                category: 'environment',
                icon: 'fas fa-wind',
                aiReasoning: 'Good air quality reduces sleep fragmentation and improves recovery'
            });
        }

        return recommendations;
    }

    /**
     * Advanced sleep debt and duration analysis
     */
    analyzeSleepDebt(metrics, profile) {
        const analysis = {
            currentDuration: metrics.sleepDuration,
            goalDuration: profile.sleepGoal,
            debt: metrics.sleepDebt,
            recommendation: '',
            severity: 'none'
        };

        if (metrics.sleepDebt > 0) {
            if (metrics.sleepDebt >= 2) {
                analysis.severity = 'severe';
                analysis.recommendation = 'Consider significantly earlier bedtime or later wake time';
            } else if (metrics.sleepDebt >= 1) {
                analysis.severity = 'moderate';
                analysis.recommendation = 'Adjust schedule to gain 1 hour of sleep';
            } else {
                analysis.severity = 'mild';
                analysis.recommendation = 'Minor schedule adjustment recommended';
            }
        } else {
            analysis.recommendation = 'Sleep duration meets your goal!';
        }

        return analysis;
    }

    /**
     * Calculate circadian rhythm alignment score
     */
    calculateCircadianAlignment(bedtimeHour, wakeHour) {
        let score = 100;
        const optimal = this.evidenceBase.circadianOptimalWindow;

        // Bedtime alignment
        if (bedtimeHour > optimal.start + 1) score -= 15;
        if (bedtimeHour < optimal.start - 1) score -= 10;
        if (bedtimeHour > 24 || bedtimeHour < 20) score -= 25;

        // Wake time alignment
        if (wakeHour > optimal.end + 2) score -= 15;
        if (wakeHour < optimal.end - 1) score -= 10;

        // Consistency bonus (would require historical data)
        // For now, assume some consistency
        score += 5;

        return Math.max(0, Math.min(100, score));
    }

    /**
     * Predict sleep efficiency based on profile factors
     */
    predictSleepEfficiency(profile) {
        let efficiency = 85; // Base efficiency percentage

        // Positive factors
        if (profile.lifestyle === 'active') efficiency += 5;
        if (profile.sleepIssues.length === 0) efficiency += 10;

        // Negative factors
        if (profile.sleepIssues.includes('anxiety')) efficiency -= 15;
        if (profile.sleepIssues.includes('racing-thoughts')) efficiency -= 10;
        if (profile.sleepIssues.includes('temperature')) efficiency -= 8;
        if (profile.sleepIssues.includes('noise')) efficiency -= 12;
        if (profile.sleepIssues.includes('caffeine')) efficiency -= 5;

        return Math.max(60, Math.min(95, efficiency));
    }

    /**
     * Detect chronotype based on sleep preferences
     */
    detectChronotype(bedtimeHour, wakeHour) {
        if (bedtimeHour <= 21 && wakeHour <= 6) return 'early-bird';
        if (bedtimeHour >= 23 && wakeHour >= 8) return 'night-owl';
        return 'intermediate';
    }

    /**
     * Calculate optimal bedtime based on wake time and sleep goal
     */
    calculateOptimalBedtime(profile) {
        const wakeTime = this.parseTime(profile.wakeTime);
        const sleepNeed = profile.sleepGoal + 0.5; // Add buffer for sleep onset
        
        let optimalBedtime = wakeTime.decimal - sleepNeed;
        if (optimalBedtime < 0) optimalBedtime += 24;
        
        const hour = Math.floor(optimalBedtime);
        const minute = Math.round((optimalBedtime - hour) * 60);
        
        return this.formatTime(hour, minute);
    }

    /**
     * Advanced priority calculation using AI weightings
     */
    calculatePriority(basePriority, sleepIssues) {
        const weights = {
            'anxiety': 1.2,
            'racing-thoughts': 1.1,
            'temperature': 1.0,
            'noise': 0.9,
            'caffeine': 0.8
        };

        let priorityScore = basePriority === 'high' ? 3 : basePriority === 'medium' ? 2 : 1;
        
        // Adjust based on sleep issues
        sleepIssues.forEach(issue => {
            if (weights[issue]) {
                priorityScore *= weights[issue];
            }
        });

        if (priorityScore >= 3.5) return 'critical';
        if (priorityScore >= 2.5) return 'high';
        if (priorityScore >= 1.5) return 'medium';
        return 'low';
    }

    /**
     * AI-driven schedule optimization
     */
    optimizeSchedule(recommendations, metrics) {
        // Remove conflicts and optimize timing
        const optimized = this.resolveTimeConflicts(recommendations);
        
        // Sort by AI-calculated importance and timing
        return optimized.sort((a, b) => {
            const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
            
            // Primary sort: priority
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            
            // Secondary sort: time (earlier first)
            if (a.time !== 'flexible' && b.time !== 'flexible') {
                return a.time.localeCompare(b.time);
            }
            
            // Tertiary sort: evidence-based recommendations first
            if (a.evidenceBased && !b.evidenceBased) return -1;
            if (!a.evidenceBased && b.evidenceBased) return 1;
            
            return 0;
        });
    }

    /**
     * Resolve timing conflicts between recommendations
     */
    resolveTimeConflicts(recommendations) {
        const timeSlots = new Map();
        const resolved = [];

        recommendations.forEach(rec => {
            if (rec.time === 'flexible') {
                resolved.push(rec);
                return;
            }

            const timeKey = rec.time;
            if (timeSlots.has(timeKey)) {
                // Conflict detected - adjust timing
                const conflicting = timeSlots.get(timeKey);
                const adjustedTime = this.adjustTimeForConflict(rec.time, rec.category);
                rec.time = adjustedTime;
                rec.description += ' (AI-adjusted timing to avoid conflicts)';
            }
            
            timeSlots.set(rec.time, rec);
            resolved.push(rec);
        });

        return resolved;
    }

    /**
     * Adjust timing to resolve conflicts
     */
    adjustTimeForConflict(originalTime, category) {
        const [hours, minutes] = originalTime.split(':').map(Number);
        
        // Different categories get different adjustment strategies
        const adjustmentMap = {
            'routine': -15, // 15 minutes earlier
            'environment': -30, // 30 minutes earlier
            'nutrition': 15, // 15 minutes later
            'mental-health': -10, // 10 minutes earlier
            'lifestyle': 30 // 30 minutes later
        };

        const adjustment = adjustmentMap[category] || -15;
        const newMinutes = minutes + adjustment;
        const adjustedHour = newMinutes >= 60 ? hours + 1 : newMinutes < 0 ? hours - 1 : hours;
        const adjustedMinutes = newMinutes >= 60 ? newMinutes - 60 : newMinutes < 0 ? newMinutes + 60 : newMinutes;

        return this.formatTime(adjustedHour, adjustedMinutes);
    }

    /**
     * Generate comprehensive AI insights
     */
    generateInsights(profile, recommendations) {
        const metrics = this.calculateSleepMetrics(profile);
        const sleepDebtAnalysis = this.analyzeSleepDebt(metrics, profile);
        const circadianHealth = this.assessCircadianHealth(metrics);
        const riskFactors = this.identifyRiskFactors(profile, metrics);
        const optimizations = this.suggestOptimizations(profile, metrics);

        return {
            sleepAnalysis: this.generateSleepAnalysisText(sleepDebtAnalysis, metrics),
            aiStatus: `AI analyzed ${profile.sleepIssues.length} sleep challenges and generated ${recommendations.length} evidence-based recommendations across ${new Set(recommendations.map(r => r.category)).size} optimization categories.`,
            circadianHealth: circadianHealth,
            riskFactors: riskFactors,
            optimizations: optimizations,
            sleepEfficiency: metrics.sleepEfficiency,
            chronotype: metrics.chronotype
        };
    }

    /**
     * Generate detailed sleep analysis text
     */
    generateSleepAnalysisText(sleepDebtAnalysis, metrics) {
        let analysis = `Sleep Duration: ${metrics.sleepDuration.toFixed(1)} hours (Goal: ${this.userProfile.sleepGoal}h). `;
        
        if (sleepDebtAnalysis.debt > 0) {
            analysis += `Sleep debt of ${sleepDebtAnalysis.debt.toFixed(1)} hours detected. ${sleepDebtAnalysis.recommendation}`;
        } else {
            analysis += `Excellent duration! Predicted sleep efficiency: ${metrics.sleepEfficiency}%.`;
        }

        analysis += ` Chronotype: ${metrics.chronotype.replace('-', ' ')}.`;
        
        return analysis;
    }

    /**
     * Assess circadian rhythm health
     */
    assessCircadianHealth(metrics) {
        const score = metrics.circadianScore;
        let feedback = '';
        let recommendations = [];

        if (score >= 90) {
            feedback = 'Excellent circadian alignment! Your sleep timing is optimal.';
        } else if (score >= 75) {
            feedback = 'Good circadian health with minor room for improvement.';
            recommendations.push('Consider slightly earlier bedtime for optimal alignment');
        } else if (score >= 60) {
            feedback = 'Moderate circadian alignment. Schedule adjustments recommended.';
            recommendations.push('Shift sleep window closer to natural circadian preferences');
        } else {
            feedback = 'Poor circadian alignment detected. Significant schedule changes needed.';
            recommendations.push('Consider consulting a sleep specialist for circadian rhythm disorders');
        }

        return {
            score: Math.round(score),
            feedback: feedback,
            recommendations: recommendations,
            chronotypeMatch: this.assessChronotypeMatch(metrics)
        };
    }

    /**
     * Assess how well current schedule matches chronotype
     */
    assessChronotypeMatch(metrics) {
        const chronotype = metrics.chronotype;
        const bedtimeHour = metrics.bedtime.hour;
        
        const matches = {
            'early-bird': bedtimeHour <= 22,
            'night-owl': bedtimeHour >= 23,
            'intermediate': bedtimeHour >= 21 && bedtimeHour <= 23
        };

        return {
            isMatched: matches[chronotype],
            suggestion: matches[chronotype] ? 
                'Schedule aligns well with your natural chronotype' :
                'Consider adjusting schedule to better match your chronotype'
        };
    }

    /**
     * Identify sleep risk factors using AI analysis
     */
    identifyRiskFactors(profile, metrics) {
        const risks = [];
        
        // Duration-based risks
        if (metrics.sleepDuration < 7) {
            risks.push({
                factor: 'Insufficient Sleep Duration',
                severity: 'high',
                impact: 'Cognitive performance, immune function, mood regulation'
            });
        }

        // Multiple issue complexity
        if (profile.sleepIssues.length > 2) {
            risks.push({
                factor: 'Multiple Sleep Challenges',
                severity: 'medium',
                impact: 'Compounding effects may require professional intervention'
            });
        }

        // Circadian misalignment
        if (metrics.circadianScore < 60) {
            risks.push({
                factor: 'Circadian Rhythm Disruption',
                severity: 'medium',
                impact: 'Hormone regulation, metabolism, cardiovascular health'
            });
        }

        // Late bedtime risks
        if (metrics.bedtime.hour > 23) {
            risks.push({
                factor: 'Late Bedtime Pattern',
                severity: 'low',
                impact: 'May conflict with natural circadian preferences'
            });
        }

        // Sleep efficiency prediction
        if (metrics.sleepEfficiency < 75) {
            risks.push({
                factor: 'Predicted Low Sleep Efficiency',
                severity: 'medium',
                impact: 'Frequent awakenings, non-restorative sleep'
            });
        }

        return risks;
    }

    /**
     * Suggest schedule optimizations
     */
    suggestOptimizations(profile, metrics) {
        const optimizations = [];

        // Sleep timing optimization
        if (metrics.sleepDebt > 0.5) {
            const optimalBedtime = metrics.optimalBedtime;
            optimizations.push({
                type: 'timing',
                suggestion: `Consider moving bedtime to ${optimalBedtime} for optimal sleep duration`,
                benefit: `Would eliminate ${metrics.sleepDebt.toFixed(1)} hour sleep debt`
            });
        }

        // Chronotype alignment
        const chronotypeMatch = this.assessChronotypeMatch(metrics);
        if (!chronotypeMatch.isMatched) {
            optimizations.push({
                type: 'chronotype',
                suggestion: chronotypeMatch.suggestion,
                benefit: 'Improved sleep quality and daytime alertness'
            });
        }

        // Environmental optimization
        if (profile.sleepIssues.length > 0) {
            optimizations.push({
                type: 'environment',
                suggestion: 'Address identified sleep challenges through environmental modifications',
                benefit: `Could improve sleep efficiency by 10-20%`
            });
        }

        return optimizations;
    }

    /**
     * Utility function to calculate optimal timing
     */
    calculateOptimalTime(baseHour, hourOffset, minuteOffset) {
        let hour = baseHour + hourOffset;
        let minute = minuteOffset;

        // Handle hour overflow/underflow
        while (hour >= 24) hour -= 24;
        while (hour < 0) hour += 24;

        return this.formatTime(hour, minute);
    }

    /**
     * Format time to HH:MM string
     */
    formatTime(hour, minute) {
        // Ensure valid time values
        while (hour >= 24) hour -= 24;
        while (hour < 0) hour += 24;
        while (minute >= 60) {
            minute -= 60;
            hour += 1;
        }
        while (minute < 0) {
            minute += 60;
            hour -= 1;
        }

        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    /**
     * Advanced sleep pattern analysis (for future enhancement)
     */
    analyzePatterns(historicalData) {
        // This would analyze historical sleep data to identify patterns
        // For now, return basic pattern analysis
        return {
            consistency: 'moderate',
            trends: ['improving'],
            recommendations: ['maintain current schedule']
        };
    }

    /**
     * Generate sleep hygiene score
     */
    calculateSleepHygieneScore(profile, completedTasks, totalTasks) {
        let baseScore = (completedTasks / Math.max(1, totalTasks)) * 100;
        
        // Adjust based on sleep factors
        const metrics = this.calculateSleepMetrics(profile);
        
        // Duration factor
        if (metrics.sleepDebt === 0) baseScore += 5;
        if (metrics.sleepDebt > 1) baseScore -= 10;
        
        // Circadian factor
        baseScore += (metrics.circadianScore - 50) * 0.2;
        
        // Issue complexity penalty
        baseScore -= profile.sleepIssues.length * 2;
        
        return Math.max(0, Math.min(100, Math.round(baseScore)));
    }

    /**
     * Generate personalized sleep tips based on AI analysis
     */
    generatePersonalizedTips(profile, metrics) {
        const tips = [];

        // Chronotype-specific tips
        switch(metrics.chronotype) {
            case 'early-bird':
                tips.push('Your early chronotype is well-suited for morning productivity');
                break;
            case 'night-owl':
                tips.push('Consider gradually shifting bedtime earlier in 15-minute increments');
                break;
            case 'intermediate':
                tips.push('You have flexibility in sleep timing - focus on consistency');
                break;
        }

        // Lifestyle-specific tips
        if (profile.lifestyle === 'active') {
            tips.push('Your active lifestyle supports better sleep - maintain exercise routine');
        }

        // Issue-specific tips
        if (profile.sleepIssues.includes('anxiety')) {
            tips.push('Consider incorporating meditation or relaxation techniques');
        }

        return tips;
    }

    /**
     * Export AI model state for debugging/analysis
     */
    exportModelState() {
        return {
            version: this.version,
            userProfile: this.userProfile,
            recommendations: Array.from(this.recommendations.entries()),
            evidenceBase: this.evidenceBase,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * AI learning simulation (placeholder for future ML integration)
     */
    learn(userFeedback, outcomes) {
        // This would implement machine learning to improve recommendations
        // Based on user feedback and sleep outcome data
        console.log('AI learning from user feedback:', userFeedback);
        
        // For now, simulate learning by adjusting recommendation weights
        if (outcomes && outcomes.sleepQuality > 8) {
            console.log('Positive outcome detected - reinforcing current strategy');
        }
    }

    /**
     * Generate sleep report for tracking progress
     */
    generateSleepReport(profile, completedTasks, historicalData = []) {
        const metrics = this.calculateSleepMetrics(profile);
        const insights = this.generateInsights(profile, []);
        
        return {
            date: new Date().toDateString(),
            sleepScore: this.calculateSleepHygieneScore(profile, completedTasks.size, 10),
            metrics: metrics,
            insights: insights,
            completionRate: (completedTasks.size / 10) * 100,
            recommendations: insights.optimizations
        };
    }
}

/**
 * SLEEP SCHEDULER APPLICATION CLASS
 * Main application controller that integrates the AI model
 */
class SleepSchedulerApp {
    constructor() {
        this.ai = new SleepHygieneAI();
        this.completedTasks = new Set();
        this.currentSchedule = [];
        this.userHistory = [];
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        console.log('Initializing Sleep Scheduler App...');
        this.bindEvents();
        this.loadUserData();
        // Schedule will only generate when user clicks the button
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Generate schedule button - ONLY trigger schedule generation on button click
        const generateBtn = document.getElementById('generateSchedule');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateSchedule());
        }

        // Reset button
        const resetBtn = document.getElementById('resetButton');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAllData());
        }

        // Profile form events - NO automatic schedule generation
        // Users can change form values without triggering schedule generation
        // Schedule will only be generated when they click the button
    }

    /**
     * Load user data from memory (simulated persistence)
     */
    loadUserData() {
        // In a real app, this would load from a database
        // For now, we'll use default values
        console.log('Loading user preferences...');
    }

    /**
     * Save user data (simulated persistence)
     */
    saveUserData() {
        const userData = {
            profile: this.getUserProfile(),
            completedTasks: Array.from(this.completedTasks),
            lastUpdated: new Date().toISOString()
        };
        console.log('Saving user data:', userData);
    }

    /**
     * Get current user profile from form
     */
    getUserProfile() {
        const sleepIssues = Array.from(document.querySelectorAll('input[name="sleepIssues"]:checked'))
            .map(cb => cb.value);

        return {
            bedtime: document.getElementById('bedtime')?.value || '22:00',
            wakeTime: document.getElementById('wakeTime')?.value || '06:00',
            sleepGoal: parseInt(document.getElementById('sleepGoal')?.value || '8'),
            lifestyle: document.getElementById('lifestyle')?.value || 'moderate',
            sleepIssues: sleepIssues
        };
    }

    /**
     * Update profile and regenerate recommendations
     */
    updateProfile() {
        console.log('Profile updated, regenerating AI recommendations...');
        this.generateSchedule();
    }

    /**
     * Generate initial schedule with loading animation
     */
    generateInitialSchedule() {
        const container = document.getElementById('scheduleContainer');
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-brain"></i>
                    <p>AI is analyzing your sleep profile...</p>
                </div>
            `;
        }
        
        setTimeout(() => this.generateSchedule(), 2000);
    }

    /**
     * Generate complete sleep schedule using AI
     */
    generateSchedule() {
        const profile = this.getUserProfile();
        console.log('Generating AI-powered sleep schedule...', profile);
        
        // Use AI model to analyze and generate recommendations
        const recommendations = this.ai.analyzeProfile(profile);
        const insights = this.ai.generateInsights(profile, recommendations);
        
        this.currentSchedule = recommendations;
        this.renderSchedule(recommendations);
        this.renderInsights(insights);
        this.updateProgress();
        
        // Save state
        this.saveUserData();
    }

    /**
     * Render schedule in UI
     */
    renderSchedule(recommendations) {
        const container = document.getElementById('scheduleContainer');
        if (!container) return;
        
        if (recommendations.length === 0) {
            container.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>No recommendations generated. Please check your profile settings.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recommendations.map((rec, index) => `
            <div class="schedule-item ${rec.priority}-priority ${this.completedTasks.has(rec.id) ? 'completed' : ''}" 
                 onclick="app.toggleTask('${rec.id}')"
                 style="animation-delay: ${index * 0.1}s"
                 tabindex="0"
                 role="button"
                 aria-label="Toggle ${rec.title}">
                <div class="schedule-left">
                    <input type="checkbox" class="task-checkbox" 
                           ${this.completedTasks.has(rec.id) ? 'checked' : ''}
                           aria-hidden="true">
                    <i class="${rec.icon}" aria-hidden="true"></i>
                    <div class="task-info">
                        <h4>${rec.title}</h4>
                        <p>${rec.description}</p>
                        ${rec.aiReasoning ? `<small style="color: #8b5cf6; font-style: italic;">💡 ${rec.aiReasoning}</small>` : ''}
                    </div>
                </div>
                <div class="schedule-right">
                    <div class="task-time">${rec.time === 'flexible' ? 'Anytime' : rec.time}</div>
                    <div class="priority-badge ${rec.priority}">${rec.priority}</div>
                </div>
            </div>
        `).join('');

        // Add keyboard navigation
        this.addKeyboardNavigation();
    }

    /**
     * Add keyboard navigation support
     */
    addKeyboardNavigation() {
        document.querySelectorAll('.schedule-item').forEach(item => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    /**
     * Render AI insights
     */
    renderInsights(insights) {
        // Update basic insights
        const sleepAnalysis = document.getElementById('sleepAnalysis');
        const aiStatus = document.getElementById('aiStatus');
        
        if (sleepAnalysis) sleepAnalysis.textContent = insights.sleepAnalysis;
        if (aiStatus) aiStatus.textContent = insights.aiStatus;
        
        // Update insights container with additional AI insights
        const container = document.getElementById('insightsContainer');
        if (!container) return;

        // Add circadian health insight
        this.updateOrCreateInsight(container, 'circadian-insight', 
            `Circadian Health: ${insights.circadianHealth.score}%`,
            insights.circadianHealth.feedback
        );

        // Add risk factors if any
        if (insights.riskFactors.length > 0) {
            const riskText = insights.riskFactors.map(risk => 
                `${risk.factor} (${risk.severity} severity)`
            ).join(', ');
            
            this.updateOrCreateInsight(container, 'risk-insight',
                '⚠️ Sleep Risk Assessment',
                riskText
            );
        }

        // Add optimization suggestions
        if (insights.optimizations.length > 0) {
            const optimizationText = insights.optimizations
                .map(opt => opt.suggestion)
                .join('. ');
            
            this.updateOrCreateInsight(container, 'optimization-insight',
                '🎯 AI Optimization Suggestions',
                optimizationText
            );
        }

        // Add sleep efficiency prediction
        this.updateOrCreateInsight(container, 'efficiency-insight',
            `🧠 Predicted Sleep Efficiency: ${insights.sleepEfficiency}%`,
            `Based on your profile, AI predicts ${insights.sleepEfficiency}% sleep efficiency. Chronotype: ${insights.chronotype.replace('-', ' ')}.`
        );
    }

    /**
     * Helper to update or create insight items
     */
    updateOrCreateInsight(container, className, title, content) {
        let insightElement = container.querySelector(`.${className}`);
        
        if (!insightElement) {
            insightElement = document.createElement('div');
            insightElement.className = `insight-item ${className}`;
            container.appendChild(insightElement);
        }
        
        insightElement.innerHTML = `
            <h4>${title}</h4>
            <p>${content}</p>
        `;
    }

    /**
     * Toggle task completion
     */
    toggleTask(taskId) {
        if (this.completedTasks.has(taskId)) {
            this.completedTasks.delete(taskId);
            console.log(`Task uncompleted: ${taskId}`);
        } else {
            this.completedTasks.add(taskId);
            console.log(`Task completed: ${taskId}`);
        }
        
        this.updateTaskVisual(taskId);
        this.updateProgress();
        this.provideFeedback(taskId);
    }

    /**
     * Update visual state of task
     */
    updateTaskVisual(taskId) {
        const taskElement = document.querySelector(`[onclick*="${taskId}"]`);
        if (taskElement) {
            const checkbox = taskElement.querySelector('.task-checkbox');
            const isCompleted = this.completedTasks.has(taskId);
            
            if (checkbox) checkbox.checked = isCompleted;
            taskElement.classList.toggle('completed', isCompleted);
            
            // Add completion animation
            if (isCompleted) {
                taskElement.style.animation = 'none';
                taskElement.offsetHeight; // Force reflow
                taskElement.style.animation = 'completionPulse 0.6s ease-out';
            }
        }
    }

    /**
     * Update progress dashboard
     */
    updateProgress() {
        const totalTasks = this.currentSchedule.length;
        const completedCount = this.completedTasks.size;
        const profile = this.getUserProfile();
        
        // Calculate AI-enhanced sleep score
        const sleepScore = this.ai.calculateSleepHygieneScore(profile, completedCount, totalTasks);
        const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
        
        const highPriorityTasks = this.currentSchedule.filter(task => 
            ['high', 'critical'].includes(task.priority));
        const highPriorityCompleted = highPriorityTasks.filter(task => 
            this.completedTasks.has(task.id)).length;

        // Update UI elements
        this.updateElement('sleepScore', sleepScore);
        this.updateElement('completionRate', `${completionRate}%`);
        this.updateElement('tasksCompleted', completedCount);
        this.updateElement('highPriorityDone', `${highPriorityCompleted}/${highPriorityTasks.length}`);
        
        // Calculate and update streak
        const streak = this.calculateStreak(completionRate);
        this.updateElement('streakCount', streak);
        
        // Update progress bar with animation
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${sleepScore}%`;
        }
    }

    /**
     * Helper to safely update element content
     */
    updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }

    /**
     * Calculate streak based on completion patterns
     */
    calculateStreak(completionRate) {
        // Simplified streak calculation for demo
        // In real app, would track daily completion over time
        if (completionRate >= 80) return Math.floor(Math.random() * 14) + 1;
        if (completionRate >= 60) return Math.floor(Math.random() * 7) + 1;
        return 0;
    }

    /**
     * Provide contextual feedback when tasks are completed
     */
    provideFeedback(taskId) {
        const task = this.currentSchedule.find(t => t.id === taskId);
        if (!task) return;

        const isCompleted = this.completedTasks.has(taskId);
        
        if (isCompleted && task.priority === 'high') {
            this.showNotification(`Great job! ${task.title} completed. This will significantly improve your sleep quality.`, 'success');
        }
    }

    /**
     * Show user notifications
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    /**
     * Generate sleep analytics report
     */
    generateAnalytics() {
        const profile = this.getUserProfile();
        return this.ai.generateSleepReport(profile, this.completedTasks);
    }

    /**
     * Reset all application data and UI state
     */
    resetAllData() {
        console.log('Resetting all application data...');

        // Clear completed tasks
        this.completedTasks.clear();

        // Reset current schedule
        this.currentSchedule = [];

        // Clear user history
        this.userHistory = [];

        // Reset AI model state
        this.ai.userProfile = null;
        this.ai.sleepPatterns = [];
        this.ai.recommendations.clear();

        // Clear form inputs
        this.resetFormInputs();

        // Clear UI elements
        this.clearUIElements();

        // Reset progress indicators
        this.resetProgressIndicators();

        // Show confirmation message
        this.showNotification('All data has been reset. Please fill out your profile to get new recommendations.', 'info');

        // Regenerate initial schedule after a short delay
        setTimeout(() => {
            this.generateInitialSchedule();
        }, 1000);
    }

    /**
     * Reset form inputs to default values
     */
    resetFormInputs() {
        // Reset profile inputs
        const inputs = ['bedtime', 'wakeTime', 'sleepGoal', 'lifestyle'];
        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                element.value = '';
            }
        });

        // Reset sleep issues checkboxes
        document.querySelectorAll('input[name="sleepIssues"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    /**
     * Clear UI elements
     */
    clearUIElements() {
        // Clear schedule container
        const scheduleContainer = document.getElementById('scheduleContainer');
        if (scheduleContainer) {
            scheduleContainer.innerHTML = '';
        }

        // Clear insights container
        const insightsContainer = document.getElementById('insightsContainer');
        if (insightsContainer) {
            insightsContainer.innerHTML = '';
        }

        // Clear analysis text
        const sleepAnalysis = document.getElementById('sleepAnalysis');
        const aiStatus = document.getElementById('aiStatus');
        if (sleepAnalysis) sleepAnalysis.textContent = '';
        if (aiStatus) aiStatus.textContent = '';
    }

    /**
     * Reset progress indicators
     */
    resetProgressIndicators() {
        const elements = ['sleepScore', 'completionRate', 'tasksCompleted', 'highPriorityDone', 'streakCount'];
        elements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = elementId === 'streakCount' ? '0' : '0%';
            }
        });

        // Reset progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = '0%';
        }
    }

    /**
     * Export schedule for external use
     */
    exportSchedule() {
        const data = {
            profile: this.getUserProfile(),
            schedule: this.currentSchedule,
            completedTasks: Array.from(this.completedTasks),
            aiModel: this.ai.exportModelState()
        };

        console.log('Schedule exported:', data);
        return data;
    }
}

// Global app instance
let app;

/**
 * SLEEP SCIENCE KNOWLEDGE BASE
 * Evidence-based sleep research data for AI recommendations
 */
const SleepScienceDB = {
    // Sleep stages and architecture
    sleepStages: {
        rem: { percentage: 20, importance: 'memory consolidation, emotional processing' },
        deepSleep: { percentage: 15, importance: 'physical recovery, immune function' },
        lightSleep: { percentage: 65, importance: 'transition states, light recovery' }
    },

    // Circadian rhythm factors
    circadianFactors: {
        melatonin: { onsetTime: -2, peakTime: 3 }, // hours relative to bedtime
        cortisol: { lowestTime: 2, risingTime: -1 }, // hours relative to wake time
        coreBodyTemp: { lowestTime: 1.5 } // hours relative to wake time
    },

    // Sleep disruptors and their impact windows
    disruptors: {
        caffeine: { halfLife: 6, clearanceTime: 10 },
        alcohol: { metabolismRate: 1, sleepImpact: 4 },
        blueLight: { melatoninSuppression: 2, impactWindow: 3 },
        exercise: { temperatureWindow: 4, alertnessWindow: 6 },
        stress: { cortisolElevation: 8, recoveryTime: 2 }
    },

    // Environmental optimization ranges
    environment: {
        temperature: { optimal: 67, range: [65, 68] },
        humidity: { optimal: 50, range: [30, 50] },
        noise: { threshold: 30, whiteNoiseRange: [40, 50] },
        darkness: { lux: 0, tolerance: 5 }
    }
};

/**
 * ADVANCED AI ALGORITHMS
 */
class AdvancedSleepAI extends SleepHygieneAI {
    constructor() {
        super();
        this.sleepScienceDB = SleepScienceDB;
        this.learningRate = 0.1;
        this.userAdaptations = new Map();
    }

    /**
     * Machine learning-inspired adaptation algorithm
     */
    adaptRecommendations(userFeedback, completionPatterns) {
        // Simulate ML adaptation based on user behavior
        const adaptations = new Map();
        
        // Analyze completion patterns
        completionPatterns.forEach(pattern => {
            if (pattern.category && pattern.completionRate > 0.8) {
                adaptations.set(pattern.category, {
                    weight: 1.2,
                    reason: 'High user compliance detected'
                });
            }
        });

        // Store adaptations for future use
        this.userAdaptations = adaptations;
        return adaptations;
    }

    /**
     * Predictive sleep quality algorithm
     */
    predictSleepQuality(profile, environmentalFactors = {}) {
        let qualityScore = 75; // Base score
        
        // Duration factor
        const durationOptimal = profile.sleepGoal;
        const durationActual = this.calculateSleepMetrics(profile).sleepDuration;
        const durationFactor = Math.min(1, durationActual / durationOptimal);
        qualityScore *= durationFactor;

        // Timing factor (circadian alignment)
        const timingScore = this.calculateSleepMetrics(profile).circadianScore / 100;
        qualityScore *= timingScore;

        // Issue impact
        const issueImpact = {
            'anxiety': -15,
            'racing-thoughts': -12,
            'temperature': -10,
            'noise': -8,
            'caffeine': -5
        };

        profile.sleepIssues.forEach(issue => {
            qualityScore += (issueImpact[issue] || 0);
        });

        // Environmental factors
        if (environmentalFactors.temperature) {
            const tempOptimal = this.sleepScienceDB.environment.temperature.optimal;
            const tempDiff = Math.abs(environmentalFactors.temperature - tempOptimal);
            qualityScore -= tempDiff * 2;
        }

        return Math.max(40, Math.min(100, Math.round(qualityScore)));
    }

    /**
     * Advanced chronotype detection with confidence scoring
     */
    detectAdvancedChronotype(profile, historicalData = []) {
        const bedtimeHour = parseInt(profile.bedtime.split(':')[0]);
        const wakeHour = parseInt(profile.wakeTime.split(':')[0]);
        
        const chronotypes = {
            'extreme-early': { bedtime: [20, 21], wake: [4, 6], confidence: 0 },
            'early': { bedtime: [21, 22], wake: [5, 7], confidence: 0 },
            'intermediate': { bedtime: [22, 23], wake: [6, 8], confidence: 0 },
            'late': { bedtime: [23, 24], wake: [7, 9], confidence: 0 },
            'extreme-late': { bedtime: [0, 2], wake: [8, 11], confidence: 0 }
        };

        // Calculate confidence for each chronotype
        Object.keys(chronotypes).forEach(type => {
            const chrono = chronotypes[type];
            let confidence = 100;
            
            // Bedtime alignment
            if (bedtimeHour >= chrono.bedtime[0] && bedtimeHour <= chrono.bedtime[1]) {
                confidence += 30;
            } else {
                const bedDiff = Math.min(
                    Math.abs(bedtimeHour - chrono.bedtime[0]),
                    Math.abs(bedtimeHour - chrono.bedtime[1])
                );
                confidence -= bedDiff * 10;
            }
            
            // Wake time alignment
            if (wakeHour >= chrono.wake[0] && wakeHour <= chrono.wake[1]) {
                confidence += 30;
            } else {
                const wakeDiff = Math.min(
                    Math.abs(wakeHour - chrono.wake[0]),
                    Math.abs(wakeHour - chrono.wake[1])
                );
                confidence -= wakeDiff * 10;
            }
            
            chronotypes[type].confidence = Math.max(0, confidence);
        });

        // Find best match
        const bestMatch = Object.entries(chronotypes)
            .sort(([,a], [,b]) => b.confidence - a.confidence)[0];

        return {
            type: bestMatch[0],
            confidence: bestMatch[1].confidence,
            recommendations: this.getChronotypeRecommendations(bestMatch[0])
        };
    }

    /**
     * Get chronotype-specific recommendations
     */
    getChronotypeRecommendations(chronotype) {
        const recommendations = {
            'extreme-early': [
                'Maintain early schedule for optimal performance',
                'Avoid late evening social activities that conflict with natural rhythm'
            ],
            'early': [
                'Your early chronotype supports morning productivity',
                'Consider morning exercise for enhanced circadian alignment'
            ],
            'intermediate': [
                'You have flexibility in timing - focus on consistency',
                'Can adapt to social schedules while maintaining sleep quality'
            ],
            'late': [
                'Consider gradually shifting earlier in 15-minute increments',
                'Use bright morning light to encourage earlier circadian phase'
            ],
            'extreme-late': [
                'May benefit from delayed sleep phase therapy',
                'Consider consulting sleep specialist for chronotype management'
            ]
        };

        return recommendations[chronotype] || [];
    }

    /**
     * Sleep debt recovery algorithm
     */
    calculateSleepDebtRecovery(currentDebt, profile) {
        const strategies = [];
        
        if (currentDebt > 0) {
            // Gradual recovery strategy
            const weeklyRecovery = Math.min(currentDebt, 2); // Max 2 hours recovery per week
            const dailyAdjustment = weeklyRecovery / 7 * 60; // Minutes per day
            
            strategies.push({
                type: 'gradual',
                adjustment: `${Math.round(dailyAdjustment)} minutes earlier bedtime`,
                timeline: `${Math.ceil(currentDebt / weeklyRecovery)} weeks`,
                sustainability: 'high'
            });
            
            // Weekend recovery strategy
            if (currentDebt < 4) {
                strategies.push({
                    type: 'weekend',
                    adjustment: 'Sleep in 1-2 hours on weekends',
                    timeline: '2-3 weekends',
                    sustainability: 'moderate'
                });
            }
        }

        return strategies;
    }

    /**
     * Environmental optimization AI
     */
    optimizeEnvironment(profile, currentConditions = {}) {
        const optimizations = [];
        const bedroom = this.sleepScienceDB.environment;

        // Temperature optimization
        if (profile.sleepIssues.includes('temperature') || !currentConditions.temperature) {
            optimizations.push({
                factor: 'temperature',
                target: `${bedroom.temperature.optimal}°F`,
                range: `${bedroom.temperature.range[0]}-${bedroom.temperature.range[1]}°F`,
                method: 'Thermostat, fan, breathable bedding',
                impact: 'high'
            });
        }

        // Light optimization
        optimizations.push({
            factor: 'lighting',
            target: 'Complete darkness',
            range: '<5 lux',
            method: 'Blackout curtains, eye mask, eliminate LED lights',
            impact: 'high'
        });

        // Sound optimization
        if (profile.sleepIssues.includes('noise')) {
            optimizations.push({
                factor: 'acoustics',
                target: `${bedroom.noise.whiteNoiseRange[0]}-${bedroom.noise.whiteNoiseRange[1]} dB white noise`,
                range: `<${bedroom.noise.threshold} dB ambient`,
                method: 'White noise machine, earplugs, sound dampening',
                impact: 'medium'
            });
        }

        return optimizations;
    }
}

/**
 * NOTIFICATION SYSTEM
 */
class SleepNotificationSystem {
    constructor(app) {
        this.app = app;
        this.notifications = [];
    }

    /**
     * Smart notification scheduling
     */
    scheduleNotifications(schedule) {
        // Clear existing notifications
        this.notifications = [];
        
        // Schedule notifications for high-priority tasks
        schedule.filter(task => task.priority === 'high').forEach(task => {
            if (task.time !== 'flexible') {
                this.notifications.push({
                    taskId: task.id,
                    time: task.time,
                    message: `Time for: ${task.title}`,
                    type: 'reminder'
                });
            }
        });
    }

    /**
     * Show notification (would integrate with browser notifications in real app)
     */
    showNotification(notification) {
        console.log(`🔔 ${notification.message}`);
        // In real app, would use Notification API
    }
}

/**
 * APPLICATION INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Sleep Scheduler...');
    
    // Initialize app with enhanced AI
    app = new SleepSchedulerApp();
    app.ai = new AdvancedSleepAI(); // Upgrade to advanced AI
    
    // Initialize notification system
    app.notificationSystem = new SleepNotificationSystem(app);
    
    // Add CSS animations for completion
    const style = document.createElement('style');
    style.textContent = `
        @keyframes completionPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); }
            100% { transform: scale(1); }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            opacity: 1;
            transition: opacity 0.3s ease;
            animation: slideInRight 0.5s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-success {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .notification-warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .notification-info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Sleep Scheduler App fully initialized with Advanced AI');
});

/**
 * UTILITY FUNCTIONS
 */

// Sleep quality assessment utilities
const SleepUtils = {
    /**
     * Calculate sleep efficiency
     */
    calculateSleepEfficiency(timeInBed, actualSleep) {
        return Math.round((actualSleep / timeInBed) * 100);
    },

    /**
     * Estimate sleep onset latency based on profile
     */
    estimateSleepOnset(profile) {
        let latency = 15; // Base 15 minutes
        
        if (profile.sleepIssues.includes('anxiety')) latency += 20;
        if (profile.sleepIssues.includes('racing-thoughts')) latency += 15;
        if (profile.sleepIssues.includes('caffeine')) latency += 10;
        
        return Math.min(60, latency); // Cap at 60 minutes
    },

    /**
     * Calculate ideal wake window
     */
    calculateWakeWindow(bedtime, sleepGoal) {
        const bedtimeDecimal = parseInt(bedtime.split(':')[0]) + (parseInt(bedtime.split(':')[1]) / 60);
        let wakeWindow = bedtimeDecimal + sleepGoal;
        
        if (wakeWindow >= 24) wakeWindow -= 24;
        
        const hour = Math.floor(wakeWindow);
        const minute = Math.round((wakeWindow - hour) * 60);
        
        return {
            optimal: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            range: {
                early: `${hour.toString().padStart(2, '0')}:${Math.max(0, minute - 30).toString().padStart(2, '0')}`,
                late: `${hour.toString().padStart(2, '0')}:${Math.min(59, minute + 30).toString().padStart(2, '0')}`
            }
        };
    },

    /**
     * Generate sleep hygiene assessment
     */
    assessSleepHygiene(profile, completedTasks, schedule) {
        const categories = {
            timing: 0,
            environment: 0,
            lifestyle: 0,
            nutrition: 0,
            mentalHealth: 0
        };

        // Calculate category completion rates
        schedule.forEach(task => {
            const categoryKey = task.category.replace('-', '');
            const camelCaseKey = categoryKey.charAt(0).toLowerCase() + 
                              categoryKey.slice(1).replace(/\b\w/g, l => l.toLowerCase());
            
            if (categories.hasOwnProperty(camelCaseKey) || 
                categories.hasOwnProperty(task.category)) {
                const key = categories.hasOwnProperty(camelCaseKey) ? camelCaseKey : task.category;
                if (completedTasks.has(task.id)) {
                    categories[key] += 1;
                }
            }
        });

        return {
            overall: Math.round((completedTasks.size / Math.max(1, schedule.length)) * 100),
            categories: categories,
            strengths: Object.entries(categories).filter(([,score]) => score >= 2).map(([cat]) => cat),
            improvements: Object.entries(categories).filter(([,score]) => score < 1).map(([cat]) => cat)
        };
    }
};

/**
 * SLEEP COACHING AI
 * Provides intelligent coaching and motivation
 */
class SleepCoachAI {
    constructor() {
        this.motivationalMessages = this.initializeMotivationalSystem();
        this.coachingStrategies = this.initializeCoachingStrategies();
    }

    initializeMotivationalSystem() {
        return {
            encouragement: [
                "Great progress! Each completed task brings you closer to optimal sleep.",
                "Your consistency is building healthy sleep habits that will benefit you long-term.",
                "Small changes in sleep hygiene can lead to significant improvements in life quality."
            ],
            streakMessages: [
                "Amazing! You're building a strong sleep routine.",
                "Consistency is key - keep up the excellent work!",
                "Your dedication to sleep health is paying off."
            ],
            completionMessages: [
                "Perfect! You've completed your sleep hygiene routine.",
                "Excellent work - your sleep quality should improve tonight!",
                "Outstanding commitment to your sleep health!"
            ]
        };
    }

    initializeCoachingStrategies() {
        return {
            'anxiety': {
                techniques: ['progressive muscle relaxation', '4-7-8 breathing', 'mindfulness meditation'],
                approach: 'Focus on calming the nervous system'
            },
            'racing-thoughts': {
                techniques: ['journaling', 'guided imagery', 'cognitive shuffling'],
                approach: 'Redirect mental energy away from worries'
            },
            'temperature': {
                techniques: ['bedroom cooling', 'breathable fabrics', 'cool shower'],
                approach: 'Optimize thermal environment for sleep onset'
            }
        };
    }

    /**
     * Generate personalized coaching message
     */
    generateCoachingMessage(completionRate, currentStreak, sleepIssues) {
        if (completionRate >= 90) {
            return this.getRandomMessage('completionMessages');
        } else if (currentStreak >= 3) {
            return this.getRandomMessage('streakMessages');
        } else if (completionRate >= 50) {
            return this.getRandomMessage('encouragement');
        }
        
        return this.generateEncouragementMessage(sleepIssues);
    }

    /**
     * Generate issue-specific encouragement
     */
    generateEncouragementMessage(sleepIssues) {
        if (sleepIssues.length === 0) {
            return "You're on the right track! Consistency will help optimize your sleep quality.";
        }
        
        const primaryIssue = sleepIssues[0];
        const strategy = this.coachingStrategies[primaryIssue];
        
        if (strategy) {
            return `Focus on ${strategy.approach.toLowerCase()}. Try ${strategy.techniques[0]} tonight.`;
        }
        
        return "Every step counts toward better sleep. Keep building these healthy habits!";
    }

    /**
     * Get random motivational message
     */
    getRandomMessage(category) {
        const messages = this.motivationalMessages[category];
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

/**
 * EXPORT FOR MODULE USAGE
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SleepHygieneAI,
        AdvancedSleepAI,
        SleepSchedulerApp,
        SleepScienceDB,
        SleepUtils,
        SleepCoachAI
    };
}

/**
 * GLOBAL ERROR HANDLING
 */
window.addEventListener('error', (e) => {
    console.error('Sleep Scheduler Error:', e.error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'notification notification-warning';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Something went wrong. Please refresh the page.</span>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 5000);
});

/**
 * PERFORMANCE MONITORING
 */
const SleepAppPerformance = {
    startTime: Date.now(),
    
    logPerformance(action) {
        const duration = Date.now() - this.startTime;
        console.log(`⚡ ${action} completed in ${duration}ms`);
    },
    
    measureAIResponse(startTime, endTime, recommendationCount) {
        const duration = endTime - startTime;
        console.log(`🧠 AI generated ${recommendationCount} recommendations in ${duration}ms`);
        return duration;
    }
};

console.log('🌙 Sleep Hygiene AI Model v2.0.0 loaded successfully');
console.log('📊 Advanced algorithms initialized');
console.log('🎯 Ready for personalized sleep optimization');