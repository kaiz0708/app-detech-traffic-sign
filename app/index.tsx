import React, { useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import { TouchableOpacity, Text, SafeAreaView } from 'react-native';

let typeCamera : CameraType = "back"

const Home: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const [hideDetech, setHideDetech] = useState(false)

  const takePicture = async (hideDetech : boolean) => {
    setHideDetech(hideDetech)
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Ảnh URI:', photo?.uri);
      Alert.alert('Thành công', 'Ảnh đã được chụp & xử lý');
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Button title="Cấp quyền camera" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {hideDetech ? (
        <CameraView ref={cameraRef} style={styles.camera} facing={typeCamera} />
      ) : (
        <View style={styles.camera} />
      )}
  
      <View style={stylesButton.buttonRow}>
        <TouchableOpacity style={stylesButton.buttonSub} onPress={() => takePicture(!hideDetech)}>
          <Text style={stylesButton.buttonText}>Bắt đầu detect</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={stylesButton.buttonSub} onPress={() => router.push('/Camera')}>
          <Text style={stylesButton.buttonText}>Detech ảnh và video</Text>
        </TouchableOpacity>
  
        <TouchableOpacity style={stylesButton.buttonSub} onPress={() => router.push('/Update')}>
          <Text style={stylesButton.buttonText}>Tải ảnh / video</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  const stylesButton = StyleSheet.create({
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
      backgroundColor: '#fff',
    },
    buttonSub: {
      backgroundColor: '#007AFF', // màu xanh iOS
      borderRadius: 10,
      paddingVertical: 10,
      width: '30%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 14,
    },
  });

export default Home;