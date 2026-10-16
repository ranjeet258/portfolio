# Ranjeet Gupta - Portfolio

Welcome to the personal portfolio repository of Ranjeet Gupta. This is a front-end showcase of my projects, skills, and professional experience as an AI Engineer and Data Scientist.

## About Me

I am an AI Engineer & Data Scientist specializing in Machine Learning, Deep Learning, Large Language Models (LLMs), and MLOps. This portfolio serves to highlight my journey, expertise, and the solutions I build to solve complex data problems.

## Features

- **Professional Summary**: Overview of my skills and career path.
- **Projects Showcase**: Highlights of significant AI and ML projects.
- **Skills Directory**: Technical proficiencies in algorithms, frameworks, and MLOps tools.
- **Contact Details**: Ways to connect or collaborate with me.

## Technologies Used

- HTML5, CSS3 and plain JavaScript (no build step for the pages themselves)
- Bootstrap grid + Tailwind utilities, precompiled into `assets/css/tailwind.css`
- AOS, Typed.js, GLightbox and Isotope for scroll animations, the hero typing effect, image previews and the project grid
- A canvas particle background, preloader and skills marquee in `assets/js/fx.js`
- An AI chat assistant backed by a small FastAPI service in [`rag-backend/`](rag-backend/README.md)

## Project Layout

```
index.html, gargs-intern.html, iith-intern.html   pages
assets/css/main.css      site styles and light theme
assets/css/fx.css        preloader, hero effects, marquee
assets/css/tailwind.css  generated - do not edit by hand
assets/js/main.js        navigation, theme, project grid, contact assistant, hero chat
assets/js/fx.js          visual effects
rag-backend/             chat API (the assistant's knowledge lives in chat/knowledge.py)
```

## Editing Styles

Tailwind classes are compiled ahead of time rather than generated in the browser. After adding or changing Tailwind classes in the HTML or JS, rebuild the stylesheet (needs Node.js):

```bash
npx tailwindcss@3.4.17 -i assets/css/tailwind.input.css -o assets/css/tailwind.css
```

## Contact

Feel free to reach out if you're interested in collaborating on AI/ML projects or discussing innovative solutions.

---
*Built by Ranjeet Gupta*