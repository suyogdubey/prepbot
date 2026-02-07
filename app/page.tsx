'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, Flame, CheckCircle2, Circle, Undo2, 
  Brain, Calculator, BookOpen, Laptop, Target, 
  Calendar, ChevronRight, ChevronDown, Map, Upload,
  Zap, Battery, BatteryMedium, BatteryCharging
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TYPES ---
type Subject = 'CS' | 'MATH' | 'ENG' | 'GT';
type TaskType = 'LEARN' | 'SOLVE' | 'MOCK';

interface Task {
  id: string;
  subject: Subject;
  type: TaskType;
  title: string;
  xp: number;
}

interface WeekModule {
  id: string;
  title: string;
  tasks: Task[];
}

// --- CONFIGURATION ---
const RANKS = [
  { name: "Novice", minXp: 0 },
  { name: "Apprentice", minXp: 1000 },
  { name: "Code Ninja", minXp: 2500 },
  { name: "System Architect", minXp: 5000 },
  { name: "Tech Lead", minXp: 8000 },
  { name: "CTO", minXp: 12000 },
  { name: "Unicorn Founder", minXp: 20000 }
];

// --- MASTER SYLLABUS (V5.1 - 100% Coverage) ---
const SYLLABUS_DB: WeekModule[] = [
  {
    id: 'week1',
    title: 'Week 1: Foundations & Python Tour (Feb 8 - Feb 14)',
    tasks: [
      { id: 'w1_cs_learn', subject: 'CS', type: 'LEARN', title: 'Revise: Python Loops, Lists, Dicts', xp: 100 },
      { id: 'w1_cs_sort', subject: 'CS', type: 'SOLVE', title: 'Code: Implement Bubble & Insertion Sort', xp: 200 },
      { id: 'w1_math_learn', subject: 'MATH', type: 'LEARN', title: 'Matrices: Types, Equality, Operations', xp: 100 },
      { id: 'w1_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 15 Matrix Multiplication Problems', xp: 150 },
      { id: 'w1_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Quant: 20 Questions on Averages & Percentages', xp: 100 },
      { id: 'w1_eng_solve', subject: 'ENG', type: 'SOLVE', title: 'Reading: Solve 2 Factual Passages', xp: 80 },
    ]
  },
  {
    id: 'week2',
    title: 'Week 2: Functions & Determinants (Feb 15 - Feb 21)',
    tasks: [
      { id: 'w2_cs_learn', subject: 'CS', type: 'LEARN', title: 'Functions: Scope, Parameters (Positional/Default)', xp: 100 },
      { id: 'w2_cs_viz', subject: 'CS', type: 'SOLVE', title: 'Code: Create 3 Charts using Matplotlib (Line, Bar)', xp: 200 },
      { id: 'w2_math_learn', subject: 'MATH', type: 'LEARN', title: 'Determinants: Properties & Inverse', xp: 100 },
      { id: 'w2_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: Cramers Rule & Row Reduction', xp: 150 },
      { id: 'w2_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Logic: 20 Questions on Blood Relations', xp: 100 },
      { id: 'w2_eng_learn', subject: 'ENG', type: 'LEARN', title: 'Vocab: Memorize 30 High-Frequency Idioms', xp: 50 },
    ]
  },
  {
    id: 'week3',
    title: 'Week 3: Files & Applied Calculus (Feb 22 - Feb 28)',
    tasks: [
      { id: 'w3_cs_learn', subject: 'CS', type: 'LEARN', title: 'File Handling: Text & Binary (Pickle)', xp: 150 },
      { id: 'w3_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Solve: 10 File Read/Write Code Questions', xp: 150 },
      { id: 'w3_math_learn', subject: 'MATH', type: 'LEARN', title: 'Calculus: Differentiation & Marginal Cost', xp: 150 },
      { id: 'w3_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 10 Maxima/Minima Problems (Revenue)', xp: 200 },
      { id: 'w3_gt_learn', subject: 'GT', type: 'LEARN', title: 'GK: Read Top News Headlines (Last 3 Months)', xp: 50 },
      { id: 'w3_eng_solve', subject: 'ENG', type: 'SOLVE', title: 'Reading: Narrative Passages', xp: 80 },
    ]
  },
  {
    id: 'week4',
    title: 'Week 4: Data Structures & Financial Math (Mar 1 - Mar 7)',
    tasks: [
      { id: 'w4_cs_learn', subject: 'CS', type: 'LEARN', title: 'Stack: Push/Pop Implementation', xp: 150 },
      { id: 'w4_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Solve: 15 Stack Expression (Infix/Postfix) Qs', xp: 200 },
      { id: 'w4_math_learn', subject: 'MATH', type: 'LEARN', title: 'Financial Math: EMI, Sinking Funds, CAGR', xp: 150 },
      { id: 'w4_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 10 EMI & Perpetuity Problems', xp: 150 },
      { id: 'w4_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Quant: Time, Speed, Distance', xp: 100 },
      { id: 'w4_mock', subject: 'CS', type: 'MOCK', title: 'MINI MOCK: Half Syllabus Test', xp: 500 },
    ]
  },
  {
    id: 'week5',
    title: 'Week 5: SQL & Integration (Mar 8 - Mar 14)',
    tasks: [
      { id: 'w5_cs_learn', subject: 'CS', type: 'LEARN', title: 'SQL: Select, Group By, Joins', xp: 100 },
      { id: 'w5_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Solve: Write SQL Queries for 10 Scenarios', xp: 200 },
      { id: 'w5_math_learn', subject: 'MATH', type: 'LEARN', title: 'Calculus: Integration & Consumer Surplus', xp: 150 },
      { id: 'w5_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 10 Producer/Consumer Surplus Qs', xp: 150 },
      { id: 'w5_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Logic: Coding-Decoding', xp: 100 },
    ]
  },
  {
    id: 'week6',
    title: 'Week 6: Networks & Linear Prog (Mar 15 - Mar 21)',
    tasks: [
      { id: 'w6_cs_learn', subject: 'CS', type: 'LEARN', title: 'Networks: Topologies, Devices, Protocols', xp: 100 },
      { id: 'w6_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Solve: 20 Network Abbreviation MCQs', xp: 100 },
      { id: 'w6_math_learn', subject: 'MATH', type: 'LEARN', title: 'Linear Programming & Time Series', xp: 100 },
      { id: 'w6_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: Graph LPP & Calculate Trends', xp: 150 },
      { id: 'w6_cs_sql', subject: 'CS', type: 'LEARN', title: 'Interface Python with MySQL', xp: 150 },
    ]
  },
  {
    id: 'week7',
    title: 'Week 7: The Final Lap (Mar 22 - Mar 28)',
    tasks: [
      { id: 'w7_cs_learn', subject: 'CS', type: 'LEARN', title: 'Societal Impact: Cyber Ethics & E-Waste', xp: 50 },
      { id: 'w7_mock_cs', subject: 'CS', type: 'MOCK', title: 'FULL MOCK: Computer Science', xp: 500 },
      { id: 'w7_mock_math', subject: 'MATH', type: 'MOCK', title: 'FULL MOCK: Applied Math', xp: 500 },
      { id: 'w7_mock_gt', subject: 'GT', type: 'MOCK', title: 'FULL MOCK: General Test', xp: 400 },
    ]
  },
  {
    id: 'week8',
    title: 'Week 8: Exam Simulation (Mar 29 - April 4)',
    tasks: [
      { id: 'w8_rev_weak', subject: 'CS', type: 'LEARN', title: 'Review Weak Topics', xp: 200 },
      { id: 'w8_mock_final', subject: 'CS', type: 'MOCK', title: 'THE FINAL BOSS: Full 3-Hour Simulation', xp: 1000 },
      { id: 'w8_relax', subject: 'GT', type: 'LEARN', title: 'Rest & Mental Prep', xp: 500 },
    ]
  }
];

