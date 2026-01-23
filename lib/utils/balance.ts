// src/lib/utils/balance.ts
import { Fee, BalanceSummary, FeeStatus } from "@/types/balance.types";

/**
 * Calculate total balance from fees
 */
export function calculateTotalBalance(fees: Fee[]): number {
  return fees
    .filter((fee) => fee.status === "pending")
    .reduce((sum, fee) => sum + fee.amount, 0);
}

/**
 * Get balance summary with breakdown
 */
export function getBalanceSummary(fees: Fee[]): BalanceSummary {
  const pendingFees = fees.filter((fee) => fee.status === "pending");
  const paidFees = fees.filter((fee) => fee.status === "paid");

  return {
    totalBalance: calculateTotalBalance(fees),
    pendingFees,
    paidFees,
    totalPending: pendingFees.reduce((sum, fee) => sum + fee.amount, 0),
    totalPaid: paidFees.reduce((sum, fee) => sum + fee.amount, 0),
  };
}

/**
 * Format date for display
 */
export function formatFeeDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status: FeeStatus): {
  background: string;
  text: string;
} {
  const colors = {
    pending: {
      background: "#fef3c7",
      text: "#92400e",
    },
    paid: {
      background: "#d1fae5",
      text: "#065f46",
    },
  };

  return colors[status];
}

/**
 * Get balance color (red for owing, green for paid)
 */
export function getBalanceColor(amount: number, isPending: boolean = true): string {
  if (!isPending) return "#10b981"; // Green for paid
  return amount > 0 ? "#ef4444" : "#10b981";
}

/**
 * Sort fees by date
 */
export function sortFeesByDate(
  fees: Fee[],
  direction: "asc" | "desc" = "desc"
): Fee[] {
  return [...fees].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return direction === "asc" ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort fees by amount
 */
export function sortFeesByAmount(
  fees: Fee[],
  direction: "asc" | "desc" = "desc"
): Fee[] {
  return [...fees].sort((a, b) => {
    return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
  });
}

/**
 * Filter fees by status
 */
export function filterFeesByStatus(fees: Fee[], status: FeeStatus): Fee[] {
  return fees.filter((fee) => fee.status === status);
}

/**
 * Filter fees by date range
 */
export function filterFeesByDateRange(
  fees: Fee[],
  startDate?: string,
  endDate?: string
): Fee[] {
  let filtered = [...fees];

  if (startDate) {
    const start = new Date(startDate).getTime();
    filtered = filtered.filter((fee) => new Date(fee.date).getTime() >= start);
  }

  if (endDate) {
    const end = new Date(endDate).getTime();
    filtered = filtered.filter((fee) => new Date(fee.date).getTime() <= end);
  }

  return filtered;
}

/**
 * Get overdue fees (pending fees with past dates)
 */
export function getOverdueFees(fees: Fee[]): Fee[] {
  const today = new Date().setHours(0, 0, 0, 0);
  
  return fees.filter((fee) => {
    if (fee.status !== "pending") return false;
    const feeDate = new Date(fee.date).setHours(0, 0, 0, 0);
    return feeDate < today;
  });
}

/**
 * Check if a fee is overdue
 */
export function isFeeOverdue(fee: Fee): boolean {
  if (fee.status !== "pending") return false;
  const today = new Date().setHours(0, 0, 0, 0);
  const feeDate = new Date(fee.date).setHours(0, 0, 0, 0);
  return feeDate < today;
}

/**
 * Get days until/since fee due date
 */
export function getDaysUntilDue(dateString: string): number {
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString).setHours(0, 0, 0, 0);
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format due date status (e.g., "Due in 3 days", "Overdue by 2 days")
 */
export function formatDueDateStatus(dateString: string): string {
  const days = getDaysUntilDue(dateString);
  
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days > 1) return `Due in ${days} days`;
  if (days === -1) return "Overdue by 1 day";
  return `Overdue by ${Math.abs(days)} days`;
}

/**
 * Export fees to CSV
 */
export function exportFeesToCSV(fees: Fee[]): string {
  const headers = ["Description", "Amount", "Date", "Status"];
  const rows = fees.map((fee) => [
    fee.description,
    `$${fee.amount.toFixed(2)}`,
    formatFeeDate(fee.date),
    fee.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download fees as CSV file
 */
export function downloadFeesCSV(fees: Fee[], filename: string = "fees.csv"): void {
  const csv = exportFeesToCSV(fees);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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

/**
 * Group fees by month
 */
export function groupFeesByMonth(fees: Fee[]): Record<string, Fee[]> {
  return fees.reduce((groups, fee) => {
    const date = new Date(fee.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    
    groups[monthKey].push(fee);
    return groups;
  }, {} as Record<string, Fee[]>);
}

/**
 * Format month key for display
 */
export function formatMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}