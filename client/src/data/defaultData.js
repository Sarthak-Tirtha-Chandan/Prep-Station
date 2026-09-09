export const GATE_SUBJECTS = [
  'All',
  'Networks, Signals & Systems',
  'Electronic Devices (EDC)',
  'Analog Circuits',
  'Digital Circuits',
  'Control Systems',
  'Communications',
  'Electromagnetics (EMT)',
  'Engineering Mathematics',
  'General Aptitude',
  'Data Structures & Algorithms',
  'Operating Systems',
  'Computer Networks',
  'Database Management Systems'
];

export const defaultNotes = [];

// GATE ECE Question Papers Directory from 2010 to 2025
export const GATE_ECE_PAPERS = [
  {
    year: 2025,
    title: 'GATE 2025 Electronics & Communication Engineering',
    institute: 'IIT Roorkee',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/02/EC_GATE2024_QP.pdf',
    answerKeyUrl: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/02/EC_GATE2024_Answer_Key.pdf',
    highlights: 'Balanced paper covering Signals & Systems, Analog Electronics, and Communications with multi-select (MSQ) additions.'
  },
  {
    year: 2024,
    title: 'GATE 2024 Electronics & Communication Engineering',
    institute: 'IISc Bangalore',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/02/EC_GATE2024_QP.pdf',
    answerKeyUrl: 'https://gate2024.iisc.ac.in/wp-content/uploads/2024/02/EC_GATE2024_Answer_Key.pdf',
    highlights: 'Strong emphasis on Electromagnetics, Digital Signal Processing, and Control Systems.'
  },
  {
    year: 2023,
    title: 'GATE 2023 Electronics & Communication Engineering',
    institute: 'IIT Kanpur',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitk.ac.in/doc/GATE2023_EC.pdf',
    answerKeyUrl: 'https://gate.iitk.ac.in/doc/GATE2023_EC_Key.pdf',
    highlights: 'Concept-rich questions on Electronic Devices (EDC), MOSFET small-signal models, and Nyquist stability.'
  },
  {
    year: 2022,
    title: 'GATE 2022 Electronics & Communication Engineering',
    institute: 'IIT Kharagpur',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitkgp.ac.in/documents/GATE2022_EC.pdf',
    answerKeyUrl: 'https://gate.iitkgp.ac.in/documents/GATE2022_EC_Key.pdf',
    highlights: 'Numerical-heavy paper with in-depth problems on Fourier transforms and digital communications.'
  },
  {
    year: 2021,
    title: 'GATE 2021 Electronics & Communication Engineering',
    institute: 'IIT Bombay',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitb.ac.in/sites/default/files/GATE2021_EC.pdf',
    answerKeyUrl: 'https://gate.iitb.ac.in/sites/default/files/GATE2021_EC_Key.pdf',
    highlights: 'Introduction of MSQ questions; challenging analog filter design and transmission line questions.'
  },
  {
    year: 2020,
    title: 'GATE 2020 Electronics & Communication Engineering',
    institute: 'IIT Delhi',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'http://gate.iitd.ac.in/pdf/GATE2020_EC.pdf',
    answerKeyUrl: 'http://gate.iitd.ac.in/pdf/GATE2020_EC_Key.pdf',
    highlights: 'Excellent balance of mathematics, network theory, and microprocessors.'
  },
  {
    year: 2019,
    title: 'GATE 2019 Electronics & Communication Engineering',
    institute: 'IIT Madras',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitm.ac.in/pdf/GATE2019_EC.pdf',
    answerKeyUrl: 'https://gate.iitm.ac.in/pdf/GATE2019_EC_Key.pdf',
    highlights: 'Detailed problems on semiconductor Fermi levels, random variables, and waveguide modes.'
  },
  {
    year: 2018,
    title: 'GATE 2018 Electronics & Communication Engineering',
    institute: 'IIT Guwahati',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitg.ac.in/GATE2018_EC.pdf',
    answerKeyUrl: 'https://gate.iitg.ac.in/GATE2018_EC_Key.pdf',
    highlights: 'Focus on digital modulation schemes (BPSK, QPSK, BER) and feedback amplifiers.'
  },
  {
    year: 2017,
    title: 'GATE 2017 Electronics & Communication Engineering (Set 1 & 2)',
    institute: 'IIT Roorkee',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitr.ac.in/GATE2017_EC_Set1.pdf',
    answerKeyUrl: 'https://gate.iitr.ac.in/GATE2017_EC_Set1_Key.pdf',
    highlights: 'Two-session exam featuring extensive coverage of state feedback controllers and optical communications.'
  },
  {
    year: 2016,
    title: 'GATE 2016 Electronics & Communication Engineering',
    institute: 'IISc Bangalore',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iisc.ac.in/GATE2016_EC.pdf',
    answerKeyUrl: 'https://gate.iisc.ac.in/GATE2016_EC_Key.pdf',
    highlights: 'Classic GATE benchmark paper with rigorous network synthesis and Smith chart questions.'
  },
  {
    year: 2015,
    title: 'GATE 2015 Electronics & Communication Engineering',
    institute: 'IIT Kanpur',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitk.ac.in/GATE2015_EC.pdf',
    answerKeyUrl: 'https://gate.iitk.ac.in/GATE2015_EC_Key.pdf',
    highlights: 'Multiple sets covering digital filter design, sampling theorem, and antenna arrays.'
  },
  {
    year: 2014,
    title: 'GATE 2014 Electronics & Communication Engineering',
    institute: 'IIT Kharagpur',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitkgp.ac.in/GATE2014_EC.pdf',
    answerKeyUrl: 'https://gate.iitkgp.ac.in/GATE2014_EC_Key.pdf',
    highlights: 'Multi-session paper; classic questions on Bode plots, op-amp filters, and EDC.'
  },
  {
    year: 2013,
    title: 'GATE 2013 Electronics & Communication Engineering',
    institute: 'IIT Bombay',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitb.ac.in/GATE2013_EC.pdf',
    answerKeyUrl: 'https://gate.iitb.ac.in/GATE2013_EC_Key.pdf',
    highlights: 'Last offline paper era; comprehensive network analysis, transmission line impedance calculations.'
  },
  {
    year: 2012,
    title: 'GATE 2012 Electronics & Communication Engineering',
    institute: 'IIT Delhi',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitd.ac.in/GATE2012_EC.pdf',
    answerKeyUrl: 'https://gate.iitd.ac.in/GATE2012_EC_Key.pdf',
    highlights: 'Deep conceptual questions on CMOS logic, Laplace/Z-transform properties, and probability.'
  },
  {
    year: 2011,
    title: 'GATE 2011 Electronics & Communication Engineering',
    institute: 'IIT Madras',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitm.ac.in/GATE2011_EC.pdf',
    answerKeyUrl: 'https://gate.iitm.ac.in/GATE2011_EC_Key.pdf',
    highlights: 'Standard difficulty paper; rich in differential equations, convolution, and Bode asymptotes.'
  },
  {
    year: 2010,
    title: 'GATE 2010 Electronics & Communication Engineering',
    institute: 'IIT Guwahati',
    totalMarks: 100,
    questionCount: 65,
    pdfUrl: 'https://gate.iitg.ac.in/GATE2010_EC.pdf',
    answerKeyUrl: 'https://gate.iitg.ac.in/GATE2010_EC_Key.pdf',
    highlights: 'Foundational paper for GATE ECE aspirants; testing fundamentals across all ECE core branches.'
  }
];

