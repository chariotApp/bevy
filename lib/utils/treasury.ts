// src/lib/utils/treasury.ts

/**
 * Format currency amount to display string
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert display name to class name (slug format)
 */
export function displayNameToClassName(displayName: string): string {
  return displayName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "_"); // Replace spaces with underscores
}

/**
 * Validate payment class form data
 */
export interface PaymentClassFormData {
  displayName: string;
  duesAmount: string;
  billingFrequency: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePaymentClassForm(
  data: PaymentClassFormData
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate display name
  if (!data.displayName.trim()) {
    errors.push({
      field: "displayName",
      message: "Display name is required",
    });
  } else if (data.displayName.length < 2) {
    errors.push({
      field: "displayName",
      message: "Display name must be at least 2 characters",
    });
  } else if (data.displayName.length > 50) {
    errors.push({
      field: "displayName",
      message: "Display name must be less than 50 characters",
    });
  }

  // Validate dues amount
  const amount = parseFloat(data.duesAmount);
  if (isNaN(amount)) {
    errors.push({
      field: "duesAmount",
      message: "Dues amount must be a valid number",
    });
  } else if (amount < 0) {
    errors.push({
      field: "duesAmount",
      message: "Dues amount cannot be negative",
    });
  } else if (amount > 999999.99) {
    errors.push({
      field: "duesAmount",
      message: "Dues amount is too large",
    });
  }

  // Validate billing frequency
  const validFrequencies = ["semester", "monthly", "annual", "one_time"];
  if (!validFrequencies.includes(data.billingFrequency)) {
    errors.push({
      field: "billingFrequency",
      message: "Invalid billing frequency",
    });
  }

  return errors;
}

/**
 * Format billing frequency for display
 */
export function formatBillingFrequency(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    semester: "Semester",
    monthly: "Monthly",
    annual: "Annual",
    one_time: "One Time",
  };

  return frequencyMap[frequency] || frequency;
}

/**
 * Calculate due date based on billing frequency
 */
export function calculateNextDueDate(
  lastDueDate: Date,
  billingFrequency: string
): Date {
  const nextDate = new Date(lastDueDate);

  switch (billingFrequency) {
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "semester":
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case "annual":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case "one_time":
      // One-time payments don't have a next due date
      return lastDueDate;
    default:
      throw new Error(`Unknown billing frequency: ${billingFrequency}`);
  }

  return nextDate;
}

/**
 * Get initials from full name
 */
export function getInitials(fullName: string | null): string {
  if (!fullName) return "U";

  const names = fullName.trim().split(/\s+/);
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Generate avatar color based on name
 */
export function getAvatarColor(fullName: string | null): string {
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#f59e0b", // amber
    "#84cc16", // lime
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
  ];

  if (!fullName) return colors[0];

  // Generate a consistent color based on the name
  const hash = fullName.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Sort members by various criteria
 */
export type SortCriteria = "name" | "balance" | "paymentClass";
export type SortDirection = "asc" | "desc";

export function sortMembers<T extends { full_name: string | null; balance?: number; payment_class?: string }>(
  members: T[],
  criteria: SortCriteria,
  direction: SortDirection = "asc"
): T[] {
  const sorted = [...members];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (criteria) {
      case "name":
        const nameA = (a.full_name || "").toLowerCase();
        const nameB = (b.full_name || "").toLowerCase();
        comparison = nameA.localeCompare(nameB);
        break;

      case "balance":
        comparison = (a.balance || 0) - (b.balance || 0);
        break;

      case "paymentClass":
        const classA = (a.payment_class || "").toLowerCase();
        const classB = (b.payment_class || "").toLowerCase();
        comparison = classA.localeCompare(classB);
        break;
    }

    return direction === "asc" ? comparison : -comparison;
  });

  return sorted;
}

/**
 * Filter members by payment class
 */
export function filterMembersByPaymentClass<T extends { payment_class?: string }>(
  members: T[],
  paymentClass: string | null
): T[] {
  if (!paymentClass) return members;
  return members.filter((m) => m.payment_class === paymentClass);
}

/**
 * Calculate total outstanding balance for all members
 */
export function calculateTotalBalance(members: Array<{ balance?: number }>): number {
  return members.reduce((total, member) => total + (member.balance || 0), 0);
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(dueDate: Date | string): boolean {
  const dueDateObj = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  return dueDateObj < new Date();
}

/**
 * Get balance status (positive, negative, zero)
 */
export type BalanceStatus = "positive" | "negative" | "zero";

export function getBalanceStatus(balance: number): BalanceStatus {
  if (balance > 0) return "positive";
  if (balance < 0) return "negative";
  return "zero";
}

/**
 * Get balance color based on status
 */
export function getBalanceColor(balance: number): string {
  const status = getBalanceStatus(balance);

  switch (status) {
    case "positive":
      return "#dc2626"; // red - owes money
    case "negative":
      return "#10b981"; // green - has credit
    case "zero":
      return "#64748b"; // gray - balanced
  }
}

/**
 * Export members data to CSV format
 */
export function exportMembersToCSV(
  members: Array<{
    full_name: string | null;
    payment_class?: string;
    balance?: number;
  }>
): string {
  const headers = ["Name", "Payment Class", "Balance"];
  const rows = members.map((m) => [
    m.full_name || "Unnamed User",
    m.payment_class || "N/A",
    formatCurrency(m.balance || 0),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}