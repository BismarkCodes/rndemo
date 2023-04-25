// 1. INSTALLATION
//npm
npm install fs-extra --save-dev
//yarn 
yarn add fs-extra --save-dev


// 2. SET-UP

// create file in project root directory
auto-update-dependencies.js //can also use TypeScript if you like


// 3. CONFIG

//import fs-extra
const fs = require('fs-extra');

// The path to the build.gradle file
const buildGradlePath =
  'PATH_TO_DEPENDENCY_PLUGIN_VERSION_VALUE_FILE';

// The old and new Kotlin Gradle plugin version numbers
const oldVersion = '1.3.50';
const newVersion = '1.6.20';

// Read the build.gradle file
fs.readFile(buildGradlePath, 'utf8', (err, data) => {
  if (err) throw err;

  // Replace the old version number with the new version number
  const newData = data.replace(
    `pluginVersion=${oldVersion}`,
    `pluginVersion=${newVersion}`,
  );

  // Write the updated file back to disk
  fs.writeFile(buildGradlePath, newData, 'utf8', err => {
    if (err) throw err;
    console.log(
      `Success Log Message`,
    );
  });
});
