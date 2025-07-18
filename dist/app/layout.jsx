import { Inter } from "next/font/google";
import AppProviders from "../client/src/AppProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata = {
    title: "STEM Center",
    description: "Trung tâm giáo dục STEM cho trẻ em",
};
export default function RootLayout({ children, }) {
    return (<html lang="vi">
      <body className={inter.className}>
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>);
}
