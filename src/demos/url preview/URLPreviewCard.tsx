import {
  StyleSheet,
  Animated,
  View,
  useColorScheme,
  Linking,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import cheerio from 'cheerio';
import urljoin from 'url-join';

import {Colors} from '../../constants/colors';
import CustomText from '../../components/text/CustomText';
import FastImage from 'react-native-fast-image';

// add http to the url if it does not exist. Example url 'bismark.com' should return 'http://bismark.com'
function addHTTP(url: string) {
  if (!url.includes('http')) return urljoin('http://', url);
  return url;
}

// get host name. "example.com/bismarkcodes/tutorials" should return "example.com"
function getHostname(url: string) {
  let hostname = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (hostname != null && hostname.length > 2) {
    hostname = hostname[2];
  } else {
    hostname = url.split('/')[0];
  }
  return hostname;
}

const URLPreviewCard: React.FC<{url: string}> = ({url}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const isDarkMode = useColorScheme() === 'dark';
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (url) {
      fetchSiteData(url);
    } else {
      hideAnimation();
    }
  }, [url]);

  // listen show animation when title or description changes
  useEffect(() => {
    showAnimation();
  }, [title, description]);

  function fetchSiteData(url: string) {
    fetch(addHTTP(url.toLowerCase()))
      .then(response => response.text())
      .then(html => {
        const $ = cheerio.load(html);
        let fTitle = $('title').text();
        let fDescription = $('meta[name="description"]').attr('content');
        let fImageUrl =
          $('meta[property="og:image"]').attr('content') ||
          $('img').attr('src') ||
          '';
        setTitle(fTitle);
        setDescription(fDescription);
        setImageUrl(fImageUrl);

        if (fTitle && fDescription) {
          showAnimation();
        }
      })
      .catch(error => {
        hideAnimation();
        resetState();
      });
  }

  function showAnimation() {
    if (url && title && description) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }

  function hideAnimation() {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  function resetState() {
    setTitle('');
    setDescription('');
    setImageUrl('');
  }

  function onPressHandler() {
    Linking.openURL(addHTTP(url.toLowerCase()));
  }

  // custom theme
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.cards.bg.dark : Colors.cards.bg.light,
  };
  const backgroundInnerStyle = {
    backgroundColor: isDarkMode
      ? Colors.cards.bgInner.dark
      : Colors.cards.bgInner.light,
  };
  return (
    <Animated.View style={{transform: [{translateY: slideInterpolate}]}}>
      <Pressable
        style={[styles.container, backgroundStyle]}
        onPress={onPressHandler}
        android_ripple={{borderless: false}}>
        {/* hide image component for site that dont have image */}
        {imageUrl && (
          <View style={[styles.imageContainer, backgroundInnerStyle]}>
            <FastImage
              source={{uri: imageUrl, priority: FastImage.priority.normal}}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.image}
            />
          </View>
        )}
        <View
          style={[
            styles.content,
            !imageUrl && {borderRadius: 8},
            backgroundInnerStyle,
          ]}>
          {/* title */}
          <CustomText style={styles.title} numberOfLines={!description ? 2 : 1}>
            {title}
          </CustomText>
          {/* description. It appears some sites don't have description. You see why Good SEO practices are important? */}
          {description && (
            <CustomText style={styles.description} numberOfLines={1}>
              {description}
            </CustomText>
          )}
          <CustomText style={styles.url} grey={true} numberOfLines={1}>
            {getHostname(url?.toLowerCase())}
          </CustomText>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default URLPreviewCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    paddingBottom: 0,
    height: 95,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  imageContainer: {
    width: 100,
    // height: '40%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  url: {
    fontSize: 12,
    marginTop: 4,
  },
});

