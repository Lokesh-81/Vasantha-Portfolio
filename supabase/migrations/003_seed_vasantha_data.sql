-- ==============================================================================
-- Migration 003: Seed Vasantha Perala Portfolio Data
-- Accurate, verified data for Vasantha Perala
-- ==============================================================================

-- 1. SEED PROFILE
DELETE FROM public.profiles WHERE email = 'peralavasantha08@gmail.com' OR name = 'Vasantha Perala';

INSERT INTO public.profiles (
  id,
  name,
  headline,
  bio,
  about_bio,
  about_sub_description,
  location,
  email,
  phone,
  linkedin_url,
  profile_image_url,
  interests
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Vasantha Perala',
  'Electrical & Electronics Engineering Student',
  'Aspiring engineer passionate about exploring opportunities in both Electrical Engineering and the IT sector, driven to learn and solve real-world problems across core systems and software.',
  'Enthusiastic engineer with an active interest across both Electrical Engineering and the IT software sector. Passionate about learning, problem-solving, and applying technical skills to real-world challenges in both domains.',
  'I focus on power systems simulation, renewable energy integration, and software development—combining core electrical principles with modern IT technologies to build impactful solutions.',
  'Hyderabad, India',
  'peralavasantha08@gmail.com',
  '+91 9550139722',
  'https://www.linkedin.com/in/vasantha-perala-050ba034a/',
  NULL,
  ARRAY['Power Systems', 'Renewable Energy', 'Electrical Engineering', 'Technology']
);

-- 2. SEED EDUCATION
DELETE FROM public.education;

INSERT INTO public.education (
  institution,
  degree,
  period,
  score,
  score_label,
  description,
  highlights,
  sort_order
) VALUES
(
  'Malla Reddy Engineering College for Women',
  'B.Tech — Electrical and Electronics Engineering',
  '2023–2027',
  '8.08',
  'CGPA',
  'Pursuing core studies in Power Systems, Renewable Energy, Control Systems, Electrical Machines, and Computational Engineering.',
  ARRAY[
    'Rigorous coursework in Power Electronics, Power Systems, and Control Theory',
    'Practical simulation laboratories using MATLAB, Simulink, and AutoCAD',
    'Active participant in technical symposiums and engineering project expos'
  ],
  1
),
(
  'Loyola Academy Junior College',
  'Intermediate — MPC',
  '2021–2023',
  '84.7%',
  'Percentage',
  'Strong foundational academic performance with intensive focus on calculus, classical mechanics, electromagnetism, and physical sciences.',
  ARRAY[
    'High academic standing across Mathematics and Physical Sciences',
    'Strong analytical and mathematical problem-solving foundation'
  ],
  2
),
(
  'ZPHS',
  'SSC',
  '2021',
  '9.8',
  'CGPA',
  'Exceptional academic record throughout secondary school education with top honors in science and mathematics.',
  ARRAY[
    'Secured 9.8 CGPA distinction',
    'Awarded academic excellence recognition'
  ],
  3
);

-- 3. SEED EXPERIENCE
DELETE FROM public.experience;

INSERT INTO public.experience (
  company,
  role,
  period,
  location,
  type,
  description,
  responsibilities,
  technologies,
  sort_order
) VALUES (
  'Pooja & Company',
  'Industrial Intern',
  'May 2026 – June 2026',
  'Visakhapatnam, India',
  'Industrial Internship',
  'Completed a core engineering industrial internship focused on Electrical Drives and Material Handling Systems (Elecon), gaining hands-on operational exposure in the domain.',
  ARRAY[
    'Hands-on operational exposure with core electrical drives and heavy material handling systems (Elecon)',
    'Studied industrial motor control schemes, frequency regulation, and power transmission mechanisms',
    'Observed on-site electrical equipment maintenance, safety protocols, and load management workflows',
    'Analyzed industrial automation schematics and equipment operational reliability metrics'
  ],
  ARRAY[
    'Electrical Drives',
    'Elecon Systems',
    'Motor Control',
    'Industrial Automation',
    'Power Distribution'
  ],
  1
);

-- 4. SEED PROJECTS
DELETE FROM public.projects;

