import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

const STORAGE_KEY_URL = "@youtube_video_url";
const STORAGE_KEY_TIME = "@youtube_video_time";

type Nav = NativeStackNavigationProp<RootStackParamList, "Edit">;

const EditScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      const savedUrl = await AsyncStorage.getItem(STORAGE_KEY_URL);
      if (savedUrl) setUrl(savedUrl);
    };
    load();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem(STORAGE_KEY_URL, url);
    await AsyncStorage.setItem(STORAGE_KEY_TIME, Date.now().toString()); 
      //navigation.navigate("Video");
      navigation.goBack(); 
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Enter YouTube Video URL"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default EditScreen;
