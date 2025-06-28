import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudUpload, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { EventWithStats } from "@shared/schema";

interface FileUploadPanelProps {
  preSelectedEventId?: number;
}

export default function FileUploadPanel({ preSelectedEventId }: FileUploadPanelProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterDepartment, setSubmitterDepartment] = useState("");
  const [submitterContact, setSubmitterContact] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  // 미리 선택된 이벤트 ID가 있으면 설정
  useEffect(() => {
    if (preSelectedEventId) {
      setSelectedEventId(preSelectedEventId.toString());
    }
  }, [preSelectedEventId]);

  const { data: events } = useQuery<EventWithStats[]>({
    queryKey: ["/api/events"],
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEventId || !submitterName || !submitterDepartment || selectedFiles.length === 0) {
        throw new Error("필수 정보를 모두 입력해주세요.");
      }

      const formData = new FormData();
      formData.append("eventId", selectedEventId);
      formData.append("submitterName", submitterName);
      formData.append("submitterDepartment", submitterDepartment);
      if (submitterContact) {
        formData.append("submitterContact", submitterContact);
      }
      
      selectedFiles.forEach(file => {
        formData.append("files", file);
      });

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "제출에 실패했습니다.");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      
      setSelectedEventId("");
      setSubmitterName("");
      setSubmitterDepartment("");
      setSubmitterContact("");
      setSelectedFiles([]);
      
      toast({
        title: "제출 완료",
        description: "자료가 성공적으로 제출되었습니다.",
      });
    },
    onError: (error) => {
      toast({
        title: "제출 실패",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "파일 크기 오류",
          description: `${file.name}의 크기가 50MB를 초과합니다.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const activeEvents = events?.filter(event => event.isActive) || [];

  return (
    <Card id="upload-section">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">자료 제출</h3>
        
        <div className="space-y-4">
          {!preSelectedEventId && (
            <div>
              <Label htmlFor="event-select" className="text-sm font-medium text-slate-700 mb-2">
                이벤트 선택
              </Label>
              <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="이벤트를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {activeEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">제출자 정보</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="이름 *"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="부서 *"
                value={submitterDepartment}
                onChange={(e) => setSubmitterDepartment(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Input
                type="text"
                placeholder="연락처 (선택)"
                value={submitterContact}
                onChange={(e) => setSubmitterContact(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2">파일 업로드</Label>
            <div
              className={`upload-area border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver ? "border-primary bg-primary/10" : "border-slate-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CloudUpload className="h-8 w-8 text-slate-400 mb-2 mx-auto" />
              <p className="text-sm text-slate-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
              <p className="text-xs text-slate-500 mb-3">최대 50MB, 모든 파일 형식 지원</p>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                id="file-input"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                파일 선택
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium text-slate-700">선택된 파일</Label>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              className="flex-1"
              disabled={submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
            >
              <Upload className="h-4 w-4 mr-2" />
              {submitMutation.isPending ? "제출 중..." : "제출하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedEventId("");
                setSubmitterName("");
                setSubmitterDepartment("");
                setSubmitterContact("");
                setSelectedFiles([]);
              }}
            >
              취소
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
