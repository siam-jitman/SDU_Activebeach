var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name: 'Activebeach Web Page',
  description: 'Activebeach Web Page => 1.activebeach web site (create by siam)',
  script: 'D:\\Program\\website\\siam\\activebeach\\index.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', function () {
  svc.start();
});

svc.install();