# Arthur AI - Complete Tools Reference

## All 22 Database Tools Available to Arthur

### 📋 Member Management (4 tools)

#### 1. `view_members`
View all organization members with their roles and payment classes.
- **Required**: organization_id
- **Returns**: List of members with names, emails, roles, payment classes

#### 2. `add_member`
Add a new member to the organization by email.
- **Required**: organization_id, user_email
- **Optional**: role (admin/member), payment_class
- **Note**: User must have an account first

#### 3. `update_member_role`
Change a member's role (admin or member).
- **Required**: organization_id, user_id, role

#### 4. `update_member_payment_class`
Change a member's payment class/tier.
- **Required**: organization_id, user_id, payment_class

---

### 💰 Payment Management (4 tools)

#### 5. `view_member_balance`
View a specific member's balance and transaction history.
- **Required**: organization_id, user_id
- **Returns**: Balance, last 10 transactions, user info

#### 6. `add_payment_transaction`
Add a payment transaction (charge, payment, or dues).
- **Required**: organization_id, user_id, amount, type, description
- **Types**: charge (adds to balance), payment (reduces balance), dues

#### 7. `view_payment_classes`
View all payment classes (membership tiers) in the organization.
- **Required**: organization_id
- **Returns**: All active payment classes with dues amounts

#### 8. `create_payment_class`
Create a new payment class (membership tier).
- **Required**: organization_id, class_name, display_name, dues_amount, billing_frequency
- **Optional**: description
- **Billing frequency**: semester, monthly, annual, one_time

---

### 📢 Announcements (2 tools)

#### 9. `view_announcements`
View recent announcements posted in the organization.
- **Required**: organization_id
- **Optional**: limit (default: 10)
- **Returns**: Announcements with titles, content, authors, dates

#### 10. `create_announcement`
Create a new announcement.
- **Required**: organization_id, title, content, user_id
- **Note**: user_id should be the current user creating it

---

### 📅 Events (2 tools)

#### 11. `view_events`
View upcoming or recent events in the organization.
- **Required**: organization_id
- **Optional**: limit (default: 10), upcoming_only (default: true)
- **Returns**: Events with title, date/time, location, description

#### 12. `create_event`
Create a new event in the organization calendar.
- **Required**: organization_id, title, start_time, end_time, user_id
- **Optional**: description, location
- **Date format**: ISO 8601 (e.g., "2024-02-15T18:00:00Z")

---

### 🚨 Incident Reports (3 tools)

#### 13. `view_incident_reports`
View incident reports in the organization.
- **Required**: organization_id
- **Optional**: status (pending/reviewing/resolved/dismissed), limit (default: 20)
- **Returns**: Reports with title, description, severity, status, reporter

#### 14. `create_incident_report`
Create a new incident report.
- **Required**: organization_id, reporter_id, title, description, incident_date, severity
- **Optional**: location
- **Severity levels**: low, medium, high, critical

#### 15. `update_incident_status`
Update the status of an incident report.
- **Required**: incident_id, status
- **Status options**: pending, reviewing, resolved, dismissed

---

### 🚗 Chariot Rides (5 tools)

#### 16. `view_rides`
View ride requests in the Chariot system.
- **Required**: organization_id
- **Optional**: status, limit (default: 20)
- **Status options**: pending, claimed, in_progress, completed, cancelled
- **Returns**: Rides with pickup/dropoff, times, user, driver info

#### 17. `create_ride`
Create a new ride request.
- **Required**: organization_id, user_id, pickup_location, dropoff_location
- **Optional**: pickup_time, notes

#### 18. `update_ride_status`
Update a ride's status or claim it as a driver.
- **Required**: ride_id, status
- **Optional**: driver_id (required when claiming)
- **Status options**: pending, claimed, in_progress, completed, cancelled

#### 19. `view_chariot_drivers`
View all approved Chariot drivers.
- **Required**: organization_id
- **Returns**: List of approved drivers with names

