// import React, { useEffect, useRef, useState } from "react";
// import { ActivityIndicator, StyleSheet, View } from "react-native";
// import {
//   Camera,
//   useCameraDevice,
//   useCameraPermission,
//   useFrameProcessor,
// } from "react-native-vision-camera";
// import { runOnJS } from "react-native-reanimated";
// import {
//   Tensor,
//   TensorflowModel,
//   useTensorflowModel,
// } from "react-native-fast-tflite";
// import { useResizePlugin } from "vision-camera-resize-plugin";
// import { Text } from "@/components/ui/text";
// import BoundingBoxOverlay from "../components/BoundingBoxOverlay";

// function tensorToString(tensor: Tensor): string {
//   return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
// }
// function modelToString(model: TensorflowModel): string {
//   return (
//     `TFLite Model (${model.delegate}):\n` +
//     `- Inputs: ${model.inputs.map(tensorToString).join("")}\n` +
//     `- Outputs: ${model.outputs.map(tensorToString).join("")}`
//   );
// }

// const ObjectDetectionCamera = () => {
//   const [boundingBoxes, setBoundingBoxes] = useState<
//     { x: number; y: number; width: number; height: number }[]
//   >([]);
//   const objectDetection = useTensorflowModel(
//     require("../assets/models/spine_model_float16.tflite")
//   );
//   const model =
//     objectDetection.state === "loaded" ? objectDetection.model : undefined;

//   const { resize } = useResizePlugin();
//   const camera = useRef<Camera>(null);
//   const device = useCameraDevice("back");
//   const { hasPermission, requestPermission } = useCameraPermission();

//   React.useEffect(() => {
//     if (model == null) return;
//     console.log("Model Input Tensor:", model.inputs[0]);
//   }, [model]);

//   const frameProcessor = useFrameProcessor(
//     (frame) => {
//       "worklet";
//       if (model == null) {
//         // model is still loading...
//         return;
//       }

//       console.log(`Running inference on ${frame}`);
//       const resized = resize(frame, {
//         scale: {
//           width: 640,
//           height: 640,
//         },
//         pixelFormat: "rgb",
//         dataType: "float32",
//       });
//       const outputs = model.runSync([resized]);

//       const detections = outputs[0];
//       const numDetections = detections.length / 6;
//       // console.log(`Number of detections: ${numDetections}`);

//       for (let i = 0; i < numDetections; i++) {
//         const index = i * 6;
//         const x1 = detections[index];
//         const y1 = detections[index + 1];
//         const x2 = detections[index + 2];
//         const y2 = detections[index + 3];
//         const score = detections[index + 4];
//         const classId = detections[index + 5];

//         if (score > 0.95) {
//           console.log(
//             `Object detected: Class ${classId}, Score ${score}, Box: (${x1}, ${y1}) to (${x2}, ${y2})`
//           );
//           // Optional: drawRect logic here
//         }
//       }
//     },
//     [model]
//   );

//   React.useEffect(() => {
//     requestPermission();
//   }, [requestPermission]);

//   const takePicture = async () => {
//     if (camera.current) {
//       try {
//         const photo = await camera.current.takePhoto();
//         // Show the photo cropped by the bounding box
//       } catch (error) {}
//     }
//   };

//   if (hasPermission === false) {
//     return (
//       <View style={styles.container}>
//         <Text>No access to camera</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       {device == null ? (
//         <View style={styles.container}>
//           <ActivityIndicator size="large" color="black" />
//         </View>
//       ) : (
//         <View style={styles.container}>
//           <Camera
//             ref={camera}
//             style={StyleSheet.absoluteFill}
//             isActive={true}
//             frameProcessor={frameProcessor}
//             device={device}
//           />
//           <BoundingBoxOverlay boxes={boundingBoxes} />
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     position: "relative",
//   },
// });

// export default ObjectDetectionCamera;

/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Tensor, useTensorflowModel } from "react-native-fast-tflite";
import { runOnJS } from "react-native-reanimated";
import { Svg, Rect } from "react-native-svg";
import { Worklets } from "react-native-worklets-core";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function App(): React.ReactNode {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const model = useTensorflowModel(
    require("../assets/models/spine_model_float16.tflite")
  );
  const actualModel = model.state === "loaded" ? model.model : undefined;

  const { resize } = useResizePlugin();

  const [boxes, setBoxes] = React.useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  const updateBoxes = React.useCallback((newBoxes: typeof boxes) => {
    setBoxes(newBoxes);
  }, []);

  const fn = Worklets.createRunOnJS(updateBoxes);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      if (!actualModel) return;

      const resized = resize(frame, {
        scale: {
          width: 640,
          height: 640,
        },
        pixelFormat: "rgb",
        dataType: "float32",
      });

      const result = actualModel.runSync([resized]);
      const detections = result[0];
      const numDetections = detections.length / 6;
      const newBoxes = [];

      // for (let i = 0; i < numDetections; i++) {
      //   const score = result[2][i];
      //   if (score > 0.6) {
      //     const [y1, x1, y2, x2] = result[0].slice(i * 4, i * 4 + 4); // EfficientDet format is [ymin, xmin, ymax, xmax]
      //     const boundingBox = {
      //       x: x1 * screenWidth,
      //       y: y1 * screenHeight,
      //       width: (x2 - x1) * screenWidth,
      //       height: (y2 - y1) * screenHeight,
      //     };
      //     newBoxes.push(boundingBox);
      //   }
      // }

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
          const boundingBox = {
            x: x1 * screenWidth,
            y: y1 * screenHeight,
            width: (x2 - x1) * screenWidth,
            height: (y2 - y1) * screenHeight,
          };
          newBoxes.push(boundingBox);
        }
      }

      fn(newBoxes);
    },
    [actualModel]
  );

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <View style={styles.container}>
      {hasPermission && device ? (
        <>
          <Camera
            device={device}
            style={StyleSheet.absoluteFill}
            isActive={true}
            frameProcessor={frameProcessor}
            pixelFormat="yuv"
          />
          <Svg style={StyleSheet.absoluteFill}>
            {boxes.map((box, index) => (
              <Rect
                key={index}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke="lime"
                strokeWidth="2"
                fill="transparent"
              />
            ))}
          </Svg>
        </>
      ) : (
        <Text>No Camera available.</Text>
      )}

      {model.state === "loading" && (
        <ActivityIndicator size="small" color="white" />
      )}
      {model.state === "error" && (
        <Text>Failed to load model! {model.error.message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
