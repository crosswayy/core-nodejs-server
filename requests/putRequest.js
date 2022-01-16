const https = require('https');

const options = {
    host: 'jsonplaceholder.typicode.com',
    path: '/users/1',
    method: 'PUT',
    headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json',
    },
};

const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
        console.error(res.statusCode, res.statusMessage);
        res.resume();
        return;
    }

    let chunks = '';
    res.on('data', (chunk) => {
        chunks += chunk;
    });

    res.on('close', () => {
        const data = JSON.parse(chunks);
        console.log(data);
    });
});

const requestData = {
    username: 'crossedocean'
}

req.write(JSON.stringify(requestData));
req.end();
req.on('error', (err) => console.log(err));
