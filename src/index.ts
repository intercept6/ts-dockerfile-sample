import 'source-map-support/register';
import {createServer} from 'http';
import axios from 'axios';

const DEFAULT_PORT = '3000';
const PORT = parseInt(process.env.PORT ?? DEFAULT_PORT);

let count = 1;

const server = createServer(async (req, res) => {
  const path = req.url ?? '/';
  res.writeHead(200, {'Content-Type': 'application/json'});

  switch (path) {
    case '/ping': {
      res.write(JSON.stringify({pong: count++}));
      console.log(`count: ${count}`);
      break;
    }
    case '/ip': {
      const {data} = await axios.get('https://checkip.amazonaws.com');
      const ip = data.trim('\n');
      res.write({ip});
      break;
    }
    default: {
      res.write(JSON.stringify({message: 'hello world!'}));
      break;
    }
  }

  res.end();
});

(async () => {
  server.listen(PORT);

  console.log('app is running!');

  process.once('SIGTERM', async () => {
    console.log('SIGTERM received, terminate server.');
    server.close();
  });

  process.once('SIGINT', async () => {
    console.log('SIGINT received, terminate server.');
    server.close();
  });
})();
