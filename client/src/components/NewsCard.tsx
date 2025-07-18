import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { News } from "@shared/schema";
import Link from "next/link";

interface NewsCardProps {
  news: News;
}

const categoryColors = {
  "TIN TỨC": "bg-blue-600 text-white",
  "SỰ KIỆN": "bg-green-500 text-white",
  "WORKSHOP": "bg-purple-500 text-white",
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
      <img 
        src={news.image} 
        alt={news.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge className={categoryColors[news.category as keyof typeof categoryColors] || "bg-gray-500 text-white"}>
            {news.category}
          </Badge>
          <span className="text-gray-500 text-sm ml-3">
            {new Date(news.publishedAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
        <p className="text-gray-700 text-sm mb-4">{news.excerpt}</p>
        <Link href={`/tin-tuc/${news.slug}`}>
          <span className="text-ocean-blue font-medium hover:text-blue-700 transition-colors cursor-pointer">
            Đọc thêm →
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
