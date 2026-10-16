"""
Everything the assistant knows about Ranjeet.

The profile lives in code rather than in documents that are loaded, embedded and
searched at runtime: it is small enough to sit in the model's prompt in full, so
answering needs no retrieval round trip and the server has nothing to index at
startup. To change what the assistant knows, edit PROFILE and redeploy.

Sources: the CV, the portfolio pages (index.html) and the two internship write-ups.
"""

PROFILE = """\
# Ranjeet Gupta

AI/ML Engineer and B.Tech student at the National Institute of Technology (NIT) Jamshedpur, Jharkhand, India. He works on production-grade deep learning, Generative AI systems and automated MLOps pipelines, with a strong base in data science, predictive modeling and statistics.

He builds intelligent systems that combine LLMs, RAG pipelines, multi-agent architectures and predictive analytics to solve real-world problems. His experience spans AI research, statistical modeling, computer vision and autonomous robotic systems, with projects ranging from multimodal AI assistants and Hybrid RAG systems to foundation models and advanced deep learning architectures.

Target roles: AI Engineer, Machine Learning Engineer, Data Scientist, MLOps Engineer. He is open to AI/ML roles, internships and research collaborations.

## Contact

- Email: ranjeetgupta.work@gmail.com
- Location: NIT Jamshedpur, Jharkhand, India
- GitHub: https://github.com/ranjeet258
- LinkedIn: https://www.linkedin.com/in/ranjeet-gupta-9a705827b/
- Kaggle: https://www.kaggle.com/ranjeet258
- Medium: https://medium.com/@ranjeetkrgupta258

## Education

- B.Tech, National Institute of Technology (NIT) Jamshedpur, Aug 2023 - Jun 2027. Relevant coursework: Artificial Intelligence, Machine Learning, Engineering Mathematics, Probability and Statistics.
- Higher Secondary: Akanksha 40, JAC Board - 92%.
- Secondary: Model School - 90%.

## Skills

- Languages: Python, SQL, C/C++.
- Machine learning and deep learning: XGBoost, Random Forest, Transformers, CNN, RNN, Scikit-learn, PyTorch, TensorFlow, Keras, NLP, Computer Vision (OpenCV), Reinforcement Learning.
- Generative AI: LLMs, RAG, fine-tuning, Agentic AI and multi-agent systems, prompt engineering, vector databases (Qdrant), LangChain, LangGraph, MCP, Hugging Face.
- LLM optimisation: LoRA, QLoRA, PEFT, RLHF, quantization (PTQ, QAT, AWQ), knowledge distillation, Unsloth, LLaMA Factory, DeepSpeed.
- Data science: feature engineering, EDA, statistical analysis, hypothesis testing, A/B testing, optimization, risk modeling, data visualization (Matplotlib, Seaborn, Power BI, Tableau).
- Data engineering: SQL, ETL pipelines, Pandas, NumPy, Apache Spark, MySQL, PostgreSQL, Redis, Amazon Redshift.
- Cloud and MLOps: AWS (EC2, S3), Azure, Docker, Kubernetes, CI/CD, GitHub Actions, MLflow.
- Software: FastAPI, Next.js, Git/GitHub, Linux, Jupyter, data structures and algorithms.

## Experience

### Intern - Gargs Engineering Limited, Jamshedpur (May - June 2025)
Manufacturing cost analysis on the backhoe bucket production process.
- Collected, cleaned and analysed raw-material and process cost data across manufacturing lines, using SQL to query production data and Excel and Python (Pandas) for cleaning and analysis.
- Ran root-cause analysis and statistical modeling of production cost drivers, and exploratory data analysis to find trends, inefficiencies and process-improvement opportunities.
- Built interactive Power BI dashboards for material consumption, material flow, production cost, revenue trends and KPIs.
- Worked with the engineering team on material utilisation and production workflows; the recommendations contributed to an approximately 8% reduction in manufacturing cost.
- Skills used: Python, Pandas, SQL, Excel, Statistics, Power BI, EDA, data visualization.

### Intern - IIT Hyderabad Sponsored Research Project, at NIT Jamshedpur (Oct 2024 - Jan 2025)
Fin motion optimisation for a bio-inspired underwater robot that mimics fish locomotion with two servo motors per fin. The goal was to find the servo frequency, amplitude and phase offset that maximise thrust while minimising energy use, without months of hardware trials.
- Mounted the robot on a force-measurement rig in a water tank and programmed a Raspberry Pi to send sinusoidal commands to the servos, recording thrust and power across 270 unique frequency, amplitude and phase-offset configurations.
- Ran the 270 experiments across 3 motion modes, repeating each 3 times to handle sensor noise, giving 810 clean training datapoints.
- Trained an XGBoost regression model to predict thrust and power for any servo parameter combination, reaching R-squared of about 0.96.
- Ran a 16,000-combination grid search on the trained model in under 3 seconds to find optimal settings, replacing months of physical testing (about 78% less hardware testing time).
- Validated the top predictions in the tank (within 5% error) and deployed the optimised servo commands as a real-time lookup table on the Raspberry Pi onboard controller, across 6 motion modes.
- Key finding: a phase offset of 85-90 degrees between the two servos consistently gave peak efficiency across all motion modes, independently confirming how real fish swim.
- Skills used: Python, XGBoost, scikit-learn, Pandas, NumPy, Raspberry Pi, servo control, mathematics, data analytics.

### Co-Founder - Robotic and Automation Club, NIT Jamshedpur (Aug 2024 - Present)
- Co-founded a research-oriented student club focused on machine learning and intelligent automation systems.
- Mentors students on machine learning pipelines, deep learning frameworks and computer vision architectures, and organises workshops on AI/ML and AI robotics systems.
- Directs the design and development of end-to-end computer vision and embedded AI proof-of-concepts.

## Projects

### AgentKart (ongoing) - https://github.com/ranjeet258/AgentKart
An autonomous AI workforce platform to hire, orchestrate and manage AI agents like human talent. A "CEO Agent" breaks down strategic goals and routes sub-tasks to specialised Sales, Marketing and Customer Support agents. An AI matching engine (FastAPI) routes natural-language goals to the right agent using LangChain, Qdrant (vector DB) and Neo4j (graph DB), with Temporal.io for durable long-running execution. Microservices: Next.js frontend, NestJS core API with Prisma and PostgreSQL, FastAPI AI engine, Docker.

### PaperTunedLLM - https://github.com/ranjeet258/PaperTunedLLM
Turns dense ML research papers into verifiable insights. A Qwen2.5-3B model fine-tuned on the QASPER dataset with QLoRA and compressed with 4-bit AWQ quantization, for complex reasoning on lightweight hardware. Uses a BGE-M3 and Qdrant RAG pipeline to extract precise evidence from PDFs and reduce hallucination. Full-stack microservice built with PyTorch, FastAPI, Next.js and TGI, tuned for high-throughput, low-latency retrieval. Skills: Quantization, PTQ, QAT, LoRA, QLoRA, Unsloth, Hugging Face ecosystem.

### BusinessIQ - https://github.com/ranjeet258/BusinessIQ
Agentic AI platform for enterprise analytics, RAG and WhatsApp marketing automation. A multi-agent architecture built with LangGraph runs text-to-SQL workflows to query, aggregate and visualise enterprise data; RAG pipelines turn unstructured data (PDFs, Excel, CSVs) into queryable insights; automated routing handles WhatsApp workflows. Tech: Python, SQL, Pandas, LangChain, LangGraph, LangSmith, vector databases.

### Vehicle Insurance MLOps Pipeline - https://github.com/ranjeet258/MLops-Vehicle-Insurance-Pipeline
An end-to-end MLOps pipeline for predictive analytics on vehicle insurance data: exploratory data analysis, data cleaning and automated feature engineering for tabular data, with the model shipped through a fully automated CI/CD pipeline (GitHub Actions) and deployed in Docker containers on AWS. Tech: Python, Scikit-learn, SQL, MongoDB Atlas, AWS EC2, Docker, GitHub Actions, Flask.

### Foundation Models for End-to-End Event Reconstruction - https://github.com/ranjeet258/Specific-Tasks-2a-FM-for-E2E-EventReconstruction
A unified multi-task AI model for holistic particle-physics event analysis. Standard pipelines process tasks separately, causing compounding errors; this model handles multiple tasks simultaneously and uses a custom ConservationLoss so predictions respect conservation of energy. Tech: Python, PyTorch, physics-informed ML.

### CMS Detector Super-Resolution - https://github.com/ranjeet258/Specific-Tasks-2b-Super-resolution-at-the-CMS-detector
A deep learning network that increases the resolution of particle-collision data from the CMS detector at CERN, reconstructing lightweight low-resolution data into high-fidelity data to cut storage and processing cost. Tech: Python, PyTorch, super-resolution networks.

### AI Humanoid Robotic Head
A personalised humanoid robotic head for natural human-machine interaction, providing multipurpose, domain-specific customer support. Powered by a multimodal AI architecture integrating on-device computer vision and Gemini for real-time perception and tailored conversation.

### Movie Recommender System - https://github.com/ranjeet258/Movie-Recommender-System
Content-based recommender on the TMDB 5000 dataset. Extracts features with NLP (TF-IDF / CountVectorizer) and ranks similar movies with cosine similarity.

### Used Car Sales Dashboard (Tableau) - https://github.com/ranjeet258/Tableau_Used-Car-Analysis
Interactive Tableau dashboard on used-car sales, uncovering pricing trends, fuel types and ownership patterns. Cleaned raw datasets, built relational models and designed interactive visualisations with dynamic filters.

### Mobile Sales Dashboard (Power BI) - https://github.com/ranjeet258/PowerBI_Motorola-Sales-Dashboard
Power BI dashboard of smartphone sales across India showing total sales, payment trends, top models, customer demographics and regional distribution. Ingested unstructured data, performed DAX modeling and built KPI dashboards.

## Achievements and Certifications

- Patents: two published patents integrating predictive AI and sensor data - an AI-Based Humanoid Robotic Head System and a Bio-Inspired Underwater Robot System.
- Certifications: Google Advanced Data Analytics; Machine Learning Specialisation; Generative AI and LLM Fine-Tuning.
- Top 3 percentile in JEE Main 2023 (about 1.4 million candidates).
- District Rank 1 and State Rank 29 (Jharkhand) in the Akanksha 40 examination.
- Solved 200+ algorithmic and data-manipulation problems across Kaggle, LeetCode and Codeforces.
- Co-founded the Robotic and Automation Club at NIT Jamshedpur.
"""
