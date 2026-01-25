# Arthur AI - Quick Start Guide

## ✅ Setup Complete!

Your Arthur AI chatbot is ready to use with Anthropic Claude!

## 🚀 How to Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Arthur:**
   - Go to your organization page
   - Click "Arthur" in the sidebar
   - Start chatting!

## 💡 What Arthur Can Do

### 📊 View Data
- **Members**: "Show me all members" or "List members in the organization"
- **Balances**: "What's [user]'s balance?" or "Show balance for user [id]"
- **Events**: "What events are coming up?" or "Show me all events"
- **Announcements**: "Show recent announcements"
- **Incidents**: "View pending incident reports"
- **Rides**: "Show pending Chariot rides"
- **Payment Classes**: "What are the membership tiers?"
- **Drivers**: "Who are the approved Chariot drivers?"

### ✏️ Create Data
- **Announcements**: "Create an announcement titled 'Meeting' with content 'Team meeting tomorrow at 3pm'"
- **Events**: "Create an event titled 'Fundraiser' on 2024-02-15 at 6pm"
- **Payments**: "Add a $50 charge to user [id] for equipment fee"
- **Incidents**: "Create an incident report for [description]"
- **Rides**: "Create a ride from [location] to [location]"
- **Payment Classes**: "Create a new payment class called 'Associate' with $100 semester dues"
- **Members**: "Add member with email [email]"

### 🔄 Update Data
- **Member Role**: "Make user [id] an admin"
- **Payment Class**: "Change user [id] to senior payment class"
- **Incident Status**: "Mark incident [id] as resolved"
- **Ride Status**: "Mark ride [id] as completed"

### ➕ Manage Access
- **Add Driver**: "Make user [id] a Chariot driver"

## 🎯 Example Conversations

### Example 1: View Members
```
You: "Show me all members in the organization"

Arthur: "Here are your organization's members:

1. John Doe (john@example.com)
   - Role: admin
   - Payment Class: general_member

2. Jane Smith (jane@example.com)
   - Role: member
   - Payment Class: new_member

...

Total: 25 members"
```

### Example 2: Check Balance
```
You: "What's the balance for user abc-123-def?"

Arthur: "User John Doe has a current balance of $150.00

Recent transactions:
1. $50.00 charge - Monthly dues (2024-01-15)
2. $100.00 charge - Equipment fee (2024-01-10)
3. -$0.00 payment - Initial payment (2024-01-01)

Total balance: $150.00"
```

### Example 3: Create Announcement
```
You: "Create an announcement"

Arthur: "I can help you create an announcement. What should the title be?"

You: "Team Meeting Tomorrow"

Arthur: "Great! And what should the content say?"

You: "All members are required to attend the monthly team meeting tomorrow at 3pm in the main hall."

Arthur: "✓ Announcement created successfully!

Title: Team Meeting Tomorrow
Content: All members are required to attend the monthly team meeting tomorrow at 3pm in the main hall.

The announcement has been posted to your organization."
```

### Example 4: Create Event
```
You: "Create an event for our fundraiser on February 15th at 6pm"

Arthur: "I can create that event. Could you provide:
1. Event title
2. End time
3. Location (optional)
4. Description (optional)"

You: "Title: Spring Fundraiser, ends at 10pm, at Community Center, our annual fundraising event"

Arthur: "✓ Event created successfully!

Title: Spring Fundraiser
Date: February 15, 2024
Time: 6:00 PM - 10:00 PM
Location: Community Center
Description: Our annual fundraising event"
```

### Example 5: Add Payment Transaction
```
You: "Add a $25 payment from user abc-123 for monthly dues"

Arthur: "✓ Payment transaction added successfully!

Amount: $25.00
Type: Payment (reduces balance)
Description: Monthly dues
User: John Doe

The member's balance has been updated."
```

## 🔑 Getting User IDs

Arthur works best with user IDs. To get them:

1. Ask Arthur: "Show me all members"
2. Arthur will display names, emails, and IDs
3. Copy the ID for use in other commands

Or use email addresses where supported:
- "Add member with email john@example.com"

## ⚠️ Important Notes

### Permissions
- Arthur uses YOUR permissions
- If you're not an admin, you may not be able to perform certain actions
- Database Row Level Security (RLS) is enforced

### Data Format
- **Dates**: Use ISO 8601 format (e.g., "2024-02-15T18:00:00Z") or natural language
- **Amounts**: Use numbers (e.g., 50 for $50.00)
- **IDs**: Use the full UUID when possible

### Arthur's Intelligence
- Arthur can infer context from conversation
- Arthur will ask for missing information
- Arthur can handle natural language queries
- Arthur remembers the conversation context

## 🐛 Troubleshooting

### "I apologize, but I encountered an error"
- Check that your Anthropic API key is valid
- Verify you're connected to the internet
- Check browser console for details

### "User not found" or "Organization not found"
- Make sure you're using the correct IDs
- Ask Arthur to "show me all members" to get valid IDs

### Database errors
- Check that you have permission to perform the action
- Verify required fields are provided
- Check that relationships exist (e.g., user exists before adding to org)

### Arthur isn't understanding
- Be more specific with your request
- Break complex requests into smaller steps
- Use exact field names when needed

## 💰 API Costs

Anthropic Claude pricing (as of 2024):
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens
- Average chat: 1000-3000 tokens
- Estimated cost per conversation: $0.02-$0.10

Monitor your usage at: https://console.anthropic.com/

## 📈 Advanced Usage

### Bulk Operations
```
You: "Show me all members with a balance over $100"

Arthur: [Calls view_members, then filters and displays results]
```

### Multi-step Tasks
```
You: "I need to add a new member, assign them to the senior payment class, and add their first dues charge"

Arthur: "I can help with that. Let me break this down:
1. First, what's the new member's email?
2. What should their initial dues charge be?

[Proceeds step by step]"
```

### Complex Queries
Arthur can combine data from multiple sources:
```
You: "Show me all pending incident reports and who reported them"

Arthur: [Fetches incidents, cross-references with user profiles, displays combined data]
```

## 🎉 You're Ready!

Start chatting with Arthur and let AI manage your organization data naturally!

Need help? Arthur will guide you through any task you're trying to accomplish.
