import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Download } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import EventCreationModal from "./event-creation-modal";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const [showEventModal, setShowEventModal] = useState(false);
  const { isAuthenticated } = useAdmin();
  const { toast } = useToast();

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      toast({
        title: "인증 필요",
        description: "이벤트 생성을 위해 관리자 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }
    setShowEventModal(true);
  };

  const actions = [
    {
      title: "새 이벤트 생성",
      icon: Plus,
      onClick: handleCreateEvent,
    },
    {
      title: "자료 제출",
      icon: Upload,
      onClick: () => {
        document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      title: "결과 다운로드",
      icon: Download,
      onClick: () => {
        toast({
          title: "준비 중",
          description: "다운로드 기능은 준비 중입니다.",
        });
      },
    },
  ];

  return (
    <>
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">빠른 실행</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="text-center">
                    <action.icon className="h-6 w-6 text-slate-400 group-hover:text-primary mb-2 mx-auto" />
                    <p className="text-sm font-medium text-slate-600 group-hover:text-primary">
                      {action.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <EventCreationModal
        open={showEventModal}
        onOpenChange={setShowEventModal}
      />
    </>
  );
}
