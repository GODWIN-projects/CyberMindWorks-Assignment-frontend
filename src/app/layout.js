import {  Inter } from "next/font/google";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin",]
})


export const metadata = {
  title: "Job Openings",
  description: "Job Openings",
  icons: {
    icon: "tesla.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <MantineProvider withGlobalClasses withNormalizeCSS>
          <DatesProvider>
            {children}
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
