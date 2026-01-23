// src/components/treasury/MemberBalanceTable.tsx (Updated)
import { Member, PaymentClass } from "@/hooks/useTreasury";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableEmpty,
} from "@/components/ui/Table";
import { PaymentClassBadge } from "./PaymentClassList";
import {
  formatCurrency,
  getInitials,
  getAvatarColor,
  getBalanceColor,
} from "@/lib/utils/treasury";

interface MemberBalanceTableProps {
  members: Member[];
  paymentClasses: PaymentClass[];
  onMemberClick?: (member: Member) => void;
}

export function MemberBalanceTable({
  members,
  paymentClasses,
  onMemberClick,
}: MemberBalanceTableProps) {
  const getPaymentClass = (className: string) => {
    return paymentClasses.find((pc) => pc.class_name === className);
  };

  if (members.length === 0) {
    return (
      <Table>
        <TableEmpty message="No members found." />
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader columns="1fr 200px 150px">
        <span>Member</span>
        <TableCell align="center">
          <span>Payment Class</span>
        </TableCell>
        <TableCell align="right">
          <span>Balance</span>
        </TableCell>
      </TableHeader>

      <TableBody>
        {members.map((member, index) => {
          const paymentClass = getPaymentClass(member.payment_class);
          const balance = (member as any).balance || 0;

          return (
            <TableRow
              key={member.id}
              columns="1fr 200px 150px"
              onClick={onMemberClick ? () => onMemberClick(member) : undefined}
              style={{
                borderBottom:
                  index < members.length - 1 ? "1px solid #f1f5f9" : "none",
              }}
            >
              {/* Member Info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#eff6ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: getAvatarColor(member.full_name),
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(member.full_name)}
                </div>
                <p
                  style={{
                    fontWeight: 500,
                    color: "#1e293b",
                    fontSize: "0.95rem",
                    margin: 0,
                  }}
                >
                  {member.full_name}
                </p>
              </div>

              {/* Payment Class Badge */}
              <TableCell align="center">
                {paymentClass ? (
                  <PaymentClassBadge paymentClass={paymentClass} />
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.375rem 0.875rem",
                      backgroundColor: "#f1f5f9",
                      color: "#64748b",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderRadius: "6px",
                    }}
                  >
                    {member.payment_class}
                  </span>
                )}
              </TableCell>

              {/* Balance */}
              <TableCell align="right">
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: getBalanceColor(balance),
                    margin: 0,
                  }}
                >
                  {formatCurrency(balance)}
                </p>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}