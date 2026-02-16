import psycopg2
import re

NEON_URL = 'postgresql://neondb_owner:npg_GD7iB1EpFrPI@ep-fancy-king-ai9ek29a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'
SUPABASE_STORAGE_URL = 'https://kzkgokdlghefqqhhdqlv.supabase.co/storage/v1/object/public/portfolio-files'

def update_urls():
    conn = psycopg2.connect(NEON_URL)
    cursor = conn.cursor()
    
    print("🔄 Updating image URLs to Supabase Storage...\n")
    
    # Update projects
    cursor.execute("SELECT id, title_en, image_url, video_url FROM projects")
    projects = cursor.fetchall()
    
    for project in projects:
        pid, title, img_url, vid_url = project
        updated = False
        
        # Update image_url if it's a local path
        if img_url and ('/Media/' in img_url or 'localhost' in img_url or '/uploads/' in img_url):
            # Extract filename
            filename = img_url.split('/')[-1]
            new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
            cursor.execute("UPDATE projects SET image_url = %s WHERE id = %s", (new_url, pid))
            print(f"  ✓ Project '{title}': {filename}")
            updated = True
        
        # Update video_url if it's a local path
        if vid_url and ('/Media/' in vid_url or 'localhost' in vid_url or '/uploads/' in vid_url):
            filename = vid_url.split('/')[-1]
            new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
            cursor.execute("UPDATE projects SET video_url = %s WHERE id = %s", (new_url, pid))
            print(f"  ✓ Project '{title}' video: {filename}")
            updated = True
        
        if not updated and img_url:
            print(f"  ⊘ Project '{title}': Already has valid URL")
    
    # Commit projects updates
    conn.commit()
    
    # Update skills icon_url
    cursor.execute("SELECT id, name_en, icon_url FROM skills WHERE icon_url IS NOT NULL")
    skills = cursor.fetchall()
    
    for skill in skills:
        sid, name, icon_url = skill
        if icon_url and ('/Media/' in icon_url or 'localhost' in icon_url or '/uploads/' in icon_url):
            filename = icon_url.split('/')[-1]
            new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
            cursor.execute("UPDATE skills SET icon_url = %s WHERE id = %s", (new_url, sid))
            print(f"  ✓ Skill '{name}': {filename}")
    
    # Update education logo_url (if column exists)
    try:
        cursor.execute("SELECT id, institution_name, logo_url FROM education WHERE logo_url IS NOT NULL")
        education = cursor.fetchall()
        
        for edu in education:
            eid, inst, logo_url = edu
            if logo_url and ('/Media/' in logo_url or 'localhost' in logo_url or '/uploads/' in logo_url):
                filename = logo_url.split('/')[-1]
                new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
                cursor.execute("UPDATE education SET logo_url = %s WHERE id = %s", (new_url, eid))
                print(f"  ✓ Education '{inst}': {filename}")
    except psycopg2.errors.UndefinedColumn:
        print("  ⊘ Education: no logo_url column")
        conn.rollback()
    
    # Update work experience logo_url (if column exists)
    try:
        cursor.execute("SELECT id, company_name, logo_url FROM work_experience WHERE logo_url IS NOT NULL")
        experiences = cursor.fetchall()
        
        for exp in experiences:
            eid, company, logo_url = exp
            if logo_url and ('/Media/' in logo_url or 'localhost' in logo_url or '/uploads/' in logo_url):
                filename = logo_url.split('/')[-1]
                new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
                cursor.execute("UPDATE work_experience SET logo_url = %s WHERE id = %s", (new_url, eid))
                print(f"  ✓ Work Experience '{company}': {filename}")
    except psycopg2.errors.UndefinedColumn:
        print("  ⊘ Work Experience: no logo_url column")
        conn.rollback()
    
    # Update hobbies icon_url (if column exists)
    try:
        cursor.execute("SELECT id, name_en, icon_url FROM hobbies WHERE icon_url IS NOT NULL")
        hobbies = cursor.fetchall()
        
        for hobby in hobbies:
            hid, name, icon_url = hobby
            if icon_url and ('/Media/' in icon_url or 'localhost' in icon_url or '/uploads/' in icon_url):
                filename = icon_url.split('/')[-1]
                new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
                cursor.execute("UPDATE hobbies SET icon_url = %s WHERE id = %s", (new_url, hid))
                print(f"  ✓ Hobby '{name}': {filename}")
    except psycopg2.errors.UndefinedColumn:
        print("  ⊘ Hobbies: no icon_url column")
        conn.rollback()
    
    # Update testimonials avatar_url (if column exists)
    try:
        cursor.execute("SELECT id, name, avatar_url FROM testimonials WHERE avatar_url IS NOT NULL")
        testimonials = cursor.fetchall()
        
        for test in testimonials:
            tid, name, avatar_url = test
            if avatar_url and ('/Media/' in avatar_url or 'localhost' in avatar_url or '/uploads/' in avatar_url):
                filename = avatar_url.split('/')[-1]
                new_url = f"{SUPABASE_STORAGE_URL}/{filename}"
                cursor.execute("UPDATE testimonials SET avatar_url = %s WHERE id = %s", (new_url, tid))
                print(f"  ✓ Testimonial '{name}': {filename}")
    except psycopg2.errors.UndefinedColumn:
        print("  ⊘ Testimonials: no avatar_url column")
        conn.rollback()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("\n✅ All image URLs updated to Supabase Storage!")
    print(f"Images will now load from: {SUPABASE_STORAGE_URL}/[filename]")

if __name__ == "__main__":
    update_urls()
