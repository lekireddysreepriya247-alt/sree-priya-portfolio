/*
  ============================================================
  EDIT THIS FILE ONLY.
  Everything shown on the website comes from here.
  Change the text between the quotes, save, and refresh.
  The projects, journey and skill-card scores are EXAMPLES -
  replace them with her real ones before submitting.
  ============================================================
*/
window.PORTFOLIO = {
  name: "Leki Reddy Sree Priya",
  shortName: "Sree Priya",                // used in "Hi, I'm ___."
  email: "lekireddysreepriya247@gmail.com",
  phone: "+91 93907 45469",                              // contact number, e.g. "+91 98765 43210" (hidden while empty)
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  status: "Open to internships",
  photo: "assets/photo.jpg",

  // The notepad in the first screen flips through these: "I am a ___"
  roles: ["AIML Engineer", "Python Developer", "Web Developer", "AI Model Builder"],

  intro:
    "A B.Tech CSE (AI & ML) student at Jain University who likes taking an idea all the way from a blank file to something people can open and use.",

  // Each skill is one door. "color" is the door colour.
  skills: [
    {
      id: "java",
      name: "Java",
      color: "#4f6aa3",
      summary: "Solid fundamentals, clean structure",
      detail:
        "Java is where I learned the fundamentals: classes, collections, exceptions and clean structure. I use it for coursework, data structure practice and small management systems.",
      points: ["Object-oriented design", "Data structures and algorithms", "Collections and generics", "Exception handling", "Database programs with JDBC"],
      tools: ["Core Java", "OOP", "Collections", "JDBC", "MySQL"]
    },
    {
      id: "python",
      name: "Python",
      color: "#2f6a50",
      summary: "Scripts, APIs and this site's backend",
      detail:
        "Python is my everyday language. I use it for automation, data handling and server code. The contact form and visitor counter on this site are written in Python.",
      points: ["Scripting and automation", "REST APIs with Flask", "Data handling with pandas", "Working with MongoDB", "Deploying to the cloud"],
      tools: ["Python 3", "Flask", "pandas", "NumPy", "MongoDB"]
    },
    {
      id: "web",
      name: "Web Development",
      color: "#c7773f",
      summary: "Pages that move and feel good to use",
      detail:
        "I build sites by hand with HTML, CSS and JavaScript, paying attention to layout, motion and how the page behaves on a phone. This portfolio uses no framework.",
      points: ["Responsive layouts", "Animations and transitions", "JavaScript interactions", "Forms connected to a backend", "Hosting and deployment"],
      tools: ["HTML", "CSS", "JavaScript", "Git and GitHub", "Vercel"]
    },
    {
      id: "ai",
      name: "AI Models",
      color: "#7a4768",
      summary: "From raw data to a trained model",
      detail:
        "I build and train machine learning models: cleaning the data, choosing a model, measuring how well it does and improving it step by step.",
      points: ["Cleaning and preparing data", "Training classification models", "Neural networks", "Measuring accuracy", "Putting a model behind a web page"],
      tools: ["scikit-learn", "TensorFlow", "Jupyter", "Model evaluation", "NumPy"]
    }
  ],

  // The flip card that opens from "My skill card". Scores are out of 100 - EXAMPLES, change them.
  card: {
    levels: [
      { name: "Python", score: 85 },
      { name: "Java", score: 85 },
      { name: "Web Development", score: 80 },
      { name: "AI Models", score: 75 }
    ],
    back: "I like building things end to end: the model, the Python that serves it and the page people actually see."
  },

  // EXAMPLES - replace with her real projects. "room" must match a skill id above
  // (java, python, web, ai) so the project also shows behind that door. Leave link as "" if none.
  projects: [
    {
      title: "Handwritten digit recogniser",
      kind: "AI model",
      room: "ai",
      text: "A neural network trained to read handwritten digits, with a small page where you can draw a number and see the prediction.",
      stack: ["Python", "TensorFlow"],
      link: ""
    },
    {
      title: "Student record manager",
      kind: "Java",
      room: "java",
      text: "A desktop program for adding, searching and updating student records, backed by a database.",
      stack: ["Java", "JDBC", "MySQL"],
      link: ""
    },
    {
      title: "This portfolio",
      kind: "Web and Python",
      room: "web",
      text: "A hand-built site with a Python backend that saves contact messages and counts visitors in MongoDB.",
      stack: ["HTML", "CSS", "JavaScript", "Python", "MongoDB"],
      link: ""
    }
  ],

  // Journey, newest first.
  journey: [
    { when: "2026", title: "Built this portfolio", place: "Jain University", text: "Designed and published this site, with a Python backend for the contact form and visitor counter." },
    { when: "2025", title: "Started B.Tech in CSE (AI & ML)", place: "Jain University, Bengaluru", text: "Began my degree in computer science with a focus on artificial intelligence and machine learning." },
    { when: "2025", title: "Finished Class 12", place: "Sri Chaitanya College", text: "Completed Class 12 with 93%." },
    { when: "2023", title: "Finished Class 10", place: "Narayana School, Tadipatri", text: "Completed Class 10 with 89%." }
  ],


  // Education, newest first. A row is hidden while its "school" is empty.
  // "marks" is shown big on the right, e.g. "9.1 CGPA" or "95%".
  education: [
    { level: "B.Tech, CSE (AI & ML)", school: "Jain University", place: "Bengaluru", years: "2025 to 2029", marks: "8.6 CGPA" },
    { level: "Class 12", school: "Sri Chaitanya College", place: "", years: "2025", marks: "93%" },
    { level: "Class 10", school: "Narayana School", place: "Tadipatri", years: "2023", marks: "89%" }
  ],

  // Leave a link as "" to hide it.
  links: {
    github: "https://github.com/lekireddysreepriya247-alt",
    linkedin: "https://www.linkedin.com/in/sree-priya-64161038a/",
    resume: ""
  }
};
