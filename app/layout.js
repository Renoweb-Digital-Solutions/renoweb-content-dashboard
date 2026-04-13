import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CMSNavbar from "@/components/CMSNavbar";
import { NetworkProvider } from "@/lib/networkContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Renoweb CMS",
  description: "This is a content dashboard for renoweb so that people can easily upload content like case studies, blogs and research hub stuffs.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NetworkProvider>

          <CMSNavbar />
          {children}
        </NetworkProvider>
      </body>
    </html >
  );
}
