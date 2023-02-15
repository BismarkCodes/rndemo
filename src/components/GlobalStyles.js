import {Colors} from '../constants/colors';

export const GlobalStyles = {
  text: {
    fontSize: 16,
  },
  input: {
    messageInput: {
      inputContainer: {
        backgroundColor: Colors.cards.bg.light,
        // marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 55,
        maxHeight: 150,
      },
      textInput: {
        flex: 1,
        paddingHorizontal: 8,
        color: Colors.text.primary.light,
        fontSize: 16,
        fontWeight: '500',
        maxHeight: 140,
      },
    },
  },
};
