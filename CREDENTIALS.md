# Login Credentials

## Admin Account

**Email:** `admin@example.com`  
**Password:** `Admin123!SecurePassword`  
**Role:** `admin`

**Capabilities:**
- Full access to all features
- Can moderate/delete any requirement
- Can manage all users
- Can post requirements

---

## Test User Accounts

You can create additional test accounts by registering through the frontend at `/register`.

**Available Roles:**
- **Client** - Can post requirements
- **Planner** - Can browse and respond to planner requirements
- **Performer** - Can browse and respond to performer requirements
- **Crew** - Can browse and respond to crew requirements

---

## Environment Variables Required

### Backend (Vercel)
```
JWT_SECRET=wLgUeDAc2HGF4rR1QolZ8v6TOkKyPuMfX9aI3pCVjWbzYtEsnJ0B7NmxSiqhd5
MONGODB_URI=<your-production-mongodb-uri>
CORS_ORIGIN=<your-frontend-vercel-url>
CLIENT_URL=<your-frontend-vercel-url>
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=/api
```

---

## Seeding Admin on Production

If the admin user doesn't exist in production MongoDB:

1. Update `backend/.env` with production `MONGODB_URI`
2. Run: `node backend/scripts/seed-admin.js`
3. Admin will be created with credentials above

---

## Security Notes

⚠️ **IMPORTANT:** Change the admin password in production!

1. Login as admin
2. Navigate to profile/settings
3. Change password using the change password feature
4. Update this file with new credentials (or delete this file for security)

---

**Last Updated:** January 2025
