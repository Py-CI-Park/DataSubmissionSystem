import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventWithStats } from "@shared/schema";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ko } from "date-fns/locale";

export default function EventsList() {
  const { data: events, isLoading } = useQuery<EventWithStats[]>({
    queryKey: ["/api/events"],
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-60" />
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEventStatus = (deadline: Date) => {
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);
    
    if (isBefore(deadline, now)) {
      return { label: "마감", variant: "destructive" as const };
    }
    if (isBefore(deadline, threeDaysFromNow)) {
      return { label: "마감임박", variant: "destructive" as const };
    }
    return { label: "활성", variant: "default" as const };
  };

  const activeEvents = events?.filter(event => event.isActive) || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">활성 이벤트</h3>
          <Button variant="ghost" size="sm">
            전체 보기 <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {activeEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              활성 이벤트가 없습니다.
            </div>
          ) : (
            activeEvents.map((event) => {
              const status = getEventStatus(new Date(event.deadline));
              return (
                <div
                  key={event.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 mb-1">{event.title}</h4>
                      <p className="text-sm text-slate-600">{event.description}</p>
                    </div>
                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-slate-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {format(new Date(event.deadline), 'yyyy.MM.dd HH:mm', { locale: ko })}까지
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-600">
                        제출: {event.submissionCount}
                      </span>
                      <Button variant="ghost" size="sm">
                        관리
                      </Button>
                    </div>
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
