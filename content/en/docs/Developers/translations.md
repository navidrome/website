---
title: "Translations"
linkTitle: "Translations"
date: 2020-04-10
description: >
  Learn how can you contribute with translations for the UI
---

Translations in Navidrome are based on 
[ReactAdmin translations](https://marmelab.com/react-admin/Translation.html). Translated strings 
are stored in JS files in the
[`ui/src/i18n`](https://github.com/deluan/navidrome/tree/master/ui/src/i18n) folder.

Each language has a file for it, with a the code name of the language implemented by that file 
(ex: `en` for English, `pt`, for Portuguese). The structure of the translation files is as follow:

```js
import englishMessages from 'ra-language-english'
import deepmerge from 'deepmerge'

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

In the example above, we imported the base english language translations from ReactAdmin 
(in the first line), and add Navidrome specific strings to it. For all strings available for 
translation, take a look at the existing translations in the 
[`ui/src/i18n`](https://github.com/deluan/navidrome/tree/master/ui/src/i18n) folder. 

You'll also need to add to the project a package with default base translations (error messages, 
navigation labels) for the language your are adding. Ex: for Chinese:
```
npm install --save ra-language-chinese
```

{{% alert %}}
For more information about ReactAdmin translation and available base translations, please check 
[their documentation](https://marmelab.com/react-admin/Translation.html#available-locales).
{{% /alert %}}

To make new language files available to Navidrome, they need to be added to the 
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