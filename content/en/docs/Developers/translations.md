---
title: "Translations"
linkTitle: "Translations"
date: 2020-04-10
description: >
  Learn how can you contribute with translations for the UI
---

Translations in Navidrome are JS files stored in the 
[`ui/src/i18n`](https://github.com/deluan/navidrome/tree/master/ui/src/i18n) folder.

Each language has a file for it, with a the code name of the language implemented by that file 
(ex: `en` for English, `pt`, for Portuguese). The structure of the translation files is as follow:

```js
import deepmerge from 'deepmerge'
import englishMessages from 'ra-language-english'

export default deepmerge(englishMessages, {
  languageName: 'English',
  resources: {
    song: {
      name: 'Song |||| Songs',
      fields: {
        albumArtist: 'Album Artist',
        duration: 'Time',
        trackNumber: 'Track #',
        playCount: 'Plays'
      }
    },
    album: {},
    artist: {},
    user: {},
    transcoding: {},
    player: {},
  },
  ra: {
    auth: {},
    validation: {}
  },
  menu: {},
  player: {}
})
```

New files needs to be added to the 
[`ui/src/i18n/index.js`](https://github.com/deluan/navidrome/tree/master/ui/src/i18n/index.js) file.
Just `import` your new language file at the top, like the existing ones, and add it to the 
`addLanguages()` function call. Example for language `xx`:

```js
// Import your new file at the top of the `index.js`
import xx from './xx'

// Add new languages to the object bellow
addLanguages({ pt, xx })
```

After this, the new language should appear in the __Configurations->Personal->Language__ selector.

Before submitting your [Pull Request](https://github.com/deluan/navidrome/pulls), please format your code with `npm run prettier`