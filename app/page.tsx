'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Flame, CheckCircle2, Circle, Undo2, 
  Brain, Calculator, BookOpen, Laptop, Target, 
  Calendar as CalendarIcon, ChevronRight, ChevronLeft, Map, Upload,
  Zap, Battery, BatteryMedium, BatteryCharging, Lock, AlertTriangle, Locate
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- TYPES ---
type Subject = 'CS' | 'MATH' | 'ENG' | 'GT';
type TaskType = 'LEARN' | 'SOLVE' | 'MOCK' | 'DRILL';

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

interface DaySchedule {
  dateStr: string;
  dateObj: Date;
  config: any;
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

// --- MASTER SYLLABUS (V12 Final - Full Coverage) ---
const SYLLABUS_DB: WeekModule[] = [
  {
    id: 'week1',
    title: 'Week 1: Foundations',
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
    title: 'Week 2: Logic & Funcs',
    tasks: [
      { id: 'w2_cs_learn', subject: 'CS', type: 'LEARN', title: 'Functions: Scope, Parameters & Exception Handling', xp: 100 },
      { id: 'w2_cs_viz', subject: 'CS', type: 'SOLVE', title: 'Code: Create Charts (Bar/Line) with Matplotlib', xp: 200 },
      { id: 'w2_math_learn', subject: 'MATH', type: 'LEARN', title: 'Determinants: Properties & Inverse', xp: 100 },
      { id: 'w2_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: Cramers Rule & Row Reduction', xp: 150 },
      { id: 'w2_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Logic: 20 Questions on Blood Relations', xp: 100 },
      { id: 'w2_eng_learn', subject: 'ENG', type: 'LEARN', title: 'Vocab: Memorize 30 High-Frequency Idioms', xp: 50 },
    ]
  },
  {
    id: 'week3',
    title: 'Week 3: Files & Calculus I',
    tasks: [
      { id: 'w3_cs_learn', subject: 'CS', type: 'LEARN', title: 'File Handling: Text, Binary & CSV Files', xp: 150 },
      { id: 'w3_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Code: Write a CSV Reader/Writer Program', xp: 200 },
      { id: 'w3_math_learn', subject: 'MATH', type: 'LEARN', title: 'Calculus: Differentiation & Marginal Cost', xp: 150 },
      { id: 'w3_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 10 Maxima/Minima Problems (Revenue)', xp: 200 },
      { id: 'w3_gt_learn', subject: 'GT', type: 'LEARN', title: 'GK: Read Top News Headlines (Last 3 Months)', xp: 50 },
      { id: 'w3_eng_solve', subject: 'ENG', type: 'SOLVE', title: 'Reading: Narrative Passages', xp: 80 },
    ]
  },
  {
    id: 'week4',
    title: 'Week 4: Data & Finance',
    tasks: [
      { id: 'w4_cs_learn', subject: 'CS', type: 'LEARN', title: 'Data Structures: Stack (LIFO) & Queue (FIFO)', xp: 150 },
      { id: 'w4_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Code: Implement Push/Pop & Enqueue/Dequeue', xp: 200 },
      { id: 'w4_math_learn', subject: 'MATH', type: 'LEARN', title: 'Financial Math: EMI, Sinking Funds, CAGR', xp: 150 },
      { id: 'w4_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 10 EMI & Perpetuity Problems', xp: 150 },
      { id: 'w4_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Quant: Time, Speed, Distance', xp: 100 },
      { id: 'w4_mock', subject: 'CS', type: 'MOCK', title: 'MINI MOCK: Half Syllabus Test', xp: 500 },
    ]
  },
  {
    id: 'week5',
    title: 'Week 5: SQL & Probability',
    tasks: [
      { id: 'w5_cs_learn', subject: 'CS', type: 'LEARN', title: 'SQL: Select, Group By, Joins, Having', xp: 100 },
      { id: 'w5_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Solve: Write SQL Queries for 10 Scenarios', xp: 200 },
      { id: 'w5_math_learn', subject: 'MATH', type: 'LEARN', title: 'Probability: Distributions (Binomial/Poisson)', xp: 150 },
      { id: 'w5_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: 10 Probability Word Problems', xp: 150 },
      { id: 'w5_gt_solve', subject: 'GT', type: 'SOLVE', title: 'Logic: Coding-Decoding', xp: 100 },
    ]
  },
  {
    id: 'week6',
    title: 'Week 6: Connectivity',
    tasks: [
      { id: 'w6_cs_learn', subject: 'CS', type: 'LEARN', title: 'Networks: Topologies, Protocols (TCP/IP)', xp: 100 },
      { id: 'w6_cs_solve', subject: 'CS', type: 'SOLVE', title: 'Solve: 20 Network Abbreviation MCQs', xp: 100 },
      { id: 'w6_math_learn', subject: 'MATH', type: 'LEARN', title: 'Index Numbers & Time Series Analysis', xp: 100 },
      { id: 'w6_math_solve', subject: 'MATH', type: 'SOLVE', title: 'Solve: Calculate Trend (Moving Averages)', xp: 150 },
      { id: 'w6_cs_sql', subject: 'CS', type: 'LEARN', title: 'Interface Python with MySQL', xp: 150 },
    ]
  },
  {
    id: 'week7',
    title: 'Week 7: The Final Lap',
    tasks: [
      { id: 'w7_cs_learn', subject: 'CS', type: 'LEARN', title: 'Societal Impact: Cyber Ethics & E-Waste', xp: 50 },
      { id: 'w7_mock_cs', subject: 'CS', type: 'MOCK', title: 'FULL MOCK: Computer Science (3 Hours)', xp: 500 },
      { id: 'w7_mock_math', subject: 'MATH', type: 'MOCK', title: 'FULL MOCK: Applied Math (3 Hours)', xp: 500 },
      { id: 'w7_mock_gt', subject: 'GT', type: 'MOCK', title: 'FULL MOCK: General Test (60 Mins)', xp: 400 },
    ]
  },
  {
    id: 'week8',
    title: 'Week 8: Exam Simulation',
    tasks: [
      { id: 'w8_rev_weak', subject: 'CS', type: 'LEARN', title: 'Review Weak Topics (Error Analysis)', xp: 200 },
      { id: 'w8_mock_final', subject: 'CS', type: 'MOCK', title: 'THE FINAL BOSS: Full Simulation Day', xp: 1000 },
      { id: 'w8_relax', subject: 'GT', type: 'LEARN', title: 'Rest & Mental Prep', xp: 500 },
    ]
  }
];

// --- EXPANDED DRILL POOL (20 Unique Items) ---
const DRILLS: Task[] = [
  { id: 'd_math1', subject: 'MATH', type: 'DRILL', title: 'Drill: 10 Mental Math (Percentages)', xp: 50 },
  { id: 'd_eng1', subject: 'ENG', type: 'DRILL', title: 'Drill: Read 1 Editorial (The Hindu/Express)', xp: 50 },
  { id: 'd_cs1', subject: 'CS', type: 'DRILL', title: 'Drill: Write 1 Python List Comprehension', xp: 50 },
  { id: 'd_gt1', subject: 'GT', type: 'DRILL', title: 'Drill: Solve 5 Syllogism Puzzles', xp: 50 },
  { id: 'd_math2', subject: 'MATH', type: 'DRILL', title: 'Drill: Write down Integration Formulas', xp: 50 },
  { id: 'd_cs2', subject: 'CS', type: 'DRILL', title: 'Drill: Debug a 10-line Python snippet', xp: 50 },
  { id: 'd_eng2', subject: 'ENG', type: 'DRILL', title: 'Drill: 5 Antonym/Synonym Pairs', xp: 50 },
  { id: 'd_gt2', subject: 'GT', type: 'DRILL', title: 'Drill: 1 Data Interpretation Set (Table)', xp: 50 },
  { id: 'd_math3', subject: 'MATH', type: 'DRILL', title: 'Drill: Solve 3 Determinant Problems', xp: 50 },
  { id: 'd_cs3', subject: 'CS', type: 'DRILL', title: 'Drill: Write SQL Query (GROUP BY)', xp: 50 },
  { id: 'd_eng3', subject: 'ENG', type: 'DRILL', title: 'Drill: 5 One-Word Substitutions', xp: 50 },
  { id: 'd_gt3', subject: 'GT', type: 'DRILL', title: 'Drill: Current Affairs (Last 2 Days)', xp: 50 },
  { id: 'd_cs4', subject: 'CS', type: 'DRILL', title: 'Drill: Convert Infix to Postfix', xp: 50 },
  { id: 'd_math4', subject: 'MATH', type: 'DRILL', title: 'Drill: Calculate CAGR for a dataset', xp: 50 },
  { id: 'd_eng4', subject: 'ENG', type: 'DRILL', title: 'Drill: Jumbled Sentences (Order 5)', xp: 50 },
  { id: 'd_gt4', subject: 'GT', type: 'DRILL', title: 'Drill: Solve 5 Number Series', xp: 50 },
  { id: 'd_cs5', subject: 'CS', type: 'DRILL', title: 'Drill: Identify Topology from Diagram', xp: 50 },
  { id: 'd_math5', subject: 'MATH', type: 'DRILL', title: 'Drill: 5 Modulo Arithmetic Sums', xp: 50 },
  { id: 'd_eng5', subject: 'ENG', type: 'DRILL', title: 'Drill: 5 Idioms with Sentences', xp: 50 },
  { id: 'd_gt5', subject: 'GT', type: 'DRILL', title: 'Drill: Direction Sense Test (North/South)', xp: 50 },
];

export default function CuetFinalApp() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'syllabus' | 'history'>('dashboard');
  
