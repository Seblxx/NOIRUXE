import sqlite3
import os
import sys

# Check SQLite database
sqlite_path = 'portfolio-backend/portfolio.db'
if not os.path.exists(sqlite_path):
    print(f"❌ SQLite database not found at {sqlite_path}")
    sys.exit(1)

conn = sqlite3.connect(sqlite_path)
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("\n📊 Tables in SQLite database:")
for table in tables:
    table_name = table[0]
    cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"  ✓ {table_name}: {count} rows")

conn.close()

print("\n✅ Ready to migrate to Neon!")
print("\nTo proceed with migration, you'll need your Neon DATABASE_URL from Vercel.")
