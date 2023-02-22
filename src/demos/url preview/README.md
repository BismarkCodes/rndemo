# React Native URL Preview

This is a React Native component that displays a preview of a URL, including a title, a description, and a thumbnail(optional). It was built using [Cheerio](https://github.com/cheeriojs/cheerio), [url-join](https://github.com/jfromaniello/url-join), and [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image).

## Features

- Parses website HTML data with Cheerio to extract title, description, and image information
- Uses url-join to construct full URLs for images
- Uses Animated from React Native to show/hide the preview component
- Custom HTML parser function for sites not compatible with Cheerio

## Installation

To use this component, first install the required libraries:

```bash
#with npm
npm install cheerio url-join react-native-fast-image

#with yarn
yarn add cheerio url-join react-native-fast-image
```

Then copy the [URLPreviewCard.tsx](https://github.com/BismarkCodes/rndemo/blob/main/src/demos/url%20preview/URLPreviewCard.tsx) file into your project.

## Usage

To use the component, import it and include it in your JSX code. Here's an example:

```jsx
import UrlPreviewCard from './UrlPreviewCard';

function MyComponent() {
  return <UrlPreviewCard url="https://example.com" />;
}
```

## Props

The component accepts the following props:

- `url`: the URL to preview

## Helper Functions

With the power of Regex, we can retrieve all urls from the text value as shown in the video above like this.

```javascript
function findUrls(text: string) {
  const urlRegex =
    /(?:(?:(?:https?|ftp):\/\/)?(?:www\.)?|(?:[a-z0-9]+\.))([a-z0-9]+\.[^\s]{2,}|[a-z0-9]+\.[^\s]{2,}\.[a-z]{2,})\.?/gi;

  let result = text.match(urlRegex);

  return result ? result[0] : '';
}
```

## License

This component is released under the MIT License.

## Credits

This component was created by [Bismark Okletey](https://bismarkamanor.vercel.app). The preview animation was created using the React Native Animated library. If you have any questions or suggestions, please create an issue [here](https://github.com/BismarkCodes/rndemo/issues).
