# Arthur AI - Agentic Database Assistant

Arthur is an intelligent AI chatbot that can interact with your organization's database through natural language. It uses Anthropic's Claude AI with function calling to understand your requests and perform database operations.

## Features

Arthur can help you with:

- **View Members**: See all members in your organization with their roles and payment classes
- **Check Balances**: View member balances and transaction history
- **Manage Announcements**: View and create organization announcements
- **Payment Transactions**: Add charges, payments, or dues for members
- **View Payment Classes**: See all membership tiers and their dues amounts

## Setup

### 1. Install Dependencies

The required dependencies are already installed:
```bash
npm install @anthropic-ai/sdk
```

### 2. Get Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

### 3. Add Environment Variable

Add your Anthropic API key to `.env.local`:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### 4. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

### Architecture

1. **Frontend** (`app/organizations/[id]/arthur/page.tsx`):
   - Chat interface where users interact with Arthur
   - Sends messages to the API route
   - Displays AI responses

2. **API Route** (`app/api/arthur/chat/route.ts`):
   - Receives chat messages
   - Calls Anthropic's Claude API with function calling
   - Executes database operations based on AI's tool calls
   - Returns formatted responses

3. **Database Tools** (`lib/arthur/database-tools.ts`):
   - Defines available database operations
   - Implements each tool (view, create, update, delete)
   - Interacts with Supabase

### Function Calling Flow

```
User: "Show me all members"
  ↓
Arthur API receives request
  ↓
Claude AI decides to use "view_members" tool
  ↓
Tool executes database query
  ↓
Results returned to Claude
  ↓
Claude formats response in natural language
  ↓
User sees: "Here are your organization's 25 members..."
```

## Example Conversations

### Viewing Data
```
User: "Who are the members in my organization?"
Arthur: "Here are your organization's members: [lists members with names and roles]"

User: "What's John's balance?"
Arthur: "I'll need to look up John. Can you provide their user ID or email?"
```

### Creating Data
```
User: "Create an announcement about the meeting tomorrow"
Arthur: "I can create that announcement. What should the title be?"
User: "Team Meeting - Tomorrow at 3pm"
Arthur: "And what should the content say?"
User: "All members are required to attend the monthly team meeting..."
Arthur: "✓ Announcement created successfully!"
```

### Managing Transactions
```
User: "Add a $50 charge to user abc123 for equipment"
Arthur: "✓ Added $50 charge for equipment to the member's account"
```

## Available Database Tools

| Tool Name | Description | Parameters |
|-----------|-------------|------------|
| `view_members` | List all organization members | organization_id |
| `view_member_balance` | Check a member's balance | organization_id, user_id |
| `view_announcements` | View recent announcements | organization_id, limit |
| `create_announcement` | Create new announcement | organization_id, title, content, user_id |
| `add_payment_transaction` | Add charge/payment/dues | organization_id, user_id, amount, type, description |
| `view_payment_classes` | View membership tiers | organization_id |

## Extending Arthur

### Adding New Database Operations

1. **Define the tool** in `lib/arthur/database-tools.ts`:

```typescript
{
  name: "your_new_tool",
  description: "What this tool does",
  input_schema: {
    type: "object",
    properties: {
      // Define parameters
    },
    required: ["required_params"]
  }
}
```

2. **Implement the function**:

```typescript
async function yourNewTool(supabase: any, params: any) {
  // Your implementation
}
```

3. **Add to executeToolCall** switch statement:

```typescript
case "your_new_tool":
  return await yourNewTool(supabase, toolInput);
```

## Security Considerations

- ✅ User authentication is required to access Arthur
- ✅ Organization ID is validated on each request
- ✅ All database operations go through Supabase RLS (Row Level Security)
- ⚠️ Always test new tools thoroughly before deploying
- ⚠️ Consider adding admin-only restrictions for sensitive operations

## Troubleshooting

### "Error: Missing ANTHROPIC_API_KEY"
- Make sure you added `ANTHROPIC_API_KEY` to `.env.local`
- Restart your development server after adding the key

### "Failed to fetch" or network errors
- Check that your API route is accessible at `/api/arthur/chat`
- Verify Supabase connection is working
- Check browser console for detailed error messages

### AI not using tools correctly
- Review tool descriptions in `database-tools.ts`
- Make sure parameter schemas are correct
- Check API logs for tool execution errors

## Cost Considerations

- Claude API pricing: ~$3 per million input tokens, ~$15 per million output tokens
- Typical conversation: 500-2000 tokens
- Estimated cost per conversation: $0.01-0.05
- Monitor usage at [https://console.anthropic.com/](https://console.anthropic.com/)

## Future Enhancements

Ideas for extending Arthur:

- [ ] Add file upload capabilities
- [ ] Export data to CSV/PDF
- [ ] Advanced analytics and reporting
- [ ] Multi-organization management
- [ ] Scheduled tasks and reminders
- [ ] Integration with external services (Stripe, email, etc.)
- [ ] Conversation history persistence
- [ ] Voice input/output

## Support

For issues or questions about Arthur AI, please check:
- Anthropic documentation: [https://docs.anthropic.com/](https://docs.anthropic.com/)
- Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
