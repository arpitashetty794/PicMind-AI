import type { Metadata } from "next";
import { IBM_Plex_Sans} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const IBMPlex  = IBM_Plex_Sans({ 
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight:['400','500','600','700']
});

//const geistMono = Geist_Mono({
  //variable: "--font-geist-mono",
  //subsets: ["latin"],
//}); 

export const metadata: Metadata = {
  title: "PicMind-AI",
  description: "AI- powered Image Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={cn("font-IBMPlex antialiased",IBMPlex.variable)}>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
      </body>
    </html>
 </ClerkProvider>  
  );  
}
