"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Mail } from "lucide-react";
import { useEffect, useState } from "react";
export default function Careers() {
    const [jobs, setJobs] = useState([]);
    useEffect(() => {
        fetch("/api/recruitments")
            .then((res) => res.json())
            .then((data) => setJobs(data.recruitments || []));
    }, []);
    return (<div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tuyển dụng
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tham gia đội ngũ STEM Center để cùng xây dựng tương lai giáo dục
          </p>
        </div>

        {/* Why Join Us */}
        <div className="bg-white rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Tại sao chọn STEM Center?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Badge className="w-8 h-8 text-white"/>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Môi trường sáng tạo
              </h3>
              <p className="text-gray-600">
                Làm việc trong môi trường năng động, được khuyến khích sáng tạo và phát triển ý tưởng mới
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white"/>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đãi ngộ hấp dẫn
              </h3>
              <p className="text-gray-600">
                Mức lương cạnh tranh, thưởng theo hiệu quả và các chế độ phúc lợi tốt
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white"/>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Phát triển nghề nghiệp
              </h3>
              <p className="text-gray-600">
                Cơ hội học hỏi, đào tạo chuyên sâu và thăng tiến trong sự nghiệp
              </p>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs.map((job, index) => {
            var _a, _b, _c, _d;
            return (<Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge className={job.type === "Toàn thời gian" || job.type === "full-time"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"}>
                        {job.type}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1"/>
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <DollarSign className="w-4 h-4 mr-1"/>
                        {job.salary}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {job.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Yêu cầu:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {typeof job.requirements === 'string'
                    ? job.requirements.split('\n').map((req, i) => (<li key={i} className="flex items-start">
                                  <span className="text-ocean-blue mr-2">•</span>
                                  {req}
                                </li>))
                    : (_b = (_a = job.requirements) === null || _a === void 0 ? void 0 : _a.map) === null || _b === void 0 ? void 0 : _b.call(_a, (req, i) => (<li key={i} className="flex items-start">
                                  <span className="text-ocean-blue mr-2">•</span>
                                  {req}
                                </li>))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Quyền lợi:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {typeof job.benefits === 'string'
                    ? job.benefits.split('\n').map((benefit, i) => (<li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {benefit}
                                </li>))
                    : (_d = (_c = job.benefits) === null || _c === void 0 ? void 0 : _c.map) === null || _d === void 0 ? void 0 : _d.call(_c, (benefit, i) => (<li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {benefit}
                                </li>))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <Button className="bg-ocean-blue text-white hover:bg-blue-700 mb-4">
                      <Mail className="w-4 h-4 mr-2"/>
                      Ứng tuyển ngay
                    </Button>
                    {job.url ? (<Button asChild variant="outline" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white">
                        <a href={job.url} target="_blank" rel="noopener noreferrer">Tìm hiểu thêm</a>
                      </Button>) : (<Button variant="outline" className="border-ocean-blue text-ocean-blue hover:bg-ocean-blue hover:text-white" disabled>
                        Tìm hiểu thêm
                      </Button>)}
                  </div>
                </div>
              </CardContent>
            </Card>);
        })}
        </div>

        {/* Contact */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Không tìm thấy vị trí phù hợp? Hãy gửi CV của bạn cho chúng tôi!
          </p>
          <Button className="bg-accent-orange text-white hover:bg-orange-600">
            Gửi CV tự do
          </Button>
        </div>
      </div>
    </div>);
}
