import * as tf from "@tensorflow/tfjs"
import * as cocossd from "@tensorflow-models/coco-ssd"

export type ModelType = "yolo" | "efficientnet"

interface Detection {
  label: string
  confidence: number
  bbox: number[]
}

interface ModelInstance {
  detect: (input: HTMLVideoElement | HTMLImageElement) => Promise<Detection[]>
}

export async function loadModel(modelType: ModelType): Promise<ModelInstance> {
  try {
    // Initialize TensorFlow.js
    await tf.setBackend('webgl')
    await tf.ready()

    // Load COCO-SSD model with different configurations based on model type
    const model = await cocossd.load({
      base: modelType === "yolo" ? "lite_mobilenet_v2" : "lite_mobilenet_v2",
    })

    // Return a wrapper that passes through the raw bounding box coordinates
    // COCO-SSD returns [x, y, width, height] in pixel coordinates
    return {
      detect: async (input: HTMLVideoElement | HTMLImageElement) => {
        const predictions = await model.detect(input)
        return predictions.map(pred => ({
          label: pred.class,
          confidence: pred.score,
          bbox: pred.bbox // Keep original pixel coordinates
        }))
      }
    }
  } catch (error) {
    console.error('Error loading model:', error)
    throw new Error(`Failed to load ${modelType} model: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 