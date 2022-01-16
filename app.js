const http = require('http');
const qs = require('querystring');
const url = require('url');

const Users = require('./users');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        return handleGetReq(req, res);
    } else if (req.method === 'POST') {
        return handlePostReq(req, res);
    } else if (req.method === 'DELETE') {
        return handleDeleteReq(req, res);
    } else if (req.method === 'PUT') {
        return handlePutReq(req, res);
    }
});

function handleGetReq(req, res) {
    const { pathname } = url.parse(req.url);

    if (pathname !== '/users') {
        return handleError(res, 404);
    }

    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(Users.getUsers()));
}

function handlePostReq(req, res) {
    const size = parseInt(req.headers['content-length'], 10);
    const buffer = Buffer.allocUnsafe(size);
    let pos = 0;

    const { pathname } = url.parse(req.url);
    if (pathname !== '/user') {
        return handleError(res, 404);
    }

    req
        .on('data', (chunk) => {
            const offset = pos + chunk.length;
            if (offset > size) {
                reject(443, 'To large', res);
                return;
            }

            chunk.copy(buffer, pos);
            pos = offset;
        })
        .on('end', () => {
            if (pos !== size) {
                reject(400, 'Bad Request', res);
                return
            }

            const data = JSON.parse(buffer.toString());
            Users.saveUser(data);
            console.log('User posted: ', data);
            res.setHeader('Content-Type', 'application/json');
            res.end('You posted: ' + JSON.stringify(data));
        });
}

function handleDeleteReq(req, res) {
    const { pathname, query } = url.parse(req.url);
    if (pathname !== '/user') {
        return handleError(res, 404);
    }

    const { id } = qs.parse(query);
    const userDeleted = Users.deleteUser(id);
    res.setHeader('Content-type', 'Application/json');
    res.end(`{"deletedUser": ${userDeleted}}`);
}

function handlePutReq(req, res) {
    const size = parseInt(req.headers['content-length'], 10);
    const buffer = Buffer.allocUnsafe(size);

    const { pathname, query } = url.parse(req.url);
    const { id } = qs.parse(query);

    if (pathname !== '/user') {
        return handleError(res, 404);
    }

    let pos = 0;
    req
        .on('data', (chunk) => {
            const offset = pos + chunk.length;
            if (offset > size) {
                reject(443, 'Too large', res);
                return;
            }

            chunk.copy(buffer, pos);
            pos = offset;
        })

        .on('end', () => {
            if (pos !== size) {
                reject(400, 'Bad request', res);
                return;
            }

            const data = JSON.parse(buffer.toString());
            const userUpdated = Users.replaceUser(id, data);

            res.setHeader('Content-type', 'Application/json');
            res.end(`{"userUpdated": ${userUpdated}}`);
        });
}

function handleError(res, code) {
    res.statusCode = code;
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
}

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
