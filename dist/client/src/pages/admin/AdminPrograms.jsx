import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Pencil, Trash2, Plus } from "lucide-react";
export default function AdminPrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        setLoading(true);
        fetch(`/api/admin/programs?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setPrograms(data.programs || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    }, [page]);
    const reload = () => {
        setLoading(true);
        fetch(`/api/admin/programs?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setPrograms(data.programs || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa chương trình này?"))
            return;
        await fetch(`/api/admin/programs/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        });
        reload();
    };
    const handleEdit = (program) => {
        setEditing(program);
        setEditForm(program);
    };
    const handleSaveEdit = async () => {
        if (!editing)
            return;
        await fetch(`/api/admin/programs/${editing.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
            body: JSON.stringify(editForm),
        });
        setEditing(null);
        reload();
    };
    const handleCreate = async () => {
        await fetch("/api/admin/programs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
            body: JSON.stringify(createForm),
        });
        setCreating(false);
        setCreateForm({});
        reload();
    };
    return (<div className="space-y-6">
      <div className="text-left pl-[10%]">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Chương trình</h1>
        <p className="text-gray-600 mt-1">Quản lý các chương trình học STEM</p>
        <div className="flex justify-end">
        <Button variant="outline" onClick={() => setCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4"/> Tạo mới
        </Button>
      </div>
      </div>

      

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2"/>
            Danh sách chương trình học
          </CardTitle>
          <CardDescription>Chỉnh sửa hoặc xóa các chương trình học</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (<p>Đang tải...</p>) : programs.length === 0 ? (<p className="text-gray-500">Chưa có chương trình nào.</p>) : (<>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Tên chương trình</th>
                    <th>Độ tuổi</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (<tr key={program.id} className="border-b">
                      <td className="py-2 font-medium">{program.title}</td>
                      <td>{program.ageRange}</td>
                      <td className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(program)} className="flex items-center gap-1">
                          <Pencil className="w-4 h-4"/> Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(program.id)} className="flex items-center gap-1">
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

      {/* Modal Sửa */}
      {editing && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Sửa chương trình</h2>
            <Input placeholder="Tiêu đề" value={editForm.title || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { title: e.target.value })))}/>
            <Input placeholder="Slug" value={editForm.slug || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { slug: e.target.value })))}/>
            <Input placeholder="Độ tuổi" value={editForm.ageRange || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { ageRange: e.target.value })))}/>
            <Textarea placeholder="Mục tiêu" value={editForm.objectives || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { objectives: e.target.value })))}/>
            <Textarea placeholder="Mô tả" value={editForm.description || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { description: e.target.value })))}/>
            <Input placeholder="URL ảnh" value={editForm.image || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { image: e.target.value })))}/>
            <Input placeholder="Màu nền" value={editForm.color || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { color: e.target.value })))}/>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Hủy</Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </div>
          </div>
        </div>)}

      {/* Modal Tạo */}
      {creating && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Tạo chương trình mới</h2>
            <Input placeholder="Tiêu đề" value={createForm.title || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { title: e.target.value })))}/>
            <Input placeholder="Slug" value={createForm.slug || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { slug: e.target.value })))}/>
            <Input placeholder="Độ tuổi" value={createForm.ageRange || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { ageRange: e.target.value })))}/>
            <Textarea placeholder="Mục tiêu" value={createForm.objectives || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { objectives: e.target.value })))}/>
            <Textarea placeholder="Mô tả" value={createForm.description || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { description: e.target.value })))}/>
            <Input placeholder="URL ảnh" value={createForm.image || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { image: e.target.value })))}/>
            <Input placeholder="Màu nền" value={createForm.color || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { color: e.target.value })))}/>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>Hủy</Button>
              <Button onClick={handleCreate}>Tạo</Button>
            </div>
          </div>
        </div>)}
    </div>);
}
