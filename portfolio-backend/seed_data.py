"""
Run this script to populate your portfolio with your CV data.
Make sure the backend is running first: uvicorn main:app --reload --port 8080
Then run: python seed_data.py
"""

import requests
import json

API_URL = "http://localhost:8080/api"

# Your Skills
skills = [
    {"name_en": "Java", "name_fr": "Java", "category": "Programming Languages", "proficiency": 90, "display_order": 1},
    {"name_en": "Python", "name_fr": "Python", "category": "Programming Languages", "proficiency": 90, "display_order": 2},
    {"name_en": "JavaScript", "name_fr": "JavaScript", "category": "Programming Languages", "proficiency": 85, "display_order": 3},
    {"name_en": "TypeScript", "name_fr": "TypeScript", "category": "Programming Languages", "proficiency": 85, "display_order": 4},
    {"name_en": "HTML/CSS", "name_fr": "HTML/CSS", "category": "Web Technologies", "proficiency": 90, "display_order": 5},
    {"name_en": "C#", "name_fr": "C#", "category": "Programming Languages", "proficiency": 75, "display_order": 6},
    {"name_en": "SQL", "name_fr": "SQL", "category": "Databases", "proficiency": 80, "display_order": 7},
    {"name_en": "Node.js", "name_fr": "Node.js", "category": "Backend", "proficiency": 85, "display_order": 8},
    {"name_en": "React.js", "name_fr": "React.js", "category": "Frontend", "proficiency": 90, "display_order": 9},
    {"name_en": "Spring Boot", "name_fr": "Spring Boot", "category": "Backend", "proficiency": 85, "display_order": 10},
    {"name_en": "Docker", "name_fr": "Docker", "category": "DevOps", "proficiency": 80, "display_order": 11},
    {"name_en": "AWS", "name_fr": "AWS", "category": "Cloud", "proficiency": 75, "display_order": 12},
    {"name_en": "Git", "name_fr": "Git", "category": "Tools", "proficiency": 85, "display_order": 13},
    {"name_en": "Agile Methodologies", "name_fr": "Méthodologies Agile", "category": "Methodologies", "proficiency": 80, "display_order": 14},
]

# Your Projects
projects = [
    {
        "title_en": "TWIN - Stock Market Predictor",
        "title_fr": "TWIN - Prédicteur de Marché Boursier",
        "description_en": "A full-stack dual panel stock market predicting interface using Python, JavaScript and HTML/CSS. Trained on Yahoo Finance Data, implements login features and deployed using Render.",
        "description_fr": "Une interface de prédiction boursière à double panneau utilisant Python, JavaScript et HTML/CSS. Entraîné sur les données Yahoo Finance avec fonctionnalités de connexion.",
        "short_description_en": "Stock market prediction platform with dual panel interface",
        "short_description_fr": "Plateforme de prédiction boursière avec interface à double panneau",
        "technologies": ["Python", "JavaScript", "HTML/CSS", "Yahoo Finance API", "Render"],
        "category": "Full Stack",
        "start_date": "2025-09-01",
        "end_date": "2025-12-01",
        "is_featured": True,
        "display_order": 1
    },
    {
        "title_en": "Champlain Pet Clinic",
        "title_fr": "Clinique Vétérinaire Champlain",
        "description_en": "A full-stack website serving as a multi-purpose interface for customers and their pet doctors. Collaborated with the inventory team using Jira and Agile methodologies. Built with Java, Spring Boot, Docker, React, and TypeScript.",
        "description_fr": "Un site web full-stack servant d'interface polyvalente pour les clients et leurs vétérinaires. Collaboration avec l'équipe d'inventaire utilisant Jira et les méthodologies Agile.",
        "short_description_en": "Multi-purpose veterinary clinic management system",
        "short_description_fr": "Système de gestion de clinique vétérinaire polyvalent",
        "technologies": ["Spring Boot", "React", "TypeScript", "Docker", "Java", "Jira"],
        "category": "Full Stack",
        "start_date": "2025-09-01",
        "end_date": "2025-11-01",
        "is_featured": True,
        "display_order": 2
    },
    {
        "title_en": "VLADTECH INC - Construction Portfolio",
        "title_fr": "VLADTECH INC - Portfolio de Construction",
        "description_en": "Full stack website with a team of five members to create a portfolio and booking system for a construction company, mainly focusing on the front-end. Utilized Java, Spring Boot, Docker, React, and TypeScript.",
        "description_fr": "Site web full-stack avec une équipe de cinq membres pour créer un portfolio et un système de réservation pour une entreprise de construction.",
        "short_description_en": "Portfolio and booking system for construction company",
        "short_description_fr": "Portfolio et système de réservation pour entreprise de construction",
        "technologies": ["Spring Boot", "React", "TypeScript", "Docker", "Java"],
        "category": "Full Stack",
        "start_date": "2025-09-01",
        "end_date": "2026-02-01",
        "is_featured": True,
        "display_order": 3
    },
    {
        "title_en": "NOIRUXE - Music Label Website",
        "title_fr": "NOIRUXE - Site Web du Label Musical",
        "description_en": "A website for a music label, enhancing the online presence of its artists. Collaborated with clients to understand branding needs and tailored designs accordingly. Implemented responsive web design with Tailwind, GSAP, and Three.js.",
        "description_fr": "Un site web pour un label musical, améliorant la présence en ligne de ses artistes. Collaboration avec les clients pour comprendre les besoins de marque.",
        "short_description_en": "Interactive music label website with 3D animations",
        "short_description_fr": "Site web interactif de label musical avec animations 3D",
        "technologies": ["TypeScript", "Tailwind CSS", "GSAP", "Three.js", "React"],
        "category": "Frontend",
        "start_date": "2025-01-01",
        "is_featured": True,
        "display_order": 4
    }
]

