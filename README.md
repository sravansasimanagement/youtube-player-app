# 📺 YouTube Video Player App (React Native + Expo)

A simple **YouTube Video Player** built with **React Native (Expo)** that works on **both mobile and web**.  
The app allows users to enter a YouTube video URL, automatically plays the video, and resumes playback from where the user left off — even if they navigate away and return later.  

Additionally, it includes a **funny GIF page** for extra fun 🎉.

---

## 🚀 Features

- 🎥 Input a **YouTube Video URL** and save it.  
- ▶️ **Autoplay** the video automatically.  
- ⏸️ **Resume playback position**: 
- ✏️ **Edit URL** with an Edit button.  
- 😂 A **GIF page** with a funny animation and BACK button.  
- 📱 Works on **iOS, Android, and Web (via Expo)**.  

---

## 🛠️ Tech Stack

- [Expo](https://expo.dev/)  
- [React Native](https://reactnative.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [React Navigation](https://reactnavigation.org/)  
- [react-native-youtube-iframe](https://github.com/LonelyCpp/react-native-youtube-iframe)  
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)  

---

## 📂 Project Structure

src/
├── App.tsx
├── navigation/
│ └── AppNavigator.tsx
├── screens/
│ ├── HomeScreen.tsx
│ ├── VideoScreen.tsx
│ └── GifScreen.tsx
└── components/
└── YouTubePlayerComponent.tsx


---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/youtube-video-app.git
cd youtube-video-app


2. Install Dependencies
bash
Copy
Edit
npm install
3. Start the App
Run the project with Expo:

For Mobile (Expo Go app):
bash
Copy
Edit
npx expo start

