import psycopg2

NEON_URL = 'postgresql://neondb_owner:npg_GD7iB1EpFrPI@ep-fancy-king-ai9ek29a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'

conn = psycopg2.connect(NEON_URL)
cursor = conn.cursor()

cursor.execute('SELECT title_en, image_url, video_url FROM projects')
projects = cursor.fetchall()

print("Current URLs in database:")
for title, img, vid in projects:
    print(f"\n{title}:")
    print(f"  Image: {img}")
    print(f"  Video: {vid}")

conn.close()
