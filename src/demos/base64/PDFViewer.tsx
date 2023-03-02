import {StyleSheet, ActivityIndicator, View, Modal} from 'react-native';
import React, {useState} from 'react';
import Pdf from 'react-native-pdf';

import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';
import CustomText from '../../components/text/CustomText';
import {Colors} from '../../constants/colors';

const PDFViewer = () => {
  const [fileSource, setFileSource] = useState('');
  const [pdfFile, setPdfFile] = useState([]);
  const [loading, setLoading] = useState(true);

  // getting local files
  function getLocalFileUri() {
    setFileSource('local');
    DocumentPicker.pick({
      type: [types.pdf],
    })
      .then(data => setPdfFile(data))
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
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    } as RequestInit);

    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.onloadend = () => {
      const base64data = reader.result as string;
      setLoading(true);
      setPdfFile(
        [`data:application/pdf;base64,${base64data.split('base64,')[1]}`],
        // example base64data = 'data:application/octet-stream;base64,JVBERi0xLjQNJeLjz9MNCjE3NTUgMCBvYmoNPDwvTGluZWFyaXplZC'
        /* 
        - this will give an error since it indicates that the application is of type octet-stream instead of pdf
        - since react-native-pdf will support base64 strings with this formart 'data:application/pdf;base64,encodedData'
        Fix: 
        - using string.split() method to get the encoded data
        */
      );
    };
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.text} onPress={getLocalFileUri}>
        Get PDF from Device
      </CustomText>
      <View style={{height: 45}} />
      <CustomText
        style={styles.text}
        onPress={() =>
          getServerFileUri(
            'https://www.marxists.org/archive/marx/works/download/pdf/Manifesto.pdf',
          )
        }>
        Get PDF from Server
      </CustomText>
      <Modal
        visible={pdfFile.length > 0}
        onRequestClose={() => {
          setFileSource(''), setPdfFile([]), setLoading(true);
        }}>
        <View style={styles.modalInner}>
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator color={Colors.white} size={'large'} />
            </View>
          )}
          <Pdf
            source={{
              uri: fileSource === 'local' ? pdfFile[0]?.uri : pdfFile[0],
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              setTimeout(() => {
                setLoading(false);
              }, 1500);
            }}
            onPageChanged={(page, numberOfPages) => {
              // console.log(`Current page: ${page}`);
            }}
            onError={error => {
              // console.log(error);
            }}
            onPressLink={uri => {
              // console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PDFViewer;

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
  pdf: {
    flex: 1,
    height: '100%',
    width: '100%',
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
});
