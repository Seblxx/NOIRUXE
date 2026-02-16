import sqlite3
import psycopg2
from psycopg2.extras import execute_values
import sys

# Database URLs
SQLITE_PATH = 'portfolio-backend/portfolio.db'
NEON_URL = 'postgresql://neondb_owner:npg_GD7iB1EpFrPI@ep-fancy-king-ai9ek29a-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'

# Tables to migrate
TABLES = [
    'skills',
    'projects', 
    'work_experience',
    'education',
    'hobbies',
    'testimonials',
    'contact_messages',
    'resumes',
    'admins'
]

def migrate_table(sqlite_conn, pg_conn, table_name):
    """Migrate a single table from SQLite to PostgreSQL"""
    sqlite_cursor = sqlite_conn.cursor()
    pg_cursor = pg_conn.cursor()
    
    # Get PostgreSQL column types
    pg_cursor.execute(f"""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '{table_name}'
    """)
    pg_columns = {row[0]: row[1] for row in pg_cursor.fetchall()}
    
    # Get data from SQLite
    sqlite_cursor.execute(f"SELECT * FROM {table_name}")
    rows = sqlite_cursor.fetchall()
    
    if not rows:
        print(f"  ⊘ {table_name}: No data to migrate")
        return 0
    
    # Get column names
    column_names = [description[0] for description in sqlite_cursor.description]
    
    # Clear existing data in Neon (if any)
    pg_cursor.execute(f"DELETE FROM {table_name}")
    pg_conn.commit()
    
    # Insert data into PostgreSQL
    placeholders = ','.join(['%s'] * len(column_names))
    columns = ','.join(column_names)
    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
    
    success_count = 0
    for row in rows:
        try:
            # Convert values based on PostgreSQL column types
            converted_row = []
            for i, val in enumerate(row):
                col_name = column_names[i]
                pg_type = pg_columns.get(col_name, '')
                
                # Convert integers to booleans for boolean columns
                if pg_type == 'boolean' and isinstance(val, int):
                    converted_row.append(bool(val))
                else:
                    converted_row.append(val)
            
            pg_cursor.execute(query, tuple(converted_row))
            success_count += 1
        except Exception as e:
            print(f"    ⚠️  Error inserting row: {e}")
            pg_conn.rollback()
            continue
    
    pg_conn.commit()
    print(f"  ✓ {table_name}: Migrated {success_count}/{len(rows)} rows")
    return success_count

def main():
    print("🚀 Starting migration from SQLite to Neon PostgreSQL...\n")
    
    try:
        # Connect to SQLite
        print("📂 Connecting to SQLite...")
        sqlite_conn = sqlite3.connect(SQLITE_PATH)
        print("  ✓ Connected to SQLite\n")
        
        # Connect to Neon
        print("🐘 Connecting to Neon PostgreSQL...")
        pg_conn = psycopg2.connect(NEON_URL)
        print("  ✓ Connected to Neon\n")
        
        print("📊 Migrating tables:")
        total_rows = 0
        
        for table in TABLES:
            try:
                rows_migrated = migrate_table(sqlite_conn, pg_conn, table)
                total_rows += rows_migrated
            except Exception as e:
                print(f"  ❌ {table}: Error - {e}")
        
        print(f"\n✅ Migration complete! Total rows migrated: {total_rows}")
        
        # Close connections
        sqlite_conn.close()
        pg_conn.close()
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
