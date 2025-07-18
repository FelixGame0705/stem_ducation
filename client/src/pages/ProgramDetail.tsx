"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Target, Users } from "lucide-react";
import Link from "next/link";
import type { Program } from "@shared/schema";

export default function ProgramDetail() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const {
    data: program,
    isLoading,
    error,
  } = useQuery<Program>({
    queryKey: ["/api/programs", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await fetch(`/api/programs/${slug}`);
      if (!res.ok) throw new Error("Không tìm thấy chương trình");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy chương trình
            </h1>
            <Link href="/chuong-trinh-hoc">
              <Button className="bg-ocean-blue text-white hover:bg-blue-700">
                Quay lại danh sách chương trình
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const colorClasses = {
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    pink: "bg-pink-100 text-pink-800",
    indigo: "bg-indigo-100 text-indigo-800",
    red: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/chuong-trinh-hoc">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
          />

          <div className="p-8">
            <div className="mb-6">
              <Badge
                className={
                  colorClasses[program.color as keyof typeof colorClasses] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {program.ageRange}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {program.title}
            </h1>

            <p className="text-lg text-gray-600 mb-8">{program.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-ocean-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Độ tuổi</h3>
                  <p className="text-gray-600">{program.ageRange}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="w-8 h-8 text-ocean-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Thời lượng
                  </h3>
                  <p className="text-gray-600">12 buổi học</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-ocean-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Mục tiêu</h3>
                  <p className="text-gray-600">Thực hành</p>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mục tiêu học tập
              </h2>
              <p className="text-gray-600">{program.objectives}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/lien-he">
                <Button className="bg-accent-orange text-white hover:bg-orange-600">
                  Đăng ký học thử miễn phí
                </Button>
              </Link>
              <Button
                asChild
                variant="outline"
                className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white"
              >
                <a
                  href="https://www.facebook.com/profile.php?id=61577624084677"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tư vấn chương trình
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}