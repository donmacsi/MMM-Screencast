const electron = require('electron');
const Positioner = require('electron-positioner');
const ipc = require('node-ipc');
ipc.config.id = 'screenCastWindow';
ipc.config.retry = 1500;
ipc.config.socketRoot = 'tmp';
ipc.config.networkHost = 'localhost';
ipc.config.appSpace = 'MMM-Screencast';
const url = process.argv[2];
const width = parseInt(process.argv[3], 10);
const height = parseInt(process.argv[4], 10);
const position = process.argv[5];
const y = parseInt(process.argv[6], 10);
const x = parseInt(position, 10);

ipc.serve(`/${ipc.config.socketRoot}/${ipc.config.appSpace}.${ipc.config.id}`, () => {
  ipc.server.on('quit', (data, socket) => {
    ipc.server.emit(socket, 'quit');
    app.quit();
    process.exit();
  });
});
const app = electron.app;

app.once('ready', function () {
  const windowOptions = {
    maxHeight: height,
    maxWidth: width,
    resize: false,
    width: width,
    height: height,
    darkTheme: true,
    alwayOnTop: true,
    show: false,
    frame: false,
    zoomFactor: 1.0,
    focusable: false
  };
    
  const screenCastWindow = new electron.BrowserWindow(windowOptions);
    
  if (!x) {
    console.log('move', x)
    const positioner = new Positioner(screenCastWindow);
    positioner.move(position);
  } else {
    screenCastWindow.setPosition(x, y);
  }

  // Show window when page is ready
  screenCastWindow.once('ready-to-show', function () {
    screenCastWindow.show();
  });

});

ipc.server.start();
