"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload } from "lucide-react"
import { ImageUploader } from "@/components/image-uploader"
import { DetectionResults } from "@/components/detection-results"

export default function ImageUploadPage() {
  const [selectedModel, setSelectedModel] = useState("yolo")
  const [imageUrl, setImageUrl] = useState("")
  const [detections, setDetections] = useState([])
  const [inferenceTime, setInferenceTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (file) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setImageUrl(e.target.result)
      processImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (imageData) => {
    setIsProcessing(true)
    setDetections([])

    try {
      // In a real implementation, we would process the image with the selected model
      // For now, we'll simulate detection results after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate detection results
      const mockDetections = [
        { label: "person", confidence: 0.92, bbox: [0.1, 0.2, 0.3, 0.5] },
        { label: "car", confidence: 0.87, bbox: [0.5, 0.6, 0.2, 0.2] },
      ]

      setDetections(mockDetections)
      setInferenceTime(120 + Math.random() * 50)
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Image Upload Detection</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              {!imageUrl ? (
                <ImageUploader onUpload={handleImageUpload} />
              ) : (
                <div className="relative aspect-video w-full">
                  <Image src={imageUrl || "/placeholder.svg"} alt="Uploaded image" fill className="object-contain" />
                  {/* We would render bounding boxes here in a real implementation */}
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex items-center justify-between mt-4">
            <Button onClick={() => setImageUrl("")} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Upload New Image
            </Button>
            <Select
              value={selectedModel}
              onValueChange={(value) => {
                setSelectedModel(value)
                if (imageUrl) processImage(imageUrl)
              }}
            >
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
              <DetectionResults detections={detections} isLoading={isProcessing} />
            </TabsContent>
            <TabsContent value="performance" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inference Time</p>
                      <p className="text-2xl font-bold">
                        {isProcessing ? "Processing..." : `${inferenceTime.toFixed(2)} ms`}
                      </p>
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
