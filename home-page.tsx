import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Book, PointsHistory } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();

  const { data: books } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const { data: pointsHistory } = useQuery<PointsHistory[]>({
    queryKey: ["/api/points-history"],
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome, {user?.username}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Your Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user?.points}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{books?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pointsHistory?.slice(0, 3).map((history) => (
                <div key={history.id} className="flex justify-between">
                  <span>{history.reason}</span>
                  <span className="font-bold">{history.points} points</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
