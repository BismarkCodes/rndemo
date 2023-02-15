import {StyleSheet, Animated, View, Image, useColorScheme} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import cheerio from 'cheerio';
import {Colors} from '../../constants/colors';
import CustomText from '../text/CustomText';
import urljoin from 'url-join';
import RNFetchBlob from 'rn-fetch-blob';

function addHTTPS(url) {
  if (!url.includes('http')) return 'https://' + url;
  return url;
}

const previousURLS = [];

const fetchImage = async (url: string, onDone: Object) => {
  try {
    const localFaviconPath = `${
      RNFetchBlob.fs.dirs.CacheDir
    }/${Date.now()}.png`;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
    })
      .fetch('GET', url, {
        'Content-Type': 'application/octet-stream',
      })
      .then(res => {
        const data = res.base64();
        RNFetchBlob.fs
          .writeFile(localFaviconPath, JSON.stringify(data), 'base64')
          .then(() => {
            onDone(localFaviconPath);
          });
      });
  } catch (error) {
    console.error(error);
  }
};

const URLPreviewCard: React.FC<{url: string}> = ({url}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  const isDarkMode = useColorScheme() === 'dark';
  const slideUpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (url) {
      fetch(addHTTPS(url))
        .then(response => response.text())
        .then(html => {
          // Use Cheerio to extract the title, description, image, and favicon from the HTML
          const $ = cheerio.load(html);
          setTitle($('title').text());
          setDescription($('meta[name="description"]').attr('content'));
          const imageHref =
            $('meta[property="og:image"]').attr('content') ||
            $('img').attr('src');
          const faviconHref =
            $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || '';

          //   get absolute url for sites image
          if (imageHref && imageHref?.startsWith('/')) {
            // Prepend base URL to relative URL
            setImageUrl(urljoin('http://', url, imageHref));
          } else {
            setImageUrl(imageHref);
          }
          // get absolute url for sites favicon
          if (faviconHref && faviconHref?.startsWith('/')) {
            // Prepend base URL to relative URL
            const faviconUrlPath = urljoin('https://', url, faviconHref);
            const fileType = faviconHref?.split('.').pop().toLowerCase();
            if (fileType === 'ico') {
              fetchImage(faviconUrlPath, setFaviconUrl);
            } else {
              setFaviconUrl(faviconUrlPath);
            }
          }
        })
        .then(() => {
          if (url && title && description) {
            showAnimation();
          }
        })
        .catch(error => {
          console.log(error);
          hideAnimation();
        });
    }
  }, [url]);

  useEffect(() => {
    if (url && title && description) {
      showAnimation();
    }
  }, [url, title, description]);

  useEffect(() => {
    if (url.length == 0) {
      hideAnimation();
    }
  }, [url]);

  function showAnimation() {
    Animated.timing(slideUpAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function hideAnimation() {
    Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(resetState);
  }

  function resetState() {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setFaviconUrl('');
  }

  const slideInterpolate = slideUpAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.cards.bg.dark : Colors.cards.bg.light,
  };
  const backgroundInnerStyle = {
    backgroundColor: isDarkMode
      ? Colors.cards.bgInner.dark
      : Colors.cards.bgInner.light,
  };
  return (
    <Animated.View
      style={[
        styles.container,
        {transform: [{translateY: slideInterpolate}]},
        backgroundStyle,
      ]}>
      {console.log(url, imageUrl, faviconUrl)}
      <View style={[styles.imageContainer, backgroundInnerStyle]}>
        {imageUrl && (
          <Image
            source={{uri: imageUrl || faviconUrl}}
            // source={require("/data/user/0/com.rndemo/cache/1676489137458.png")}
            style={styles.image}
            resizeMode={'cover'}
          />
        )}
      </View>
      <View style={[styles.content, backgroundInnerStyle]}>
        <CustomText style={styles.title} numberOfLines={!description ? 2 : 1}>
          {title}
        </CustomText>
        {description && (
          <CustomText style={styles.description} numberOfLines={1}>
            {description}
          </CustomText>
        )}
        <CustomText style={styles.url} grey={true} numberOfLines={1}>
          {url?.toLowerCase()}
        </CustomText>
      </View>
    </Animated.View>
  );
};

export default URLPreviewCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
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
