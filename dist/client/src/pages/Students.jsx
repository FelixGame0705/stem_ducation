"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import StudentCard from "@/components/StudentCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
export default function Students() {
    const [filterProgram, setFilterProgram] = useState("");
    const [filterYear, setFilterYear] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 6;
    const { data: studentsData, isLoading } = useQuery({
        queryKey: ["/api/students", filterProgram, filterYear, currentPage],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filterProgram)
                params.append("program", filterProgram);
            if (filterYear)
                params.append("year", filterYear);
            params.append("page", currentPage.toString());
            params.append("limit", limit.toString());
            const res = await fetch(`/api/students?${params}`);
            return res.json();
        },
    });
    const students = (studentsData === null || studentsData === void 0 ? void 0 : studentsData.students) || [];
    const pagination = studentsData === null || studentsData === void 0 ? void 0 : studentsData.pagination;
    const programs = ["Otto Robot", "Microbit", "Python", "AI", "Cloud Computing"];
    const years = [2024, 2023, 2022];
    return (<div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Học viên tiêu biểu
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những thành tích nổi bật của các học viên STEM Center
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={filterProgram} onValueChange={(value) => {
            setFilterProgram(value === "all" ? "" : value);
            setCurrentPage(1);
        }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Chọn chương trình"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chương trình</SelectItem>
              {programs.map((program) => (<SelectItem key={program} value={program}>
                  {program}
                </SelectItem>))}
            </SelectContent>
          </Select>

          <Select value={filterYear} onValueChange={(value) => {
            setFilterYear(value === "all" ? "" : value);
            setCurrentPage(1);
        }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Chọn năm"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả năm</SelectItem>
              {years.map((year) => (<SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>))}
            </SelectContent>
          </Select>

          {(filterProgram || filterYear) && (<Button variant="outline" onClick={() => {
                setFilterProgram("");
                setFilterYear("");
                setCurrentPage(1);
            }} className="cursor-pointer">
              Xóa bộ lọc
            </Button>)}
        </div>

        {isLoading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (<div key={i} className="bg-gray-50 rounded-xl p-6 space-y-4">
                <Skeleton className="w-24 h-24 rounded-full mx-auto"/>
                <Skeleton className="h-6 w-32 mx-auto"/>
                <Skeleton className="h-4 w-40 mx-auto"/>
                <Skeleton className="h-6 w-28 mx-auto"/>
                <Skeleton className="h-4 w-full"/>
              </div>))}
          </div>) : students.length === 0 ? (<div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy học viên nào phù hợp với bộ lọc.</p>
          </div>) : (<>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {students.map((student) => (<StudentCard key={student.id} student={student}/>))}
            </div>
            
            {pagination && (<Pagination currentPage={currentPage} totalPages={pagination.pages} onPageChange={setCurrentPage}/>)}
          </>)}
      </div>
    </div>);
}
