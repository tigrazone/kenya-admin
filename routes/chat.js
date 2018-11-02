/**
 * Created by itersh on 26.10.17.
 */
const dao = require('../utils/dao')

exports.init = (http, session, parser)=>{
    const io = require('socket.io')(http);
    // io.use(sharedsession(session, parser));

    io.set('authorization', function(handshake, accept) {
        session(handshake, {}, function (err) {
            if (err) return accept(err)
            let session = handshake.session;
            // check the session is valid
            accept(null, session.userId != null)
        })
    })

    io.on('connection', function(socket){
        const userId = socket.request.session ?
            parseInt(socket.request.session.userId)
            : 0;

        global.logger.log(`a user ${userId} connected`);

        socket.on('message', function(msg){
            dao.saveMsg(userId, msg)
                .then(
                    r => io.emit('message', r)
                ).catch(
                    e => global.logger.error(e)
            )
        });

        socket.on('disconnect', function(){
            global.logger.log(`user ${userId} disconnected`);
        });

        dao.getMsgs(20, 0).then(
            r => r.reverse().forEach(msg => io.emit('message', msg))
        ).catch(
            e => global.logger.error(e)
        )
    });
}