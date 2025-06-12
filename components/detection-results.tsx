import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function DetectionResults({ detections = [], isLoading = false }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Processing image...</span>
        </CardContent>
      </Card>
    )
  }

  if (!detections.length) {
    return (
      <Card>
        <CardContent className="pt-6 text-center min-h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">No objects detected or start detection to see results</p>
        </CardContent>
      </Card>
    )
  }

  // Group detections by label
  const groupedDetections = detections.reduce((acc, detection) => {
    if (!acc[detection.label]) {
      acc[detection.label] = []
    }
    acc[detection.label].push(detection)
    return acc
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Objects ({detections.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedDetections).map(([label, items]) => (
            <div key={label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="h-4 w-4 rounded-full mr-2"
                    style={{
                      backgroundColor: `hsl(${Math.floor(items[0].confidence * 120)}, 80%, 50%)`,
                    }}
                  />
                  <span className="font-medium">{label}</span>
                </div>
                <span className="text-sm bg-muted px-2 py-1 rounded-md">
                  {items.length > 1 ? `${items.length} instances` : "1 instance"}
                </span>
              </div>
              {items.map((detection, idx) => (
                <div key={idx} className="ml-6 text-sm text-muted-foreground flex justify-between">
                  <span>Instance {idx + 1}</span>
                  <span className="font-mono">{Math.round(detection.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
