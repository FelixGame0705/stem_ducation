import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Trash2, Plus, Pencil } from "lucide-react";
export default function AdminNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({});
    // Lấy danh sách news với phân trang
    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/news?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setNews(data.news || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    }, [page]);
    const handleCreateNews = async () => {
        const payload = Object.assign(Object.assign({}, createForm), { publishedAt: createForm.publishedAt || new Date().toISOString() });
        await fetch(`/api/admin/news`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
            body: JSON.stringify(payload),
        });
        setCreating(false);
        setLoading(true);
        fetch(`/api/admin/news?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setNews(data.news || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    };
    // Xóa bài viết
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa bài viết này?"))
            return;
        await fetch(`/api/admin/news/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        });
        setNews((prev) => prev.filter((item) => item.id !== id));
    };
    // Mở modal sửa
    const handleEdit = (item) => {
        setEditing(item);
        setEditForm(item);
    };
    // Lưu bài viết đã sửa
    const handleSaveEdit = async () => {
        if (!editing)
            return;
        const payload = Object.assign(Object.assign({}, editForm), { publishedAt: editForm.publishedAt || new Date().toISOString() });
        await fetch(`/api/admin/news/${editing.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
            body: JSON.stringify(payload),
        });
        setEditing(null);
        setLoading(true);
        fetch(`/api/admin/news?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setNews(data.news || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    };
    return (<div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-center md:text-left pl-[3%]">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Tin tức</h1>
          <p className="text-gray-600 mt-1">Quản lý các bài viết tin tức</p>
        </div>
        <div className="flex justify-center md:justify-end pr-[3%]">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => {
            setCreateForm({});
            setCreating(true);
        }}>
            <Plus className="w-4 h-4"/> Tạo mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="h-5 w-5 mr-2"/>
            Danh sách bài viết tin tức
          </CardTitle>
          <CardDescription>Quản lý, sửa, xóa bài viết tin tức</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (<p>Đang tải...</p>) : news.length === 0 ? (<p className="text-gray-500">Chưa có bài viết nào.</p>) : (<>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Tiêu đề</th>
                    <th>Chuyên mục</th>
                    <th>Ngày đăng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (<tr key={item.id} className="border-b">
                      <td className="py-2 font-medium">{item.title}</td>
                      <td>{item.category}</td>
                      <td>{new Date(item.publishedAt).toLocaleDateString()}</td>
                      <td className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="flex items-center gap-1">
                          <Pencil className="w-4 h-4"/> Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="flex items-center gap-1">
                          <Trash2 className="w-4 h-4"/> Xóa
                        </Button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
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
            </>)}
        </CardContent>
      </Card>
      {creating && (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Tạo bài viết mới</h2>
            <div className="space-y-4">
              <input className="w-full border px-3 py-2 rounded" value={createForm.title || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { title: e.target.value })))} placeholder="Tiêu đề"/>
              <input className="w-full border px-3 py-2 rounded" value={createForm.slug || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { slug: e.target.value })))} placeholder="Slug (ví dụ: bai-viet-moi)"/>
              <input className="w-full border px-3 py-2 rounded" value={createForm.category || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { category: e.target.value })))} placeholder="Chuyên mục"/>
              <textarea className="w-full border px-3 py-2 rounded" value={createForm.excerpt || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { excerpt: e.target.value })))} placeholder="Tóm tắt" rows={3}/>
              <textarea className="w-full border px-3 py-2 rounded" value={createForm.content || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { content: e.target.value })))} placeholder="Nội dung chi tiết" rows={6}/>
              <input className="w-full border px-3 py-2 rounded" value={createForm.image || ""} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { image: e.target.value })))} placeholder="URL ảnh (Cloudinary)"/>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={createForm.featured || false} onChange={(e) => setCreateForm((f) => (Object.assign(Object.assign({}, f), { featured: e.target.checked })))}/>
                Đánh dấu nổi bật
              </label>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button variant="outline" onClick={() => setCreating(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreateNews}>Tạo</Button>
            </div>
          </div>
        </div>)}

      {/* Modal sửa bài viết */}
      {editing && (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Sửa bài viết</h2>
            <div className="space-y-4">
              <input className="w-full border px-3 py-2 rounded" value={editForm.title || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { title: e.target.value })))} placeholder="Tiêu đề"/>
              <input className="w-full border px-3 py-2 rounded" value={editForm.category || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { category: e.target.value })))} placeholder="Chuyên mục"/>
              <textarea className="w-full border px-3 py-2 rounded" value={editForm.excerpt || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { excerpt: e.target.value })))} placeholder="Tóm tắt" rows={3}/>
              <textarea className="w-full border px-3 py-2 rounded" value={editForm.content || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { content: e.target.value })))} placeholder="Nội dung chi tiết" rows={6}/>
              <input className="w-full border px-3 py-2 rounded" value={editForm.image || ""} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { image: e.target.value })))} placeholder="URL ảnh (Cloudinary)"/>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editForm.featured || false} onChange={(e) => setEditForm((f) => (Object.assign(Object.assign({}, f), { featured: e.target.checked })))}/>
                Đánh dấu nổi bật
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
    </div>);
}
