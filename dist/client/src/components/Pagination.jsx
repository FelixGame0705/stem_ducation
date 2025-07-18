import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1)
        return null;
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            else {
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }
        return pages;
    };
    return (<div className="flex items-center justify-center space-x-2 mt-8">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4"/>
        Trước
      </Button>
      
      {getPageNumbers().map((page, index) => {
            if (page === "...") {
                return (<span key={index} className="px-2 py-1 text-gray-500">
              ...
            </span>);
            }
            return (<Button key={index} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => onPageChange(page)}>
            {page}
          </Button>);
        })}
      
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Sau
        <ChevronRight className="h-4 w-4"/>
      </Button>
    </div>);
}
