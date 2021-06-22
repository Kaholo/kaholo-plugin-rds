const {getRds, getAwsCallback} = require("./helpers");

const regionsList = [
    { "id": "us-east-1", "value": "US East 1 (N. Virginia)" },
    { "id": "us-east-2", "value": "US East 2 (Ohio)" },
    { "id": "us-west-1", "value": "US West 1 (N. California)" },
    { "id": "us-west-2", "value": "US West 2 (Oregon)" },
    { "id": "ap-southeast-1", "value": "Asia Pacific Southeast 1 (Singapore)" },
    { "id": "ap-southeast-2", "value": "Asia Pacific Southeast 2 (Sydney)" },
    { "id": "ap-northeast-1", "value": "Asia Pacific Northeast (Tokyo)" },
    { "id": "eu-west-1", "value": "EU West(Ireland)" },
    { "id": "sa-east-1", "value": "South America East (São Paulo)" },
    { "id": "eu-central-1", "value": "EU Central(Frankfurt)" }
];

async function getRegions(query, _, _){
    return regionsList.filter(region => { return !query || region.id.includes(query) || region.value.includes(query) });
}

function mapAutoParams(autoParams){
    const params = {};
    autoParams.forEach(param => {
      params[param.name] = param.value;
    });
    return params;
}

async function listDbParamGroupFamilies(query, pluginSettings, actionParams){
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(actionParams);
    const rds = getRds({params}, settings);
    const result = await (new Promise((resolve, reject) => {
        rds.describeDBEngineVersions({Engine: params.engine}, getAwsCallback(resolve, reject));
    }));
    const groupFamilies = result.DBEngineVersions
        .filter(version =>  !query || (version.Engine + version.EngineVersion).contains(query) || 
                            version.DBParameterGroupFamily.contains(query))
        .map(version => version.DBParameterGroupFamily);
    // remove duplicates and convert to {id:, value:} format
    return [...(new Set(groupFamilies))].map(family => ({id: family, value: family}));
}

module.exports = { 
    getRegions,
    listDbParamGroupFamilies
}