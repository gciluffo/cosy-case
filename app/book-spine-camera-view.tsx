import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Text } from "@/components/ui/text";
import BoundingBoxOverlay from "../components/BoundingBoxOverlay";

function tensorToString(tensor: Tensor): string {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
}
function modelToString(model: TensorflowModel): string {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join("")}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join("")}`
  );
}

const ObjectDetectionCamera = () => {
  const [boundingBoxes, setBoundingBoxes] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);
  const objectDetection = useTensorflowModel(
    require("../assets/models/spine_model_float16.tflite")
  );
  const model =
    objectDetection.state === "loaded" ? objectDetection.model : undefined;

  const { resize } = useResizePlugin();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();

  React.useEffect(() => {
    if (model == null) return;
    console.log("Model Input Tensor:", model.inputs[0]);
  }, [model]);

  // const frameProcessor = useFrameProcessor(
  //   (frame) => {
  //     "worklet";
  //     if (!model) return;

  //     // Resize frame to match model input size
  //     const resized = resize(frame, {
  //       scale: {
  //         width: 192,
  //         height: 192,
  //       },
  //       pixelFormat: "rgb",
  //       dataType: "float32",
  //     });

  //     // Run YOLO inference
  //     const outputs = model.runSync([resized]);

  //     const detection_boxes = outputs[0];
  //     const detection_scores = outputs[2];
  //     const num_detections = outputs[3][0];

  //     let boxes = [];
  //     for (let i = 0; i < num_detections; i++) {
  //       if (detection_scores[i] > 0.6) {
  //         // Adjust confidence threshold
  //         boxes.push({
  //           x: Number(detection_boxes[i * 4]) * frame.width,
  //           y: Number(detection_boxes[i * 4 + 1]) * frame.height,
  //           width:
  //             (Number(detection_boxes[i * 4 + 2]) -
  //               Number(detection_boxes[i * 4])) *
  //             frame.width,
  //           height:
  //             (Number(detection_boxes[i * 4 + 3]) -
  //               Number(detection_boxes[i * 4 + 1])) *
  //             frame.height,
  //         });
  //       }
  //     }
  //     runOnJS(setBoundingBoxes)(boxes);
  //   },
  //   [model]
  // );

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (model == null) {
        // model is still loading...
        return;
      }

      console.log(`Running inference on ${frame}`);
      const resized = resize(frame, {
        scale: {
          width: 640,
          height: 640,
        },
        pixelFormat: "rgb",
        dataType: "float32",
      });
      const outputs = model.runSync([resized]);

      const detections = outputs[0];
      const numDetections = detections.length / 6;
      // console.log(`Number of detections: ${numDetections}`);

      for (let i = 0; i < numDetections; i++) {
        const index = i * 6;
        const x1 = detections[index];
        const y1 = detections[index + 1];
        const x2 = detections[index + 2];
        const y2 = detections[index + 3];
        const score = detections[index + 4];
        const classId = detections[index + 5];

        if (score > 0.95) {
          console.log(
            `Object detected: Class ${classId}, Score ${score}, Box: (${x1}, ${y1}) to (${x2}, ${y2})`
          );
          // Optional: drawRect logic here
        }
      }
    },
    [model]
  );

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const takePicture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        // Show the photo cropped by the bounding box
      } catch (error) {}
    }
  };

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <>
      {device == null ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="black" />
        </View>
      ) : (
        <View style={styles.container}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            isActive={true}
            frameProcessor={frameProcessor}
            device={device}
          />
          <BoundingBoxOverlay boxes={boundingBoxes} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});

export default ObjectDetectionCamera;
