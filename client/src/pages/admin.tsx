import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/use-admin";
import { Shield, LogOut } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, authenticate, logout } = useAdmin();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await authenticate(password);
      if (success) {
        toast({
          title: "로그인 성공",
          description: "관리자로 로그인되었습니다.",
        });
        setPassword("");
      } else {
        toast({
          title: "로그인 실패",
          description: "비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "로그인 오류",
        description: "로그인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "로그아웃",
      description: "관리자에서 로그아웃되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">관리자 패널</CardTitle>
          </CardHeader>
          
          <CardContent>
            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">관리자 비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-800 font-medium">관리자로 로그인되었습니다.</p>
                  <p className="text-emerald-600 text-sm mt-1">
                    이제 이벤트를 생성하고 관리할 수 있습니다.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Link href="/">
                    <Button className="w-full">
                      대시보드로 이동
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
