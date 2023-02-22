import {StyleSheet, View, TextInput, useColorScheme} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

import {Colors} from '../../constants/colors';
import {GlobalStyles} from '../../components/GlobalStyles';
import URLPreviewCard from './URLPreviewCard';
import CustomText from '../../components/text/CustomText';

// obtain url from text using regex. "bismark's portfolio site is bismarkamanor.vercel.app" should return "bismarkamanor.vercel.app"
function findUrls(text: string) {
  const urlRegex =
    /(?:(?:(?:https?|ftp):\/\/)?(?:www\.)?|(?:[a-z0-9]+\.))([a-z0-9]+\.[^\s]{2,}|[a-z0-9]+\.[^\s]{2,}\.[a-z]{2,})\.?/gi;
  let result = text.match(urlRegex);
  return result ? result[0] : '';
}

const URLPreview = (): JSX.Element => {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    updateUrl();
  }, [input]);

  const updateUrl = useDebouncedCallback(() => {
    setUrl(findUrls(input) || '');
  }, 500);

  return (
    <View style={styles.container}>
      <CustomText style={styles.bigText}>URL Preview</CustomText>
      <View style={styles.preview}>
        {/* url preview component */}
        <URLPreviewCard
          url={url.endsWith('.') ? url.substring(0, url.length - 1) : url}
        />
      </View>
      <View
        style={[
          GlobalStyles.input.messageInput.inputContainer,
          {paddingHorizontal: 10},
          isDarkMode && {backgroundColor: Colors.cards.bg.dark},
        ]}>
        <TextInput
          defaultValue={input}
          multiline={true}
          placeholder="Type your message"
          style={[
            GlobalStyles.input.messageInput.textInput,
            styles.input,
            isDarkMode && {color: Colors.text.primary.dark},
            {
              borderBottomColor: isDarkMode
                ? Colors.border.dark
                : Colors.border.light,
            },
          ]}
          onChangeText={setInput}
          placeholderTextColor={Colors.text.placeHolder.light}
        />
      </View>
    </View>
  );
};

export default URLPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  preview: {
    padding: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
  input: {borderBottomWidth: 1, paddingHorizontal: 0},
  text: {
    fontSize: 26,
    color: Colors.text.primary.light,
  },

  bigText: {
    fontWeight: '600',
    fontSize: 50,
    textAlign: 'center',
    paddingVertical: 30,
  },
});
