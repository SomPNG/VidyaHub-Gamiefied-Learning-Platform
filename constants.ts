// FIX: Add import for Phaser to resolve 'Cannot find name "Phaser"' error.
import Phaser from 'phaser';
import { Subject, StudentData } from './types';
import { BeakerIcon, BookOpenIcon, CalculatorIcon, GlobeAltIcon, LightBulbIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { NumberCollectorScene } from './games/NumberCollector';
import { WordScrambleScene } from './games/WordScramble';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'math', name: 'Mathematics', icon: CalculatorIcon,
    chapters: [
      { id: 'm1', title: 'Number Systems', content: [
        { id: 'm1l1', type: 'lecture', title: 'Introduction to Real Numbers', url: '#'},
        { id: 'm1p1', type: 'pdf', title: 'Chapter 1 Study Pack', url: '#'},
        { id: 'm1q1', type: 'quiz', title: 'Number Systems Quiz', questions: [
          {id: 'mq1', question: 'What is the value of Pi (approx)?', options: ['3.14', '2.14', '4.14', '3.00'], answer: '3.14', type: 'mcq', explanation: 'Pi (π) is the ratio of a circle\'s circumference to its diameter, approximately equal to 3.14159.'},
          {id: 'mq2', question: '2 + 2 = ?', options: [], answer: '4', type: 'fill-in-the-blanks', explanation: 'This is a fundamental arithmetic operation. Adding two to two results in four.'}
        ]},
        { id: 'm1g1', type: 'game', title: 'Number Collector', description: 'Collect the falling multiples of 3!', gameConfig: {
          type: Phaser.AUTO,
          width: 800,
          height: 600,
          physics: {
            default: 'arcade',
            arcade: {
              // FIX: The gravity property requires both x and y values.
              gravity: { x: 0, y: 200 }
            }
          },
          scene: NumberCollectorScene
        }}
      ]},
      { id: 'm2', title: 'Polynomials', content: [
        { id: 'm2l1', type: 'lecture', title: 'Understanding Polynomials', url: '#'},
        { id: 'm2p1', type: 'pdf', title: 'Polynomials Study Guide', url: '#'},
        { id: 'm2g1', type: 'game', title: 'Polynomial Puzzle', description: 'Match polynomial expressions to their simplified forms.'},
      ]},
      { id: 'm3', title: 'Coordinate Geometry', content: [
         { id: 'm3l1', type: 'lecture', title: 'Introduction to the Cartesian Plane', url: '#'},
         { id: 'm3q1', type: 'quiz', title: 'Geometry Quiz', questions: [
            {id: 'mq3', question: 'What are the coordinates of the origin?', options: ['(1,1)', '(0,0)', '(1,0)', '(0,1)'], answer: '(0,0)', type: 'mcq', explanation: 'The origin is the point where the x-axis and y-axis intersect, which is at coordinates (0,0).'}
         ]}
      ]},
      { id: 'm4', title: 'Introduction to Trigonometry', content: [] },
      { id: 'm5', title: 'Statistics', content: [] },
    ]
  },
  {
    id: 'science', name: 'Science', icon: BeakerIcon,
    chapters: [
      { id: 's1', title: 'Laws of Motion', content: [
         { id: 's1l1', type: 'lecture', title: 'Newton\'s First Law', url: '#'},
         { id: 's1p1', type: 'pdf', title: 'Motion Study Guide', url: '#'},
         { id: 's1q1', type: 'quiz', title: 'Motion Quiz', questions: [
          {id: 'sq1', question: 'Force = Mass x ?', options: ['Acceleration', 'Velocity', 'Speed', 'Time'], answer: 'Acceleration', type: 'mcq', explanation: 'This is Newton\'s Second Law of Motion, which states that Force equals Mass times Acceleration (F=ma).'},
        ]}
      ]},
      { id: 's2', title: 'Chemical Reactions', content: [
        { id: 's2l1', type: 'lecture', title: 'Types of Chemical Reactions', url: '#'},
        { id: 's2p1', type: 'pdf', title: 'Reactions Study Pack', url: '#'},
      ]},
      { id: 's3', title: 'Life Processes', content: [
        { id: 's3l1', type: 'lecture', title: 'Nutrition in Living Organisms', url: '#'},
        { id: 's3g1', type: 'game', title: 'Cellular Voyage', description: 'Explore the human cell.'}
      ]},
      { id: 's4', title: 'Light - Reflection and Refraction', content: [] },
      { id: 's5', 'title': 'Electricity', content: [] },
    ]
  },
  { 
    id: 'social', name: 'Social Studies', icon: GlobeAltIcon, 
    chapters: [
        {id: 'ss1', title: 'The Rise of Nationalism in Europe', content: [
            {id: 'ss1l1', type: 'lecture', title: 'The French Revolution and the Idea of the Nation', url: '#'},
            {id: 'ss1p1', type: 'pdf', title: 'Nationalism Study Pack', url: '#'},
        ]},
        {id: 'ss2', title: 'Resources and Development', content: [
            {id: 'ss2l1', type: 'lecture', title: 'Types of Resources', url: '#'},
            {id: 'ss2q1', type: 'quiz', title: 'Geography Quiz', questions: [
                {id: 'ssq1', question: 'Which of these is a renewable resource?', options: ['Coal', 'Petroleum', 'Solar Energy', 'Natural Gas'], answer: 'Solar Energy', type: 'mcq', explanation: 'Solar energy is a renewable resource because it is derived from the sun, which is a virtually inexhaustible source. Coal, petroleum, and natural gas are fossil fuels and are non-renewable.'}
            ]}
        ]},
        {id: 'ss3', title: 'Power Sharing', content: [] },
        {id: 'ss4', title: 'Agriculture', content: [] },
    ] 
  },
  { 
    id: 'english', name: 'English', icon: BookOpenIcon, 
    chapters: [
        {id: 'e1', title: 'Prose - A Letter to God', content: [
            {id: 'e1l1', type: 'lecture', title: 'Story Summary & Analysis', url: '#'},
            {id: 'e1p1', type: 'pdf', title: 'Full Text and Questions', url: '#'},
            { id: 'e1g1', type: 'game', title: 'Word Scramble', description: 'Unscramble the vocabulary word!', gameConfig: {
                type: Phaser.AUTO,
                width: 800,
                height: 600,
                scene: [WordScrambleScene]
            }}
        ]},
        {id: 'e2', title: 'Grammar - Tenses', content: [
            {id: 'e2l1', type: 'lecture', title: 'Understanding Past, Present, and Future', url: '#'},
            {id: 'e2q1', type: 'quiz', title: 'Tense Identification Quiz', questions: [
                 {id: 'eq1', question: 'Identify the tense: "He is playing football."', options: ['Present Perfect', 'Past Continuous', 'Present Continuous', 'Future Simple'], answer: 'Present Continuous', type: 'mcq', explanation: 'The sentence uses the verb "is playing," which is the structure for the Present Continuous tense, indicating an action happening now.'}
            ]},
            {id: 'e2g1', type: 'game', title: 'Tense Troubles', description: 'Fix the broken sentences.'}
        ]},
        {id: 'e3', title: 'Poetry - Dust of Snow', content: []},
    ] 
  },
  { 
    id: 'physics', name: 'Physics', icon: LightBulbIcon, 
    chapters: [
        {id: 'p1', title: 'Units and Measurement', content: []},
        {id: 'p2', title: 'Work, Energy and Power', content: [
            {id: 'p2l1', type: 'lecture', title: 'Work-Energy Theorem', url: '#'},
            {id: 'p2p1', type: 'pdf', title: 'Chapter Notes', url: '#'}
        ]},
        {id: 'p3', title: 'Gravitation', content: []},
    ] 
  },
  { 
    id: 'chemistry', name: 'Chemistry', icon: ScaleIcon, 
    chapters: [
        {id: 'c1', title: 'Structure of Atom', content: [
            {id: 'c1l1', type: 'lecture', title: 'Bohr\'s Model of an Atom', url: '#'},
            {id: 'c1p1', type: 'pdf', title: 'Atomic Models Guide', url: '#'},
            {id: 'c1q1', type: 'quiz', title: 'Atomic Structure Quiz', questions: [
                {id: 'cq1', question: 'Which particle has a negative charge?', options: ['Proton', 'Neutron', 'Electron', 'Photon'], answer: 'Electron', type: 'mcq', explanation: 'In an atom, an electron carries a negative charge, a proton carries a positive charge, and a neutron has no charge.'}
            ]},
            { id: 'c1g1', type: 'game', title: 'Atom Builder', description: 'Drag and drop protons, neutrons, and electrons to build different elements.'}
        ]},
        {id: 'c2', title: 'States of Matter', content: []},
        {id: 'c3', title: 'Chemical Bonding', content: []},
    ]
  },
];


