import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function Dashboard() {
  // Example static data
  const paidMembers = 42;
  const accountBalance = 1234.56;
  const activeCreditCards = 5;
  const activeMembers = 50;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Club Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paid Dues</CardTitle>
            <CardDescription>Members who have paid</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{paidMembers}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Club funds available</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">${accountBalance.toLocaleString()}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Credit Cards</CardTitle>
            <CardDescription>Cards in use</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{activeCreditCards}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Members</CardTitle>
            <CardDescription>Current club members</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-4xl font-bold">{activeMembers}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}