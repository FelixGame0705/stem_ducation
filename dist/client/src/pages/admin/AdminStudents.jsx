import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        fetch(`/api/admin/students?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setStudents(data.students || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    }, [page]);
    const reload = () => {
        setLoading(true);
        fetch(`/api/admin/students?page=${page}&limit=10`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            var _a;
            setStudents(data.students || []);
            setTotalPages(((_a = data.pagination) === null || _a === void 0 ? void 0 : _a.pages) || 1);
            setLoading(false);
        });
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa học viên này?"))
            return;
        await fetch(`/api/admin/students/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
            },
        });
        reload();
    };
    const handleEdit = (student) => {
        setEditing(student);
        setEditForm(student);
    };
    const handleSaveEdit = async () => {
        if (!editing)
            return;
        await fetch(`/api/admin/students/${editing.id}`, {
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
        await fetch("/api/admin/students", {
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
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Học viên</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin học viên tiêu biểu</p>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4"/> Tạo mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2"/> Danh sách học viên tiêu biểu
          </CardTitle>
          <CardDescription>Chỉnh sửa hoặc xóa thông tin học viên</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (<p>Đang tải...</p>) : students.length === 0 ? (<p className="text-gray-500">Chưa có học viên nào.</p>) : (<>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">Tên học viên</th>
                    <th>Trường</th>
                    <th>Năm học</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (<tr key={student.id} className="border-b">
                      <td className="py-2 font-medium">{student.name}</td>
                      <td>{student.school}</td>
                      <td>{student.year}</td>
                      <td className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(student)} className="flex items-center gap-1">
                          <Pencil className="w-4 h-4"/> Sửa
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)} className="flex items-center gap-1">
                          <Trash2 className="w-4 h-4"/> Xóa
                        </Button>
                      </td>
                    </tr>))}
                </tbody>
              </table>

              <div className="flex justify-center mt-4 gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Trang trước
                </Button>
                <span className="px-2 py-1 text-sm">Trang {page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Trang sau
                </Button>
              </div>
            </>)}
        </CardContent>
      </Card>

      {/* Modal Edit */}
      {editing && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Sửa học viên</h2>
            <Input placeholder="Tên" value={editForm.name || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { name: e.target.value })))}/>
            <Input placeholder="Trường" value={editForm.school || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { school: e.target.value })))}/>
            <Input placeholder="Lớp" value={editForm.grade || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { grade: e.target.value })))}/>
            <Input placeholder="Thành tích" value={editForm.achievement || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { achievement: e.target.value })))}/>
            <Textarea placeholder="Mô tả" value={editForm.description || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { description: e.target.value })))}/>
            <Input placeholder="URL ảnh" value={editForm.image || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { image: e.target.value })))}/>
            <Input placeholder="Chương trình" value={editForm.program || ""} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { program: e.target.value })))}/>
            <Input placeholder="Năm học" type="number" value={editForm.year || 0} onChange={(e) => setEditForm(f => (Object.assign(Object.assign({}, f), { year: parseInt(e.target.value) })))}/>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Hủy</Button>
              <Button onClick={handleSaveEdit}>Lưu</Button>
            </div>
          </div>
        </div>)}

      {/* Modal Create */}
      {creating && (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Tạo học viên mới</h2>
            <Input placeholder="Tên" value={createForm.name || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { name: e.target.value })))}/>
            <Input placeholder="Trường" value={createForm.school || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { school: e.target.value })))}/>
            <Input placeholder="Lớp" value={createForm.grade || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { grade: e.target.value })))}/>
            <Input placeholder="Thành tích" value={createForm.achievement || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { achievement: e.target.value })))}/>
            <Textarea placeholder="Mô tả" value={createForm.description || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { description: e.target.value })))}/>
            <Input placeholder="URL ảnh" value={createForm.image || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { image: e.target.value })))}/>
            <Input placeholder="Chương trình" value={createForm.program || ""} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { program: e.target.value })))}/>
            <Input placeholder="Năm học" type="number" value={createForm.year || 0} onChange={(e) => setCreateForm(f => (Object.assign(Object.assign({}, f), { year: parseInt(e.target.value) })))}/>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>Hủy</Button>
              <Button onClick={handleCreate}>Tạo</Button>
            </div>
          </div>
        </div>)}
    </div>);
}