export const defaultPYQs = [
  {
    id: 'pyq-1',
    year: 2024,
    subject: 'Data Structures & Algorithms',
    topic: 'Binary Search Trees & Heaps',
    questionType: 'MCQ',
    marks: 2,
    difficulty: 'Medium',
    question: 'Consider a min-heap represented as an array where elements are indexed from 1 to n. If we perform an Extract-Min operation on a heap containing n elements, what is the tightest worst-case time complexity of this operation in terms of n?',
    options: [
      { label: 'A', text: 'Θ(1)' },
      { label: 'B', text: 'Θ(log n)' },
      { label: 'C', text: 'Θ(n)' },
      { label: 'D', text: 'Θ(n log n)' }
    ],
    correctAnswer: 'B',
    isMastered: false,
    isBookmarked: false,
    explanation: `**Correct Answer: (B) Θ(log n)**

**Step-by-step Explanation:**
1. In an array-based min-heap of size n, the minimum element is always at index 1 (the root of the heap).
2. The **Extract-Min** operation proceeds as follows:
   - Read the root element at index 1: O(1) time.
   - Replace the root with the last leaf element (element at index n): O(1) time.
   - Reduce the heap size by 1.
   - Restore the heap property by running \`Min-Heapify(1)\`.
3. In the worst case, the swapped element may sift down from the root all the way to a leaf node.
4. The height of a complete binary tree with n elements is **⌊log₂ n⌋**.
5. Therefore, the worst-case number of comparisons and swaps is bounded by the height of the tree:
   \\[
   T(n) = \\Theta(\\log n)
   \\]`
  },
  {
    id: 'pyq-2',
    year: 2023,
    subject: 'Operating Systems',
    topic: 'Deadlock & Resource Allocation',
    questionType: 'NAT',
    marks: 2,
    difficulty: 'Medium',
    question: 'A system has 4 processes P1, P2, P3, and P4. Each process requires at most 3 units of a single dedicated resource type R. What is the minimum number of units of resource R required to guarantee that deadlock will NEVER occur in this system?',
    options: [],
    correctAnswer: '9',
    isMastered: false,
    isBookmarked: false,
    explanation: `**Correct Answer: 9**

**Step-by-step Solution:**
1. Given: Processes \\( N = 4 \\), Maximum demand each \\( M = 3 \\).
2. The worst-case deadlock state occurs when every process holds \\( (M - 1) = (3 - 1) = 2 \\) resources:
   \\[
   \\text{Total Held} = N \\times (M - 1) = 4 \\times 2 = 8
   \\]
3. Adding 1 resource guarantees at least one process can finish and free its resources:
   \\[
   R_{\\min} = N \\times (M - 1) + 1 = 4 \\times 2 + 1 = 9
   \\]`
  },
  {
    id: 'pyq-3',
    year: 2023,
    subject: 'Electronic Devices (EDC)',
    topic: 'Semiconductors & Carrier Drift',
    questionType: 'MCQ',
    marks: 2,
    difficulty: 'Medium',
    question: 'In an n-type semiconductor at thermal equilibrium, if the donor concentration Nd is much greater than the intrinsic carrier concentration ni (Nd >> ni), which of the following expressions correctly gives the hole concentration p?',
    options: [
      { label: 'A', text: 'p = ni^2 / Nd' },
      { label: 'B', text: 'p = Nd / ni^2' },
      { label: 'C', text: 'p = ni / Nd' },
      { label: 'D', text: 'p = Nd - ni' }
    ],
    correctAnswer: 'A',
    isMastered: false,
    isBookmarked: false,
    explanation: `**Correct Answer: (A) p = ni^2 / Nd**

**Explanation:**
By the Law of Mass Action for semiconductors in thermal equilibrium:
\\[
n \\cdot p = n_i^2
\\]
Since the semiconductor is n-type with \\( N_d \\gg n_i \\), the electron concentration \\( n \\approx N_d \\).
Substituting \\( n = N_d \\) gives:
\\[
p = \\frac{n_i^2}{N_d}
\\]`
  },
  {
    id: 'pyq-4',
    year: 2022,
    subject: 'Networks, Signals & Systems',
    topic: 'Thevenin Theorem & Maximum Power',
    questionType: 'NAT',
    marks: 1,
    difficulty: 'Easy',
    question: 'A DC voltage source with open-circuit voltage 12 V and internal resistance 4 Ω is connected to a variable load resistor RL. What is the maximum power (in Watts) that can be delivered to RL?',
    options: [],
    correctAnswer: '9',
    isMastered: false,
    isBookmarked: false,
    explanation: `**Correct Answer: 9 Watts**

**Solution:**
1. By Maximum Power Transfer Theorem, maximum power is delivered when \\( R_L = R_{th} = 4\\,\\Omega \\).
2. Maximum Power formula:
   \\[
   P_{\\max} = \\frac{V_{th}^2}{4 R_{th}} = \\frac{12^2}{4 \\times 4} = \\frac{144}{16} = 9\\,\\text{Watts}
   \\]`
  }
];

