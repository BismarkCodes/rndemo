/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {Colors} from './src/constants/colors';
import HastagInput from './src/demos/hastagInput/HastagInput';
import URLPreview from './src/demos/url preview/index';
import {useChangeAndroidNavbarColor} from './src/functions/hooks/useChangeAndroidNavbarColor';

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
      <URLPreview />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
