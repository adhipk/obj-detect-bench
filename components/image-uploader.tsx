"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (file: File) => void
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0])
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-lg font-medium mb-2">Drag and drop an image</p>
      <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
      <Button variant="outline" asChild>
        <label className="cursor-pointer">
          Select Image
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </Button>
    </div>
  )
}
