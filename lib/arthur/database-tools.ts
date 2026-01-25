// Database tools for Arthur AI Agent
import { createClient } from "@/lib/supabase/server";

export type DatabaseTool = {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, any>;
    required: string[];
  };
};

// Define all available database tools
export const databaseTools: DatabaseTool[] = [
  {
    name: "view_members",
    description: "View all members in the organization with their roles and payment classes. Use this to see who is in the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "view_member_balance",
    description: "View a specific member's balance and transaction history. Use this to check how much a member owes or has paid.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_id: {
          type: "string",
          description: "The user ID of the member"
        }
      },
      required: ["organization_id", "user_id"]
    }
  },
  {
    name: "view_announcements",
    description: "View recent announcements posted in the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        limit: {
          type: "number",
          description: "Number of announcements to retrieve (default: 10)"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "create_announcement",
    description: "Create a new announcement in the organization. Only use this when explicitly asked to create an announcement.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        title: {
          type: "string",
          description: "The announcement title"
        },
        content: {
          type: "string",
          description: "The announcement content/message"
        },
        user_id: {
          type: "string",
          description: "The ID of the user creating the announcement"
        }
      },
      required: ["organization_id", "title", "content", "user_id"]
    }
  },
  {
    name: "add_payment_transaction",
    description: "Add a payment transaction (charge, payment, or dues) for a member. Use this to record payments or charges.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_id: {
          type: "string",
          description: "The user ID of the member"
        },
        amount: {
          type: "number",
          description: "The transaction amount in dollars"
        },
        type: {
          type: "string",
          enum: ["charge", "payment", "dues"],
          description: "Type of transaction: 'charge' (adds to balance), 'payment' (reduces balance), or 'dues'"
        },
        description: {
          type: "string",
          description: "Description of the transaction"
        }
      },
      required: ["organization_id", "user_id", "amount", "type", "description"]
    }
  },
  {
    name: "view_payment_classes",
    description: "View all payment classes (membership tiers) in the organization with their dues amounts.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "create_payment_class",
    description: "Create a new payment class (membership tier) for the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        class_name: {
          type: "string",
          description: "Internal name for the class (e.g., 'senior', 'new_member')"
        },
        display_name: {
          type: "string",
          description: "Display name shown to users"
        },
        dues_amount: {
          type: "number",
          description: "Dues amount in dollars"
        },
        billing_frequency: {
          type: "string",
          enum: ["semester", "monthly", "annual", "one_time"],
          description: "How often dues are charged"
        },
        description: {
          type: "string",
          description: "Optional description of this payment class"
        }
      },
      required: ["organization_id", "class_name", "display_name", "dues_amount", "billing_frequency"]
    }
  },
  {
    name: "view_events",
    description: "View upcoming or recent events in the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        limit: {
          type: "number",
          description: "Number of events to retrieve (default: 10)"
        },
        upcoming_only: {
          type: "boolean",
          description: "Only show future events (default: true)"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "create_event",
    description: "Create a new event in the organization calendar.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        title: {
          type: "string",
          description: "Event title"
        },
        description: {
          type: "string",
          description: "Event description"
        },
        location: {
          type: "string",
          description: "Event location"
        },
        start_time: {
          type: "string",
          description: "Start time (ISO 8601 format)"
        },
        end_time: {
          type: "string",
          description: "End time (ISO 8601 format)"
        },
        user_id: {
          type: "string",
          description: "ID of user creating the event"
        }
      },
      required: ["organization_id", "title", "start_time", "end_time", "user_id"]
    }
  },
  {
    name: "view_incident_reports",
    description: "View incident reports in the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        status: {
          type: "string",
          enum: ["pending", "reviewing", "resolved", "dismissed"],
          description: "Filter by status (optional)"
        },
        limit: {
          type: "number",
          description: "Number of reports to retrieve (default: 20)"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "create_incident_report",
    description: "Create a new incident report.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        reporter_id: {
          type: "string",
          description: "ID of user reporting the incident"
        },
        title: {
          type: "string",
          description: "Incident title"
        },
        description: {
          type: "string",
          description: "Detailed description of the incident"
        },
        incident_date: {
          type: "string",
          description: "When the incident occurred (ISO 8601 format)"
        },
        location: {
          type: "string",
          description: "Where the incident occurred"
        },
        severity: {
          type: "string",
          enum: ["low", "medium", "high", "critical"],
          description: "Severity level"
        }
      },
      required: ["organization_id", "reporter_id", "title", "description", "incident_date", "severity"]
    }
  },
  {
    name: "update_incident_status",
    description: "Update the status of an incident report.",
    input_schema: {
      type: "object",
      properties: {
        incident_id: {
          type: "string",
          description: "The incident report ID"
        },
        status: {
          type: "string",
          enum: ["pending", "reviewing", "resolved", "dismissed"],
          description: "New status"
        }
      },
      required: ["incident_id", "status"]
    }
  },
  {
    name: "view_rides",
    description: "View ride requests in the Chariot system.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        status: {
          type: "string",
          enum: ["pending", "claimed", "in_progress", "completed", "cancelled"],
          description: "Filter by status (optional)"
        },
        limit: {
          type: "number",
          description: "Number of rides to retrieve (default: 20)"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "create_ride",
    description: "Create a new ride request in the Chariot system.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_id: {
          type: "string",
          description: "ID of user requesting the ride"
        },
        pickup_location: {
          type: "string",
          description: "Pickup location"
        },
        dropoff_location: {
          type: "string",
          description: "Dropoff location"
        },
        pickup_time: {
          type: "string",
          description: "Requested pickup time"
        },
        notes: {
          type: "string",
          description: "Additional notes for the driver"
        }
      },
      required: ["organization_id", "user_id", "pickup_location", "dropoff_location"]
    }
  },
  {
    name: "update_ride_status",
    description: "Update a ride's status or claim it as a driver.",
    input_schema: {
      type: "object",
      properties: {
        ride_id: {
          type: "string",
          description: "The ride ID"
        },
        status: {
          type: "string",
          enum: ["pending", "claimed", "in_progress", "completed", "cancelled"],
          description: "New status"
        },
        driver_id: {
          type: "string",
          description: "Driver ID (when claiming a ride)"
        }
      },
      required: ["ride_id", "status"]
    }
  },
  {
    name: "add_member",
    description: "Add a new member to the organization by email. The user must already have an account.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_email: {
          type: "string",
          description: "Email of the user to add"
        },
        role: {
          type: "string",
          enum: ["admin", "member"],
          description: "Member role (default: member)"
        },
        payment_class: {
          type: "string",
          description: "Payment class (e.g., 'general_member', 'new_member', 'senior')"
        }
      },
      required: ["organization_id", "user_email"]
    }
  },
  {
    name: "update_member_role",
    description: "Update a member's role in the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_id: {
          type: "string",
          description: "User ID of the member"
        },
        role: {
          type: "string",
          enum: ["admin", "member"],
          description: "New role"
        }
      },
      required: ["organization_id", "user_id", "role"]
    }
  },
  {
    name: "update_member_payment_class",
    description: "Update a member's payment class.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_id: {
          type: "string",
          description: "User ID of the member"
        },
        payment_class: {
          type: "string",
          description: "New payment class"
        }
      },
      required: ["organization_id", "user_id", "payment_class"]
    }
  },
  {
    name: "view_chariot_drivers",
    description: "View all approved Chariot drivers in the organization.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        }
      },
      required: ["organization_id"]
    }
  },
  {
    name: "add_chariot_driver",
    description: "Add a member as an approved Chariot driver.",
    input_schema: {
      type: "object",
      properties: {
        organization_id: {
          type: "string",
          description: "The organization ID"
        },
        user_id: {
          type: "string",
          description: "User ID to make a driver"
        }
      },
      required: ["organization_id", "user_id"]
    }
  }
];

