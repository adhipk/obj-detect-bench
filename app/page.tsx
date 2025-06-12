import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Zap className="h-6 w-6" />
            <span>ObjectDetectX</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
            <Link href="/docs" className="text-sm font-medium hover:underline underline-offset-4">
              Documentation
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Test Object Detection Models in Real-time
                </h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Compare YOLO and EfficientNet performance directly in your browser. No installation required.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Webcam Detection</CardTitle>
                  <CardDescription>Use your webcam for real-time object detection</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Link href="/detection/webcam">
                    <Button size="lg" className="gap-2">
                      <Camera className="h-5 w-5" />
                      Start Webcam Detection
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Image Upload</CardTitle>
                  <CardDescription>Upload images to test detection models</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Link href="/detection/upload">
                    <Button size="lg" className="gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Images
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            <div className="mx-auto max-w-5xl space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold">Supported Models</h2>
                <p className="text-muted-foreground">Test and compare these state-of-the-art object detection models</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>YOLO (You Only Look Once)</CardTitle>
                    <CardDescription>Fast and accurate single-stage object detection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Real-time detection capabilities</li>
                      <li>High accuracy with minimal latency</li>
                      <li>Detects multiple objects in a single pass</li>
                      <li>Optimized for browser performance</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>EfficientNet</CardTitle>
                    <CardDescription>Scalable and efficient neural network architecture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Balanced accuracy and computational efficiency</li>
                      <li>Optimized model scaling</li>
                      <li>Excellent feature extraction capabilities</li>
                      <li>Adaptable to various detection tasks</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ObjectDetectX. All rights reserved.
          </p>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-xs hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
