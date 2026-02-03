"""
Run this script to populate your portfolio database with your CV data.
No need to run the backend - this connects directly to Supabase!
Just run: python seed_data.py
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models import Skill, Project, WorkExperience, Education, Hobby
from app.database import Base
import os
from dotenv import load_dotenv
from datetime import date

# Load environment variables
load_dotenv()

# Get DATABASE_URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
print("📦 Creating database tables...")
Base.metadata.create_all(bind=engine)

# Your Skills (Based on your CV and projects)
skills_data = [
    {"name_en": "Python", "name_fr": "Python", "category": "Programming Languages", "proficiency": 90, "display_order": 1},
    {"name_en": "Java", "name_fr": "Java", "category": "Programming Languages", "proficiency": 90, "display_order": 2},
    {"name_en": "JavaScript", "name_fr": "JavaScript", "category": "Programming Languages", "proficiency": 85, "display_order": 3},
    {"name_en": "TypeScript", "name_fr": "TypeScript", "category": "Programming Languages", "proficiency": 85, "display_order": 4},
    {"name_en": "C#", "name_fr": "C#", "category": "Programming Languages", "proficiency": 75, "display_order": 5},
    {"name_en": "HTML/CSS", "name_fr": "HTML/CSS", "category": "Web Technologies", "proficiency": 90, "display_order": 6},
    {"name_en": "SQL", "name_fr": "SQL", "category": "Databases", "proficiency": 80, "display_order": 7},
    {"name_en": "React.js", "name_fr": "React.js", "category": "Frontend", "proficiency": 90, "display_order": 8},
    {"name_en": "Node.js", "name_fr": "Node.js", "category": "Backend", "proficiency": 85, "display_order": 9},
    {"name_en": "Spring Boot", "name_fr": "Spring Boot", "category": "Backend", "proficiency": 85, "display_order": 10},
    {"name_en": "Docker", "name_fr": "Docker", "category": "DevOps", "proficiency": 80, "display_order": 11},
    {"name_en": "AWS", "name_fr": "AWS", "category": "Cloud", "proficiency": 75, "display_order": 12},
    {"name_en": "Git", "name_fr": "Git", "category": "Tools", "proficiency": 85, "display_order": 13},
    {"name_en": "Tailwind CSS", "name_fr": "Tailwind CSS", "category": "Frontend", "proficiency": 85, "display_order": 14},
    {"name_en": "GSAP", "name_fr": "GSAP", "category": "Frontend", "proficiency": 75, "display_order": 15},
    {"name_en": "Three.js", "name_fr": "Three.js", "category": "Frontend", "proficiency": 70, "display_order": 16},
    {"name_en": "Agile/Scrum", "name_fr": "Agile/Scrum", "category": "Methodologies", "proficiency": 80, "display_order": 17},
    {"name_en": "Jira", "name_fr": "Jira", "category": "Tools", "proficiency": 75, "display_order": 18},
]

# Your Projects (Based on your CV)
projects_data = [
    {
        "title_en": "TWIN - Stock Market Predictor",
        "title_fr": "TWIN - Prédicteur de Marché Boursier",
        "description_en": "A full-stack dual panel stock market predicting interface using Python, JavaScript and HTML/CSS. Trained on Yahoo Finance Data with machine learning algorithms. Implements secure login features and deployed using Render for production hosting.",
        "description_fr": "Une interface de prédiction boursière à double panneau full-stack utilisant Python, JavaScript et HTML/CSS. Entraîné sur les données Yahoo Finance avec algorithmes d'apprentissage automatique. Fonctionnalités de connexion sécurisée et déploiement sur Render.",
        "short_description_en": "ML-powered stock market prediction platform with dual panel interface",
        "short_description_fr": "Plateforme de prédiction boursière alimentée par ML avec interface à double panneau",
        "technologies": ["Python", "JavaScript", "HTML/CSS"],
        "category": "Full Stack",
        "start_date": date(2024, 9, 1),
        "end_date": date(2024, 12, 1),
        "is_featured": True,
        "display_order": 1
    },
    {
        "title_en": "Champlain Pet Clinic",
        "title_fr": "Clinique Vétérinaire Champlain",
        "description_en": "A comprehensive full-stack veterinary clinic management system serving as a multi-purpose interface for customers and veterinarians. Collaborated with the inventory team using Jira and Agile methodologies. Built with Java Spring Boot backend, React frontend with TypeScript, and containerized using Docker for consistent deployment.",
        "description_fr": "Un système complet de gestion de clinique vétérinaire full-stack servant d'interface polyvalente pour les clients et les vétérinaires. Collaboration avec l'équipe d'inventaire utilisant Jira et les méthodologies Agile. Construit avec backend Java Spring Boot, frontend React avec TypeScript, et conteneurisé avec Docker.",
        "short_description_en": "Multi-purpose veterinary clinic management system with inventory integration",
        "short_description_fr": "Système de gestion de clinique vétérinaire avec intégration d'inventaire",
        "technologies": ["Java", "Spring Boot", "React", "TypeScript", "Docker", "PostgreSQL", "Jira"],
        "category": "Full Stack",
        "start_date": date(2024, 9, 1),
        "end_date": date(2024, 11, 1),
        "is_featured": True,
        "display_order": 2
    },
    {
        "title_en": "VLADTECH INC - Construction Portfolio",
        "title_fr": "VLADTECH INC - Portfolio de Construction",
        "description_en": "Full stack website developed with a team of five members to create a portfolio and booking system for a construction company. Primarily focused on front-end development with emphasis on responsive design and user experience. Utilized Java Spring Boot for backend services, React with TypeScript for the frontend, and Docker for containerization.",
        "description_fr": "Site web full-stack développé avec une équipe de cinq membres pour créer un portfolio et un système de réservation pour une entreprise de construction. Principalement axé sur le développement front-end avec accent sur le design responsive et l'expérience utilisateur.",
        "short_description_en": "Portfolio and booking system for construction company with team collaboration",
        "short_description_fr": "Portfolio et système de réservation pour entreprise de construction avec collaboration d'équipe",
        "technologies": ["Java", "Spring Boot", "React", "TypeScript", "Docker", "REST API"],
        "category": "Full Stack",
        "start_date": date(2024, 9, 1),
        "end_date": date(2026, 2, 1),
        "is_featured": True,
        "display_order": 3
    },
    {
        "title_en": "NOIRUXE - Music Label Website",
        "title_fr": "NOIRUXE - Site Web du Label Musical",
        "description_en": "An immersive website for a music label, enhancing the online presence of its artists with cutting-edge web technologies. Collaborated with clients to understand branding needs and tailored designs accordingly. Implemented responsive web design with Tailwind CSS for styling, GSAP for smooth animations, and Three.js for stunning 3D effects and interactive elements.",
        "description_fr": "Un site web immersif pour un label musical, améliorant la présence en ligne de ses artistes avec des technologies web de pointe. Collaboration avec les clients pour comprendre les besoins de marque et adaptation des designs. Design web responsive avec Tailwind CSS, GSAP pour animations fluides, et Three.js pour effets 3D.",
        "short_description_en": "Interactive music label website with 3D animations and modern design",
        "short_description_fr": "Site web interactif de label musical avec animations 3D et design moderne",
        "technologies": ["React", "TypeScript", "Tailwind CSS", "GSAP", "Three.js", "Vite"],
        "category": "Frontend",
        "start_date": date(2025, 1, 1),
        "is_featured": True,
        "display_order": 4
    }
]

# Your Work Experience (Based on your CV)
work_experience_data = [
    {
        "company_name": "Self Employed",
        "position_en": "Piano Teacher",
        "position_fr": "Professeur de Piano",
        "description_en": "Provided private piano instruction to students of various skill levels, developing customized lesson plans and teaching methodology.",
        "description_fr": "Enseignement privé du piano à des étudiants de différents niveaux, développement de plans de cours personnalisés et méthodologie d'enseignement.",
        "employment_type": "Self-Employed",
        "start_date": date(2023, 5, 1),
        "end_date": date(2023, 8, 31),
        "is_current": False,
        "achievements_en": [
            "Instructed students in the basics of piano through structured lessons",
            "Developed a comprehensive teaching curriculum tailored to student needs and skill levels",
            "Fostered a positive learning environment that encouraged student progress"
        ],
        "achievements_fr": [
            "Enseignement des bases du piano à travers des leçons structurées",
            "Développement d'un curriculum complet adapté aux besoins et niveaux des étudiants",
            "Création d'un environnement d'apprentissage positif encourageant la progression"
        ],
        "display_order": 1
    },
    {
        "company_name": "Pharmaprix",
        "position_en": "Retail Sales Associate",
        "position_fr": "Associé aux Ventes au Détail",
        "description_en": "Worked in a fast-paced retail environment, managing customer transactions, maintaining store organization, and providing excellent customer service.",
        "description_fr": "Travail dans un environnement de vente au détail dynamique, gestion des transactions clients, maintien de l'organisation du magasin et service client excellent.",
        "location": "Montreal, QC",
        "employment_type": "Part-Time",
        "start_date": date(2023, 5, 1),
        "end_date": date(2023, 8, 31),
        "is_current": False,
        "achievements_en": [
            "Adapted to a flexible schedule and worked extra shifts to meet business needs",
            "Restocked and organized merchandise to maintain a well-presented store environment",
            "Operated the cash register for cash, check, and credit card transactions with high accuracy",
            "Addressed customer inquiries regarding store policies and resolved concerns effectively"
        ],
        "achievements_fr": [
            "Adaptation à un horaire flexible et travail de quarts supplémentaires selon les besoins",
            "Réapprovisionnement et organisation de la marchandise pour maintenir un magasin bien présenté",
            "Utilisation de la caisse enregistreuse avec haute précision pour diverses transactions",
            "Résolution efficace des préoccupations des clients et réponses aux questions sur les politiques"
        ],
        "display_order": 2
    }
]

# Your Education (Based on your CV)
education_data = [
    {
        "institution_name": "Champlain College Saint-Lambert",
        "degree_en": "DEC in Computer Science Technology",
        "degree_fr": "DEC en Technologie de l'Informatique",
        "field_of_study_en": "Computer Science",
        "field_of_study_fr": "Informatique",
        "description_en": "Comprehensive computer science program focusing on software development, web technologies, database management, and modern programming practices. Gained hands-on experience with Java, Python, JavaScript, and various frameworks through team projects.",
        "description_fr": "Programme complet en informatique axé sur le développement logiciel, les technologies web, la gestion de bases de données et les pratiques de programmation modernes. Expérience pratique avec Java, Python, JavaScript et divers frameworks à travers des projets d'équipe.",
        "location": "Saint-Lambert, QC",
        "start_date": date(2022, 9, 1),
        "end_date": date(2026, 6, 1),
        "is_current": True,
        "achievements_en": [
            "Developed multiple full-stack applications as part of curriculum",
            "Collaborated on team projects using Agile methodologies and Jira",
            "Gained proficiency in Java, Python, JavaScript, TypeScript, and modern frameworks"
        ],
        "achievements_fr": [
            "Développement de plusieurs applications full-stack dans le cadre du programme",
            "Collaboration sur des projets d'équipe utilisant les méthodologies Agile et Jira",
            "Maîtrise de Java, Python, JavaScript, TypeScript et frameworks modernes"
        ],
        "display_order": 1
    },
    {
        "institution_name": "College Jean-Eudes",
        "degree_en": "High School Diploma (DES)",
        "degree_fr": "Diplôme d'Études Secondaires (DES)",
        "field_of_study_en": "General Studies",
        "field_of_study_fr": "Études Générales",
        "description_en": "Completed secondary education with strong academic performance and developed foundational skills in mathematics, sciences, and languages.",
        "description_fr": "Diplôme d'études secondaires avec une forte performance académique et développement de compétences fondamentales en mathématiques, sciences et langues.",
        "location": "Montreal, QC",
        "start_date": date(2018, 9, 1),
        "end_date": date(2022, 6, 1),
        "is_current": False,
        "display_order": 2
    }
]

# Your Hobbies
hobbies_data = [
    {
        "name_en": "Music Production",
        "name_fr": "Production Musicale",
        "description_en": "Passionate about creating and producing electronic music, working with digital audio workstations and sound design.",
        "description_fr": "Passionné par la création et la production de musique électronique, travaillant avec des stations de travail audio numériques et la conception sonore.",
        "display_order": 1
    },
    {
        "name_en": "Piano",
        "name_fr": "Piano",
        "description_en": "Playing piano as both a hobby and professional skill, teaching others and performing.",
        "description_fr": "Jouer du piano comme passe-temps et compétence professionnelle, enseigner aux autres et performer.",
        "display_order": 2
    },
    {
        "name_en": "Gaming",
        "name_fr": "Jeux Vidéo",
        "description_en": "Enthusiast of video games, especially strategy and competitive games that challenge problem-solving skills.",
        "description_fr": "Amateur de jeux vidéo, en particulier les jeux de stratégie et compétitifs qui stimulent les compétences en résolution de problèmes.",
        "display_order": 3
    },
    {
        "name_en": "Technology & Innovation",
        "name_fr": "Technologie et Innovation",
        "description_en": "Keeping up with the latest technology trends, experimenting with new frameworks and tools.",
        "description_fr": "Se tenir au courant des dernières tendances technologiques, expérimenter avec de nouveaux frameworks et outils.",
        "display_order": 4
    }
]

def clear_existing_data(db):
    """Clear existing data from all tables"""
    print("🗑️  Clearing existing data...")
    try:
        db.query(Skill).delete()
        db.query(Project).delete()
        db.query(WorkExperience).delete()
        db.query(Education).delete()
        db.query(Hobby).delete()
        db.commit()
        print("   ✅ Existing data cleared\n")
    except Exception as e:
        print(f"   ⚠️  Error clearing data: {e}\n")
        db.rollback()

def add_skills(db):
    """Add skills to database"""
    print("📚 Adding Skills...")
    count = 0
    for skill_data in skills_data:
        try:
            skill = Skill(**skill_data)
            db.add(skill)
            db.commit()
            print(f"   ✅ Added: {skill_data['name_en']}")
            count += 1
        except Exception as e:
            print(f"   ❌ Failed to add {skill_data['name_en']}: {e}")
            db.rollback()
    print(f"   📊 Total skills added: {count}\n")

def add_projects(db):
    """Add projects to database"""
    print("💼 Adding Projects...")
    count = 0
    for project_data in projects_data:
        try:
            project = Project(**project_data)
            db.add(project)
            db.commit()
            print(f"   ✅ Added: {project_data['title_en']}")
            count += 1
        except Exception as e:
            print(f"   ❌ Failed to add {project_data['title_en']}: {e}")
            db.rollback()
    print(f"   📊 Total projects added: {count}\n")

def add_work_experience(db):
    """Add work experience to database"""
    print("💼 Adding Work Experience...")
    count = 0
    for exp_data in work_experience_data:
        try:
            exp = WorkExperience(**exp_data)
            db.add(exp)
            db.commit()
            print(f"   ✅ Added: {exp_data['position_en']} at {exp_data['company_name']}")
            count += 1
        except Exception as e:
            print(f"   ❌ Failed to add {exp_data['position_en']}: {e}")
            db.rollback()
    print(f"   📊 Total work experiences added: {count}\n")

def add_education(db):
    """Add education to database"""
    print("🎓 Adding Education...")
    count = 0
    for edu_data in education_data:
        try:
            edu = Education(**edu_data)
            db.add(edu)
            db.commit()
            print(f"   ✅ Added: {edu_data['degree_en']} from {edu_data['institution_name']}")
            count += 1
        except Exception as e:
            print(f"   ❌ Failed to add {edu_data['degree_en']}: {e}")
            db.rollback()
    print(f"   📊 Total education records added: {count}\n")

def add_hobbies(db):
    """Add hobbies to database"""
    print("🎯 Adding Hobbies...")
    count = 0
    for hobby_data in hobbies_data:
        try:
            hobby = Hobby(**hobby_data)
            db.add(hobby)
            db.commit()
            print(f"   ✅ Added: {hobby_data['name_en']}")
            count += 1
        except Exception as e:
            print(f"   ❌ Failed to add {hobby_data['name_en']}: {e}")
            db.rollback()
    print(f"   📊 Total hobbies added: {count}\n")

if __name__ == "__main__":
    print("=" * 80)
    print("  PORTFOLIO DATABASE SEEDER")
    print("  Sebastien Legagneur - NOIRUXE Portfolio")
    print("=" * 80)
    print()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Test connection
        print("🔌 Testing database connection...")
        db.execute(text("SELECT 1"))
        print("   ✅ Connected to Supabase database!\n")
        
        # Clear existing data
        clear_existing_data(db)
        
        # Add all data
        add_skills(db)
        add_projects(db)
        add_work_experience(db)
        add_education(db)
        add_hobbies(db)
        
        print("=" * 80)
        print("✨ SUCCESS! Your portfolio database has been populated!")
        print("=" * 80)
        print("\n📊 Summary:")
        print(f"   • {len(skills_data)} skills")
        print(f"   • {len(projects_data)} projects")
        print(f"   • {len(work_experience_data)} work experiences")
        print(f"   • {len(education_data)} education records")
        print(f"   • {len(hobbies_data)} hobbies")
        print("\n🌐 Next steps:")
        print("   1. Start your frontend: npm run dev")
        print("   2. Start your backend: uvicorn main:app --reload --port 8000")
        print("   3. Visit: http://localhost:5173")
        print("\n💡 Tip: Check your Supabase dashboard to see the data!")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n⚠️  Troubleshooting:")
        print("   1. Make sure your .env file has the correct DATABASE_URL")
        print("   2. Check that your Supabase database is accessible")
        print("   3. Verify Row Level Security is disabled for testing")
    finally:
        db.close()
