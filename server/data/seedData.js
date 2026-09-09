export const seedNotes = [
  {
    title: 'Time & Space Complexity Mastersheet',
    subject: 'Data Structures & Algorithms',
    topic: 'Asymptotic Analysis & Recurrences',
    isHighYield: true,
    isFavorite: true,
    tags: ['Master Theorem', 'Asymptotic Notation', 'Recurrence Relations'],
    keyFormulas: [
      'Master Theorem: T(n) = aT(n/b) + f(n)',
      'Case 1: f(n) = O(n^(log_b(a) - ε)) => T(n) = Θ(n^(log_b(a)))',
      'Case 2: f(n) = Θ(n^(log_b(a)) * log^k(n)) => T(n) = Θ(n^(log_b(a)) * log^(k+1)(n))',
      'Case 3: f(n) = Ω(n^(log_b(a) + ε)) and regular => T(n) = Θ(f(n))'
    ],
    keyTakeaways: [
      'Worst case for QuickSort occurs on already sorted array with first/last pivot: O(n²)',
      'HeapSort worst case is always O(n log n) and in-place, but not stable',
      'Binary Search requires random access: O(log n) on sorted array, but O(n) on singly linked list',
      'Akra-Bazzi method extends Master Theorem for unequal subproblem sizes like T(n) = T(n/3) + T(2n/3) + cn'
    ],
    content: `### Asymptotic Complexity Hierarchy
\`\`\`
O(1) < O(log log n) < O(log n) < O(n^(1/k)) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!) < O(n^n)
\`\`\`

#### Essential Comparison Sorting Bounds:
- **MergeSort:** Time O(n log n) in all cases. Auxiliary space: O(n). Stable.
- **QuickSort:** Avg O(n log n), Worst O(n²). Auxiliary space: O(log n) recursion stack. Not stable.
- **HeapSort:** Time O(n log n) always. Auxiliary space: O(1). Not stable.
- **Comparison Tree Lower Bound:** Any comparison-based sorting algorithm requires at least **Ω(n log n)** comparisons in worst case because the decision tree has n! leaves, depth >= ceil(log2(n!)) = Ω(n log n).`
  },
  {
    title: 'Process Synchronization & Classical Concurrency',
    subject: 'Operating Systems',
    topic: 'Concurrency, Semaphores & Deadlocks',
    isHighYield: true,
    isFavorite: true,
    tags: ['Semaphores', 'Peterson Solution', 'Banker Algorithm', 'Coffman Conditions'],
    keyFormulas: [
      'Coffman Conditions for Deadlock: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
      'Deadlock Free Condition: Total resources R >= N*(M - 1) + 1 (where N = processes, M = max demand each)',
      'Counting Semaphore value S: S > 0 (available resources), S < 0 (|S| processes queued in wait)'
    ],
    keyTakeaways: [
      'Peterson solution satisfies Mutual Exclusion and Progress, with Bounded Waiting for 2 processes',
      'TestAndSet & Swap hardware instructions guarantee atomic execution',
      'Deadlock prevention eliminates at least one Coffman condition; Avoidance uses Banker\'s algorithm',
      'Binary semaphores take values 0 or 1; Counting semaphores can be initialized to any non-negative integer'
    ],
    content: `### Critical Section Requirements
1. **Mutual Exclusion:** If process Pi is executing in its critical section, no other processes can be executing in their critical sections.
2. **Progress:** If no process is in critical section and some wish to enter, selection cannot be postponed indefinitely. Only processes not in remainder section participate in decision.
3. **Bounded Waiting:** A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request.

#### Banker's Algorithm Data Structures:
- **Available[m]:** Vector of length m indicating available units of each resource type.
- **Max[n, m]:** Maximum demand of each process.
- **Allocation[n, m]:** Resources currently allocated to each process.
- **Need[n, m]:** Remaining resource need, where \`Need[i, j] = Max[i, j] - Allocation[i, j]\`.`
  },
  {
    title: 'Relational Database Normalization & Normal Forms',
    subject: 'Database Management Systems',
    topic: 'Functional Dependencies & Normalization',
    isHighYield: true,
    isFavorite: false,
    tags: ['Functional Dependency', '1NF', '2NF', '3NF', 'BCNF', 'Lossless Join'],
    keyFormulas: [
      'Candidate Key check: Attribute closure (X)+ must contain all attributes of the relation R',
      'Lossless Decomposition: R1 ∩ R2 -> R1 or R1 ∩ R2 -> R2 must hold in F+',
      'Dependency Preserving: (F1 ∪ F2)+ = F+'
    ],
    keyTakeaways: [
      '2NF: Every non-prime attribute is fully functionally dependent on every candidate key (no partial dependency)',
      '3NF: For every non-trivial X -> A, either X is a superkey OR A is a prime attribute',
      'BCNF: For every non-trivial X -> A, X MUST be a superkey',
      'BCNF decomposition is always lossless, but may NOT be dependency preserving. 3NF always guarantees both!'
    ],
    content: `### Summary of Normal Forms Hierarchy
\`\`\`
BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF
\`\`\`

#### Decomposition Guidelines:
- Any relation with 2 attributes is always in BCNF.
- If all attributes are prime, the relation is automatically in 3NF!
- A decomposition into 3NF is ALWAYS achievable with both **Lossless Join** and **Dependency Preservation**.
- BCNF guarantees absence of anomalies due to functional dependencies, but cannot always preserve dependencies.`
  },
  {
    title: 'IP Addressing, Subnetting & CIDR Calculation',
    subject: 'Computer Networks',
    topic: 'Network Layer & IP Protocol',
    isHighYield: true,
    isFavorite: true,
    tags: ['Subnetting', 'CIDR', 'Supernetting', 'IPv4 Header'],
    keyFormulas: [
      'Number of usable host addresses in /n subnet = 2^(32 - n) - 2',
      'First address: Network ID (all host bits 0)',
      'Last address: Directed Broadcast Address (all host bits 1)',
      'IPv4 Header Length field: 4 bits, multiplied by 4 bytes (range: 20B to 60B)'
    ],
    keyTakeaways: [
      'Subnet mask determines network portion vs host portion',
      'Longest Prefix Match is used by routing tables when multiple routes match an incoming destination IP',
      'Private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16',
      'Fragmentation offset in IPv4 header is measured in units of 8 bytes (64 bits)'
    ],
    content: `### CIDR Subnet Notation Cheat Sheet:
- \`/24\` = 256 addresses (254 hosts), Mask \`255.255.255.0\`
- \`/25\` = 128 addresses (126 hosts), Mask \`255.255.255.128\`
- \`/26\` = 64 addresses (62 hosts), Mask \`255.255.255.192\`
- \`/27\` = 32 addresses (30 hosts), Mask \`255.255.255.224\`
- \`/28\` = 16 addresses (14 hosts), Mask \`255.255.255.240\`
- \`/30\` = 4 addresses (2 hosts, point-to-point links), Mask \`255.255.255.252\`

#### Fragmentation Offset Example:
If MTU = 1000 bytes and total packet length = 4000 bytes (header 20 bytes, data 3980 bytes):
Max data per fragment = floor((1000 - 20) / 8) * 8 = floor(980 / 8) * 8 = 122 * 8 = 976 bytes.`
  },
  {
    title: 'Regular Languages & Finite Automata Properties',
    subject: 'Theory of Computation',
    topic: 'Chomsky Hierarchy & Closure Properties',
    isHighYield: true,
    isFavorite: false,
    tags: ['DFA', 'NFA', 'Pumping Lemma', 'Closure Properties', 'Myhill-Nerode'],
    keyFormulas: [
      'Pumping Lemma for Regular: string w = xyz, |xy| <= p, |y| >= 1, xy^i z ∈ L for all i >= 0',
      'Number of states in DFA equivalent to n-state NFA: at most 2^n states',
      'Regular Languages are closed under: Union, Intersection, Complement, Concatenation, Kleene Star, Reversal'
    ],
    keyTakeaways: [
      'Finite languages are ALWAYS regular',
      'Every regular language is context-free, but not vice versa',
      'Emptiness, Finiteness, and Equivalence are all decidable for Regular Languages',
      'Complement of a DFA: swap final and non-final states (only works if DFA is complete with dead states included)'
    ],
    content: `### Closure Matrix Quick Glance:
| Operation | Regular | CFL | DCFL | CSL | Recursive | REC |
|---|---|---|---|---|---|---|
| Union | Yes | Yes | No | Yes | Yes | Yes |
| Intersection | Yes | No | No | Yes | Yes | Yes |
| Complement | Yes | No | Yes | Yes | Yes | No |
| Kleene Star | Yes | Yes | No | Yes | Yes | Yes |
| Intersection with Regular | Yes | Yes | Yes | Yes | Yes | Yes |`
  },
  {
    title: 'Cache Memory Mapping Techniques & Formulas',
    subject: 'Computer Organization & Architecture',
    topic: 'Memory Hierarchy & Cache Organisation',
    isHighYield: true,
    isFavorite: true,
    tags: ['Direct Mapped', 'Set Associative', 'Fully Associative', 'Hit Ratio'],
    keyFormulas: [
      'Effective Memory Access Time (EMAT) = h * T_cache + (1 - h) * T_main',
      'Block Offset bits = log2(Block Size in bytes)',
      'Direct Mapped: Index bits = log2(Number of Cache Lines), Tag bits = Address bits - (Index + Offset)',
      'k-way Set Associative: Number of Sets = (Cache Lines) / k, Set bits = log2(Sets)'
    ],
    keyTakeaways: [
      'Fully Associative cache has NO index bits (Index = 0), entire remaining bits are Tag bits',
      'Tag Directory Size = (Number of Lines) * (Tag bits + Valid bit + Dirty bit if write-back)',
      'Spatial locality benefits from larger block size; Temporal locality benefits from replacement policies (LRU, FIFO)'
    ],
    content: `### Cache Addressing Comparison:
- **Direct Mapped:** [ Tag | Cache Line Index | Block Offset ]
- **k-way Set Associative:** [ Tag | Set Index | Block Offset ]
- **Fully Associative:** [ Tag | Block Offset ]`
  }
];

