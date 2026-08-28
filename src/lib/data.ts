export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type Skill = {
  name: string;
  level: number;
  category: "language" | "framework" | "tool" | "design" | "soft";
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string | "Present";
  bullets: string[];
  tags: string[];
  logo?: string;
};

export type Project = {
  id: string;
  title: string;
  blurb: string;
  description: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  link?: string;
  repo?: string;
  image?: string;
  featured?: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
};

export type Achievement = {
  label: string;
  value: number;
  suffix?: string;
};

export const profile = {
  name: "Basit Ali",
  handle: "@basitali08",
  title: "Data Scientist & AI Engineer",
  tagline:
    "Building intelligent systems that transform raw data into production-ready ML solutions. Specializing in predictive modeling, AI pipelines, and end-to-end data science.",
  location: "Pakistan",
  email: "whoisbasit@gmail.com",
  status: "available" as "available" | "limited" | "unavailable",
  pronouns: "he/him",
  bio: [
    "Data Science graduate from Boston Institute of Analytics with deep expertise in machine learning, artificial intelligence, and predictive modeling. I design and deploy end-to-end ML systems — from synthetic data generation and feature engineering to interactive Streamlit dashboards and model deployment.",
    "My work spans surgical robotics, holistic health & wellness, neuroscience drug discovery, NASA rocket analysis, and cooperative robotics — each project following a rigorous end-to-end pipeline with 6+ classification models, cross-validation, confusion matrices, ROC-AUC analysis, and feature importance profiling.",
  ],
  links: {
    linkedin: "https://linkedin.com/in/basit-ali-824851375",
    github: "https://github.com/basitali08",
    twitter: "#",
    website: "https://basitali08.github.io/portfolio",
    email: "mailto:whoisbasit@gmail.com",
  } satisfies Record<string, string> & { linkedin: string },
  skills: [
    { name: "Python", level: 95, category: "language" },
    { name: "SQL", level: 80, category: "language" },
    { name: "Machine Learning", level: 95, category: "soft" },
    { name: "Deep Learning", level: 85, category: "soft" },
    { name: "Scikit-learn", level: 92, category: "framework" },
    { name: "XGBoost", level: 95, category: "framework" },
    { name: "TensorFlow", level: 82, category: "framework" },
    { name: "Streamlit", level: 90, category: "framework" },
    { name: "Pandas", level: 90, category: "tool" },
    { name: "NumPy", level: 88, category: "tool" },
    { name: "Matplotlib", level: 82, category: "tool" },
    { name: "Seaborn", level: 80, category: "tool" },
    { name: "NLP", level: 78, category: "soft" },
    { name: "Feature Engineering", level: 92, category: "soft" },
    { name: "Cross-Validation", level: 90, category: "soft" },
    { name: "SMOTE", level: 88, category: "soft" },
    { name: "ROC-AUC Analysis", level: 88, category: "soft" },
    { name: "Hyperparameter Tuning", level: 85, category: "soft" },
    { name: "Ensemble Methods", level: 90, category: "soft" },
    { name: "Model Deployment", level: 82, category: "soft" },
    { name: "Data Cleaning", level: 90, category: "tool" },
    { name: "Git & GitHub", level: 78, category: "tool" },
  ] satisfies Skill[],
  achievements: [
    { label: "Projects", value: 8 },
    { label: "Best Accuracy", value: 97.6, suffix: "%" },
    { label: "Models per Project", value: 6 },
    { label: "Skills", value: 22 },
  ] satisfies Achievement[],
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/basit-ali-824851375", handle: "in/basit-ali" },
    { label: "GitHub", href: "https://github.com/basitali08", handle: "@basitali08" },
    { label: "Email", href: "mailto:whoisbasit@gmail.com", handle: "whoisbasit@gmail.com" },
  ] satisfies SocialLink[],
};

export const experience: Experience[] = [
  {
    id: "exp-1",
    company: "Boston Institute of Analytics",
    role: "Data Scientist",
    location: "Pakistan (On-site)",
    start: "Jul 2025",
    end: "Present",
    bullets: [
      "Leading data science initiatives, developing predictive models, and delivering AI-driven solutions for real-world business challenges.",
      "Building end-to-end ML pipelines with 6+ classification models, cross-validation, SMOTE balancing, and interactive Streamlit dashboards.",
    ],
    tags: ["Python", "XGBoost", "Scikit-learn", "Streamlit"],
  },
  {
    id: "exp-2",
    company: "Boston Institute of Analytics",
    role: "Artificial Intelligence Program",
    location: "Pakistan",
    start: "Aug 2025",
    end: "Jan 2026",
    bullets: [
      "Completed intensive AI training covering ML, deep learning, and intelligent systems.",
      "Built predictive models using Python and industry-standard frameworks across multiple real-world domains.",
    ],
    tags: ["Machine Learning", "Deep Learning", "Python"],
  },
];

