"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Eye, Users, Award, BookOpen, Lightbulb } from "lucide-react";

export default function About() {
  const teachers = [
    {
      name: "Thầy Nguyễn Văn A",
      role: "Giám đốc học thuật",
      specialization: "Lập trình Python, AI",
      experience: "10 năm kinh nghiệm",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
    },
    {
      name: "Cô Trần Thị B",
      role: "Giáo viên cấp cao",
      specialization: "Robotics, Microbit",
      experience: "8 năm kinh nghiệm",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b993?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
    },
    {
      name: "Thầy Lê Văn C",
      role: "Giáo viên",
      specialization: "Cloud Computing, DevOps",
      experience: "6 năm kinh nghiệm",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200",
    },
  ];

  const facilities = [
    {
      name: "Phòng lab Robotics",
      description: "Trang bị đầy đủ robot Otto, bộ kit Microbit và các dụng cụ lắp ráp",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Phòng máy tính",
      description: "40 máy tính hiện đại, cài đặt đầy đủ phần mềm lập trình",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
    {
      name: "Phòng học thông minh",
      description: "Màn hình tương tác, hệ thống âm thanh hiện đại",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    },
  ];

  return (
    <div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Về chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ của STEM Center
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-ocean-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Sứ mệnh</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Cung cấp nền tảng giáo dục STEM chất lượng cao, giúp trẻ em phát triển tư duy logic, 
                kỹ năng giải quyết vấn đề và chuẩn bị cho tương lai công nghệ số.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-8 h-8 text-ocean-blue mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Tầm nhìn</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Trở thành trung tâm giáo dục STEM hàng đầu Việt Nam, đào tạo thế hệ trẻ có tư duy 
                sáng tạo và khả năng thích ứng với công nghệ tương lai.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Thành tích của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Học viên</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
              <div className="text-gray-600">Chương trình</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Giải thưởng</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
              <div className="text-gray-600">Năm hoạt động</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Đội ngũ giáo viên
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{teacher.role}</p>
                  <Badge className="bg-ocean-blue text-white mb-2">
                    {teacher.specialization}
                  </Badge>
                  <p className="text-sm text-gray-500">{teacher.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Cơ sở vật chất
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <img 
                    src={facility.image} 
                    alt={facility.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {facility.name}
                  </h3>
                  <p className="text-gray-600">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="bg-accent-orange text-white hover:bg-orange-600 px-8 py-3">
            Đăng ký học thử miễn phí
          </Button>
        </div>
      </div>
    </div>
  );
}
