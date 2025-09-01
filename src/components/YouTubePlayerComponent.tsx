import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Platform } from 'react-native';
import YoutubePlayer, { PLAYER_STATES  } from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import type { YoutubeIframeMethods } from "react-native-youtube-iframe"; // 👈 type is here

// import YoutubePlayer, { YoutubeIframeRef } from "react-native-youtube-iframe";



const VIDEO_URL_KEY = 'video_url';
const VIDEO_POSITION_KEY = 'video_position';
const VIDEO_TIMESTAMP_KEY = 'video_timestamp';

export default function YouTubePlayerComponent({
  savedUrl,
  setSavedUrl,
  position,
  setPosition,
  playing,
  setPlaying,
  onPress,
}: {
  savedUrl: string | null;
  setSavedUrl: (url: string | null) => void;
  position: number;
  setPosition: (pos: number) => void;
  playing: boolean;
  setPlaying: (p: boolean) => void;
  onPress?: () => void;
}) {  
  const [url, setUrl] = useState('');
  // const [savedUrl, setSavedUrl] = useState<string | null>(null);
  // const [position, setPosition] = useState(0);
  // const [playing, setPlaying] = useState(true); 
  //const playerRef = useRef<any>(null);
  const playerRef = useRef<YoutubeIframeMethods>(null);

  const autoplayAttempts = useRef(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();


  useEffect(() => {
    const loadVideo = async () => {
      try {
        const storedUrl = await AsyncStorage.getItem(VIDEO_URL_KEY);
        const storedPosition = await AsyncStorage.getItem(VIDEO_POSITION_KEY);
        const storedTimestamp = await AsyncStorage.getItem(VIDEO_TIMESTAMP_KEY);
        if (storedUrl) {
          setSavedUrl(storedUrl);
          if (storedPosition && storedTimestamp) {
            const elapsed = (Date.now() - parseInt(storedTimestamp)) / 1000;
            const calculatedPosition = Math.max(0, Number(storedPosition) + elapsed);
            setPosition(Math.floor(calculatedPosition));
          }
        }
      } catch (error) {
        console.log('Error loading video data:', error);
      }
    };
    loadVideo();
  }, []);

 

  const handleSave = async () => {
    if (!url.trim()) return;
    try {
      setSavedUrl(url);
      setPosition(0);
      setPlaying(true);
      autoplayAttempts.current = 0;
      await AsyncStorage.setItem(VIDEO_URL_KEY, url);
      await AsyncStorage.setItem(VIDEO_POSITION_KEY, '0');
      await AsyncStorage.setItem(VIDEO_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.log('Error saving video:', error);
    }
  };

  const handleEdit = async () => {
    try {
      //setSavedUrl(null);
      //setUrl('');
      setPosition(0);
      setPlaying(false);
      if (progressInterval.current) clearInterval(progressInterval.current);
      await AsyncStorage.removeItem(VIDEO_URL_KEY);
      await AsyncStorage.removeItem(VIDEO_POSITION_KEY);
      await AsyncStorage.removeItem(VIDEO_TIMESTAMP_KEY);
      onPress && onPress();
    } catch (error) {
      console.log('Error clearing video data:', error);
    }
  };

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(async () => {
      if (playerRef.current && playing) {
        try {
          const currentTime = await playerRef.current.getCurrentTime();
          if (currentTime > 0) {
            await AsyncStorage.setItem(VIDEO_POSITION_KEY, Math.floor(currentTime).toString());
            await AsyncStorage.setItem(VIDEO_TIMESTAMP_KEY, Date.now().toString());
          }
        } catch (error) {
          console.log('Error tracking progress:', error);
        }
      }
    }, 2000);
  }, [playing]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  }, []);
  useEffect(() => {
    if (!isFocused) {
      stopProgressTracking();  
      setPlaying(false);        
    } else {
      setPlaying(true);         
    }
  }, [isFocused, stopProgressTracking]);

  const onReady = useCallback(() => {
    console.log('YouTube player ready');
    playerRef.current?.seekTo(30, true)
    console.log('YouTube player startttt');
    setPlaying(true); 
  }, []);

  const onChangeState = useCallback(
    async (state: string) => {
      console.log('YouTube player state changed:', state);

      switch (state) {
        case PLAYER_STATES.PLAYING:
          setPlaying(true);
          autoplayAttempts.current = 0;
          startProgressTracking();
          break;

        case PLAYER_STATES.PAUSED:
          setPlaying(false);
          stopProgressTracking();
          break;

        case PLAYER_STATES.ENDED:
          setPlaying(false);
          stopProgressTracking();
          try {
            await AsyncStorage.setItem(VIDEO_POSITION_KEY, '0');
            await AsyncStorage.setItem(VIDEO_TIMESTAMP_KEY, Date.now().toString());
          } catch (error) {
            console.log('Error saving end state:', error);
          }
          break;

        case PLAYER_STATES.BUFFERING:
          startProgressTracking();
          break;
      }
      
    },
    [startProgressTracking, stopProgressTracking]
  );

  const onError = useCallback(
    (error: string) => {
      console.log('YouTube player error:', error);
      stopProgressTracking();

      setTimeout(() => setPlaying(true), 2000); 
    },
    [stopProgressTracking]
  );

  const handleManualPlay = useCallback(() => {
    setPlaying(!playing);
    autoplayAttempts.current = 0;
  }, [playing]);

  useEffect(() => {
    return () => stopProgressTracking();
  }, [stopProgressTracking]);

  // Extract Video ID
  const getVideoId = (youtubeUrl: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern);
      if (match) return match[1];
    }
    return youtubeUrl;
  };

  if (!savedUrl) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add YouTube Video</Text>
        <TextInput
          placeholder="Enter YouTube URL or Video ID"
          value={url}
          onChangeText={setUrl}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button title="Save Video" onPress={handleSave} />
      </View>
    );
  }

  const videoId = getVideoId(savedUrl);

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={Platform.OS === 'web' ? 400 : 220}
        play={playing}
        videoId={videoId}
        initialPlayerParams={{
          start: Math.floor(position),
          controls: true,
          modestbranding: true,
          rel: false,
          autoplay: 1,
          mute: 1, 
          playsinline: 1,
          fs: 1,
        }}
        forceAndroidAutoplay={true}
        allowsFullscreenVideo={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onReady={onReady}
        onChangeState={onChangeState}
        onError={onError}
        webViewStyle={
          Platform.OS === 'web'
            ? { opacity: 0.99, backgroundColor: 'transparent' }
            : undefined
        }
        webViewProps={{
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
          domStorageEnabled: true,
          javaScriptEnabled: true,
        }}
        allow="autoplay; encrypted-media"
      />

      <View style={styles.buttonContainer}>
        <Button title="Edit Video" onPress={handleEdit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    gap: 10,
  },
  debugText: { marginTop: 8, color: '#666', fontSize: 12, textAlign: 'center' },
});