#### 20. `add_chariot_driver`
Add a member as an approved Chariot driver.
- **Required**: organization_id, user_id
- **Note**: User must already be a member

---

## Usage Patterns

### Read Operations (View)
- `view_members` - See all members
- `view_member_balance` - Check one member's balance
- `view_payment_classes` - See membership tiers
- `view_announcements` - See recent posts
- `view_events` - See calendar events
- `view_incident_reports` - See safety reports
- `view_rides` - See ride requests
- `view_chariot_drivers` - See approved drivers

### Write Operations (Create)
- `create_announcement` - Post an announcement
- `create_event` - Schedule an event
- `create_incident_report` - File a safety report
- `create_ride` - Request a ride
- `create_payment_class` - Add membership tier
- `add_payment_transaction` - Record payment/charge
- `add_member` - Add person to org
- `add_chariot_driver` - Approve a driver

### Update Operations
- `update_member_role` - Promote/demote member
- `update_member_payment_class` - Change membership tier
- `update_incident_status` - Mark incident resolved
- `update_ride_status` - Update ride progress

---

## Data Flow Examples

### Example 1: Onboarding New Member
```
1. add_member (email, role, payment_class)
2. add_payment_transaction (initial dues charge)
3. create_announcement (welcome message)
```

### Example 2: Event Planning
```
1. create_event (title, date, location)
2. create_announcement (event announcement)
3. view_members (get attendee list)
```

### Example 3: Monthly Billing
```
1. view_members (get all members)
2. For each member:
   - view_member_balance (check current balance)
   - add_payment_transaction (add monthly dues)
```

### Example 4: Ride Management
```
1. create_ride (pickup, dropoff)
2. view_chariot_drivers (see available drivers)
3. update_ride_status (driver claims ride)
4. update_ride_status (mark completed)
```

### Example 5: Incident Handling
```
1. create_incident_report (details, severity)
2. update_incident_status (set to "reviewing")
3. create_announcement (notify members if needed)
4. update_incident_status (set to "resolved")
```

---

## Tool Selection Logic

Arthur automatically chooses the right tool(s) based on your request:

| Request | Tool(s) Used |
|---------|--------------|
| "Show me all members" | `view_members` |
| "What's John's balance?" | `view_member_balance` (may ask for user_id first) |
| "Add a new member" | `add_member` (will ask for email) |
| "Create an event" | `create_event` (will ask for details) |
| "Show pending rides" | `view_rides` with status="pending" |
| "Make user X an admin" | `update_member_role` |
| "Who owes money?" | `view_members` + multiple `view_member_balance` calls |
| "Create announcement about meeting" | `create_announcement` |

---

## Error Handling

Arthur will return user-friendly errors for:
- Missing required fields → "I need more information..."
- User not found → "I couldn't find that user..."
- Permission denied → "You don't have permission..."
- Invalid data → "That value isn't valid..."
- Already exists → "That already exists..."

All database operations are protected by Supabase Row Level Security (RLS).

---

## Performance Notes

- **Fast queries**: view_members, view_payment_classes, view_chariot_drivers
- **Medium queries**: view_announcements, view_events (with JOINs for author names)
- **Slower queries**: Multiple view_member_balance calls (one per member)

For bulk operations, Arthur may make multiple tool calls in sequence.

---

## Security & Permissions

✅ **Enforced by Database RLS:**
- Users can only access their organization's data
- Some operations require admin role
- Users can't modify data they don't own

✅ **Enforced by Arthur:**
- Current user ID and organization ID are always passed
- Authentication checked before any database operation
- User context maintained throughout conversation

❌ **Not Enforced:**
- Rate limiting (consider adding if needed)
- Quota limits on AI API usage
- Audit logging (consider adding)

---

## Extending Arthur

To add new capabilities:

1. **Add tool definition** in `database-tools.ts` → `databaseTools` array
2. **Add case** in `executeToolCall()` switch statement
3. **Implement function** at bottom of file
4. **Test** with Arthur in chat interface

Arthur will automatically learn about new tools and use them appropriately!
