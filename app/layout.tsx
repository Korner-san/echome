import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";

const varelaRound = Varela_Round({
  weight: '400',
  subsets: ['latin', 'hebrew'],
  display: 'swap',
  variable: '--font-varela-round',
});

export const metadata: Metadata = {
  title: "EchoMe - המרחב הבטוח שלך להתפתחות אישית",
  description: "EchoMe - הקול שלך למסע של התפתחות אישית",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${varelaRound.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
