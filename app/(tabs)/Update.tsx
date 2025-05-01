import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import detectImage from '../service/detechService';
import { Video } from 'expo-av';

const UploadScreen: React.FC = () => {
  const [mediaData, setMediaData] = useState<{
    type: 'image' | 'video' | null;
    uri: string | null;
    signs: string[];
  }>({
    type: null,
    uri: null,
    signs: [],
  });

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Cần cấp quyền để truy cập thư viện ảnh/video!');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!res.canceled) {
      try {
        const result = await detectImage(res.assets[0].uri);
        if (result) {
          if (result.processed_image) {
            setMediaData({
              type: 'image',
              uri: `data:image/jpeg;base64,${result.processed_image}`,
              signs: result.list_traffic_sign_detech || [],
            });
          } else if (result.processed_video) {

            const videoUrl = `https://69f3-2405-4802-bc3d-4a70-1892-2a27-74af-487f.ngrok-free.app/${result.processed_video}`;
            setMediaData({
              type: 'video',
              uri: videoUrl,
              signs: result.list_traffic_sign_detech || [],
            });
          }
        }
      } catch (err: any) {
        Alert.alert('Lỗi', 'Không thể xử lý tệp: ' + err.message);
      }
    }
  };

  const checkVideoUrl = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log('Video URL status:', response.status);
      return response.ok;
    } catch (err) {
      console.error('Error checking video URL:', err);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mediaData.type === 'image' && mediaData.uri && (
          <View style={styles.mediaFrame}>
            <Image
              source={{ uri: mediaData.uri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}

        {mediaData.type === 'video' && mediaData.uri && (
          <View style={styles.mediaFrame}>
         <Video
          source={{ uri: mediaData.uri }}
          style={styles.video}
          useNativeControls
          isLooping
          shouldPlay={false}
          onError={(err) => {
            console.error('Video error:', err);
            Alert.alert('Lỗi video', 'Không thể phát video: ' + JSON.stringify(err));
            checkVideoUrl(mediaData.uri!);
          }}
          onLoad={() => {
            console.log('Video loaded successfully');
            checkVideoUrl(mediaData.uri!);
          }}
          onLoadStart={() => console.log('Video loading started')}
/>
        </View>
        )}

        {mediaData.signs.length > 0 && (
          <View style={styles.signsContainer}>
            <Text style={styles.signsTitle}>Biển báo phát hiện:</Text>
            {mediaData.signs.map((sign, index) => (
              <Text key={index} style={styles.signText}>
                - {sign}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={pickMedia}>
          <Text style={styles.buttonText}>Chọn ảnh hoặc video từ thư viện</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  mediaFrame: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  signsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  signsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  signText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default UploadScreen;

