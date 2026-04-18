## Name: Faculty_Wise Firebase Implementation

## Objective
Design and implement the Firebase backend for Faculty_Wise to support real-time scheduling workflows, secure role-based access, analytics-ready data, and reliable operations.

## Firebase Stack
1. Authentication
- Firebase Authentication (email/password initially, optional Google SSO).
- Custom claims for role-based access (`admin`, `faculty`, `student`).

2. Database
- Cloud Firestore as the primary operational database.
- Optional Realtime Database only if live collaborative editing requires ultra-low-latency cursors/state.

3. Backend Logic
- Cloud Functions (2nd gen) for scheduling runs, validations, conflict detection, and notifications.

4. File Storage
- Cloud Storage for CSV imports, schedule exports, and archived artifacts.

5. Monitoring and Ops
- Firebase Logging + Error Reporting + Performance Monitoring.

## Firestore Data Model
Recommended top-level collections:
- `users`
- `faculty`
- `courses`
- `sections`
- `rooms`
- `labs`
- `terms`
- `availabilityProfiles`
- `historicalAssignments`
- `optimizationRuns`
- `scheduleVersions`
- `publishedSchedules`
- `auditLogs`

Example document structure:
1. `users/{uid}`
- `displayName`, `email`, `role`, `departmentId`, `active`

2. `faculty/{facultyId}`
- `userId`, `specializations[]`, `certifications[]`, `minLoad`, `maxLoad`, `preferredSlots[]`

3. `optimizationRuns/{runId}`
- `termId`, `status`, `weights`, `startedBy`, `startedAt`, `completedAt`, `topVersionIds[]`, `metrics`

4. `scheduleVersions/{versionId}`
- `runId`, `score`, `hardViolations`, `softPenalty`, `entries[]`, `createdAt`

5. `publishedSchedules/{termId}`
- `versionId`, `publishedBy`, `publishedAt`, `entries[]`

## Indexing Strategy
Create composite indexes for common query paths:
- `faculty` by `departmentId + active`
- `scheduleVersions` by `runId + score(desc)`
- `optimizationRuns` by `termId + status + startedAt(desc)`
- `publishedSchedules` by `termId`

## Security Rules Strategy
Principles:
- Deny-by-default.
- Role and ownership checks for every collection.
- Separate read access for published data vs draft optimization data.

Rule intent:
1. Admin
- Full read/write for operational collections.

2. Faculty
- Read own profile and own schedule assignments.
- Submit/update own availability.
- Read published schedule for their department.

3. Student
- Read published schedule only.
- No write access in MVP.

## Cloud Functions Design
Core callable/trigger functions:
1. `setUserRole` (admin only)
- Assign or update custom claims.

2. `importMasterData`
- Parse uploaded CSV/JSON and upsert faculty/courses/rooms/labs.

3. `startOptimizationRun`
- Validate term readiness and enqueue optimization process.

4. `processOptimizationRun`
- Perform candidate generation/evaluation; write ranked `scheduleVersions`.

5. `repairScheduleConflicts`
- Resolve or annotate hard/soft conflicts in selected version.

6. `publishScheduleVersion`
- Copy approved version into `publishedSchedules/{termId}` atomically.

7. `logAuditEvent`
- Record high-impact actions (publish, role change, import).

## Real-Time UX Data Flow
1. Admin starts run
- Create `optimizationRuns/{runId}` with `status=queued`.

2. Function updates run
- `queued -> running -> repairing -> completed/failed`.

3. Dashboard listeners
- Subscribe to run doc and top schedule versions.
- Render live metrics: conflict count, score trend, processing time.

## Transactions and Consistency
Use Firestore transactions/batches for:
- Publishing selected schedule version.
- Writing related run status + metrics + output references.
- Preventing concurrent publish for same term.

## Backup and Retention
1. Daily exports
- Export critical collections (`publishedSchedules`, `optimizationRuns`, `auditLogs`) to Cloud Storage.

2. Retention policy
- Keep run artifacts for at least 2 academic years.
- Keep published schedules and audit logs per institutional policy.

## Environment and Config
Use `.env` + Firebase config separation:
- `dev`, `staging`, `prod` projects.
- Store algorithm weights and toggles in Remote Config or Firestore `systemConfig`.

## MVP Delivery Plan
1. Set up Firebase project, Auth, and Firestore schema.
2. Implement security rules and role claim setup flow.
3. Build data import function and admin import UI hooks.
4. Implement optimization run lifecycle functions.
5. Add publish workflow with audit logging.
6. Add monitoring dashboards and alerts.

## Acceptance Criteria
- Role-based access is enforced by rules.
- Admin can run optimization and publish a schedule.
- Faculty can view assignments and update availability.
- Published schedules are readable by intended users.
- All publish and role-change actions are audit-logged.
