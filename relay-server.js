const net = require('net');
const axios = require('axios');

const TRACKER_URL = 'https://script.google.com/macros/s/AKfycbwhenKmH-_6S4wtCvKcUskjE3usRLKNK64k2Knm9iOG8mxK9h2BgDHLEw1yYbNJ9116ww/exec';

const server = net.createServer(socket => {
  console.log('Device connected');

  socket.on('data', async data => {
    const hex = data.toString('hex');
    console.log('Raw HEX:', hex);

    // Very basic GT06-style packet parsing (customize for your device!)
    if (hex.includes('7878')) {
      const imei = hex.substr(10, 16); // example offset
      const lat = parseFloat('27.4728');  // Replace with parsed lat
      const lng = parseFloat('89.6398');  // Replace with parsed lng
      const speed = 40; // Replace with parsed speed

      const params = new URLSearchParams({
        imei: imei,
        lat: lat.toString(),
        lng: lng.toString(),
        speed: speed.toString(),
        battery: '90' // default or parsed
      });

      try {
        const res = await axios.get(`${TRACKER_URL}?${params}`);
        console.log('Forwarded to tracker:', res.data);
      } catch (err) {
        console.error('Error forwarding:', err.message);
      }
    }
  });

  socket.on('close', () => console.log('Device disconnected'));
});

server.listen(5000, () => {
  console.log('Listening on port 5000...');
});
