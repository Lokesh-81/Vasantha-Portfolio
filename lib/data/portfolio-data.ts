export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  score: string;
  scoreLabel: string;
  description: string;
  highlights?: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  details: string[];
  technologies: string[];
  year: string;
  status: string;
  accentColor: string;
  gradient?: string;
  graphicType?: 'fidvr' | 'battery' | 'stock' | 'lumora' | string;
  imageUrl?: string | null;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: 'Core' | 'Working Knowledge' | 'Familiar';
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  badgeColor?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  award: string;
  event: string;
  year?: string;
}

export interface LanguageSkill {
  language: string;
  proficiency: string;
  levelPercentage: number;
}

export interface ProfileData {
  name: string;
  initials: string;
  title: string;
  degree: string;
  college: string;
  location: string;
  email: string;
  phone: string;
  phoneClean: string;
  whatsappUrl: string;
  telUrl: string;
  linkedinUrl: string;
  locationDisplay: string;
  heroBio: string;
  aboutBio: string;
  aboutSubDescription: string;
  interests: string[];
  profileImageUrl?: string | null;
}

export const profileData: ProfileData = {
  name: "Vasantha Perala",
  initials: "VP",
  title: "Electrical & Electronics Engineering Student",
  degree: "B.Tech · Electrical and Electronics Engineering (EEE)",
  college: "Malla Reddy Engineering College for Women",
  location: "Hyderabad, India",
  email: "peralavasantha08@gmail.com",
  phone: "+91 9550139722",
  phoneClean: "9550139722",
  whatsappUrl: "https://wa.me/919550139722",
  telUrl: "tel:+919550139722",
  linkedinUrl: "https://www.linkedin.com/in/vasantha-perala-050ba034a/",
  locationDisplay: "Hyderabad (IST · UTC+5:30)",
  heroBio: "Aspiring engineer passionate about exploring opportunities in both Electrical Engineering and the IT sector, driven to learn and solve real-world problems across core systems and software.",
  aboutBio: "Enthusiastic engineer with an active interest across both Electrical Engineering and the IT software sector. Passionate about learning, problem-solving, and applying technical skills to real-world challenges in both domains.",
  aboutSubDescription: "I focus on power systems simulation, renewable energy integration, and software development—combining core electrical principles with modern IT technologies to build impactful solutions.",
  interests: [
    "Power Systems",
    "Renewable Energy",
    "Electrical Engineering",
    "Technology"
  ],
  profileImageUrl: null
};

export const educationList: EducationItem[] = [
  {
    id: "mrecw",
    institution: "Malla Reddy Engineering College for Women",
    degree: "B.Tech — Electrical and Electronics Engineering (EEE)",
    period: "2023 – 2027",
    score: "8.08",
    scoreLabel: "CGPA",
    description: "Pursuing core studies in Power Systems, Renewable Energy, Control Systems, Electrical Machines, and Computational Engineering.",
    highlights: [
      "Rigorous coursework in Power Electronics, Power Systems, and Control Theory",
      "Practical simulation laboratories using MATLAB, Simulink, and AutoCAD",
      "Active participant in technical symposiums and engineering project expos"
    ]
  },
  {
    id: "loyola",
    institution: "Loyola Academy Junior College",
    degree: "Intermediate — MPC (Mathematics, Physics, Chemistry)",
    period: "2021 – 2023",
    score: "84.7%",
    scoreLabel: "Percentage",
    description: "Strong foundational academic performance with intensive focus on calculus, classical mechanics, electromagnetism, and physical sciences.",
    highlights: [
      "High academic standing across Mathematics and Physical Sciences",
      "Strong analytical and mathematical problem-solving foundation"
    ]
  },
  {
    id: "zphs",
    institution: "ZPHS",
    degree: "Secondary School Certificate (SSC)",
    period: "2021",
    score: "9.8",
    scoreLabel: "CGPA",
    description: "Exceptional academic record throughout secondary school education with top honors in science and mathematics.",
    highlights: [
      "Secured 9.8 CGPA distinction",
      "Awarded academic excellence recognition"
    ]
  }
];

