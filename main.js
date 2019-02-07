const { app, BrowserWindow } = require('electron');

let mainWindow;
let url = `index.html`;

app.on('ready', () => {
  createWindow(url);
});


app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow(url);
  }
});

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1500, 
    height: 1000, 
    webPreferences: {
      nodeIntegration : true
    }
  });

  mainWindow.loadFile(url);
}