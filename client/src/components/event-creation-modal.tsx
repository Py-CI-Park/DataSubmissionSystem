import { useState, useEffect } from "react";
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
import { FolderOpen } from "lucide-react";
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
  const [initialStoragePath, setInitialStoragePath] = useState("");
  const [submissionStoragePath, setSubmissionStoragePath] = useState("");
  const [initialFiles, setInitialFiles] = useState<File[]>([]);
  const { toast } = useToast();

  // 모달이 열릴 때 기본값 설정
  useEffect(() => {
    if (open) {
      // 내일 날짜 + 오후 5시 설정
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      setDeadline(`${tomorrowDate}T17:00`);
    }
  }, [open]);

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
        if (initialStoragePath) formData.append("initialStoragePath", initialStoragePath);
        if (submissionStoragePath) formData.append("submissionStoragePath", submissionStoragePath);
        
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
            initialStoragePath: initialStoragePath || undefined,
            submissionStoragePath: submissionStoragePath || undefined,
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
      setInitialStoragePath("");
      setSubmissionStoragePath("");
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
    
    // 초기 자료 파일 선택 시 자동으로 저장 경로 설정
    if (files.length > 0 && !initialStoragePath) {
      const defaultPath = "C:\\Data\\Initial";
      setInitialStoragePath(defaultPath);
    }
  };

  const handleFolderSelect = async (type: 'initial' | 'submission') => {
    try {
      // File System Access API 지원 확인
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        const path = dirHandle.name; // 실제로는 더 복잡한 경로 처리가 필요할 수 있음
        
        if (type === 'initial') {
          setInitialStoragePath(path);
        } else {
          setSubmissionStoragePath(path);
        }
      } else {
        // 폴더 선택이 지원되지 않는 경우 대체 방법
        toast({
          title: "폴더 선택 불가",
          description: "브라우저에서 폴더 선택을 지원하지 않습니다. 직접 경로를 입력해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // 사용자가 취소한 경우 등
      console.log("폴더 선택이 취소되었습니다.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEventMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-100">새 이벤트 생성</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="dark:text-slate-200">이벤트 제목</Label>
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
            <Label htmlFor="description" className="dark:text-slate-200">설명</Label>
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
            <Label htmlFor="deadline" className="dark:text-slate-200">마감일</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="deadline-date"
                  type="date"
                  value={deadline.split('T')[0] || ''}
                  onChange={(e) => {
                    const timeValue = deadline.split('T')[1] || '17:00';
                    setDeadline(`${e.target.value}T${timeValue}`);
                  }}
                  required
                />
              </div>
              <div>
                <Input
                  id="deadline-time"
                  type="time"
                  value={deadline.split('T')[1] || '17:00'}
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
            <Label htmlFor="password" className="dark:text-slate-200">생성 비밀번호</Label>
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
            <Label htmlFor="initial-storage-path" className="dark:text-slate-200">초기 자료 저장 경로</Label>
            <div className="flex gap-2">
              <Input
                id="initial-storage-path"
                type="text"
                placeholder="예: C:\\Data\\Initial"
                value={initialStoragePath}
                onChange={(e) => setInitialStoragePath(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFolderSelect('initial')}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="submission-storage-path" className="dark:text-slate-200">제출 자료 저장 경로</Label>
            <div className="flex gap-2">
              <Input
                id="submission-storage-path"
                type="text"
                placeholder="예: C:\\Data\\Submissions"
                value={submissionStoragePath}
                onChange={(e) => setSubmissionStoragePath(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleFolderSelect('submission')}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="initial-files" className="dark:text-slate-200">초기 자료 (선택)</Label>
            <Input
              id="initial-files"
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              최대 50MB, 모든 파일 형식 지원
            </p>
            {initialFiles.length > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
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