export const seedPYQs = [
  {
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
    explanation: `**Correct Answer: (B) Θ(log n)**

**Step-by-step Explanation:**
1. In an array-based min-heap of size n, the minimum element is always at index 1 (the root of the heap).
2. The **Extract-Min** operation proceeds as follows:
   - Read the root element at index 1: O(1) time.
   - Replace the root with the last leaf element (element at index n): O(1) time.
   - Reduce the heap size by 1.
   - Restore the heap property by running \`Min-Heapify(1)\`.
3. In the worst case, the swapped element may violate the min-heap property at every level and sift down from the root all the way to a leaf node.
4. The height of a complete binary tree with n elements is **⌊log₂ n⌋**.
5. At each level of the tree, comparing with children and swapping takes constant time O(1).
6. Therefore, the worst-case number of comparisons and swaps is bounded by the height of the tree:
   \\[
   T(n) = \\Theta(\\log n)
   \\]`
  },
  {
    year: 2023,
    subject: 'Operating Systems',
    topic: 'Deadlock & Resource Allocation',
    questionType: 'NAT',
    marks: 2,
    difficulty: 'Medium',
    question: 'A system has 4 processes P1, P2, P3, and P4. Each process requires at most 3 units of a single dedicated resource type R. What is the minimum number of units of resource R required to guarantee that deadlock will NEVER occur in this system?',
    options: [],
    correctAnswer: '9',
    explanation: `**Correct Answer: 9**

**Step-by-step Solution:**
1. **Given:**
   - Number of processes \\( N = 4 \\)
   - Maximum demand of each process \\( M = 3 \\)
2. **Worst-Case Allocation (Maximum deadlock prone state):**
   - The worst case occurs when every process is allocated one resource less than its maximum requirement and is waiting for that one remaining resource.
   - Each process holds \\( (M - 1) = (3 - 1) = 2 \\) resources.
   - Total resources held by all 4 processes in this state:
     \\[
     \\text{Total Allocated} = N \\times (M - 1) = 4 \\times 2 = 8 \\text{ resources}
     \\]
   - In this state with 8 resources, every process holds 2 units and needs 1 more unit. None can complete, causing a deadlock.
3. **Deadlock-free guarantee condition:**
   - If we have just **one additional resource** (total = 8 + 1 = 9), at least one process can acquire its required 3rd resource, finish execution, and release all its 3 allocated resources back to the pool.
   - General formula:
     \\[
     R_{\\min} = N \\times (M - 1) + 1 = 4 \\times (3 - 1) + 1 = 8 + 1 = 9
     \\]
Hence, the minimum number of units required is **9**.`
  },
  {
    year: 2023,
    subject: 'Database Management Systems',
    topic: 'Functional Dependencies & Normal Forms',
    questionType: 'MCQ',
    marks: 2,
    difficulty: 'Hard',
    question: 'Given relation R(A, B, C, D, E) with functional dependencies: F = { A -> BC, CD -> E, B -> D, E -> A }. Which of the following is the canonical set of candidate keys for R?',
    options: [
      { label: 'A', text: '{ A, E }' },
      { label: 'B', text: '{ A, B, E }' },
      { label: 'C', text: '{ A, BC, E }' },
      { label: 'D', text: '{ A, CD, E }' }
    ],
    correctAnswer: 'A',
    explanation: `**Correct Answer: (A) { A, E }**

**Step-by-step Derivation:**
1. Find attribute closures for single attributes:
   - \\( A^+ = \\{A\\} \\rightarrow \\{A, B, C\\} \\) (via A -> BC)
     - From B -> D, add D: \\( \\{A, B, C, D\\} \\)
     - From CD -> E, add E: \\( \\{A, B, C, D, E\\} \\)
     - Since \\( A^+ \\) contains all attributes of R, **A is a Candidate Key**.

2. Test other single attributes:
   - \\( E^+ = \\{E\\} \\rightarrow \\{E, A\\} \\) (via E -> A)
     - Since \\( A \\in E^+ \\) and \\( A^+ \\) yields all attributes, \\( E^+ = \\{A, B, C, D, E\\} \\).
     - Hence, **E is a Candidate Key**.

3. Check B:
   - \\( B^+ = \\{B, D\\} \\neq R \\). Not a candidate key on its own.
4. Check C:
   - \\( C^+ = \\{C\\} \\neq R \\).
5. Check D:
   - \\( D^+ = \\{D\\} \\neq R \\).
6. Can any composite key exist?
   - Any attribute set containing A or E will be a superkey, not minimal.
   - Combinations of {B, C, D}: \\( (BC)^+ = \\{B, C, D, E, A\\} \\), but notice option (A) lists candidate keys formed: {A, E}.
   - Therefore, the minimal candidate keys in the options are **{ A, E }**.`
  },
  {
    year: 2022,
    subject: 'Computer Networks',
    topic: 'Subnetting & Addressing',
    questionType: 'NAT',
    marks: 1,
    difficulty: 'Easy',
    question: 'An organization is allocated the IP prefix 200.10.20.0/24. The network administrator wants to create 4 equal-sized subnets. What is the maximum number of usable host IP addresses in each subnet?',
    options: [],
    correctAnswer: '62',
    explanation: `**Correct Answer: 62**

**Step-by-step Solution:**
1. Given prefix length = /24. Total IP addresses = \\( 2^{(32 - 24)} = 2^8 = 256 \\).
2. To divide into 4 equal-sized subnets:
   - We need \\( \\log_2(4) = 2 \\) subnet bits.
   - New subnet mask prefix length = \\( 24 + 2 = /26 \\).
3. In each /26 subnet:
   - Number of host bits remaining = \\( 32 - 26 = 6 \\) bits.
   - Total IP addresses per subnet = \\( 2^6 = 64 \\).
4. Usable host IP addresses:
   - The first address is reserved as the Subnet/Network ID (all host bits 0).
   - The last address is reserved as the Directed Broadcast Address (all host bits 1).
   - Usable host count = \\( 2^6 - 2 = 64 - 2 = 62 \\).

Hence, maximum usable host IP addresses per subnet is **62**.`
  },
  {
    year: 2022,
    subject: 'Theory of Computation',
    topic: 'Chomsky Hierarchy & Languages',
    questionType: 'MCQ',
    marks: 2,
    difficulty: 'Medium',
    question: 'Let L1 = { a^n b^n c^m | n, m >= 1 } and L2 = { a^n b^m c^m | n, m >= 1 }. Which of the following statements is TRUE regarding L1 ∩ L2?',
    options: [
      { label: 'A', text: 'L1 ∩ L2 is regular' },
      { label: 'B', text: 'L1 ∩ L2 is deterministic context-free (DCFL)' },
      { label: 'C', text: 'L1 ∩ L2 is context-free but not deterministic' },
      { label: 'D', text: 'L1 ∩ L2 is not context-free (CSL)' }
    ],
    correctAnswer: 'D',
    explanation: `**Correct Answer: (D) L1 ∩ L2 is not context-free (CSL)**

**Explanation:**
1. \\( L_1 = \\{ a^n b^n c^m \\mid n, m \\ge 1 \\} \\) matches the count of a's with b's (independent of c's). This is a Context-Free Language (CFL) recognized by a pushdown automaton that pushes a's and pops on b's.
2. \\( L_2 = \\{ a^n b^m c^m \\mid n, m \\ge 1 \\} \\) matches the count of b's with c's (independent of a's). This is also a CFL.
3. The intersection:
   \\[
   L_1 \\cap L_2 = \\{ a^k b^k c^k \\mid k \\ge 1 \\}
   \\]
4. \\( \\{ a^k b^k c^k \\mid k \\ge 1 \\} \\) requires comparing counts of three different symbols simultaneously, which requires two separate memory comparisons. A single stack in a PDA cannot perform this.
5. By the Context-Free Pumping Lemma, \\( \\{ a^k b^k c^k \\} \\) is famously **NOT context-free** (it is a Context-Sensitive Language).
6. This also demonstrates that Context-Free Languages are **NOT closed under intersection**.`
  },
  {
    year: 2021,
    subject: 'Computer Organization & Architecture',
    topic: 'Cache Memory',
    questionType: 'MCQ',
    marks: 2,
    difficulty: 'Medium',
    question: 'A 4-way set-associative cache memory consists of 128 cache lines (blocks). The main memory address is 32 bits, and each cache block size is 64 bytes. What are the sizes of the Tag, Set Index, and Block Offset fields respectively?',
    options: [
      { label: 'A', text: 'Tag = 21 bits, Set = 5 bits, Offset = 6 bits' },
      { label: 'B', text: 'Tag = 19 bits, Set = 7 bits, Offset = 6 bits' },
      { label: 'C', text: 'Tag = 20 bits, Set = 6 bits, Offset = 6 bits' },
      { label: 'D', text: 'Tag = 22 bits, Set = 4 bits, Offset = 6 bits' }
    ],
    correctAnswer: 'A',
    explanation: `**Correct Answer: (A) Tag = 21 bits, Set = 5 bits, Offset = 6 bits**

**Step-by-step Calculation:**
1. **Block Offset:**
   - Block size = 64 bytes = \\( 2^6 \\) bytes.
   - Offset bits = \\( \\log_2(64) = 6 \\) bits.
2. **Number of Sets & Set Index:**
   - Total cache lines = 128.
   - Associativity \\( k = 4 \\) (4 lines per set).
   - Number of Sets = \\( \\frac{\\text{Total Lines}}{k} = \\frac{128}{4} = 32 \\) sets.
   - Set index bits = \\( \\log_2(32) = 5 \\) bits.
3. **Tag Field:**
   - Total physical address = 32 bits.
   - Tag bits = Total Address - (Set Index + Block Offset)
   - Tag bits = 32 - (5 + 6) = 32 - 11 = **21 bits**.
4. Breakdown:
   \\[
   [\\text{Tag: 21 bits}] \\quad [\\text{Set Index: 5 bits}] \\quad [\\text{Offset: 6 bits}]
   \\]`
  }
];

