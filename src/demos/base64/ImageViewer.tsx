import {StyleSheet, Image, View, Modal} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import CustomText from '../../components/text/CustomText';
import {Colors} from '../../constants/colors';

const Base64IO = () => {
  const [file, setFile] = useState([]);
  const [fileSource, setFileSource] = useState('');

  // getting local files
  function getLocalFileUri() {
    setFileSource('local');
    DocumentPicker.pick({
      type: [types.images],
    })
      .then(data => setFile(data))
      // example data
      /* 
        [{
          "fileCopyUri": null, 
          "name": "20230226-WA0003.png", 
          "size": 773137, 
          "type": "image/png", 
          "uri": "content://com.android.providers.media.documents/document/image%3A43839"
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
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/png',
      },
      responseType: 'blob',
    } as RequestInit);

    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const base64data = reader.result as string;
      setFile(base64data); // set the base64 string as the file source state
    };
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.text} onPress={getLocalFileUri}>
        Get Image from Device
      </CustomText>
      <View style={{height: 45}} />
      <CustomText
        style={styles.text}
        onPress={() =>
          getServerFileUri(
            'https://cdn-icons-png.flaticon.com/512/6840/6840478.png',
          )
        }>
        Get Image from Server
      </CustomText>

      <Modal
        visible={file.length > 0}
        animationType="slide"
        onRequestClose={() => {
          setFile([]), setFileSource('');
        }}
        transparent>
        <View style={styles.modalInner}>
          <Image
            source={fileSource === 'server' ? {uri: file} : {uri: file[0]?.uri}}
            style={{height: '100%', width: '100%'}}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

export default Base64IO;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {
    color: Colors.text.link,
    fontWeight: '600',
  },
  modalInner: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
  },
});
