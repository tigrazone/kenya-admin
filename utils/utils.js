/**
 * Created by itersh on 25.10.17.
 */
const url = require('url')

exports.getRequrl = (request)=>{
    const requrl = url.format({
        protocol: request.protocol,
        host: request.get('host'),
        pathname: request.originalUrl,
    });

    return requrl;
}