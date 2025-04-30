import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import detectImage from '../service/detechService';

const UploadScreen: React.FC = () => {
  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Cần cấp quyền để truy cập thư viện ảnh/video!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      await detectImage(result.assets); // Gửi ảnh/video cho detect
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Chọn ảnh hoặc video từ thư viện" onPress={pickMedia} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default UploadScreen;
