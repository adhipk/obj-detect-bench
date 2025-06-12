export async function loadModel(modelType) {
  console.log(`Loading ${modelType} model...`)

  // Simulate model loading delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return a mock model object
  return {
    name: modelType,
    detect: async (input) => {
      // Simulate detection
      console.log(`Detecting with ${modelType}...`)

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Return mock detections
      return [
        { label: "person", confidence: 0.92, bbox: [0.1, 0.2, 0.3, 0.5] },
        { label: "car", confidence: 0.87, bbox: [0.5, 0.6, 0.2, 0.2] },
      ]
    },
  }
}
