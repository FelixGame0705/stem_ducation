import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Newspaper,
  Calendar,
  Briefcase,
  Mail,
  TrendingUp,
  Eye
} from "lucide-react";
import type { Program, Student, News, Event, Recruitment, Contact } from "@shared/schema";

export default function AdminDashboard() {
  const { data: programs } = useQuery<{ programs: Program[]; total: number }>({
    queryKey: ["/api/admin/programs"],
  });

  const { data: students } = useQuery<{ students: Student[]; total: number }>({
    queryKey: ["/api/admin/students"],
  });

  const { data: news } = useQuery<{ news: News[]; total: number }>({
    queryKey: ["/api/admin/news"],
  });

  const { data: events } = useQuery<{ events: Event[]; total: number }>({
    queryKey: ["/api/admin/events"],
  });

  const { data: recruitments } = useQuery<{ recruitments: Recruitment[]; total: number }>({
    queryKey: ["/api/admin/recruitments"],
  });

  const { data: contacts } = useQuery<{ contacts: Contact[]; total: number }>({
    queryKey: ["/api/admin/contacts"],
  });

  const stats = [
    {
      title: "Chương trình",
      value: programs?.total || 0,
      icon: BookOpen,
      color: "bg-blue-500",
      description: "Tổng số chương trình học"
    },
    {
      title: "Học viên",
      value: students?.total || 0,
      icon: Users,
      color: "bg-green-500",
      description: "Học viên tiêu biểu"
    },
    {
      title: "Tin tức",
      value: news?.total || 0,
      icon: Newspaper,
      color: "bg-purple-500",
      description: "Bài viết đã đăng"
    },
    {
      title: "Sự kiện",
      value: events?.total || 0,
      icon: Calendar,
      color: "bg-orange-500",
      description: "Sự kiện sắp tới"
    },
    {
      title: "Tuyển dụng",
      value: recruitments?.total || 0,
      icon: Briefcase,
      color: "bg-red-500",
      description: "Vị trí tuyển dụng"
    },
    {
      title: "Liên hệ",
      value: contacts?.total || 0,
      icon: Mail,
      color: "bg-indigo-500",
      description: "Tin nhắn chờ xử lý"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Tổng quan về hoạt động của website STEM Center
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2" />
              Tin tức gần đây
            </CardTitle>
            <CardDescription>
              Những bài viết mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news?.news?.slice(0, 5).map((item: News) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Liên hệ gần đây
            </CardTitle>
            <CardDescription>
              Tin nhắn mới từ người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts?.contacts?.slice(0, 5).map((contact: Contact) => (
                <div key={contact.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={contact.processed ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {contact.processed ? "Đã xử lý" : "Chưa xử lý"}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {contact.subject}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    {contact.submittedAt ? new Date(contact.submittedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Thống kê nhanh
          </CardTitle>
          <CardDescription>
            Các chỉ số quan trọng của website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {news?.news?.filter((n: News) => n.featured).length || 0}
              </div>
              <p className="text-sm text-gray-600">Tin tức nổi bật</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events?.events?.filter((e: Event) => new Date(e.startDate) > new Date()).length || 0}
              </div>
              <p className="text-sm text-gray-600">Sự kiện sắp tới</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {contacts?.contacts?.filter((c: Contact) => !c.processed).length || 0}
              </div>
              <p className="text-sm text-gray-600">Liên hệ chưa xử lý</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {recruitments?.recruitments?.filter((r: Recruitment) => new Date(r.deadline) > new Date()).length || 0}
              </div>
              <p className="text-sm text-gray-600">Vị trí tuyển dụng</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}