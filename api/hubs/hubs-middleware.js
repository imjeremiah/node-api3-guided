const Hub = require('./hubs-model');

// ES6 PROMISE :
function checkHubId(req, res, next) {
    // taking a trip to the db searhcing for the hub with that id
    const { id } = req.params;
    Hub.findById(id) 
        .then(possibleHub => {
            if(possibleHub) {
                req.hub = possibleHub;
                next();
            } else {
                next({ message: 'not found', status: 404 });
            }
        })
        .catch(next);
}

// ASYNC / AWAIT :
async function checkHubId2(req, res, next) {
    try {
        const { id } = req.params;
        const possibleHub = await Hub.findById(id);
        if (possibleHub) {
            req.hub = possibleHub;
            next();
        } else {
            next({ message: 'not found', status: 404 });
        }
    } catch (err) {
        next(err);
    }
}

function checkHubPayload(req, res, next) {
    if(
        !req.body.name ||
        typeof req.body.name !== 'string' ||
        !req.body.name.trim() ||
        req.body.name.length < 3
    ) {
       next({ staus: 422, message: 'your hub requires name and it has to be a string of at least three characters' }); 
    } else {
        next();
    }
}

module.exports = { checkHubId, checkHubId2, checkHubPayload };