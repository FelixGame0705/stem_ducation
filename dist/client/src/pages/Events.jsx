"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";
export default function Events() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const { data, isLoading } = useQuery({
        queryKey: ["/api/events", activeTab],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (activeTab === "upcoming")
                params.append("upcoming", "true");
            const res = await fetch(`/api/events?${params}`);
            return res.json();
        },
    });
    const events = (data === null || data === void 0 ? void 0 : data.events) || [];
    return (<div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sự kiện
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tham gia các sự kiện STEM thú vị và bổ ích
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)} className="mb-6">
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
            <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (<Skeleton key={i} className="h-48 w-full rounded-xl"/>))}
          </div>) : events.length === 0 ? (<div className="text-center text-gray-500 py-12">
            {activeTab === "upcoming"
                ? "Không có sự kiện sắp tới."
                : "Không có sự kiện nào."}
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {events.map((event) => (<div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded-lg mb-4"/>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>

                  <div className="text-sm text-gray-500 space-y-1 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1"/>
                      {new Date(event.startDate).toLocaleDateString("vi-VN")} – {new Date(event.endDate).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1"/>
                      {event.location}
                    </div>
                  </div>

                  {event.registrationRequired && (<Badge className="bg-orange-100 text-orange-800 text-xs mb-2">
                      Cần đăng ký
                    </Badge>)}
                </div>
                <Button asChild className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer py-3 text-lg font-medium">
                  <Link href={`/su-kien/${event.slug}`}>
                    Tìm hiểu thêm
                  </Link>
                </Button>
              </div>))}
          </div>)}
      </div>
    </div>);
}
