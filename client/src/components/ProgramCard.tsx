import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Program } from "@shared/schema";
import Link from "next/link";

interface ProgramCardProps {
  program: Program;
}

const colorClasses = {
  purple: "bg-purple-100 text-purple-800",
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  pink: "bg-pink-100 text-pink-800",
  indigo: "bg-indigo-100 text-indigo-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
  gray: "bg-gray-100 text-gray-800",
};

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <img 
          src={program.image}
          alt={program.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <div className="mb-4">
          <Badge className={colorClasses[program.color as keyof typeof colorClasses] || "bg-gray-100 text-gray-800"}>
            {program.ageRange}
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
        <p className="text-gray-700 mb-4">{program.description}</p>
        <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-700">
          <Link href={`/chuong-trinh-hoc/${program.slug}`}>
            Xem chi tiết
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}