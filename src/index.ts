import 'source-map-support/register';
import {createServer} from 'http';
import axios from 'axios';
import {Socket} from 'net';

const DEFAULT_PORT = 3000;
const PORT = process.env.PORT ?? DEFAULT_PORT;

let count = 1;

const server = createServer(async (req, res) => {
  const path = req.url ?? '/';
  res.writeHead(200, {'Content-Type': 'application/json'});

  switch (path) {
    case '/ping': {
      console.log({count});
      res.write(JSON.stringify({pong: count++}));
      break;
    }
    case '/ip': {
      const {data} = await axios.get('https://checkip.amazonaws.com');
      const ip = data.trim('\n');
      res.write(JSON.stringify({ip}));
      break;
    }
    default: {
      res.write(JSON.stringify({message: 'hello world!'}));
      break;
    }
  }

  res.end();
});

const shutdown = async () => {
  // server.closeを呼び出すと、新規のコネクションの受け付けを終了し、既存のコネクションが終了するとコールバック関数を実行する。
  // しかし、keepaliveが有効であれば既存のコネクションが使い回されるのですぐにコネクションが終了しない。
  server.close(err => {
    if (err !== undefined) {
      console.error(err);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    console.log('terminate server.');
    // eslint-disable-next-line no-process-exit
    process.exit();
  });

  // 一定期間経過後にコネクションを終了する。
  setTimeout(() => {
    sockets.forEach(socket => {
      socket.destroy();
      sockets.delete(socket);
    });
  }, 3000);
};

// シャットダウン処理の為にコネクションをSetで管理しておく。
const sockets = new Set<Socket>();
server.on('connection', socket => {
  sockets.add(socket);

  socket.once('close', () => {
    sockets.delete(socket);
  });
});

process.once('SIGTERM', async () => {
  console.log('SIGTERM received.');
  shutdown();
});

process.once('SIGINT', async () => {
  console.log('SIGINT received.');
  shutdown();
});

server.listen(PORT);
console.log('app is running!');
