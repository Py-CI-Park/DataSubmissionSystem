import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUp, Plus, Edit, AlertTriangle, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { Activity } from "@shared/schema";

export default function RecentActivity() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'file_submitted':
        return { icon: FileUp, color: "bg-emerald-100 text-emerald-600" };
      case 'event_created':
        return { icon: Plus, color: "bg-blue-100 text-blue-600" };
      case 'file_updated':
        return { icon: Edit, color: "bg-amber-100 text-amber-600" };
      default:
        return { icon: AlertTriangle, color: "bg-red-100 text-red-600" };
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">최근 활동</h3>
          <Button variant="ghost" size="sm">
            전체 로그 보기 <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4 custom-scrollbar max-h-96 overflow-y-auto">
          {activities?.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              최근 활동이 없습니다.
            </div>
          ) : (
            activities?.map((activity) => {
              const { icon: Icon, color } = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { 
                        addSuffix: true, 
                        locale: ko 
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