export const experienceList: ExperienceItem[] = [
  {
    id: "pooja-and-company",
    company: "Pooja & Company",
    role: "Industrial Intern — Core Engineering",
    period: "May 2026 – June 2026",
    location: "Visakhapatnam, India",
    type: "Core Engineering Industrial Internship",
    description: "Completed a core engineering industrial internship focused on Electrical Drives and Material Handling Systems (Elecon), gaining hands-on operational exposure in the domain.",
    responsibilities: [
      "Hands-on operational exposure with core electrical drives and heavy material handling systems (Elecon)",
      "Studied industrial motor control schemes, frequency regulation, and power transmission mechanisms",
      "Observed on-site electrical equipment maintenance, safety protocols, and load management workflows",
      "Analyzed industrial automation schematics and equipment operational reliability metrics"
    ],
    technologies: [
      "Electrical Drives",
      "Elecon Systems",
      "Motor Control",
      "Industrial Automation",
      "Power Distribution"
    ]
  }
];

export const projectsList: ProjectItem[] = [
  {
    id: "fidvr-pv-statcom",
    number: "01",
    name: "Mitigation of Fault-Induced Delayed Voltage Recovery (FIDVR) using PV-STATCOM",
    category: "Power Systems & Grid Stability",
    tagline: "Dynamic voltage support & fault mitigation using solar PV-STATCOM controllers",
    description: "Designed and simulated a power system model using MATLAB and Simulink to study fault-induced delayed voltage recovery and evaluate PV-STATCOM based voltage support.",
    details: [
      "Designed a comprehensive power system model using MATLAB and Simulink",
      "Simulated symmetrical and asymmetrical fault conditions across the transmission line",
      "Analyzed delayed voltage recovery phenomena caused by induction motor loads",
      "Implemented a dynamic PV-STATCOM controller to supply reactive power support",
      "Improved voltage stability and accelerated recovery times under fault conditions",
      "Compared system performance metrics before and after compensation",
      "Generated detailed voltage profile and recovery wave graphs"
    ],
    technologies: [
      "MATLAB",
      "Simulink",
      "PV-STATCOM",
      "Power Systems",
      "Grid Stability",
      "Reactive Power Control"
    ],
    year: "2024 – 2025",
    status: "Completed",
    accentColor: "#60A5FA",
    gradient: "from-blue-900/40 via-sky-950/20 to-black/60",
    graphicType: "fidvr"
  },
  {
    id: "smart-charge-guardian",
    number: "02",
    name: "Smart Charge Guardian",
    category: "Embedded Systems & IoT",
    tagline: "Intelligent battery charging controller with thermal protection & wireless alerts",
    description: "Designed a smart battery charging system with temperature monitoring and Bluetooth-based alerts to improve charging safety.",
    details: [
      "Engineered a smart battery charging management architecture",
      "Integrated continuous temperature sensors for real-time thermal monitoring",
      "Built abnormal temperature and thermal runaway detection logic",
      "Implemented automatic charging cut-off relay control when thresholds are exceeded",
      "Configured Bluetooth alerts transmitted directly to paired mobile devices",
      "Designed instant overheating notifications and visual status indicators",
      "Monitored live charging cycle parameters and system voltage state"
    ],
    technologies: [
      "Embedded Systems",
      "Bluetooth",
      "Temperature Monitoring",
      "Battery Charging",
      "Microcontrollers",
      "Relay Control"
    ],
    year: "2024 – 2025",
    status: "Completed",
    accentColor: "#F472B6",
    gradient: "from-pink-900/40 via-rose-950/20 to-black/60",
    graphicType: "battery"
  },
  {
    id: "lumora-ai",
    number: "03",
    name: "Lumora AI",
    category: "AI / Stock Intelligence",
    tagline: "AI-powered stock intelligence & financial data analysis platform",
    description: "Lumora AI is an AI-powered stock intelligence platform focused on helping users understand and analyze normal stock-market data through AI-assisted insights and financial data.",
    details: [
      "AI-powered stock intelligence platform for analyzing normal market data",
      "AI-assisted insights to understand normal stock-market trends and financial indicators",
      "Integration with financial and market data APIs for stock data exploration",
      "Responsive interface built with modern web technologies for intuitive data visualization"
    ],
    technologies: [
      "AI",
      "Generative AI",
      "Stock Market Data",
      "Financial Data",
      "APIs",
      "Modern Web Technologies"
    ],
    year: "2024 – 2025",
    status: "Completed",
    accentColor: "#A78BFA",
    gradient: "from-purple-900/40 via-indigo-950/20 to-black/60",
    graphicType: "placeholder",
    imageUrl: null
  }
];

