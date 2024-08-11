import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-14 ${inter.className} text-center overflow-x-hidden`}
    >
      {children}
    </main>
  );
}
