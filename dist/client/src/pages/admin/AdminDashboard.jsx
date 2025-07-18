import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Newspaper, Calendar, Briefcase, Mail, TrendingUp, Eye } from "lucide-react";
export default function AdminDashboard() {
    var _a, _b, _c, _d, _e, _f;
    const { data: programs } = useQuery({
        queryKey: ["/api/admin/programs"],
    });
    const { data: students } = useQuery({
        queryKey: ["/api/admin/students"],
    });
    const { data: news } = useQuery({
        queryKey: ["/api/admin/news"],
    });
    const { data: events } = useQuery({
        queryKey: ["/api/admin/events"],
    });
    const { data: recruitments } = useQuery({
        queryKey: ["/api/admin/recruitments"],
    });
    const { data: contacts } = useQuery({
        queryKey: ["/api/admin/contacts"],
    });
    const stats = [
        {
            title: "Chương trình",
            value: (programs === null || programs === void 0 ? void 0 : programs.total) || 0,
            icon: BookOpen,
            color: "bg-blue-500",
            description: "Tổng số chương trình học"
        },
        {
            title: "Học viên",
            value: (students === null || students === void 0 ? void 0 : students.total) || 0,
            icon: Users,
            color: "bg-green-500",
            description: "Học viên tiêu biểu"
        },
        {
            title: "Tin tức",
            value: (news === null || news === void 0 ? void 0 : news.total) || 0,
            icon: Newspaper,
            color: "bg-purple-500",
            description: "Bài viết đã đăng"
        },
        {
            title: "Sự kiện",
            value: (events === null || events === void 0 ? void 0 : events.total) || 0,
            icon: Calendar,
            color: "bg-orange-500",
            description: "Sự kiện sắp tới"
        },
        {
            title: "Tuyển dụng",
            value: (recruitments === null || recruitments === void 0 ? void 0 : recruitments.total) || 0,
            icon: Briefcase,
            color: "bg-red-500",
            description: "Vị trí tuyển dụng"
        },
        {
            title: "Liên hệ",
            value: (contacts === null || contacts === void 0 ? void 0 : contacts.total) || 0,
            icon: Mail,
            color: "bg-indigo-500",
            description: "Tin nhắn chờ xử lý"
        }
    ];
    return (<div className="space-y-6">
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
            return (<Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <Icon className="h-4 w-4 text-white"/>
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
            </Card>);
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Newspaper className="h-5 w-5 mr-2"/>
              Tin tức gần đây
            </CardTitle>
            <CardDescription>
              Những bài viết mới nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(_a = news === null || news === void 0 ? void 0 : news.news) === null || _a === void 0 ? void 0 : _a.slice(0, 5).map((item) => (<div key={item.id} className="flex items-center space-x-3">
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
                    <Eye className="h-4 w-4"/>
                  </div>
                </div>))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2"/>
              Liên hệ gần đây
            </CardTitle>
            <CardDescription>
              Tin nhắn mới từ người dùng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(_b = contacts === null || contacts === void 0 ? void 0 : contacts.contacts) === null || _b === void 0 ? void 0 : _b.slice(0, 5).map((contact) => (<div key={contact.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Badge variant={contact.processed ? "default" : "destructive"} className="text-xs">
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
                </div>))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2"/>
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
                {((_c = news === null || news === void 0 ? void 0 : news.news) === null || _c === void 0 ? void 0 : _c.filter((n) => n.featured).length) || 0}
              </div>
              <p className="text-sm text-gray-600">Tin tức nổi bật</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {((_d = events === null || events === void 0 ? void 0 : events.events) === null || _d === void 0 ? void 0 : _d.filter((e) => new Date(e.startDate) > new Date()).length) || 0}
              </div>
              <p className="text-sm text-gray-600">Sự kiện sắp tới</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {((_e = contacts === null || contacts === void 0 ? void 0 : contacts.contacts) === null || _e === void 0 ? void 0 : _e.filter((c) => !c.processed).length) || 0}
              </div>
              <p className="text-sm text-gray-600">Liên hệ chưa xử lý</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {((_f = recruitments === null || recruitments === void 0 ? void 0 : recruitments.recruitments) === null || _f === void 0 ? void 0 : _f.filter((r) => new Date(r.deadline) > new Date()).length) || 0}
              </div>
              <p className="text-sm text-gray-600">Vị trí tuyển dụng</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);
}
