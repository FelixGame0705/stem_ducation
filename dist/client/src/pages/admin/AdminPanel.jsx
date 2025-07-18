import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Newspaper, Calendar, Briefcase, Mail, LogOut, Home, Settings } from "lucide-react";
// Admin component pages (to be created)
import AdminDashboard from "./AdminDashboard";
import AdminPrograms from "./AdminPrograms";
import AdminStudents from "./AdminStudents";
import AdminNews from "./AdminNews";
import AdminEvents from "./AdminEvents";
import AdminRecruitment from "./AdminRecruitment";
import AdminContacts from "./AdminContacts";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
export default function AdminPanel() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem("adminToken");
        if (!adminToken) {
            // Redirect to login if not authenticated
            router.push("/admin/login");
            return;
        }
        setIsAuthenticated(true);
    }, [router]);
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };
    const navigationItems = [
        { path: "/admin", icon: Home, label: "Dashboard", exact: true },
        { path: "/admin/programs", icon: BookOpen, label: "Chương trình" },
        { path: "/admin/students", icon: Users, label: "Học viên" },
        { path: "/admin/news", icon: Newspaper, label: "Tin tức" },
        { path: "/admin/events", icon: Calendar, label: "Sự kiện" },
        { path: "/admin/recruitment", icon: Briefcase, label: "Tuyển dụng" },
        { path: "/admin/contacts", icon: Mail, label: "Liên hệ" },
    ];
    // Function to render the appropriate component based on current route
    const renderContent = () => {
        switch (pathname) {
            case "/admin":
                return <AdminDashboard />;
            case "/admin/programs":
                return <AdminPrograms />;
            case "/admin/students":
                return <AdminStudents />;
            case "/admin/news":
                return <AdminNews />;
            case "/admin/events":
                return <AdminEvents />;
            case "/admin/recruitment":
                return <AdminRecruitment />;
            case "/admin/contacts":
                return <AdminContacts />;
            default:
                return <AdminDashboard />;
        }
    };
    if (!isAuthenticated) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600 mr-3"/>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Panel - STEM Center
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.open("/", "_blank")} className="text-gray-600 hover:text-gray-900">
                <Home className="h-4 w-4 mr-2"/>
                Xem website
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-800">
                <LogOut className="h-4 w-4 mr-2"/>
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Menu</CardTitle>
                <CardDescription>Quản lý nội dung website</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
                ? pathname === item.path
                : pathname.startsWith(item.path);
            return (<Link key={item.path} href={item.path} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                        <Icon className="h-4 w-4 mr-3"/>
                        {item.label}
                      </Link>);
        })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>);
}
