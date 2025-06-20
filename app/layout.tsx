import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ObjectDetectX - Real-time Object Detection Testing",
  description: "Test and compare YOLO and EfficientNet object detection models in real-time",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
