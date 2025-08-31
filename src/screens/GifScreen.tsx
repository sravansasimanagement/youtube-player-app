import React from 'react';
import { View, Button, StyleSheet, Image } from 'react-native';

const GifScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif' }}
        style={{ width: 300, height: 300 }}
      />
      <Button title="BACK" onPress={() => navigation.navigate('Video')} />
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

export default GifScreen;
