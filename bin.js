// function getElementSrc(str: string, regX: object) {
//   const match = str?.match(regX);
//   const src = match ? match[1] : '';
//   return src;
// }

// // Use Cheerio to extract the title, description, image, and favicon from the HTML
//           // const $ = cheerio.load(html);
//           const parser = new DOMParser.DOMParser();
//           const parsed = parser.parseFromString(html, 'text/html', {
//             xmlMode: false,
//           });
//           // console.log(
//           //   parsed.querySelect("link[rel='icon']"),
//           //   // parsed.getElementsByTagName('img').toString(),
//           //   // .getAttribute('content'),
//           // );
//           // console.log(parsed.querySelect('title')[0].firstChild.data);
//           setTitle(
//             parsed
//               .querySelect('title')[0]
//               ?.firstChild.data?.replace(/\s+/g, ' '),
//           );
//           setDescription(
//             parsed
//               .querySelect('meta[name="description"]')[0]
//               ?.attributes['1'].value?.replace(/\s+/g, ' '),
//           );
//           const faviconHref =
//             'http://' +
//             getHostname(url) +
//             getElementSrc(
//               parsed.querySelect('link=[rel="icon"]').toString(),
//               /<link[^>]*href="([^"]*)"[^>]*>/,
//             );

//             console.log(faviconHref)

//           // let ur = new URL('https://bismarkamanor.vercel.app/favicon.ico')

//           // console.log(ur.hostname)
//           // .value)
//           // console.log(dom);
//           // // get site title
//           // setTitle(dom.querySelector('head title')?.text);
//           // // setTitle($('title').text());
//           // //get site description
//           // setDescription(
//           //   dom
//           //     .querySelector('head meta[name="description"]')
//           //     ?.getAttribute('content'),
//           // );
//           // // get site image or thumbnail
//           // const imageHref = dom
//           //   .querySelector('head meta[property="og:image"]')
//           //   ?.getAttribute('content');
//           // //   get absolute url for sites image
//           // if (imageHref && imageHref?.startsWith('/')) {
//           //   // Prepend base URL to relative URL
//           //   fetchImage(addHTTP(url + imageHref), setImageUrl);
//           // } else {
//           //   setImageUrl(imageHref || '');
//           // }
