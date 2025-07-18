"use client";

import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import ProgramCard from "@/components/ProgramCard";
import StudentCard from "@/components/StudentCard";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import type { Program, Student, News } from "@shared/schema";
import Link from "next/link";

export default function Home() {
  const { data: programsData, isLoading: programsLoading } = useQuery<{
    programs: Program[];
    pagination: any;
  }>({
    queryKey: ["/api/programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs?limit=6");
      return res.json();
    },
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery<{
    students: Student[];
    pagination: any;
  }>({
    queryKey: ["/api/students"],
    queryFn: async () => {
      const res = await fetch("/api/students?limit=6");
      return res.json();
    },
  });

  const { data: newsData, isLoading: newsLoading } = useQuery<{
    news: News[];
    pagination: any;
  }>({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const res = await fetch("/api/news?featured=true&limit=6");
      return res.json();
    },
  });

  const programs = programsData?.programs || [];
  const students = studentsData?.students || [];
  const featuredNews = newsData?.news || [];

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Chương trình học tiêu biểu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các chương trình STEM đa dạng được thiết kế phù hợp với
              từng độ tuổi
            </p>
          </div>

          {programsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Outstanding Students Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Học viên tiêu biểu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những thành tích nổi bật của các học viên STEM Center
            </p>
          </div>

          {studentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl p-6 animate-pulse"
                >
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {students.slice(0, 3).map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/hoc-vien-tieu-bieu">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer px-6 py-3 text-lg">
                Xem tất cả học viên
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Tin tức mới nhất
              </h2>
              <p className="text-xl text-gray-600">
                Cập nhật những thông tin mới nhất về giáo dục STEM
              </p>
            </div>
            <Link href="/tin-tuc">
              <Button className="hidden md:block bg-blue-600 text-white hover:bg-blue-700 cursor-pointer px-6 py-3">
                Xem tất cả
              </Button>
            </Link>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình STEM?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay để con được trải nghiệm buổi học thử miễn phí và khám
            phá niềm đam mê với công nghệ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he">
              <Button className="bg-orange-500 text-white px-8 py-3 hover:bg-orange-600 font-semibold cursor-pointer">
                Đăng ký học thử miễn phí
              </Button>
            </Link>
            <Link href="/tu-van">
              <Button
                variant="outline"
                className="border-2 border-white text-blue-500 px-8 py-3 hover:bg-white hover:text-blue-600 font-semibold cursor-pointer"
              >
                Tư vấn chương trình học
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}