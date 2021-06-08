const aws = require("aws-sdk");
const parsers = require("./parsers");

/***
 * @returns { aws.RDS }
 ***/
function getRds(action, settings) {
    return new aws.RDS({
        region: parsers.autocomplete(action.params.REGION),
        accessKeyId: action.params.AWS_ACCESS_KEY_ID || settings.AWS_ACCESS_KEY_ID,
        secretAccessKey: action.params.AWS_SECRET_ACCESS_KEY || settings.AWS_SECRET_ACCESS_KEY
    });
}

function getAwsCallback(resolve, reject){
    return (err, result)=>{
        if (err) return reject(err);
        resolve(result);
    }
}

function parseLegacyParam(param, parseFunc) {
    try {
        if (typeof param == 'string') return JSON.parse(param);
    } 
    catch (err) {}
    finally {
        return parseFunc(param);
    }
}

module.exports = {
    getAwsCallback,
    getRds,
    parseLegacyParam
}