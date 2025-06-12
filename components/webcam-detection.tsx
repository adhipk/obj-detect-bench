"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { loadModel, ModelType } from "@/lib/model-loader"

interface Detection {
  label: string
  confidence: number
  bbox: number[]
}

interface PerformanceMetrics {
  fps: number
  inferenceTime: number
}

interface WebcamDetectionProps {
  model: ModelType
  isActive: boolean
  onDetection: (detections: Detection[], metrics: PerformanceMetrics) => void
}

interface ModelInstance {
  detect: (input: HTMLVideoElement | HTMLImageElement) => Promise<Detection[]>
}

export function WebcamDetection({ model, isActive, onDetection }: WebcamDetectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [modelInstance, setModelInstance] = useState<ModelInstance | null>(null)
  const animationRef = useRef<number | null>(null)
  const lastFrameTime = useRef(0)
  const frameCount = useRef(0)
  const fpsInterval = useRef(0)

  // Initialize webcam
  useEffect(() => {
    async function setupWebcam() {
      try {
        // First check if the browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Your browser does not support camera access. Please use a modern browser.')
        }

        // Check if we have permission to access the camera
        const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName })
        if (permissions.state === 'denied') {
          throw new Error('Camera access was denied. Please enable camera access in your browser settings.')
        }

        // Try to get the camera stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        })

        if (!videoRef.current) {
          throw new Error('Video element not found')
        }

        // Set up the video element
        videoRef.current.srcObject = stream
        
        // Wait for the video to be ready
        await new Promise((resolve, reject) => {
          if (!videoRef.current) return reject('Video element not found')
          
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
              .then(resolve)
              .catch(reject)
          }
          
          videoRef.current.onerror = () => {
            reject('Error loading video stream')
          }
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error accessing webcam:", err)
        let errorMessage = "Could not access webcam. "
        
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            errorMessage += "Please allow camera access in your browser settings."
          } else if (err.name === 'NotFoundError') {
            errorMessage += "No camera found. Please connect a camera and try again."
          } else if (err.name === 'NotReadableError') {
            errorMessage += "Camera is in use by another application. Please close other applications using the camera."
          } else {
            errorMessage += err.message
          }
        }
        
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    setupWebcam()

    return () => {
      // Clean up the video stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => {
          track.stop()
        })
        videoRef.current.srcObject = null
      }
    }
  }, [])

  // Load model
  useEffect(() => {
    async function initModel() {
      try {
        setIsLoading(true)
        console.log('Starting model load...')
        
        const loadedModel = await loadModel(model)
        console.log('Model loaded successfully')
        setModelInstance(loadedModel)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading model:", err)
        setError(`Failed to load ${model} model: ${err instanceof Error ? err.message : 'Unknown error'}`)
        setIsLoading(false)
      }
    }

    initModel()
  }, [model])

  // Handle detection loop
  useEffect(() => {
    if (!isActive || !modelInstance || !videoRef.current || isLoading) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    lastFrameTime.current = performance.now()
    frameCount.current = 0
    fpsInterval.current = 0

    const detectFrame = async () => {
      if (!videoRef.current || !canvasRef.current || !modelInstance) return

      try {
        const now = performance.now()
        const elapsed = now - lastFrameTime.current

        // Update FPS every second
        if (elapsed > 1000) {
          const fps = frameCount.current / (elapsed / 1000)
          lastFrameTime.current = now
          frameCount.current = 0
          fpsInterval.current = fps
        }

        frameCount.current++

        const startTime = performance.now()

        // Perform detection
        const detections = await modelInstance.detect(videoRef.current)
        const inferenceTime = performance.now() - startTime

        // Draw detections on canvas
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx) return

        const { videoWidth, videoHeight } = videoRef.current

        // Ensure canvas dimensions match video dimensions
        if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
          canvasRef.current.width = videoWidth
          canvasRef.current.height = videoHeight
        }

        // Clear previous frame
        ctx.clearRect(0, 0, videoWidth, videoHeight)

        // Draw current video frame
        ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight)

        // Draw bounding boxes
        ctx.lineWidth = 2
        ctx.font = "bold 14px sans-serif"

        detections.forEach((detection: Detection) => {
          // COCO-SSD returns [x, y, width, height] in pixel coordinates
          const [x, y, width, height] = detection.bbox
          
          // Use the coordinates directly since they're already in pixels
          const boxX = x
          const boxY = y
          const boxWidth = width
          const boxHeight = height

          // Use different colors based on confidence
          const hue = Math.floor(detection.confidence * 120) // 0-120 range from red to green
          const color = `hsl(${hue}, 80%, 50%)`
          const textColor = "#FFFFFF"
          const textBgColor = `hsla(${hue}, 80%, 50%, 0.8)`

          // Draw box
          ctx.strokeStyle = color
          ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

          // Draw label background
          const label = `${detection.label} ${Math.round(detection.confidence * 100)}%`
          const textWidth = ctx.measureText(label).width
          const textHeight = 20
          const textX = Math.max(0, Math.min(boxX, videoWidth - textWidth - 10))
          const textY = Math.max(textHeight, boxY - 5)

          // Draw semi-transparent background for text
          ctx.fillStyle = textBgColor
          ctx.fillRect(textX, textY - textHeight, textWidth + 10, textHeight)

          // Draw text
          ctx.fillStyle = textColor
          ctx.fillText(label, textX + 5, textY - 5)

          // Draw corner markers for better visibility
          const cornerSize = 10
          ctx.fillStyle = color
          
          // Top-left corner
          ctx.fillRect(boxX - 1, boxY - 1, cornerSize, 2)
          ctx.fillRect(boxX - 1, boxY - 1, 2, cornerSize)
          
          // Top-right corner
          ctx.fillRect(boxX + boxWidth - cornerSize + 1, boxY - 1, cornerSize, 2)
          ctx.fillRect(boxX + boxWidth - 1, boxY - 1, 2, cornerSize)
          
          // Bottom-left corner
          ctx.fillRect(boxX - 1, boxY + boxHeight - 1, cornerSize, 2)
          ctx.fillRect(boxX - 1, boxY + boxHeight - cornerSize + 1, 2, cornerSize)
          
          // Bottom-right corner
          ctx.fillRect(boxX + boxWidth - cornerSize + 1, boxY + boxHeight - 1, cornerSize, 2)
          ctx.fillRect(boxX + boxWidth - 1, boxY + boxHeight - cornerSize + 1, 2, cornerSize)
        })

        // Pass detections to parent component
        onDetection(detections, {
          fps: fpsInterval.current,
          inferenceTime,
        })

        animationRef.current = requestAnimationFrame(detectFrame)
      } catch (err) {
        console.error('Error in detection loop:', err)
        setError(`Detection error: ${err instanceof Error ? err.message : 'Unknown error'}`)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      }
    }

    animationRef.current = requestAnimationFrame(detectFrame)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isActive, modelInstance, isLoading, onDetection])

  if (error) {
    return (
      <Card className="p-4">
        <p className="text-red-500">{error}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">To fix this:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li>Check if your camera is connected and working</li>
            <li>Make sure no other application is using the camera</li>
            <li>Check your browser&apos;s camera permissions</li>
            <li>Try using a different browser</li>
          </ul>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="ml-2 text-white">Loading {model} model...</span>
        </div>
      )}
    </div>
  )
}
