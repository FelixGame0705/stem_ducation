"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
export default function EventsDetail() {
    const params = useParams();
    const slug = params === null || params === void 0 ? void 0 : params.slug;
    const { data: event, isLoading, error, } = useQuery({
        queryKey: ["/api/events", slug],
        enabled: !!slug,
        queryFn: async () => {
            const res = await fetch(`/api/events/${slug}`);
            if (!res.ok)
                throw new Error("Không tìm thấy sự kiện");
            return res.json();
        },
    });
    if (isLoading) {
        return (<div className="min-h-screen py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Skeleton className="h-8 w-48"/>
            <Skeleton className="h-64 w-full rounded-xl"/>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32"/>
              <Skeleton className="h-12 w-3/4"/>
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-2/3"/>
            </div>
          </div>
        </div>
      </div>);
    }
    if (error || !event) {
        return (<div className="min-h-screen py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy sự kiện
            </h1>
            <Link href="/su-kien">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer px-8 py-3 text-lg">
                Quay lại danh sách sự kiện
              </Button>
            </Link>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/su-kien">
          <Button variant="ghost" className="mb-8 cursor-pointer px-6 py-3 text-lg">
            <ArrowLeft className="w-5 h-5 mr-2"/>
            Quay lại
          </Button>
        </Link>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover"/>

          <div className="p-8">
            <div className="flex items-center mb-6 gap-4">
              {event.registrationRequired && (<Badge className="bg-orange-100 text-orange-800 text-xs mb-2">
                  Cần đăng ký
                </Badge>)}
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2"/>
                {new Date(event.startDate).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}
                {event.endDate !== event.startDate && (<>
                    {" – "}
                    {new Date(event.endDate).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
                  </>)}
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-2"/>
                {event.location}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {event.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6">{event.description}</p>
          </div>
        </article>

        {event.registrationRequired && (<div className="mt-8 flex justify-center">
            <Link href="/lien-he">
              <Button className="bg-orange-500 text-white hover:bg-orange-600 cursor-pointer px-10 py-4 text-xl font-semibold min-w-[280px]">
                Đăng ký tham gia sự kiện
              </Button>
            </Link>
          </div>)}
      </div>
    </div>);
}
