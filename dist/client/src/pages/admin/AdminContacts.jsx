import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    useEffect(() => {
        const fetchContacts = async () => {
            var _a;
            setLoading(true);
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
            });
            if (fromDate)
                params.append("from", fromDate);
            if (toDate)
                params.append("to", toDate);
            try {
                const res = await fetch(`/api/admin/contacts?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
                    },
                });
                const data = await res.json();
                setContacts(data.contacts || []);
                setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            }
            catch (error) {
                console.error("Lỗi khi tải danh sách liên hệ:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [page, fromDate, toDate]);
    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa tin nhắn này?"))
            return;
        try {
            await fetch(`/api/admin/contacts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
                },
            });
            setContacts((prev) => prev.filter((c) => c.id !== id));
            setSelected(null);
        }
        catch (error) {
            console.error("Lỗi khi xóa liên hệ:", error);
            alert("Xóa thất bại. Vui lòng thử lại.");
        }
    };
    return (<div className="space-y-6">
      <div className="pl-[10%] text-left">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Liên hệ</h1>
        <p className="text-gray-600 mt-2">
          Quản lý các tin nhắn liên hệ từ người dùng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2"/> Tin nhắn liên hệ
          </CardTitle>
          <CardDescription>Lọc theo ngày và xem chi tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="max-w-[200px]"/>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="max-w-[200px]"/>
          </div>

          {loading ? (<p>Đang tải...</p>) : contacts.length === 0 ? (<p className="text-gray-500">Không có tin nhắn nào.</p>) : (<div className="space-y-2">
              {contacts.map((c) => (<div key={c.id} className="p-4 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c)}>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">
                    {c.email} • {format(new Date(c.submittedAt), "dd/MM/yyyy HH:mm")}
                  </div>
                </div>))}
            </div>)}

          {/* Phân trang */}
          <div className="flex justify-center mt-4 gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Trang trước
            </Button>
            <span className="px-2 py-1 text-sm">
              Trang {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              Trang sau
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chi tiết tin nhắn */}
      {selected && (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Chi tiết tin nhắn</h2>
            <div className="space-y-2">
              <div><strong>Họ tên:</strong> {selected.name}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Điện thoại:</strong> {selected.phone}</div>
              <div><strong>Chủ đề:</strong> {selected.subject}</div>
              <div><strong>Nội dung:</strong><br /> {selected.message}</div>
              <div className="text-sm text-gray-500">
                Gửi lúc {format(new Date(selected.submittedAt), "dd/MM/yyyy HH:mm")}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setSelected(null)}>Đóng</Button>
              <Button variant="destructive" onClick={() => handleDelete(selected.id)}>Xóa</Button>
            </div>
          </div>
        </div>)}
    </div>);
}