INSERT INTO public.projects (
  number,
  name,
  category,
  tagline,
  description,
  details,
  technologies,
  year,
  status,
  accent_color,
  graphic_type,
  sort_order
) VALUES
(
  '01',
  'Mitigation of Fault-Induced Delayed Voltage Recovery (FIDVR) using PV-STATCOM',
  'Power Systems & Grid Stability',
  'Dynamic voltage support & fault mitigation using solar PV-STATCOM controllers',
  'Designed and simulated a power system model using MATLAB and Simulink to study fault-induced delayed voltage recovery and evaluate PV-STATCOM based voltage support.',
  ARRAY[
    'Designed a comprehensive power system model using MATLAB and Simulink',
    'Simulated symmetrical and asymmetrical fault conditions across the transmission line',
    'Analyzed delayed voltage recovery phenomena caused by induction motor loads',
    'Implemented a dynamic PV-STATCOM controller to supply reactive power support',
    'Improved voltage stability and accelerated recovery times under fault conditions',
    'Compared system performance metrics before and after compensation',
    'Generated detailed voltage profile and recovery wave graphs'
  ],
  ARRAY[
    'MATLAB',
    'Simulink',
    'PV-STATCOM',
    'Power Systems',
    'Grid Stability',
    'Reactive Power Control'
  ],
  '2024 – 2025',
  'Completed',
  '#60A5FA',
  'fidvr',
  1
),
(
  '02',
  'Smart Charge Guardian',
  'Embedded Systems & IoT',
  'Intelligent battery charging controller with thermal protection & wireless alerts',
  'Designed a smart battery charging system with temperature monitoring and Bluetooth-based alerts to improve charging safety.',
  ARRAY[
    'Engineered a smart battery charging management architecture',
    'Integrated continuous temperature sensors for real-time thermal monitoring',
    'Built abnormal temperature and thermal runaway detection logic',
    'Implemented automatic charging cut-off relay control when thresholds are exceeded',
    'Configured Bluetooth alerts transmitted directly to paired mobile devices',
    'Designed instant overheating notifications and visual status indicators',
    'Monitored live charging cycle parameters and system voltage state'
  ],
  ARRAY[
    'Embedded Systems',
    'Bluetooth',
    'Temperature Monitoring',
    'Battery Charging',
    'Microcontrollers',
    'Relay Control'
  ],
  '2024 – 2025',
  'Completed',
  '#F472B6',
  'battery',
  2
),
(
  '03',
  'Lumora AI',
  'AI / Stock Intelligence',
  'AI-powered stock intelligence & financial data analysis platform',
  'Lumora AI is an AI-powered stock intelligence platform focused on helping users understand and analyze normal stock-market data through AI-assisted insights and financial data.',
  ARRAY[
    'AI-powered stock intelligence platform for analyzing normal market data',
    'AI-assisted insights to understand normal stock-market trends and financial indicators',
    'Integration with financial and market data APIs for stock data exploration',
    'Responsive interface built with modern web technologies for intuitive data visualization'
  ],
  ARRAY[
    'AI',
    'Generative AI',
    'Stock Market Data',
    'Financial Data',
    'APIs',
    'Modern Web Technologies'
  ],
  '2024 – 2025',
  'Completed',
  '#A78BFA',
  'placeholder',
  3
);

-- 5. SEED SKILLS
DELETE FROM public.skills;

INSERT INTO public.skills (name, category, level, sort_order) VALUES
-- Programming Languages
('C', 'Programming Languages', 'Core', 1),
('Python', 'Programming Languages', 'Working Knowledge', 2),
('Java', 'Programming Languages', 'Working Knowledge', 3),

-- Frontend / Web
('HTML', 'Frontend / Web', 'Core', 4),
('CSS', 'Frontend / Web', 'Core', 5),

-- Database
('SQL', 'Database', 'Working Knowledge', 6),

-- AI / Machine Learning
('ChatGPT', 'AI / Machine Learning', 'Core', 7),
('Copilot', 'AI / Machine Learning', 'Core', 8),
('AI Tools', 'AI / Machine Learning', 'Working Knowledge', 9),
('AI Basics', 'AI / Machine Learning', 'Working Knowledge', 10),

-- Tools & Software
('MS Office', 'Tools & Software', 'Core', 11),
('AutoCAD', 'Tools & Software', 'Core', 12),
('MATLAB', 'Tools & Software', 'Core', 13),
('Simulink', 'Tools & Software', 'Core', 14),

-- Soft Skills
('Effective Communication', 'Soft Skills', 'Core', 15),
('Adaptability', 'Soft Skills', 'Core', 16),
('Teamwork', 'Soft Skills', 'Core', 17),
('Multi-tasking', 'Soft Skills', 'Core', 18);

-- 6. SEED CERTIFICATIONS
DELETE FROM public.certifications;

INSERT INTO public.certifications (title, issuer, badge_color, sort_order) VALUES
('Electric Vehicle''s Basics', 'NSIC', '#60A5FA', 1),
('AI', 'Infosys SpringBoard', '#C084FC', 2),
('Data Science for Engineers', 'NPTEL', '#F472B6', 3),
('C, Java Essentials', 'CISCO', '#2DD4BF', 4),
('Salesforce for Administration', 'Salesforce', '#38BDF8', 5),
('Cambridge & Pearson', 'Cambridge & Pearson', '#FDE68A', 6);

-- 7. SEED ACHIEVEMENTS
DELETE FROM public.achievements;

INSERT INTO public.achievements (title, award, event, year, sort_order) VALUES
('Second Prize in C-Cracker', '2nd Prize', 'Technical Symposium, MRECW', '2024', 1),
('2nd Prize', '2nd Prize', 'Tech-Expo, ELECTRIC AURA-2K25', '2025', 2);

-- 8. SEED LANGUAGES
DELETE FROM public.languages;

INSERT INTO public.languages (language, proficiency, level_percentage, sort_order) VALUES
('English', 'Fluent', 100, 1),
('Telugu', 'Fluent', 100, 2),
('Hindi', 'Conversational', 80, 3),
('French', 'Basic', 45, 4);

-- 9. SEED SITE SETTINGS
INSERT INTO public.site_settings (key, value, description)
VALUES
('resume_url', 'null'::jsonb, 'Public download URL for Vasantha Perala resume PDF'),
('hero_badge', '"B.Tech · EEE (2023–2027) · Hyderabad, India"'::jsonb, 'Hero section status badge text'),
('contact_email', '"peralavasantha08@gmail.com"'::jsonb, 'Official contact email'),
('phone_display', '"+91 9550139722"'::jsonb, 'Official phone number')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = now();
