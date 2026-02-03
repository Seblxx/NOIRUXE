"""
Script to create an initial admin user for the portfolio backend.
Run this script once after setting up the database.

Usage:
    python create_admin.py
"""

from app.database import SessionLocal
from app.models import Admin
from app.auth import get_password_hash
import sys

def create_initial_admin():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).first()
        if existing_admin:
            print("❌ An admin user already exists!")
            print(f"   Username: {existing_admin.username}")
            print(f"   Email: {existing_admin.email}")
            response = input("\nDo you want to create another admin? (yes/no): ")
            if response.lower() not in ['yes', 'y']:
                return
        
        print("\n🔐 Create Initial Admin User")
        print("=" * 50)
        
        username = input("Username: ").strip()
        email = input("Email: ").strip()
        full_name = input("Full Name: ").strip()
        password = input("Password: ").strip()
        confirm_password = input("Confirm Password: ").strip()
        
        if not all([username, email, password, full_name]):
            print("\n❌ All fields are required!")
            return
        
        if password != confirm_password:
            print("\n❌ Passwords do not match!")
            return
        
        if len(password) < 8:
            print("\n❌ Password must be at least 8 characters long!")
            return
        
        # Check if username or email already exists
        existing = db.query(Admin).filter(
            (Admin.username == username) | (Admin.email == email)
        ).first()
        
        if existing:
            print("\n❌ Username or email already exists!")
            return
        
        # Create admin user
        hashed_password = get_password_hash(password)
        admin = Admin(
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("\n✅ Admin user created successfully!")
        print(f"\n📋 Admin Details:")
        print(f"   ID: {admin.id}")
        print(f"   Username: {admin.username}")
        print(f"   Email: {admin.email}")
        print(f"   Full Name: {admin.full_name}")
        print(f"\n🔑 You can now login with these credentials at /api/auth/login")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error creating admin user: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    try:
        create_initial_admin()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user")
        sys.exit(0)