export const seedTodos = [
  {
    title: 'Solve 15 PYQs on Banker\'s Algorithm & Deadlocks',
    subject: 'Operating Systems',
    priority: 'High',
    dueDate: 'Today',
    estimatedMinutes: 45,
    completed: false
  },
  {
    title: 'Review Normal Forms & Lossless Decomposition Proofs',
    subject: 'Database Management Systems',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    estimatedMinutes: 30,
    completed: false
  },
  {
    title: 'Practice CIDR & Variable Length Subnet Masking (VLSM) Numericals',
    subject: 'Computer Networks',
    priority: 'Urgent',
    dueDate: 'Today',
    estimatedMinutes: 60,
    completed: true
  },
  {
    title: 'Memorize Closure Properties Table for Chomsky Hierarchy',
    subject: 'Theory of Computation',
    priority: 'High',
    dueDate: 'In 2 days',
    estimatedMinutes: 25,
    completed: false
  },
  {
    title: 'Take Full-Length GATE CS Mock Test #3',
    subject: 'General',
    priority: 'Urgent',
    dueDate: 'This Weekend',
    estimatedMinutes: 180,
    completed: false
  }
];

export const seedReminders = [
  {
    title: 'Weekly Mock Test Series Analysis',
    description: 'Review wrong attempts from Mock Test #2 and document new concepts',
    category: 'Mock Test',
    subject: 'General',
    targetDate: '2026-09-12',
    targetTime: '10:00',
    priority: 'High',
    isCompleted: false
  },
  {
    title: 'OS & Memory Management Revision Cycle 1',
    description: 'Paging, TLB hit ratio calculation, and page replacement algorithms',
    category: 'Revision',
    subject: 'Operating Systems',
    targetDate: '2026-09-15',
    targetTime: '17:30',
    priority: 'Medium',
    isCompleted: false
  },
  {
    title: 'Formula Flashcards Review - Graph Algorithms & DP',
    description: 'Dijkstra, Bellman-Ford, Floyd-Warshall, Prim vs Kruskal complexities',
    category: 'Formula Review',
    subject: 'Data Structures & Algorithms',
    targetDate: '2026-09-10',
    targetTime: '08:00',
    priority: 'High',
    isCompleted: false
  },
  {
    title: 'GATE Registration Portal Verification',
    description: 'Ensure application form status is validated and documents are approved',
    category: 'Exam Milestone',
    subject: 'General',
    targetDate: '2026-09-20',
    targetTime: '12:00',
    priority: 'High',
    isCompleted: false
  }
];