// Tool execution functions
export async function executeToolCall(toolName: string, toolInput: any) {
  const supabase = await createClient();

  switch (toolName) {
    case "view_members":
      return await viewMembers(supabase, toolInput.organization_id);

    case "view_member_balance":
      return await viewMemberBalance(supabase, toolInput.organization_id, toolInput.user_id);

    case "view_announcements":
      return await viewAnnouncements(supabase, toolInput.organization_id, toolInput.limit || 10);

    case "create_announcement":
      return await createAnnouncement(
        supabase,
        toolInput.organization_id,
        toolInput.title,
        toolInput.content,
        toolInput.user_id
      );

    case "add_payment_transaction":
      return await addPaymentTransaction(
        supabase,
        toolInput.organization_id,
        toolInput.user_id,
        toolInput.amount,
        toolInput.type,
        toolInput.description
      );

    case "view_payment_classes":
      return await viewPaymentClasses(supabase, toolInput.organization_id);

    case "create_payment_class":
      return await createPaymentClass(supabase, toolInput);

    case "view_events":
      return await viewEvents(supabase, toolInput.organization_id, toolInput.limit, toolInput.upcoming_only);

    case "create_event":
      return await createEvent(supabase, toolInput);

    case "view_incident_reports":
      return await viewIncidentReports(supabase, toolInput.organization_id, toolInput.status, toolInput.limit);

    case "create_incident_report":
      return await createIncidentReport(supabase, toolInput);

    case "update_incident_status":
      return await updateIncidentStatus(supabase, toolInput.incident_id, toolInput.status);

    case "view_rides":
      return await viewRides(supabase, toolInput.organization_id, toolInput.status, toolInput.limit);

    case "create_ride":
      return await createRide(supabase, toolInput);

    case "update_ride_status":
      return await updateRideStatus(supabase, toolInput.ride_id, toolInput.status, toolInput.driver_id);

    case "add_member":
      return await addMember(supabase, toolInput);

    case "update_member_role":
      return await updateMemberRole(supabase, toolInput.organization_id, toolInput.user_id, toolInput.role);

    case "update_member_payment_class":
      return await updateMemberPaymentClass(supabase, toolInput.organization_id, toolInput.user_id, toolInput.payment_class);

    case "view_chariot_drivers":
      return await viewChariotDrivers(supabase, toolInput.organization_id);

    case "add_chariot_driver":
      return await addChariotDriver(supabase, toolInput.organization_id, toolInput.user_id);

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// Implementation of each tool
async function viewMembers(supabase: any, organizationId: string) {
  const { data: memberships, error: membershipsError } = await supabase
    .from("organization_memberships")
    .select("user_id, role, payment_class")
    .eq("organization_id", organizationId);

  if (membershipsError) {
    return { error: membershipsError.message };
  }

  const userIds = memberships.map((m: any) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const members = memberships.map((membership: any) => {
    const profile = profiles?.find((p: any) => p.id === membership.user_id);
    return {
      id: membership.user_id,
      name: profile?.full_name || "Unknown",
      email: profile?.email || "N/A",
      role: membership.role,
      payment_class: membership.payment_class
    };
  });

  return { members, count: members.length };
}

async function viewMemberBalance(supabase: any, organizationId: string, userId: string) {
  const { data: transactions, error } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  const balance = transactions.reduce((acc: number, txn: any) => {
    if (txn.type === "charge" || txn.type === "dues") {
      return acc + txn.amount;
    } else if (txn.type === "payment") {
      return acc - txn.amount;
    }
    return acc;
  }, 0);

  // Get user info
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", userId)
    .single();

  return {
    user: {
      id: userId,
      name: profile?.full_name || "Unknown",
      email: profile?.email || "N/A"
    },
    balance,
    transactions: transactions.slice(0, 10) // Return last 10 transactions
  };
}

async function viewAnnouncements(supabase: any, organizationId: string, limit: number) {
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, content, created_at, created_by")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  // Get author names
  const authorIds = [...new Set(data.map((a: any) => a.created_by))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds);

  const announcements = data.map((announcement: any) => {
    const author = profiles?.find((p: any) => p.id === announcement.created_by);
    return {
      ...announcement,
      author_name: author?.full_name || "Unknown"
    };
  });

  return { announcements, count: announcements.length };
}

async function createAnnouncement(
  supabase: any,
  organizationId: string,
  title: string,
  content: string,
  userId: string
) {
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      organization_id: organizationId,
      title,
      content,
      created_by: userId
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, announcement: data };
}

async function addPaymentTransaction(
  supabase: any,
  organizationId: string,
  userId: string,
  amount: number,
  type: string,
  description: string
) {
  const { data, error } = await supabase
    .from("payment_transactions")
    .insert({
      organization_id: organizationId,
      user_id: userId,
      amount,
      type,
      description
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, transaction: data };
}

async function viewPaymentClasses(supabase: any, organizationId: string) {
  const { data, error } = await supabase
    .from("organization_payment_classes")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { payment_classes: data, count: data.length };
}

async function createPaymentClass(supabase: any, input: any) {
  const { data, error } = await supabase
    .from("organization_payment_classes")
    .insert({
      organization_id: input.organization_id,
      class_name: input.class_name,
      display_name: input.display_name,
      dues_amount: input.dues_amount,
      billing_frequency: input.billing_frequency,
      description: input.description || null,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, payment_class: data };
}

async function viewEvents(supabase: any, organizationId: string, limit = 10, upcomingOnly = true) {
  let query = supabase
    .from("events")
    .select("id, title, description, location, start_time, end_time, created_by, created_at")
    .eq("organization_id", organizationId);

  if (upcomingOnly) {
    query = query.gte("start_time", new Date().toISOString());
  }

  const { data, error } = await query
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  // Get creator names
  const creatorIds = [...new Set(data.map((e: any) => e.created_by))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds);

  const events = data.map((event: any) => {
    const creator = profiles?.find((p: any) => p.id === event.created_by);
    return {
      ...event,
      created_by_name: creator?.full_name || "Unknown"
    };
  });

  return { events, count: events.length };
}

async function createEvent(supabase: any, input: any) {
  const { data, error } = await supabase
    .from("events")
    .insert({
      organization_id: input.organization_id,
      title: input.title,
      description: input.description || null,
      location: input.location || null,
      start_time: input.start_time,
      end_time: input.end_time,
      created_by: input.user_id
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, event: data };
}

async function viewIncidentReports(supabase: any, organizationId: string, status?: string, limit = 20) {
  let query = supabase
    .from("incident_reports")
    .select("*")
    .eq("organization_id", organizationId);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  // Get reporter names
  const reporterIds = [...new Set(data.map((r: any) => r.reporter_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", reporterIds);

  const reports = data.map((report: any) => {
    const reporter = profiles?.find((p: any) => p.id === report.reporter_id);
    return {
      ...report,
      reporter_name: reporter?.full_name || "Unknown"
    };
  });

  return { incident_reports: reports, count: reports.length };
}

async function createIncidentReport(supabase: any, input: any) {
  const { data, error } = await supabase
    .from("incident_reports")
    .insert({
      organization_id: input.organization_id,
      reporter_id: input.reporter_id,
      title: input.title,
      description: input.description,
      incident_date: input.incident_date,
      location: input.location || null,
      severity: input.severity,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, incident_report: data };
}

async function updateIncidentStatus(supabase: any, incidentId: string, status: string) {
  const { data, error } = await supabase
    .from("incident_reports")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", incidentId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, incident_report: data };
}

async function viewRides(supabase: any, organizationId: string, status?: string, limit = 20) {
  let query = supabase
    .from("rides")
    .select("*")
    .eq("organization_id", organizationId);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  // Get user and driver names
  const userIds = [...new Set([
    ...data.map((r: any) => r.user_id),
    ...data.filter((r: any) => r.driver_id).map((r: any) => r.driver_id)
  ])];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const rides = data.map((ride: any) => {
    const user = profiles?.find((p: any) => p.id === ride.user_id);
    const driver = ride.driver_id ? profiles?.find((p: any) => p.id === ride.driver_id) : null;
    return {
      ...ride,
      user_name: user?.full_name || "Unknown",
      driver_name: driver?.full_name || null
    };
  });

  return { rides, count: rides.length };
}

async function createRide(supabase: any, input: any) {
  const { data, error } = await supabase
    .from("rides")
    .insert({
      organization_id: input.organization_id,
      user_id: input.user_id,
      pickup_location: input.pickup_location,
      dropoff_location: input.dropoff_location,
      pickup_time: input.pickup_time || null,
      notes: input.notes || null,
      status: "pending"
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, ride: data };
}

async function updateRideStatus(supabase: any, rideId: string, status: string, driverId?: string) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };

  if (driverId && status === "claimed") {
    updateData.driver_id = driverId;
    updateData.claimed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("rides")
    .update(updateData)
    .eq("id", rideId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, ride: data };
}

async function addMember(supabase: any, input: any) {
  // First, look up user by email
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", input.user_email)
    .single();

  if (profileError || !profile) {
    return { error: "User not found with that email. They must create an account first." };
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("organization_memberships")
    .select("id")
    .eq("organization_id", input.organization_id)
    .eq("user_id", profile.id)
    .single();

  if (existing) {
    return { error: "User is already a member of this organization" };
  }

  // Add membership
  const { data, error } = await supabase
    .from("organization_memberships")
    .insert({
      organization_id: input.organization_id,
      user_id: profile.id,
      role: input.role || "member",
      payment_class: input.payment_class || "general_member"
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, membership: data };
}

async function updateMemberRole(supabase: any, organizationId: string, userId: string, role: string) {
  const { data, error } = await supabase
    .from("organization_memberships")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, membership: data };
}

async function updateMemberPaymentClass(supabase: any, organizationId: string, userId: string, paymentClass: string) {
  const { data, error } = await supabase
    .from("organization_memberships")
    .update({ payment_class: paymentClass, updated_at: new Date().toISOString() })
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, membership: data };
}

async function viewChariotDrivers(supabase: any, organizationId: string) {
  const { data, error } = await supabase
    .from("chariot_drivers")
    .select("id, user_id, created_at")
    .eq("organization_id", organizationId);

  if (error) {
    return { error: error.message };
  }

  // Get driver names
  const driverIds = data.map((d: any) => d.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", driverIds);

  const drivers = data.map((driver: any) => {
    const profile = profiles?.find((p: any) => p.id === driver.user_id);
    return {
      ...driver,
      driver_name: profile?.full_name || "Unknown"
    };
  });

  return { drivers, count: drivers.length };
}

async function addChariotDriver(supabase: any, organizationId: string, userId: string) {
  // Check if already a driver
  const { data: existing } = await supabase
    .from("chariot_drivers")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    return { error: "User is already an approved driver" };
  }

  const { data, error } = await supabase
    .from("chariot_drivers")
    .insert({
      organization_id: organizationId,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, driver: data };
}
