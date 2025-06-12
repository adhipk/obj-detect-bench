"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pause, Play } from "lucide-react"
import { WebcamDetection } from "@/components/webcam-detection"
import { DetectionResults } from "@/components/detection-results"
import { ModelType } from "@/lib/model-loader"

interface Detection {
  label: string
  confidence: number
  bbox: number[]
}

interface PerformanceMetrics {
  fps: number
  inferenceTime: number
}

export default function WebcamDetectionPage() {
  const [selectedModel, setSelectedModel] = useState<ModelType>("yolo")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detections, setDetections] = useState<Detection[]>([])
  const [fps, setFps] = useState(0)
  const [inferenceTime, setInferenceTime] = useState(0)

  const handleDetections = (results: Detection[], metrics: PerformanceMetrics) => {
    setDetections(results)
    setFps(metrics.fps)
    setInferenceTime(metrics.inferenceTime)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Webcam Object Detection</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <WebcamDetection model={selectedModel} isActive={isDetecting} onDetection={handleDetections} />
            </CardContent>
          </Card>
          <div className="flex items-center justify-between mt-4">
            <Button onClick={() => setIsDetecting(!isDetecting)} className="gap-2">
              {isDetecting ? (
                <>
                  <Pause className="h-4 w-4" /> Pause Detection
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start Detection
                </>
              )}
            </Button>
            <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yolo">YOLO</SelectItem>
                <SelectItem value="efficientnet">EfficientNet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="mt-4">
              <DetectionResults detections={detections} />
            </TabsContent>
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">FPS</p>
                      <p className="text-2xl font-bold">{fps.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inference Time</p>
                      <p className="text-2xl font-bold">{inferenceTime.toFixed(2)} ms</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Model</p>
                      <p className="text-xl font-medium">{selectedModel === "yolo" ? "YOLO" : "EfficientNet"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
