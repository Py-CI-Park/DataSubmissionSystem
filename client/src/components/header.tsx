import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { FileUp, Shield } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">자료 제출 시스템</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "secondary" : "ghost"} 
                size="sm"
              >
                이벤트 목록
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-300"></div>
            <Link href="/admin">
              <Button variant="default" size="sm">
                <Shield className="h-4 w-4 mr-2" />
                관리자
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