export const projects: Project[] = [
  {
    id: "p-1",
    title: "Surgical Robotics ML",
    blurb: "Predict surgical success in robotic-assisted procedures.",
    description:
      "End-to-end pipeline with 6 models predicting surgical success from 14 parameters. Includes feature engineering, cross-validation, confusion matrices, ROC-AUC analysis, and an interactive Streamlit dashboard. Achieved 97.6% accuracy with XGBoost and SMOTE-balanced datasets.",
    tags: ["XGBoost", "Scikit-learn", "SMOTE", "Streamlit", "Python"],
    metrics: [
      { label: "Accuracy", value: "97.6%" },
      { label: "Models", value: "6" },
      { label: "Parameters", value: "14" },
    ],
    repo: "https://github.com/basitali08/surgical-robotics-ml",
    featured: true,
  },
  {
    id: "p-2",
    title: "Holistic Health & Wellness ML",
    blurb: "Mental health risk prediction from lifestyle factors.",
    description:
      "Predicts mental health risk from 15 lifestyle factors — sleep quality, diet patterns, exercise frequency, stress levels, and social habits. Includes personalized recommendations based on risk profile. Achieved 94.6% accuracy using XGBoost with SMOTE.",
    tags: ["XGBoost", "SMOTE", "Feature Engineering", "Streamlit", "Python"],
    metrics: [
      { label: "Accuracy", value: "94.6%" },
      { label: "Features", value: "15" },
    ],
    repo: "https://github.com/basitali08/holistic-health-wellness",
    featured: true,
  },
  {
    id: "p-3",
    title: "Neuron Receptor Binding Prediction",
    blurb: "Multi-class molecular binding for drug discovery.",
    description:
      "Multi-class molecular binding prediction for 5 neuron receptors: Dopamine D2, Serotonin 5-HT2A, GABA-A, NMDA, and Mu-Opioid. Uses molecular descriptors with per-receptor activity profiling and pIC50 regression. Achieved 47.7% multi-class accuracy (XGBoost), 76.4% binary for Serotonin 5-HT2A.",
    tags: ["XGBoost", "Drug Discovery", "Multi-Class", "pIC50", "SMOTE"],
    metrics: [
      { label: "AUC", value: "0.84" },
      { label: "Receptors", value: "5" },
      { label: "Paper", value: "SSRN" },
    ],
    link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6852319",
    repo: "https://github.com/basitali08/neuron-receptor-prediction",
    featured: true,
  },
  {
    id: "p-4",
    title: "NASA Rocket Analysis ML",
    blurb: "Predict rocket launch success from engineering parameters.",
    description:
      "Predicts rocket launch success from 15 engineering parameters — engine temp, fuel pressure, vibration, telemetry errors, stage separation, and more. 20-step pipeline with 6 models, SMOTE, and cross-validation. Achieved 92.9% accuracy.",
    tags: ["XGBoost", "NASA-Style", "Feature Engineering", "Streamlit", "Python"],
    metrics: [
      { label: "Accuracy", value: "92.9%" },
      { label: "Parameters", value: "15" },
    ],
    repo: "https://github.com/basitali08/nasa-rocket-analysis-",
  },
  {
    id: "p-5",
    title: "Cooperative Robotics ML",
    blurb: "Multi-robot mission success prediction with swarm intelligence.",
    description:
      "Predicts mission success for multi-robot teams from 15 coordination parameters — robot count, communication delay, swarm density, formation type, and terrain conditions. Includes formation recommender. Achieved 98.4% accuracy with XGBoost.",
    tags: ["XGBoost", "Swarm Intelligence", "Multi-Agent", "Streamlit", "Python"],
    metrics: [
      { label: "Accuracy", value: "98.4%" },
      { label: "Parameters", value: "15" },
    ],
    repo: "https://github.com/basitali08/cooperative-robotics-ml",
  },
  {
    id: "p-6",
    title: "Vehicle Tracking & Hotlist Alert System",
    blurb: "Real-time license plate recognition with ANPR.",
    description:
      "License plate recognition system that detects vehicle plates from images using EasyOCR, checks them against a hotlist database, and plots detection locations on an interactive Folium map with color-coded alerts.",
    tags: ["EasyOCR", "OpenCV", "SQLite", "Folium", "Streamlit"],
    repo: "https://github.com/basitali08/vehicle-tracking-system",
  },
  {
    id: "p-7",
    title: "Schizophrenia Drug Response Predictor",
    blurb: "Predict the best antipsychotic drug from patient features.",
    description:
      "Predicts the best antipsychotic drug from 15 patient features across 5 drugs (Olanzapine, Risperidone, Clozapine, Haloperidol, Aripiprazole). Random Forest achieved 74% accuracy and 0.92 AUC with SMOTE-balanced training.",
    tags: ["XGBoost", "Random Forest", "SMOTE", "Streamlit", "Python"],
    metrics: [
      { label: "Accuracy", value: "74%" },
      { label: "AUC", value: "0.92" },
    ],
    repo: "https://github.com/basitali08/schizophrenia-drug-predictor",
  },
  {
    id: "p-8",
    title: "GitHub Profile README Generator",
    blurb: "Generate beautiful profile READMEs from any GitHub username.",
    description:
      "Enter any GitHub username → get a beautiful profile README with stats, languages, featured projects, and badges. 4 themes. One-click download. Used by developers worldwide.",
    tags: ["Python", "Streamlit", "GitHub API", "Web App"],
    link: "https://profile-readme-generator-basitali08.streamlit.app",
    repo: "https://github.com/basitali08/profile-readme-generator",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "Consistently achieving 94–98% accuracy using XGBoost and ensemble methods with SMOTE-balanced datasets across multiple domains.",
    name: "Basit Ali",
    role: "Data Scientist",
    company: "Boston Institute of Analytics",
  },
  {
    id: "t-2",
    quote:
      "End-to-end ML pipeline expertise spanning surgical robotics, drug discovery, rocket analysis, and cooperative robotics — each with rigorous validation and deployed dashboards.",
    name: "Portfolio",
    role: "Project Highlights",
    company: "GitHub",
  },
  {
    id: "t-3",
    quote:
      "Published ML research on SSRN (Elsevier) predicting neuron receptor binding affinity using 8 engineered molecular features and multi-class classification.",
    name: "Research",
    role: "SSRN Publication",
    company: "Elsevier",
  },
];

