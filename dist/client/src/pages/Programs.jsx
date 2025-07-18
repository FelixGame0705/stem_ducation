"use client";
import { useQuery } from "@tanstack/react-query";
import ProgramCard from "@/components/ProgramCard";
import { Skeleton } from "@/components/ui/skeleton";
export default function Programs() {
    const { data, isLoading } = useQuery({
        queryKey: ["/api/programs"],
        queryFn: () => fetch("/api/programs").then((res) => res.json()),
    });
    // Tách mảng chương trình từ object trả về
    const programs = (data === null || data === void 0 ? void 0 : data.programs) || [];
    return (<div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Chương trình học
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các chương trình STEM đa dạng được thiết kế phù hợp với từng độ tuổi
          </p>
        </div>

        {isLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-48 w-full rounded-xl"/>))}
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {programs.map((program) => (<ProgramCard key={program.id} program={program}/>))}
          </div>)}
      </div>
    </div>);
}
