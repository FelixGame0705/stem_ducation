import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@shared/schema";

interface StudentCardProps {
  student: Student;
}

const achievementColors = {
  "Giải nhất Olympic Tin học": "bg-yellow-100 text-yellow-800",
  "Dự án xuất sắc": "bg-blue-100 text-blue-800",
  "Ứng dụng Python": "bg-green-100 text-green-800",
};

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="bg-gray-50">
      <CardContent className="p-6 text-center">
        <img 
          src={student.image} 
          alt={student.name}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{student.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{student.grade} - {student.school}</p>
        <Badge className={achievementColors[student.achievement as keyof typeof achievementColors] || "bg-gray-100 text-gray-800"}>
          {student.achievement}
        </Badge>
        <p className="text-sm text-gray-600 mt-3">{student.description}</p>
      </CardContent>
    </Card>
  );
}
