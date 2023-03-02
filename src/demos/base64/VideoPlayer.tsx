import {StyleSheet, ActivityIndicator, View, Modal} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import CustomText from '../../components/text/CustomText';
import {Colors} from '../../constants/colors';
import {videos} from './data';
import Video from 'react-native-video';

const VideoPlayer = () => {
  const [fileSource, setFileSource] = useState('');
  const [videoFile, setVideoFile] = useState([]);
  const [loading, setLoading] = useState(true);

  // getting local files
  function getLocalFileUri() {
    setFileSource('local');
    DocumentPicker.pick({
      type: [types.video],
    })
      .then(data => {
        console.log(data), setVideoFile(data);
      })
      .then(() => setLoading(true))
      // example data
      /* 
        [{
          "fileCopyUri": null, 
          "name": "VID-20230226-WA0003.mp4", 
          "size": 773137, 
          "type": "video/mp4", 
          "uri": "content://com.android.providers.media.documents/document/video%3A43839"
      }]
      */
      .catch(handlePickerError);
  }

  const handlePickerError = (err: unknown) => {
    if (DocumentPicker.isCancel(err)) {
      console.warn('cancelled');
    } else if (isInProgress(err)) {
    } else {
      throw err;
    }
  };

  // getting base64 string from server
  async function getServerFileUri(url: string): Promise<void> {
    setFileSource('server');
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'video/mp4',
        },
      });
      if (!response.ok) {
        return console.error(
          `Failed to fetch video, status code: ${response.status}`,
        );
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        const base64data = reader.result as string;
        setLoading(true);
        setVideoFile([`data:video/mp4;base64,${base64data.split(',')[1]}`]);
      };
    } catch (error) {
      console.error('Failed to fetch video', error);
    }
  }

  return (
    <View style={styles.container}>
      {console.log(videoFile)}
      <CustomText style={styles.text} onPress={getLocalFileUri}>
        Get Video from Device
      </CustomText>
      <View style={{height: 45}} />
      <CustomText
        style={styles.text}
        onPress={() => getServerFileUri(videos[0].source[0])}>
        Get Video from Server
      </CustomText>
      <Modal
        visible={videoFile.length > 0}
        onRequestClose={() => {
          setFileSource(''), setVideoFile([]), setLoading(true);
        }}>
        <View style={styles.modalInner}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color={Colors.white} size={'large'} />
            </View>
          )}
          <Video
            source={{
              uri: fileSource === 'local' ? videoFile[0]?.uri : videoFile[0],
              // uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            }}
            onLoad={() => {
              setTimeout(() => {
                setLoading(false);
              }, 1500);
            }}
            // Can be a URL or a local file.
            //  ref={(ref) => {
            //    this.player = ref
            //  }}
            //  onBuffer={this.onBuffer}
            //  onError={this.videoError}
            style={styles.video}
          />
        </View>
      </Modal>
    </View>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  text: {
    color: Colors.text.link,
    fontWeight: '600',
  },
  modalInner: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    position: 'relative',
  },
  video: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    minHeight: 200,
    width: '100%',
  },
});
