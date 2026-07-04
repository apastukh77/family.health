# Test Credentials

## Admin Account (JWT login/password)
- URL: /admin
- Email: admin@familyhealth.com
- Password: FamilyHealth2026
- Role: admin

## Auth Endpoints
- POST /api/auth/login  (body: {email, password} -> returns {token, user})
- GET  /api/auth/me     (Authorization: Bearer <token>)

## Notes
- Auth uses Bearer token stored in localStorage on the frontend.
- Public endpoints: GET /api/services, POST /api/bookings
- Admin endpoints (Bearer required): POST/PUT/DELETE /api/services, GET/PATCH/DELETE /api/bookings, GET /api/stats
