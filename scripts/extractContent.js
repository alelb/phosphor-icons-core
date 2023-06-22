const fs = require('fs')
const extract = require('extract-svg-path')

const sortObjectKeys = (object) => Object.keys(object).sort().reduce((objEntries, key) => {
    objEntries[key] = object[key]
    return objEntries
  }, {})

async function ls(path) {
  const icons = {}

  console.log(`Accessing folder ${path} to extract raw svg path`)
  const assetsFolder = await fs.promises.opendir(path)

  for await (const dirent of assetsFolder) {
    icons[dirent.name] = {}
    const iconFolders = await fs.promises.opendir(dirent.path)
    for await (const icon of iconFolders) {
        const p = extract(icon.path)
        const iconName = icon.name.replace(/\.[^/.]+$/, '')
        icons[dirent.name][iconName] = p
    }
  }
  const _icons = sortObjectKeys(icons)
  for (const [key, value] of Object.entries(_icons)) {
    _icons[key] = sortObjectKeys(value)
  } 

  const iconsJSON = JSON.stringify(_icons, null, 2)
  fs.writeFile('./icons.json', iconsJSON, function(err, _) {
      if(err) console.log('error', err);
  })
  console.log('SVG content extracted')
}

ls('../assets').catch(console.error)