export const MOCK_STUDENT_DATA: StudentData[] = [
  { id: 's1', name: 'Alice', grade: 8, progress: {}, coins: 1250, badges: ['Math Whiz', 'Science Starter'], level: 'Silver', lastUpdated: Date.now() },
  { id: 's2', name: 'Bob', grade: 8, progress: {}, coins: 800, badges: ['Science Starter'], level: 'Bronze', lastUpdated: Date.now() },
  { id: 's3', name: 'Charlie', grade: 8, progress: {}, coins: 2100, badges: ['Math Whiz', 'Science Expert', 'Top Learner'], level: 'Gold', lastUpdated: Date.now() },
  { id: 's4', name: 'Diana', grade: 8, progress: {}, coins: 500, badges: [], level: 'Bronze', lastUpdated: Date.now() },
];

export const MOCK_LEADERBOARD = MOCK_STUDENT_DATA.sort((a, b) => b.coins - a.coins);

export const BADGES = {
  'math-whiz': { name: 'Math Whiz', icon: '🧠', description: 'Mastered 3 Math quizzes.' },
  'science-starter': { name: 'Science Starter', icon: '🔬', description: 'Completed first Science chapter.' },
  'top-learner': { name: 'Top Learner', icon: '🏆', description: 'Reached the top of the leaderboard.' },
  'ai-explorer': { name: 'AI Explorer', icon: '🤖', description: 'Used the AI Tutor 5 times.' }
};