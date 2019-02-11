const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Thermowell-Design-win32-x64/'),
    authors: 'Riccardo Nigrelli & Giacomo Varini',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'thermowell-design.exe',
    setupExe: 'thermowell-design-app.exe',
    setupIcon: path.join(rootPath, 'assets', 'images', 'icons', 'logo.ico')
  })
}