# Your Work Experience
work_experience = [
    {
        "company_name": "Self Employed",
        "position_en": "Piano Teacher",
        "position_fr": "Professeur de Piano",
        "description_en": "Instructed students in the basics of piano through structured lessons and developed a comprehensive teaching curriculum tailored to student needs.",
        "description_fr": "Enseignement des bases du piano à travers des leçons structurées et développement d'un curriculum adapté aux besoins des étudiants.",
        "employment_type": "Self-Employed",
        "start_date": "2023-05-01",
        "end_date": "2023-08-31",
        "is_current": False,
        "achievements_en": [
            "Instructed students in the basics of piano through structured lessons",
            "Developed a comprehensive teaching curriculum tailored to student needs"
        ],
        "achievements_fr": [
            "Enseignement des bases du piano à travers des leçons structurées",
            "Développement d'un curriculum adapté aux besoins des étudiants"
        ],
        "display_order": 1
    },
    {
        "company_name": "Pharmaprix",
        "position_en": "Retail Sales Associate",
        "position_fr": "Associé aux Ventes au Détail",
        "description_en": "Worked in a fast-paced retail environment, managing customer transactions and maintaining store organization.",
        "description_fr": "Travail dans un environnement de vente au détail dynamique, gestion des transactions clients et maintien de l'organisation du magasin.",
        "employment_type": "Part-Time",
        "start_date": "2023-05-01",
        "end_date": "2023-08-31",
        "is_current": False,
        "achievements_en": [
            "Adapted to a flexible schedule and worked extra shifts to meet business needs",
            "Restocked and organized merchandise to maintain a well-presented store",
            "Operated the cash register for cash, check, and credit card transactions with high accuracy",
            "Addressed customer inquiries regarding store policies and resolved concerns effectively"
        ],
        "achievements_fr": [
            "Adaptation à un horaire flexible et travail de quarts supplémentaires",
            "Réapprovisionnement et organisation de la marchandise",
            "Utilisation de la caisse enregistreuse avec haute précision",
            "Résolution efficace des préoccupations des clients"
        ],
        "display_order": 2
    }
]

# Your Education
education = [
    {
        "institution_name": "Champlain College",
        "degree_en": "DEP in Computer Science",
        "degree_fr": "DEP en Informatique",
        "field_of_study_en": "Computer Science",
        "field_of_study_fr": "Informatique",
        "description_en": "Comprehensive computer science program focusing on software development, web technologies, and modern programming practices.",
        "description_fr": "Programme complet en informatique axé sur le développement logiciel, les technologies web et les pratiques de programmation modernes.",
        "start_date": "2022-09-01",
        "end_date": "2026-06-01",
        "is_current": True,
        "display_order": 1
    },
    {
        "institution_name": "College Jean-Edes",
        "degree_en": "High School Diploma",
        "degree_fr": "Diplôme d'Études Secondaires",
        "field_of_study_en": "General Studies",
        "field_of_study_fr": "Études Générales",
        "description_en": "Completed high school education with strong academic performance.",
        "description_fr": "Diplôme d'études secondaires avec une forte performance académique.",
        "start_date": "2018-09-01",
        "end_date": "2022-06-01",
        "is_current": False,
        "display_order": 2
    }
]

def add_data():
    print("🚀 Starting to populate your portfolio with data...\n")
    
    # Add Skills
    print("📚 Adding Skills...")
    for skill in skills:
        try:
            response = requests.post(f"{API_URL}/skills", json=skill)
            if response.status_code == 201:
                print(f"  ✅ Added: {skill['name_en']}")
            else:
                print(f"  ❌ Failed to add {skill['name_en']}: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Error adding {skill['name_en']}: {e}")
    
    # Add Projects
    print("\n💼 Adding Projects...")
    for project in projects:
        try:
            response = requests.post(f"{API_URL}/projects", json=project)
            if response.status_code == 201:
                print(f"  ✅ Added: {project['title_en']}")
            else:
                print(f"  ❌ Failed to add {project['title_en']}: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Error adding {project['title_en']}: {e}")
    
    # Add Work Experience
    print("\n💼 Adding Work Experience...")
    for exp in work_experience:
        try:
            response = requests.post(f"{API_URL}/work-experience", json=exp)
            if response.status_code == 201:
                print(f"  ✅ Added: {exp['position_en']} at {exp['company_name']}")
            else:
                print(f"  ❌ Failed to add {exp['position_en']}: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Error adding {exp['position_en']}: {e}")
    
    # Add Education
    print("\n🎓 Adding Education...")
    for edu in education:
        try:
            response = requests.post(f"{API_URL}/education", json=edu)
            if response.status_code == 201:
                print(f"  ✅ Added: {edu['degree_en']} from {edu['institution_name']}")
            else:
                print(f"  ❌ Failed to add {edu['degree_en']}: {response.status_code}")
        except Exception as e:
            print(f"  ❌ Error adding {edu['degree_en']}: {e}")
    
    print("\n✨ Done! Check your portfolio at http://localhost:3000")

if __name__ == "__main__":
    print("=" * 60)
    print("  PORTFOLIO DATA SEEDER")
    print("  Sebastien Legagneur")
    print("=" * 60)
    print("\n⚠️  Make sure the backend is running on http://localhost:8080")
    print("    Run: uvicorn main:app --reload --port 8080\n")
    
    try:
        # Test connection
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            print("✅ Backend is running!\n")
            add_data()
        else:
            print("❌ Backend is not responding correctly")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Please start it first:")
        print("   cd portfolio-backend")
        print("   uvicorn main:app --reload --port 8080")
