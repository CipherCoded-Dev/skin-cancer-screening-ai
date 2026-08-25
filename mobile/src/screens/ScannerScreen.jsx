import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import CameraReticle from "../components/CameraReticle";
import { useCameraQuality } from "../hooks/useCameraQuality";
import { useScreening } from "../hooks/useScreening";
import { COLORS, DISCLAIMER_TEXT } from "../../constants/theme";

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedUri, setCapturedUri] = useState(null);
  const { warning } = useCameraQuality();
  const { isLoading, error, runScreening } = useScreening();

  if (!permission) {
    return <View style={styles.center} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>
          DermaScan AI needs camera access to screen a lesion photo.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      setCapturedUri(photo.uri);
    } catch (err) {
      Alert.alert("Capture failed", err.message || "Could not take photo.");
    }
  };

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.length) {
      setCapturedUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!capturedUri) return;
    try {
      const response = await runScreening(capturedUri);
      navigation.navigate("Result", { result: response, originalUri: capturedUri });
    } catch (err) {
      Alert.alert(
        "Screening failed",
        err.message ||
          "Could not reach the DermaScan AI server. Check that the backend is running and the API_BASE_URL in constants/theme.js matches your machine's IP."
      );
    }
  };

  const handleRetake = () => setCapturedUri(null);

  if (capturedUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedUri }} style={styles.preview} resizeMode="cover" />

        {isLoading ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Analyzing lesion...</Text>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Run Screening</Text>
            </TouchableOpacity>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <CameraReticle warning={warning} />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.galleryButton} onPress={handlePickFromGallery}>
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <View style={styles.galleryButton} />
      </View>

      <Text style={styles.disclaimer}>{DISCLAIMER_TEXT}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 24,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  galleryButton: {
    width: 60,
    alignItems: "center",
  },
  galleryButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  actionRow: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#fff",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 15,
  },
  permissionText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  disclaimer: {
    position: "absolute",
    bottom: 8,
    left: 16,
    right: 16,
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    textAlign: "center",
  },
  errorText: {
    position: "absolute",
    bottom: 110,
    left: 24,
    right: 24,
    color: COLORS.danger,
    textAlign: "center",
    fontSize: 13,
  },
});