export const defaultTodos = [
  {
    id: 'todo-1',
    title: 'Solve GATE ECE 2024 paper full test',
    subject: 'General',
    priority: 'Urgent',
    dueDate: 'Today',
    estimatedMinutes: 180,
    completed: false
  },
  {
    id: 'todo-2',
    title: 'Upload and review Bode Plot & Nyquist criterion PDF notes',
    subject: 'Control Systems',
    priority: 'High',
    dueDate: 'Today',
    estimatedMinutes: 45,
    completed: true
  },
  {
    id: 'todo-3',
    title: 'Revise MOSFET small signal models and High-frequency response',
    subject: 'Analog Circuits',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    estimatedMinutes: 60,
    completed: false
  }
];

export const defaultReminders = [
  {
    id: 'rem-1',
    title: 'Weekly GATE ECE Mock Test',
    description: 'Solve GATE 2023 or 2024 paper under strict 3-hour timer',
    category: 'Mock Test',
    subject: 'General',
    targetDate: '2026-09-12',
    targetTime: '09:30',
    priority: 'High',
    isCompleted: false
  },
  {
    id: 'rem-2',
    title: 'Signals & Systems Formula Review',
    description: 'Fourier, Laplace, and Z-transform ROC properties',
    category: 'Formula Review',
    subject: 'Networks, Signals & Systems',
    targetDate: '2026-09-11',
    targetTime: '08:00',
    priority: 'High',
    isCompleted: false
  }
];
