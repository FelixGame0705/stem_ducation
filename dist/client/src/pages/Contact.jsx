"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";
export default function Contact() {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(insertContactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });
    const contactMutation = useMutation({
        mutationFn: async (data) => {
            const response = await apiRequest("POST", "/api/contacts", data);
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Thành công!",
                description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
            });
            form.reset();
        },
        onError: () => {
            toast({
                title: "Lỗi!",
                description: "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.",
                variant: "destructive",
            });
        },
    });
    const onSubmit = async (data) => {
        // Luôn trigger validate trước khi gửi
        const valid = await form.trigger();
        if (!valid) {
            toast({
                title: "Thiếu thông tin!",
                description: "Vui lòng điền đầy đủ các trường bắt buộc trước khi gửi.",
                variant: "destructive",
            });
            return;
        }
        try {
            const res = await fetch("/api/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok)
                throw new Error("Lỗi gửi contact");
            const result = await res.json();
            console.log("Gửi contact thành công:", result);
            toast({
                title: "Thành công!",
                description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.",
            });
            form.reset();
        }
        catch (err) {
            console.error("Gửi contact thất bại:", err);
            toast({
                title: "Lỗi!",
                description: "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.",
                variant: "destructive",
            });
        }
    };
    return (<div className="min-h-screen py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hãy để lại thông tin để được tư vấn chi tiết về các chương trình học STEM
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Gửi tin nhắn cho chúng tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field, fieldState }) => (<FormItem>
                            <FormLabel>Họ và tên *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập họ và tên" {...field} className={fieldState.invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>)}/>
                      <FormField control={form.control} name="phone" render={({ field, fieldState }) => (<FormItem>
                            <FormLabel>Số điện thoại *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập số điện thoại" {...field} className={fieldState.invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>)}/>
                    </div>

                    <FormField control={form.control} name="email" render={({ field, fieldState }) => (<FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập địa chỉ email" type="email" {...field} className={fieldState.invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>)}/>

                    <FormField control={form.control} name="subject" render={({ field, fieldState }) => (<FormItem>
                          <FormLabel>Chủ đề *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập chủ đề" {...field} className={fieldState.invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>)}/>

                    <FormField control={form.control} name="message" render={({ field, fieldState }) => (<FormItem>
                          <FormLabel>Nội dung *</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Nhập nội dung tin nhắn..." rows={6} {...field} className={fieldState.invalid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>)}/>

                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 w-full cursor-pointer transition-transform" disabled={contactMutation.isPending}>
                      {contactMutation.isPending ? "Đang gửi..." : "Gửi tin nhắn"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin liên hệ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-ocean-blue mr-3 mt-0.5"/>
                    <div>
                      <p className="font-medium text-gray-900">Địa chỉ</p>
                      <p className="text-gray-600 text-sm">
                        123 Đường ABC, Quận 1, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-ocean-blue mr-3 mt-0.5"/>
                    <div>
                      <p className="font-medium text-gray-900">Điện thoại</p>
                      <p className="text-gray-600 text-sm">(028) 1234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-ocean-blue mr-3 mt-0.5"/>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600 text-sm">
                        contact@stemcenter.edu.vn
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-ocean-blue mr-3 mt-0.5"/>
                    <div>
                      <p className="font-medium text-gray-900">Giờ làm việc</p>
                      <p className="text-gray-600 text-sm">
                        Thứ 2 - Thứ 6: 8:00 - 17:00<br />
                        Thứ 7: 8:00 - 12:00<br />
                        Chủ nhật: Nghỉ
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Đăng ký học thử
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Để con được trải nghiệm buổi học thử miễn phí tại STEM Center
                </p>
                <Button asChild className="w-full bg-orange-500 text-white hover:bg-orange-600 cursor-pointer transition-transform">
                  <a href="/lien-he">Đăng ký ngay</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Theo dõi chúng tôi
                </h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-ocean-blue transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-ocean-blue transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-ocean-blue transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>);
}
