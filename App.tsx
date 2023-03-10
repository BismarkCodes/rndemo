/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  LogBox,
} from 'react-native';
import {Colors} from './src/constants/colors';
import URLPreview from './src/demos/url preview/URLPreview';
import {useChangeAndroidNavbarColor} from './src/functions/hooks/useChangeAndroidNavbarColor';
import VideoPlayer from './src/demos/base64/VideoPlayer';
import Preview from './src/demos';

// Ignore all warning messages
LogBox.ignoreAllLogs(); //Ignore all log notifications

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? Colors.background.dark
      : Colors.background.light,
  };

  useEffect(() => {
    useChangeAndroidNavbarColor(
      isDarkMode ? Colors.cards.bg.dark : Colors.cards.bg.light,
      isDarkMode ? false : true,
    );
  }, []);

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={'default'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {/* <URLPreview /> */}
      <Preview />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