  // -- STATE --
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState<string>('');
  
  // -- DATE STATE --
  // FIXED START DATE (Feb 8, 2026) using local time constructor (Year, MonthIndex, Day)
  const START_DATE = new Date(2026, 1, 8); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // -- INIT --
  useEffect(() => {
    setMounted(true);
    const savedXp = localStorage.getItem('v13_xp');
    const savedIds = localStorage.getItem('v13_completed');
    const savedStreak = localStorage.getItem('v13_streak');
    const savedDate = localStorage.getItem('v13_date');

    if (savedXp) setXp(parseInt(savedXp));
    if (savedIds) setCompletedIds(JSON.parse(savedIds));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDate) setLastDate(savedDate);
  }, []);

  // -- SAVE --
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('v13_xp', xp.toString());
    localStorage.setItem('v13_completed', JSON.stringify(completedIds));
    localStorage.setItem('v13_streak', streak.toString());
    localStorage.setItem('v13_date', lastDate);
  }, [xp, completedIds, streak, lastDate, mounted]);

  // --- RESTORE FUNCTION ---
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
                const today = new Date().toDateString();
                if (data.lastDate !== today) setLastDate(today); else setLastDate(data.lastDate);
                alert('Progress Restored Successfully!');
            }
        } catch (err) {
            alert('Invalid Backup File');
        }
    };
    reader.readAsText(file);
  };

  // --- CORE SCHEDULE GENERATOR ---
  const generateSchedule = useMemo(() => {
    if (!mounted) return {};

    const schedule: Record<string, DaySchedule> = {};
    const allCoreTasks = SYLLABUS_DB.flatMap(w => w.tasks);
    let taskPointer = 0;
    
    for (let i = 0; i < 65; i++) {
        const currentDate = new Date(START_DATE);
        currentDate.setDate(START_DATE.getDate() + i);
        const dateStr = currentDate.toDateString();
        const day = currentDate.getDay(); // 0=Sun

        const config = getDailyConfig(day);
        const dailyTasks: Task[] = [];
        
        let slotsUsed = 0;
        const coreSlots = config.max > 2 ? config.max - 1 : config.max;

        while (slotsUsed < coreSlots && taskPointer < allCoreTasks.length) {
            dailyTasks.push(allCoreTasks[taskPointer]);
            taskPointer++;
            slotsUsed++;
        }

        while (dailyTasks.length < config.max) {
             const drillIndex = (i + dailyTasks.length) % DRILLS.length;
             const drill = { ...DRILLS[drillIndex], id: `${DRILLS[drillIndex].id}_day${i}` };
             dailyTasks.push(drill);
        }

        schedule[dateStr] = {
            dateStr,
            dateObj: currentDate,
            config,
            tasks: dailyTasks
        };
    }
    return schedule;
  }, [mounted]);

  // --- HELPER: GET BACKLOG DATE (Strictly PAST Days Only) ---
  const getBacklogDate = () => {
      // Logic Fix: Only consider dates STRICTLY BEFORE Today
      const today = new Date();
      today.setHours(0,0,0,0); // Normalize to midnight

      const dates = Object.values(generateSchedule).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
      
      for (const day of dates) {
          // If we reach Today or Future, stop checking for backlog
          if (day.dateObj >= today) return null;

          const isComplete = day.tasks.every(t => completedIds.includes(t.id));
          if (!isComplete) return day.dateObj;
      }
      return null;
  };

  function getDailyConfig(day: number) {
     const CONFIG = {
        0: { label: "No College (Grind)", color: "text-green-400", max: 5, icon: <Zap className="w-4 h-4 text-green-400"/> },
        1: { label: "Heavy Load", color: "text-red-400", max: 2, icon: <Battery className="w-4 h-4 text-red-400"/> },
        2: { label: "Heavy Load", color: "text-red-400", max: 2, icon: <Battery className="w-4 h-4 text-red-400"/> },
        3: { label: "Moderate Load", color: "text-yellow-400", max: 3, icon: <BatteryMedium className="w-4 h-4 text-yellow-400"/> },
        4: { label: "Light Load", color: "text-blue-400", max: 4, icon: <BatteryCharging className="w-4 h-4 text-blue-400"/> },
        5: { label: "Moderate Load", color: "text-yellow-400", max: 3, icon: <BatteryMedium className="w-4 h-4 text-yellow-400"/> },
        6: { label: "Light Load", color: "text-blue-400", max: 4, icon: <BatteryCharging className="w-4 h-4 text-blue-400"/> },
     };
     // @ts-ignore
     return CONFIG[day];
  }

  const toggleTask = (taskId: string, taskXp: number) => {
    const isCompleted = completedIds.includes(taskId);
    if (isCompleted) {
      setCompletedIds(prev => prev.filter(id => id !== taskId));
      setXp(prev => Math.max(0, prev - taskXp)); 
    } else {
      setCompletedIds(prev => [...prev, taskId]);
      setXp(prev => prev + taskXp); 
      
      const today = new Date().toDateString();
      if (lastDate !== today) {
         setStreak(prev => prev + 1);
         setLastDate(today);
      }
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }
  };

  const shiftDate = (days: number) => {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + days);
      setSelectedDate(newDate);
  };

  // Jump to backlog logic
  const jumpToBacklog = () => {
      const backlog = getBacklogDate();
      if (backlog) setSelectedDate(backlog);
      else setSelectedDate(new Date());
  };

  const getIcon = (subject: Subject, type: TaskType) => {
    if (type === 'MOCK') return <Target className="w-5 h-5 text-red-500" />;
    if (type === 'DRILL') return <Zap className="w-5 h-5 text-orange-400" />;
    switch(subject) {
      case 'CS': return <Laptop className="w-5 h-5 text-green-400" />;
      case 'MATH': return <Calculator className="w-5 h-5 text-blue-400" />;
      case 'ENG': return <BookOpen className="w-5 h-5 text-yellow-400" />;
      case 'GT': return <Brain className="w-5 h-5 text-purple-400" />;
      default: return <Circle className="w-5 h-5" />;
    }
  };

  if (!mounted) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-green-500 font-mono">Loading...</div>;

  const currentRank = RANKS.slice().reverse().find(r => xp >= r.minXp) || RANKS[0];
  const nextRank = RANKS.find(r => r.minXp > xp) || { name: "Max Level", minXp: xp };
  
  // Render Data
  const viewDateStr = selectedDate.toDateString();
  const dayData = generateSchedule[viewDateStr];
  const todaysTasks = dayData ? dayData.tasks : [];
  
  const dayCompletedCount = todaysTasks.filter(t => completedIds.includes(t.id)).length;
  const isDayComplete = dayCompletedCount === todaysTasks.length && todaysTasks.length > 0;

  // LOCKING LOGIC
  const earliestIncomplete = getBacklogDate();
  
  // You are locked if:
  // 1. You have a backlog (earliestIncomplete is not null)
  // 2. The day you are viewing is AHEAD of the backlog date
  // 3. The day you are viewing is NOT the backlog date itself
  const isDateLocked = earliestIncomplete && dayData && dayData.dateObj > earliestIncomplete && earliestIncomplete.toDateString() !== viewDateStr;
  
  const isToday = selectedDate.toDateString() === new Date().toDateString();

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
           <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${Math.min(100, (xp / nextRank.minXp) * 100)}%` }} />
        </div>
      </div>

      {/* DATE NAVIGATOR */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 relative">
          <button onClick={() => shiftDate(-1)} className="p-2 rounded-full hover:bg-neutral-900"><ChevronLeft className="w-5 h-5 text-neutral-400" /></button>
          
          <div className="text-center">
              <h2 className="text-lg font-bold text-white flex items-center justify-center">
                  {isToday ? "Today" : selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </h2>
              {dayData && (
                  <div className={`flex items-center justify-center space-x-1 text-[10px] font-bold ${dayData.config.color}`}>
                      {dayData.config.icon}
                      <span>{dayData.config.label}</span>
                  </div>
              )}
          </div>

          <button onClick={() => shiftDate(1)} className="p-2 rounded-full hover:bg-neutral-900"><ChevronRight className="w-5 h-5 text-neutral-400" /></button>
          
          {/* JUMP TO BACKLOG BUTTON */}
          {earliestIncomplete && (
              <button 
                onClick={jumpToBacklog}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 flex items-center space-x-1 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 text-[10px] font-bold px-3 animate-pulse"
              >
                  <AlertTriangle className="w-3 h-3" />
                  <span>BACKLOG</span>
              </button>
          )}
          
          {/* Jump to Today Button (Only show if NO backlog and not on today) */}
          {!isToday && !earliestIncomplete && (
              <button 
                onClick={() => setSelectedDate(new Date())}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2"
              >
                  <Locate className="w-4 h-4 text-green-500" />
              </button>
          )}
      </div>

      {/* BODY */}
      <div className="flex-1 p-6 space-y-6">

        {activeTab === 'dashboard' && (
          <>
            {isDateLocked && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4 flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-bold text-red-400">Locked by Backlog</h3>
                        <p className="text-xs text-red-200">
                            You must finish <strong>{earliestIncomplete?.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</strong> first.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-3">
               {todaysTasks.length > 0 ? (
                 todaysTasks.map(task => {
                    let locked = isDateLocked;
                    
                    // Internal Dependency Check
                    if (!locked && task.type === 'SOLVE') {
                         const week = SYLLABUS_DB.find(w => w.tasks.some(t => t.id === task.id));
                         if (week) {
                             const learnTask = week.tasks.find(t => t.subject === task.subject && t.type === 'LEARN');
                             if (learnTask && !completedIds.includes(learnTask.id)) locked = true;
                         }
                    }

                    return (
                     <button
                        key={task.id}
                        disabled={locked}
                        onClick={() => toggleTask(task.id, task.xp)}
                        className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                            locked ? 'bg-neutral-900/50 border-neutral-900 opacity-50 cursor-not-allowed' : 
                            'bg-neutral-900 border-neutral-800 hover:border-green-500/50 active:scale-95'
                        }`}
                      >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-start space-x-3 pr-4">
                                <div className={`mt-1 ${completedIds.includes(task.id) ? 'text-green-500' : 'text-neutral-600'}`}>
                                    {locked ? <Lock className="w-5 h-5" /> : completedIds.includes(task.id) ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-950 mb-1 inline-block ${
                                        task.subject === 'CS' ? 'text-green-400' : 
                                        task.subject === 'MATH' ? 'text-blue-400' :
                                        task.subject === 'GT' ? 'text-purple-400' : 'text-yellow-400'
                                    }`}>
                                        {task.subject} • {task.type}
                                    </span>
                                    <h3 className={`font-semibold leading-tight ${completedIds.includes(task.id) ? 'text-neutral-500 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </h3>
                                    {locked && !isDateLocked && <p className="text-[10px] text-red-400 mt-1">Complete "LEARN" task first</p>}
                                </div>
                            </div>
                            <span className="text-xs font-mono text-green-500">+{task.xp}</span>
                        </div>
                      </button>
                    );
                 })
               ) : (
                   <div className="p-8 text-center text-neutral-500">No tasks. Enjoy the break.</div>
               )}
            </div>

            {isDayComplete && (
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center animate-in fade-in slide-in-from-bottom-4">
                    <Trophy className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-bold text-green-400">Day Conquered!</h3>
                    <p className="text-xs text-green-200 mb-4">You have finished everything scheduled for {selectedDate.toLocaleDateString()}.</p>
                    <button onClick={() => shiftDate(1)} className="bg-green-500 text-black font-bold py-2 px-6 rounded-full hover:bg-green-400 transition-colors text-sm">
                        Next Day &rarr;
                    </button>
                </div>
            )}
          </>
        )}

        {activeTab === 'syllabus' && (
          <div className="space-y-4">
             {SYLLABUS_DB.map((week) => {
               const weekCompletedCount = week.tasks.filter(t => completedIds.includes(t.id)).length;
               const totalWeekTasks = week.tasks.length;
               return (
                 <div key={week.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white">{week.title}</h3>
                        <span className="text-xs text-neutral-500">{weekCompletedCount}/{totalWeekTasks}</span>
                     </div>
                     <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500" style={{ width: `${(weekCompletedCount/totalWeekTasks)*100}%` }}></div>
                     </div>
                 </div>
               );
             })}
          </div>
        )}

        {activeTab === 'history' && (
           <div className="space-y-2">
               <h3 className="text-xs font-bold text-neutral-500 uppercase">Completed Tasks</h3>
               {completedIds.slice().reverse().map(id => {
                   const t = SYLLABUS_DB.flatMap(w=>w.tasks).concat(DRILLS).find(x => x.id === id || id.startsWith(x.id));
                   if(!t) return null;
                   return (
                       <div key={id} className="flex justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                           <span className="text-sm text-neutral-300 line-through">{t.title}</span>
                           <button onClick={() => toggleTask(id, t.xp)} className="text-xs text-red-500">Undo</button>
                       </div>
                   )
               })}
           </div>
        )}

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
            <p className="text-[10px] text-neutral-600 text-center">V13 Final. Local Save Enabled.</p>
        </div>

      </div>

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
               {tab === 'dashboard' && <CalendarIcon className="w-5 h-5 mb-1" />}
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