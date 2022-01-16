const https = require('https');

const options = {
    host: 'jsonplaceholder.typicode.com',
    path: '/users/1',
    method: 'DELETE',
    headers: {
        'Accept': 'Application/json'
    }
};

const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
        console.error(res.statusCode, res.statusMessage);
        res.resume();
        return;
    }

    let chunks = '';
    res.on('data', (chunk) => chunks += chunk);
    res.on('close', () => {
        const data = JSON.parse(chunks);
        console.log('Deleted', data);
    });
});

req.end();

req.on('error', err => console.error(err));
