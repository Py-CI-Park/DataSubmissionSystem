import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileCheck, Clock, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@shared/schema";

export default function DashboardStatsComponent() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">대시보드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsItems = [
    {
      label: "활성 이벤트",
      value: stats?.activeEvents || 0,
      icon: Calendar,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "총 제출",
      value: stats?.totalSubmissions || 0,
      icon: FileCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "미제출",
      value: stats?.pendingSubmissions || 0,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "완료율",
      value: stats?.completionRate || "0%",
      icon: PieChart,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
