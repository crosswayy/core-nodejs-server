const https = require('https');

const options = {
    host: 'jsonplaceholder.typicode.com',
    path: '/users',
    method: 'POST',
    headers: {
        'Content-Type': 'Application/json',
        'Accept': 'Application/json',
    },
};

const req = https.request(options, (res) => {
    if (res.statusCode !== 201) {
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
    name: 'New User',
    username: 'digitalocean',
    email: 'user@digitalocean.com',
    address: {
        street: 'North Pole',
        city: 'Murmansk',
        zipcode: '12345-6789',
    },
    phone: '555-1212',
    website: 'digitalocean.com',
    company: {
        name: 'DigitalOcean',
        catchPhrase: 'Welcome to the developer cloud',
        bs: 'cloud scale security'
    }
};

req.write(JSON.stringify(requestData));
req.end();
req.on('error', (err) => console.log(err));