export default function CuetMegaApp() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'history'>('dashboard');
  
  // -- STATE MANAGEMENT --
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string>('');
  const [expandedWeek, setExpandedWeek] = useState<string | null>('week1'); 

  // -- INIT (Load Save Data) --
  useEffect(() => {
    setMounted(true);
    const savedXp = localStorage.getItem('v7_xp');
    const savedIds = localStorage.getItem('v7_completed');
    const savedStreak = localStorage.getItem('v7_streak');
    const savedDate = localStorage.getItem('v7_date');

    if (savedXp) setXp(parseInt(savedXp));
    if (savedIds) setCompletedIds(JSON.parse(savedIds));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDate) setLastDate(savedDate);
  }, []);

  // -- SAVE SYSTEM (Auto-Save) --
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('v7_xp', xp.toString());
    localStorage.setItem('v7_completed', JSON.stringify(completedIds));
    localStorage.setItem('v7_streak', streak.toString());
    localStorage.setItem('v7_date', lastDate);
  }, [xp, completedIds, streak, lastDate, mounted]);

  // -- CORE FUNCTIONS --

  const toggleTask = (taskId: string, taskXp: number) => {
    const isCompleted = completedIds.includes(taskId);

    if (isCompleted) {
      // UNDO
      setCompletedIds(prev => prev.filter(id => id !== taskId));
      setXp(prev => Math.max(0, prev - taskXp)); 
    } else {
      // COMPLETE
      setCompletedIds(prev => [...prev, taskId]);
      setXp(prev => prev + taskXp); 
      
      const today = new Date();
      const todayStr = today.toDateString();
      
      // STREAK LOGIC (Strict)
      if (lastDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate === yesterday.toDateString()) {
           setStreak(prev => prev + 1);
        } else {
           setStreak(1); 
        }
        setLastDate(todayStr);
      }
      
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target?.result as string);
            if (data.xp !== undefined && data.completedIds) {
                setXp(data.xp);
                setCompletedIds(data.completedIds);
                setStreak(data.streak || 0);
                
                // Fix streak logic on restore
                const today = new Date().toDateString();
                if (data.lastDate !== today) {
                    setLastDate(today); // Reset date to today to avoid lockouts
                } else {
                    setLastDate(data.lastDate);
                }
                
                alert('Progress Restored Successfully!');
            }
        } catch (err) {
            alert('Invalid Backup File');
        }
    };
    reader.readAsText(file);
  };

  const getCurrentRank = () => {
    return RANKS.slice().reverse().find(r => xp >= r.minXp) || RANKS[0];
  };

  const getNextRank = () => {
    return RANKS.find(r => r.minXp > xp) || { name: "Max Level", minXp: xp };
  };

  const getIcon = (subject: Subject, type: TaskType) => {
    if (type === 'MOCK') return <Target className="w-5 h-5 text-red-500" />;
    
    switch(subject) {
      case 'CS': return <Laptop className="w-5 h-5 text-green-400" />;
      case 'MATH': return <Calculator className="w-5 h-5 text-blue-400" />;
      case 'ENG': return <BookOpen className="w-5 h-5 text-yellow-400" />;
      case 'GT': return <Brain className="w-5 h-5 text-purple-400" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  // --- SMART RECOMMENDER (College + Dependency Logic) ---
  const getDailyConfig = () => {
     const day = new Date().getDay();
     // Based on User's PDF Time Table:
     const CONFIG = {
        0: { label: "No College (Grind Mode)", color: "text-green-400", max: 5, subjects: ['CS', 'MATH', 'GT', 'ENG'], icon: <Zap className="w-4 h-4 text-green-400"/> },
        1: { label: "Heavy College Load", color: "text-red-400", max: 2, subjects: ['ENG', 'GT', 'CS'], icon: <Battery className="w-4 h-4 text-red-400"/> },
        2: { label: "Heavy College Load", color: "text-red-400", max: 2, subjects: ['ENG', 'GT', 'MATH'], icon: <Battery className="w-4 h-4 text-red-400"/> },
        3: { label: "Moderate College Load", color: "text-yellow-400", max: 3, subjects: ['CS', 'MATH', 'GT'], icon: <BatteryMedium className="w-4 h-4 text-yellow-400"/> },
        4: { label: "Light College Load", color: "text-blue-400", max: 4, subjects: ['MATH', 'CS', 'ENG'], icon: <BatteryCharging className="w-4 h-4 text-blue-400"/> },
        5: { label: "Moderate College Load", color: "text-yellow-400", max: 3, subjects: ['CS', 'ENG', 'MATH'], icon: <BatteryMedium className="w-4 h-4 text-yellow-400"/> },
        6: { label: "Light College Load", color: "text-blue-400", max: 4, subjects: ['CS', 'MATH', 'GT'], icon: <BatteryCharging className="w-4 h-4 text-blue-400"/> },
     };
     // @ts-ignore
     return CONFIG[day];
  }

  const getRecommendedTasks = () => {
    const config = getDailyConfig();
    const allTasks = SYLLABUS_DB.flatMap(w => w.tasks);
    const incomplete = allTasks.filter(t => !completedIds.includes(t.id));
    const progressPercent = Math.round((completedIds.length / allTasks.length) * 100);

    const actionableTasks = incomplete.filter(task => {
        // 1. Mocks locked until 30%
        if (task.type === 'MOCK' && progressPercent < 30) return false;
        
        // 2. Always show LEARN
        if (task.type === 'LEARN') return true;

        // 3. Block SOLVE if LEARN incomplete
        if (task.type === 'SOLVE') {
            const parentWeek = SYLLABUS_DB.find(w => w.tasks.some(t => t.id === task.id));
            if (!parentWeek) return true; 
            const hasUnfinishedLearn = parentWeek.tasks.some(t => 
                t.subject === task.subject && t.type === 'LEARN' && !completedIds.includes(t.id)
            );
            if (hasUnfinishedLearn) return false;
        }
        return true;
    });

    const sortedTasks = actionableTasks.sort((a, b) => {
        const aPriority = config.subjects.includes(a.subject) ? 1 : 0;
        const bPriority = config.subjects.includes(b.subject) ? 1 : 0;
        return bPriority - aPriority; 
    });
    
    return sortedTasks.slice(0, config.max);
  };

  if (!mounted) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-green-500 font-mono">Loading System...</div>;

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();
  const dailyRecommendations = getRecommendedTasks();
  const dailyConfig = getDailyConfig();
  const totalTasks = SYLLABUS_DB.flatMap(w => w.tasks).length;
  const progressPercent = Math.round((completedIds.length / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col max-w-md mx-auto border-x border-neutral-900 pb-20">
      
      {/* HEADER */}
      <div className="bg-neutral-900/80 backdrop-blur-md p-6 sticky top-0 z-50 border-b border-neutral-800">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic">MEGA<span className="text-green-500">_GRIND</span></h1>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 mt-1">
              <span className="font-bold text-white">{currentRank.name}</span>
              <span>•</span>
              <span>{xp} XP</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end space-x-2 mb-1">
               <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-neutral-700'}`} />
               <span className="text-xl font-bold">{streak}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-neutral-600">Day Streak</p>
          </div>
        </div>

        <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
           <div 
             className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out"
             style={{ width: `${Math.min(100, (xp / nextRank.minXp) * 100)}%` }}
           />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-neutral-500 uppercase font-bold tracking-widest">
            <span>Progress: {progressPercent}%</span>
            <span>Next: {nextRank.minXp - xp} XP</span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 p-6 space-y-8">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                  <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> 
                    Today ({new Date().toLocaleDateString('en-US', { weekday: 'short' })})
                  </h2>
                  <div className={`flex items-center space-x-2 text-[10px] font-bold px-2 py-1 rounded bg-neutral-900 border border-neutral-800 ${dailyConfig.color}`}>
                      {dailyConfig.icon}
                      <span>{dailyConfig.label}</span>
                  </div>
              </div>
              
              {dailyRecommendations.length > 0 ? (
                dailyRecommendations.map(task => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id, task.xp)}
                    className="w-full text-left bg-neutral-900 border border-neutral-800 hover:border-green-500/50 p-4 rounded-xl transition-all active:scale-95 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      {getIcon(task.subject, task.type)}
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded bg-neutral-950 ${
                          task.subject === 'CS' ? 'text-green-400' : 
                          task.subject === 'MATH' ? 'text-blue-400' :
                          task.subject === 'GT' ? 'text-purple-400' : 'text-yellow-400'
                        }`}>
                          {task.subject} • {task.type}
                        </span>
                        <span className="text-xs font-mono text-green-500">+{task.xp} XP</span>
                      </div>
                      <h3 className="font-semibold text-neutral-200 leading-tight pr-8">{task.title}</h3>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center bg-neutral-900/50 rounded-xl border border-dashed border-neutral-800">
                  <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-white font-bold">Daily Tasks Complete!</p>
                  <p className="text-xs text-neutral-500">Rest up. Tomorrow is another grind.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                  <p className="text-xs text-neutral-500 uppercase">Tasks Done</p>
                  <p className="text-2xl font-bold text-white">{completedIds.length}</p>
               </div>
               <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                  <p className="text-xs text-neutral-500 uppercase">Syllabus</p>
                  <p className="text-2xl font-bold text-white">{progressPercent}%</p>
               </div>
            </div>
          </>
        )}

        {/* SYLLABUS TAB */}
        {activeTab === 'syllabus' && (
          <div className="space-y-4">
             {SYLLABUS_DB.map((week, index) => {
               const isExpanded = expandedWeek === week.id;
               const weekCompletedCount = week.tasks.filter(t => completedIds.includes(t.id)).length;
               const totalWeekTasks = week.tasks.length;
               const isFullyComplete = weekCompletedCount === totalWeekTasks;

               return (
                 <div key={week.id} className={`rounded-xl border transition-all ${
                   isFullyComplete ? 'bg-green-900/10 border-green-900/30' : 'bg-neutral-900 border-neutral-800'
                 }`}>
                   <button 
                     onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
                     className="w-full flex items-center justify-between p-4"
                   >
                     <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                            isFullyComplete ? 'bg-green-500 border-green-500 text-black' : 'bg-neutral-950 border-neutral-700 text-neutral-500'
                        }`}>
                            {index + 1}
                        </div>
                        <div className="text-left">
                            <h3 className={`text-sm font-bold ${isFullyComplete ? 'text-green-400' : 'text-white'}`}>{week.title}</h3>
                            <p className="text-[10px] text-neutral-500">{weekCompletedCount}/{totalWeekTasks} Completed</p>
                        </div>
                     </div>
                     {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-500" /> : <ChevronRight className="w-4 h-4 text-neutral-500" />}
                   </button>

                   {isExpanded && (
                     <div className="px-4 pb-4 space-y-2 border-t border-neutral-800/50 pt-4">
                        {week.tasks.map(task => {
                            const isDone = completedIds.includes(task.id);
                            return (
                                <button
                                  key={task.id}
                                  onClick={() => toggleTask(task.id, task.xp)}
                                  className={`w-full flex items-center justify-between p-3 rounded-lg text-xs transition-colors ${
                                    isDone ? 'bg-green-500/10 text-green-400' : 'bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                                  }`}
                                >
                                    <div className="flex items-center space-x-3 text-left">
                                        {isDone ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 text-neutral-600" />}
                                        <span className={isDone ? 'line-through' : ''}>{task.title}</span>
                                    </div>
                                    <span className="text-[10px] font-mono opacity-50 ml-2">+{task.xp}</span>
                                </button>
                            )
                        })}
                     </div>
                   )}
                 </div>
               );
             })}
          </div>
        )}

        {/* SETTINGS / BACKUP AREA */}
        <div className="p-6 mt-4 border-t border-neutral-900 space-y-4">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest text-center">Data Management</h3>
            
            <div className="flex space-x-2">
                <button 
                onClick={() => {
                    const data = { xp, completedIds, streak, lastDate };
                    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `cuet_backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                }}
                className="flex-1 py-3 bg-neutral-900 rounded-lg text-xs font-bold text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center space-x-2"
                >
                <Upload className="w-4 h-4" />
                <span>Backup</span>
                </button>

                <label className="flex-1 py-3 bg-neutral-900 rounded-lg text-xs font-bold text-neutral-400 hover:text-white border border-neutral-800 flex items-center justify-center space-x-2 cursor-pointer">
                    <Undo2 className="w-4 h-4" />
                    <span>Restore</span>
                    <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                </label>
            </div>
            
            <p className="text-[10px] text-neutral-600 text-center">
                Data saved to local device. Vercel resets will NOT affect you.
            </p>
        </div>

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Activity Log (Tap to Undo)</h3>
            {completedIds.slice().reverse().map(id => {
               const task = SYLLABUS_DB.flatMap(w => w.tasks).find(t => t.id === id);
               if (!task) return null;

               return (
                 <button 
                   key={id}
                   onClick={() => toggleTask(id, task.xp)} 
                   className="w-full flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl group hover:border-red-500/50 transition-colors"
                 >
                   <div className="flex items-center space-x-3">
                      <Undo2 className="w-4 h-4 text-neutral-600 group-hover:text-red-500" />
                      <span className="text-sm font-medium text-neutral-300 group-hover:line-through">{task.title}</span>
                   </div>
                   <span className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      REVOKE
                   </span>
                 </button>
               )
            })}
            {completedIds.length === 0 && <p className="text-center text-neutral-500 py-10">No history found.</p>}
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-900 p-2 max-w-md mx-auto z-50">
        <div className="grid grid-cols-3 gap-1">
           {['dashboard', 'syllabus', 'history'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`py-3 rounded-lg flex flex-col items-center justify-center transition-all ${
                 activeTab === tab ? 'text-green-400 bg-neutral-900' : 'text-neutral-500 hover:text-neutral-300'
               }`}
             >
               {tab === 'dashboard' && <Target className="w-5 h-5 mb-1" />}
               {tab === 'syllabus' && <Map className="w-5 h-5 mb-1" />}
               {tab === 'history' && <Undo2 className="w-5 h-5 mb-1" />}
               <span className="text-[10px] font-bold uppercase tracking-wider">{tab}</span>
             </button>
           ))}
        </div>
      </div>

    </div>
  );
}