import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
export default function Hero() {
    return (<section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Khám phá thế giới <span className="text-yellow-300">STEM</span>{" "}
              cùng con
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Trung tâm giáo dục STEM hàng đầu với các chương trình Otto Robot,
              Microbit, Python, AI và Cloud Computing dành cho học sinh tiểu học
              và THCS
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/lien-he">
                <Button className="bg-orange-500 text-white px-8 py-3 hover:bg-orange-600 font-semibold cursor-pointer">
                  Đăng ký học thử miễn phí
                </Button>
              </Link>
              <Link href="/chuong-trinh-hoc">
                <Button variant="outline" className="border-2 border-white text-blue-500 px-8 py-3 hover:bg-white hover:text-blue-600 font-semibold cursor-pointer">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" alt="Students learning STEM in modern classroom" className="rounded-xl shadow-2xl w-full h-auto"/>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600"/>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900">
                    500+
                  </div>
                  <div className="text-xs text-gray-600">
                    Học viên thành công
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
