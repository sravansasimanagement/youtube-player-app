import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import VideoScreen from '../screens/VideoScreen';
import GifScreen from '../screens/GifScreen';
import EditScreen from '../screens/EditScreen';


export type RootStackParamList = {
  Home: undefined;
  Video: undefined;
  GIF: undefined;
  Edit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
    <Stack.Navigator  >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Video" component={VideoScreen} />
      <Stack.Screen name="GIF" component={GifScreen} />
      <Stack.Screen name="Edit" component={EditScreen}  />
    </Stack.Navigator>
  );
};

export default AppNavigator;
