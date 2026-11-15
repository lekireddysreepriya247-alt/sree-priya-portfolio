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
  email: "your.email@example.com",        // her email (hidden until changed)
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  status: "Open to internships",
  photo: "assets/photo.jpg",

  // The notepad in the first screen flips through these: "I am a ___"
  roles: ["AIML Engineer", "Python Developer", "Web Developer", "AI Model Builder"],

  intro:
    "A computer science student who likes taking an idea all the way from a blank file to something people can open and use.",

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

  // EXAMPLES - newest first. Replace with her real journey.
  journey: [
    { when: "2026", title: "Building AI models", place: "Projects and coursework", text: "Started training machine learning models and connecting them to web pages with Python." },
    { when: "2025", title: "First websites", place: "Self-taught", text: "Learned HTML, CSS and JavaScript and published my first pages online." },
    { when: "2024", title: "Python", place: "College", text: "Picked up Python for scripting, data handling and backend work." },
    { when: "2023", title: "Started with Java", place: "College", text: "Wrote my first programs and learned object-oriented programming." }
  ],

  // Leave a link as "" to hide it.
  links: {
    github: "",
    linkedin: "",
    resume: ""
  }
};
