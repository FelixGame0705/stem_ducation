import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash2, Plus } from "lucide-react";
export default function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showCreate, setShowCreate] = useState(false);
    const [createForm, setCreateForm] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const loadEvents = () => {
        setLoading(true);
        fetch(`/api/admin/events?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setEvents(data.events || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    };
    useEffect(() => {
        loadEvents();
    }, [page]);
    const handleDelete = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa sự kiện này?"))
            return;
        await fetch(`/api/admin/events/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        });
        loadEvents();
    };
    const handleSaveEdit = async () => {
        if (!editing)
            return;
        await fetch(`/api/admin/events/${editing.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
            body: JSON.stringify(editForm),
        });
        setEditing(null);
        loadEvents();
    };
    const handleCreate = async () => {
        await fetch(`/api/admin/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
            body: JSON.stringify(createForm),
        });
        setShowCreate(false);
        setCreateForm({});
        loadEvents();
    };
    return (<div className="space-y-6">
      <div className="text-center md:text-left pl-[10%]">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Sự kiện</h1>
        <p className="text-gray-600 mt-2">Quản lý các sự kiện và hoạt động</p>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2"/> Tạo mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2"/> Sự kiện
          </CardTitle>
          <CardDescription>Quản lý, chỉnh sửa, xóa các sự kiện</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (<p>Đang tải...</p>) : events.length === 0 ? (<p className="text-gray-500">Chưa có sự kiện nào.</p>) : (<>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Tiêu đề</th>
                    <th>Thời gian</th>
                    <th>Địa điểm</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((item) => (<tr key={item.id} className="border-b">
                      <td className="py-2 font-medium">{item.title}</td>
                      <td>
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </td>
                      <td>{item.location}</td>
                      <td className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => {
                    setEditing(item);
                    setEditForm(item);
                }}>
                          <Pencil className="w-4 h-4"/>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
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
            </>)}
        </CardContent>
      </Card>

      {editing && (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Sửa sự kiện</h2>
            <div className="space-y-4">
              <input className="w-full border px-3 py-2 rounded" value={editForm.title || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { title: e.target.value })))} placeholder="Tiêu đề"/>
              <input className="w-full border px-3 py-2 rounded" value={editForm.location || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { location: e.target.value })))} placeholder="Địa điểm"/>
              <input className="w-full border px-3 py-2 rounded" value={editForm.image || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { image: e.target.value })))} placeholder="URL ảnh"/>
              <textarea className="w-full border px-3 py-2 rounded" rows={4} value={editForm.description || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { description: e.target.value })))} placeholder="Mô tả"/>
              <input type="datetime-local" className="w-full border px-3 py-2 rounded" value={editForm.startDate
                ? new Date(editForm.startDate).toISOString().slice(0, 16)
                : ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { startDate: new Date(e.target.value).toISOString() })))}/>

              <input type="datetime-local" className="w-full border px-3 py-2 rounded" value={editForm.endDate
                ? new Date(editForm.endDate).toISOString().slice(0, 16)
                : ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { endDate: new Date(e.target.value).toISOString() })))}/>

              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.registrationRequired || false} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { registrationRequired: e.target.checked })))}/>
                Cần đăng ký
              </label>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="outline" onClick={() => setEditing(null)}>
                Hủy
              </Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </div>
          </div>
        </div>)}

      {showCreate && (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Tạo sự kiện mới</h2>
            <div className="space-y-4">
              <input className="w-full border px-3 py-2 rounded" value={createForm.title || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { title: e.target.value })))} placeholder="Tiêu đề"/>
              <input className="w-full border px-3 py-2 rounded" value={createForm.location || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { location: e.target.value })))} placeholder="Địa điểm"/>
              <input className="w-full border px-3 py-2 rounded" value={createForm.image || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { image: e.target.value })))} placeholder="URL ảnh"/>
              <textarea className="w-full border px-3 py-2 rounded" rows={4} value={createForm.description || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { description: e.target.value })))} placeholder="Mô tả"/>
              <input className="w-full border px-3 py-2 rounded" type="datetime-local" value={createForm.startDate || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { startDate: e.target.value })))}/>
              <input className="w-full border px-3 py-2 rounded" type="datetime-local" value={createForm.endDate || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { endDate: e.target.value })))}/>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={createForm.registrationRequired || false} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { registrationRequired: e.target.checked })))}/>
                Cần đăng ký
              </label>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreate}>Tạo</Button>
            </div>
          </div>
        </div>)}
    </div>);
}
