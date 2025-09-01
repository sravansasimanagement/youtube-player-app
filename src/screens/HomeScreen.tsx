// 

// HomeScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import YouTubePlayerComponent from '../components/YouTubePlayerComponent';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(true);

  return (
    <View style={styles.container}>
      <YouTubePlayerComponent
        savedUrl={savedUrl}
        setSavedUrl={setSavedUrl}
        position={position}
        setPosition={setPosition}
        playing={playing}
        setPlaying={setPlaying}
        onPress={() => navigation.navigate('Edit')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
