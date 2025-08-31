import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import YouTubePlayerComponent from '../components/YouTubePlayerComponent';

const STORAGE_KEY_URL = "@youtube_video_url";
const STORAGE_KEY_TIME = "@youtube_video_time";

type Nav = NativeStackNavigationProp<RootStackParamList, "Video">;

const VideoScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const savedUrl = await AsyncStorage.getItem(STORAGE_KEY_URL);
      const savedTime = await AsyncStorage.getItem(STORAGE_KEY_TIME);

      if (savedUrl) {
        const match = savedUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        if (match) setVideoId(match[1]);

        if (savedTime) {
          const elapsed = (Date.now() - Number(savedTime)) / 1000;
          setStartTime(elapsed);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
            <YouTubePlayerComponent onPress={() => navigation.navigate('GIF')} />

    </View>
  );
};

export default VideoScreen;