export type Publication = {
  id: string;
  title: string;
  venue: string;
  publisher: string;
  year: string;
  abstract: string;
  tags: string[];
  link: string;
  authors?: string;
  doi?: string;
};

export const publications: Publication[] = [
  {
    id: "pub-1",
    title:
      "Machine Learning Approaches for Predicting Neuron Receptor Binding Affinity Using Engineered Molecular Descriptors",
    venue: "SSRN (Elsevier)",
    publisher: "Social Science Research Network — Elsevier",
    year: "2025",
    authors: "Basit Ali",
    doi: "papers.cfm?abstract_id=6852319",
    abstract:
      "Multi-class molecular binding prediction across 5 neuron receptors (Dopamine D2, Serotonin 5-HT2A, GABA-A, NMDA, Mu-Opioid) using 8 engineered molecular descriptors. XGBoost classifier achieved 47.7% multi-class accuracy and 0.84 ROC-AUC, with binary classification peaking at 76.4% for Serotonin 5-HT2A. Pipeline includes SMOTE balancing, pIC50 regression, and per-receptor activity profiling for neuroscience drug discovery.",
    tags: [
      "XGBoost",
      "Drug Discovery",
      "Multi-Class",
      "pIC50",
      "SMOTE",
      "Neuroscience",
    ],
    link: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6852319",
  },
];

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Skills", href: "#skills" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const commandItems = [
  { id: "go-about", label: "Go to About", section: "Navigate", shortcut: "A", href: "#about" },
  { id: "go-projects", label: "Go to Projects", section: "Navigate", shortcut: "P", href: "#projects" },
  { id: "go-research", label: "Go to Research", section: "Navigate", href: "#research" },
  { id: "go-contact", label: "Go to Contact", section: "Navigate", shortcut: "C", href: "#contact" },
  { id: "email", label: "Copy email", section: "Quick actions", shortcut: "E", action: "copy-email" as const },
  { id: "resume", label: "Download resume", section: "Quick actions", shortcut: "R", action: "download-resume" as const },
  { id: "linkedin", label: "Open LinkedIn", section: "Quick actions", action: "open-linkedin" as const },
  { id: "github", label: "Open GitHub", section: "Quick actions", action: "open-github" as const },
  { id: "theme", label: "Toggle ambient audio", section: "Theme", shortcut: "M", action: "toggle-audio" as const },
];
