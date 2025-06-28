import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import EventCreationModal from "@/components/event-creation-modal";
import FileUploadPanel from "@/components/file-upload-panel";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar, Clock, Users } from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import type { EventWithStats } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { isAuthenticated } = useAdmin();
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery<EventWithStats[]>({
    queryKey: ["/api/events"],
  });

  const handleCreateEvent = () => {
    setShowEventModal(true);
  };

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
  };

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

  // 선택된 이벤트에 대한 자료 제출 화면
  if (selectedEventId) {
    const selectedEvent = events?.find(e => e.id === selectedEventId);
    
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedEventId(null)}
              className="text-sm text-slate-600 hover:text-slate-800 mb-4"
            >
              ← 이벤트 목록으로 돌아가기
            </button>
            {selectedEvent && (
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h2>
                    <p className="text-slate-600">{selectedEvent.description}</p>
                  </div>
                  <Badge variant={getEventStatus(new Date(selectedEvent.deadline)).variant}>
                    {getEventStatus(new Date(selectedEvent.deadline)).label}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{format(new Date(selectedEvent.deadline), 'yyyy.MM.dd HH:mm', { locale: ko })}까지</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>제출: {selectedEvent.submissionCount}건</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <FileUploadPanel preSelectedEventId={selectedEventId} />
        </main>
      </div>
    );
  }

  const activeEvents = events?.filter(event => event.isActive) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">자료 제출 시스템</h1>
          <p className="text-lg text-slate-600">회사 자료를 쉽고 빠르게 제출하고 관리하세요</p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-slate-500">이벤트를 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* 활성 이벤트들 */}
            {activeEvents.map((event) => {
              const status = getEventStatus(new Date(event.deadline));
              return (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{format(new Date(event.deadline), 'MM.dd HH:mm', { locale: ko })}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>제출 {event.submissionCount}건</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* 새 이벤트 생성 버튼 */}
            <button
              onClick={handleCreateEvent}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-dashed border-slate-300 hover:border-emerald-500"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                  <Plus className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">새 이벤트</h3>
                <p className="text-sm text-slate-600">새로운 제출 이벤트를 만드세요</p>
              </div>
            </button>
          </div>
        )}

        {activeEvents.length === 0 && !isLoading && (
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              아직 생성된 이벤트가 없습니다. 새 이벤트를 만들어보세요.
            </p>
          </div>
        )}
      </main>

      <EventCreationModal
        open={showEventModal}
        onOpenChange={setShowEventModal}
      />
    </div>
  );
}
