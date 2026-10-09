# ApplyFlow REST API Documentation

Base URL: `http://localhost:5000/api`

## Health Check

### `GET /api/health`
Checks API server and database connection status.

**Response `200 OK`**:
```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-10-09T21:49:59.089Z",
  "uptime": "16s",
  "database": {
    "status": "connected",
    "isConnected": true
  }
}
```

---

## Applications Endpoints

### `GET /api/applications`
Retrieves a paginated, searchable, and filtered list of job applications.

**Query Parameters**:
- `q` (string): Search text matching company, jobTitle, location, or notes.
- `status` (string): `All` | `Applied` | `Interview` | `Offer` | `Rejected` (default: `All`)
- `workMode` (string): `All` | `Remote` | `Hybrid` | `In-office` (default: `All`)
- `employmentType` (string): `All` | `Full-time` | `Part-time` | `Contract` | `Internship` (default: `All`)
- `sortBy` (string): `applicationDate` | `followUpDate` | `company` | `status` | `createdAt` (default: `applicationDate`)
- `sortOrder` (string): `asc` | `desc` (default: `desc`)
- `page` (number): Page number (default: `1`)
- `limit` (number): Items per page, 1-100 (default: `10`)

**Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "66f38b2a1a2b3c4d5e6f7a8b",
      "company": "Stripe",
      "jobTitle": "Senior Backend Engineer",
      "jobUrl": "https://stripe.com/jobs/123",
      "location": "Remote",
      "workMode": "Remote",
      "employmentType": "Full-time",
      "status": "Interview",
      "applicationDate": "2026-10-01T00:00:00.000Z",
      "interviewDate": "2026-10-15T00:00:00.000Z",
      "followUpDate": "2026-10-10T00:00:00.000Z",
      "recruiterName": "Jane Doe",
      "recruiterEmail": "jane@stripe.com",
      "notes": "System design round scheduled.",
      "createdAt": "2026-10-01T10:00:00.000Z",
      "updatedAt": "2026-10-05T12:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### `GET /api/applications/:id`
Get a single job application by MongoDB ObjectId.

---

### `POST /api/applications`
Create a new job application.

**Request Body**:
```json
{
  "company": "Acme Corp",
  "jobTitle": "Frontend Developer",
  "workMode": "Hybrid",
  "status": "Applied",
  "jobUrl": "https://example.com/jobs/fe"
}
```

---

### `PUT /api/applications/:id`
Update an existing job application.

---

### `DELETE /api/applications/:id`
Delete a job application record.

---

## Dashboard Statistics

### `GET /api/stats`
Returns aggregated count metrics.

**Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "total": 12,
    "byStatus": {
      "Applied": 5,
      "Interview": 3,
      "Offer": 2,
      "Rejected": 2
    },
    "upcomingInterviews": 2,
    "offers": 2,
    "overdueFollowUps": 1
  }
}
```