export const skillsList: SkillItem[] = [
  // Programming Languages
  { id: "c-lang", name: "C", category: "Programming Languages", level: "Core" },
  { id: "python", name: "Python", category: "Programming Languages", level: "Working Knowledge" },
  { id: "java", name: "Java", category: "Programming Languages", level: "Working Knowledge" },

  // Frontend / Web
  { id: "html", name: "HTML", category: "Frontend / Web", level: "Core" },
  { id: "css", name: "CSS", category: "Frontend / Web", level: "Core" },

  // Database
  { id: "sql", name: "SQL — Basics", category: "Database", level: "Working Knowledge" },

  // AI / Machine Learning
  { id: "ai-tools", name: "AI Tools", category: "AI / Machine Learning", level: "Working Knowledge" },
  { id: "chatgpt", name: "ChatGPT", category: "AI / Machine Learning", level: "Core" },
  { id: "copilot", name: "Copilot", category: "AI / Machine Learning", level: "Core" },
  { id: "ai-basics", name: "AI Basics", category: "AI / Machine Learning", level: "Working Knowledge" },

  // Tools & Software
  { id: "ms-office", name: "MS Office", category: "Tools & Software", level: "Core" },
  { id: "autocad", name: "AutoCAD", category: "Tools & Software", level: "Core" },
  { id: "matlab", name: "MATLAB", category: "Tools & Software", level: "Core" },
  { id: "simulink", name: "Simulink", category: "Tools & Software", level: "Core" },

  // Soft Skills
  { id: "comm", name: "Effective Communication", category: "Soft Skills", level: "Core" },
  { id: "adaptability", name: "Adaptability", category: "Soft Skills", level: "Core" },
  { id: "teamwork", name: "Teamwork", category: "Soft Skills", level: "Core" },
  { id: "multitasking", name: "Multi-tasking", category: "Soft Skills", level: "Core" }
];

export const skillCategories = [
  "All",
  "Programming Languages",
  "Frontend / Web",
  "Database",
  "AI / Machine Learning",
  "Tools & Software",
  "Soft Skills"
] as const;

export const certificationsList: CertificationItem[] = [
  {
    id: "cert-ev",
    title: "Electric Vehicle's Basics",
    issuer: "NSIC",
    badgeColor: "#60A5FA"
  },
  {
    id: "cert-ai",
    title: "AI",
    issuer: "Infosys SpringBoard",
    badgeColor: "#C084FC"
  },
  {
    id: "cert-ds",
    title: "Data Science for Engineers",
    issuer: "NPTEL",
    badgeColor: "#F472B6"
  },
  {
    id: "cert-cisco",
    title: "C, Java Essentials",
    issuer: "CISCO",
    badgeColor: "#2DD4BF"
  },
  {
    id: "cert-salesforce",
    title: "Salesforce for Administration",
    issuer: "Salesforce",
    badgeColor: "#38BDF8"
  },
  {
    id: "cert-cambridge",
    title: "Cambridge & Pearson",
    issuer: "Cambridge & Pearson",
    badgeColor: "#FDE68A"
  }
];

export const achievementsList: AchievementItem[] = [
  {
    id: "ach-c-cracker",
    title: "Second Prize — C-Cracker",
    award: "2nd Prize",
    event: "Technical Symposium, MRECW",
    year: "2024"
  },
  {
    id: "ach-tech-expo",
    title: "2nd Prize — Tech-Expo",
    award: "2nd Prize",
    event: "ELECTRIC AURA-2K25",
    year: "2025"
  }
];

export const languagesList: LanguageSkill[] = [
  { language: "English", proficiency: "Fluent", levelPercentage: 100 },
  { language: "Telugu", proficiency: "Fluent", levelPercentage: 100 },
  { language: "Hindi", proficiency: "Conversational", levelPercentage: 80 },
  { language: "French", proficiency: "Basic", levelPercentage: 45 }
];

export const marqueeTechnologies = [
  { name: "C", category: "Programming" },
  { name: "Python", category: "Programming & AI" },
  { name: "Java", category: "Programming" },
  { name: "HTML", category: "Web Standards" },
  { name: "CSS", category: "Styling" },
  { name: "SQL", category: "Database" },
  { name: "MATLAB", category: "Simulation & Control" },
  { name: "Simulink", category: "Power Systems Modeling" },
  { name: "AutoCAD", category: "Schematic Design" },
  { name: "AI Tools", category: "Emerging Tech" },
  { name: "Electrical Drives", category: "Industrial Automation" },
  { name: "PV-STATCOM", category: "Renewable Power" }
];
