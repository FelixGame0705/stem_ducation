"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Lightbulb } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Header() {
    const pathname = usePathname();
    const navigation = [
        { name: "Chương trình học", href: "/chuong-trinh-hoc" },
        { name: "Học viên tiêu biểu", href: "/hoc-vien-tieu-bieu" },
        { name: "Tin tức", href: "/tin-tuc" },
        { name: "Sự kiện", href: "/su-kien" },
        { name: "Về chúng tôi", href: "/ve-chung-toi" },
        { name: "Tuyển dụng", href: "/tuyen-dung" },
    ];
    return (<header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white"/>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">
              Bright Way Vietnam
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (<Link key={item.name} href={item.href} className={`font-medium transition-colors ${pathname === item.href
                ? "text-ocean-blue"
                : "text-gray-700 hover:text-ocean-blue"}`}>
                {item.name}
              </Link>))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link href="/lien-he" className="inline-block">
              <Button className="bg-ocean-blue text-white hover:bg-blue-700">
                Đăng ký học thử
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-6 h-6"/>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navigation.map((item) => (<Link key={item.name} href={item.href} className={`font-medium transition-colors py-2 ${pathname === item.href
                ? "text-ocean-blue"
                : "text-gray-700 hover:text-ocean-blue"}`}>
                      {item.name}
                    </Link>))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>);
}
