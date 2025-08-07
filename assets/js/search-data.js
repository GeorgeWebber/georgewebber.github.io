// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-bio",
    title: "bio",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-news",
          title: "news",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/news/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Publications by categories in reversed chronological order. Type below to filter by keywords or co-authors.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-scored-in-the-top-50-students-uk-wide-for-a-level-computer-science",
          title: 'Scored in the Top 50 students UK-wide for A-Level Computer Science.',
          description: "",
          section: "News",},{id: "news-achieved-a-a-a-a-a-in-my-a-levels-maths-further-maths-physics-cs-amp-amp-epq",
          title: 'Achieved A*A*A*A*A* in my A-Levels (Maths, Further Maths, Physics, CS &amp;amp;amp; EPQ).',
          description: "",
          section: "News",},{id: "news-began-studying-mathematics-and-computer-science-at-st-anne-s-college-university-of-oxford",
          title: 'Began studying Mathematics and Computer Science at St Anne’s College, University of Oxford....',
          description: "",
          section: "News",},{id: "news-graduated-from-the-university-of-oxford",
          title: 'Graduated from the University of Oxford',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/oxford_graduation.html";
            },},{id: "news-began-phd-study-into-generative-machine-learning-for-pet-reconstruction-under-the-primary-supervision-of-prof-andrew-reader",
          title: 'Began PhD study into generative machine learning for PET reconstruction, under the primary...',
          description: "",
          section: "News",},{id: "news-published-review-article-in-bjr-ai",
          title: 'Published review article in BJR|AI',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/BJRAI_2024_published.html";
            },},{id: "news-presented-two-papers-at-ieee-mic-in-florida",
          title: 'Presented two papers at IEEE MIC in Florida',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/florida_MIC_conference.html";
            },},{id: "news-won-best-presentation-at-departmental-research-symposium",
          title: 'Won best presentation at departmental research symposium',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/symposium_award.html";
            },},{id: "news-published-first-author-ieee-tmi-paper",
          title: 'Published first-author IEEE TMI paper',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/IEEE_TMI_2025_published.html";
            },},{id: "news-ieee-mic-2025-submission-accepted-for-oral-presentation",
          title: 'IEEE MIC 2025 submission accepted for oral presentation',
          description: "",
          section: "News",},{id: "news-presented-at-maths4dl-conference",
          title: 'Presented at Maths4DL conference',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/maths4dl_poster.html";
            },},{id: "news-first-author-miccai-paper-accepted",
          title: 'First-author MICCAI paper accepted',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/MICCAI_paper_accepted_2025.html";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%67%65%6F%72%67%65.%77%65%62%62%65%72@%6B%63%6C.%61%63.%75%6B", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/george-webber", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0009-0003-2573-7690", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=PqjnFqAAAAAJ", "_blank");
        },
      },{
        id: 'social-work',
        title: 'Work',
        section: 'Socials',
        handler: () => {
          window.open("https://kclpure.kcl.ac.uk/portal/en/persons/george-webber", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
