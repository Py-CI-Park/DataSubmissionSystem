import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface EventCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EventCreationModal({ open, onOpenChange }: EventCreationModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [password, setPassword] = useState("");
  const [initialFiles, setInitialFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const createEventMutation = useMutation({
    mutationFn: async () => {
      if (!title || !description || !deadline || !password) {
        throw new Error("필수 정보를 모두 입력해주세요.");
      }

      if (initialFiles.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("deadline", deadline);
        formData.append("password", password);
        formData.append("isActive", "true");
        
        initialFiles.forEach(file => {
          formData.append("initialFiles", file);
        });

        const response = await fetch("/api/events", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "이벤트 생성에 실패했습니다.");
        }

        return response.json();
      } else {
        // Use JSON for text-only data
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            deadline,
            password,
            isActive: true,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "이벤트 생성에 실패했습니다.");
        }

        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      setTitle("");
      setDescription("");
      setDeadline("");
      setPassword("");
      setInitialFiles([]);
      onOpenChange(false);
      
      toast({
        title: "이벤트 생성 완료",
        description: "새 이벤트가 성공적으로 생성되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "생성 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    setInitialFiles(Array.from(files));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 이벤트 생성</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">이벤트 제목</Label>
            <Input
              id="title"
              type="text"
              placeholder="예: Q1 보고서 제출"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="이벤트에 대한 상세 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="deadline">마감일</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="deadline-date"
                  type="date"
                  value={deadline.split('T')[0] || ''}
                  onChange={(e) => {
                    const timeValue = deadline.split('T')[1] || '23:59';
                    setDeadline(`${e.target.value}T${timeValue}`);
                  }}
                  required
                />
              </div>
              <div>
                <Input
                  id="deadline-time"
                  type="time"
                  value={deadline.split('T')[1] || '23:59'}
                  onChange={(e) => {
                    const dateValue = deadline.split('T')[0] || new Date().toISOString().split('T')[0];
                    setDeadline(`${dateValue}T${e.target.value}`);
                  }}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="password">생성 비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="이벤트 생성을 위한 비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="initial-files">초기 자료 (선택)</Label>
            <Input
              id="initial-files"
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <p className="text-xs text-slate-500 mt-1">
              최대 50MB, 모든 파일 형식 지원
            </p>
            {initialFiles.length > 0 && (
              <p className="text-xs text-slate-600 mt-1">
                {initialFiles.length}개 파일 선택됨
              </p>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? "생성 중..." : "생성하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
