import RNFetchBlob from 'rn-fetch-blob';
var base64 = require('base-64');

export function downloadJSON(accessToken, path) {   // Return Promise
    return RNFetchBlob.fetch(
        'POST',
        'https://content.dropboxapi.com/2/files/download',
        {
            Authorization: 'Bearer ' + accessToken,
            'Dropbox-API-Arg': JSON.stringify({
                path: path,
            }),
        },
        null
    )
    .then(res => {
        return res.json();
    });
}

export function uploadJSON(accessToken, path, data) {   // Return Promise
    return RNFetchBlob.fetch(
        'POST',
        'https://content.dropboxapi.com/2/files/upload',
        {
            Authorization: 'Bearer ' + accessToken,
            'Dropbox-API-Arg': JSON.stringify({
                path: path,
                mode: {
                    ".tag": "overwrite",
                },
            }),
            'Content-Type' : 'application/octet-stream',
        },
        base64.encode(JSON.stringify(data))
    );
}