const {getRds, getLightsail, getAwsCallback} = require("./helpers");

const MISSING_OR_INCORRECT_CREDENTIALS_ERROR = "Missing or incorrect credentials - please select valid access and secret keys first";

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

async function listRegions(query, pluginSettings, actionParams) {
    let [  settings, params  ] = [ mapAutoParams(pluginSettings), mapAutoParams(actionParams) ];
    params = {...params, REGION: params.REGION || "eu-west-2"};
    const rds = getRds({ params }, settings);
    const lightsail = getLightsail(params, settings);

    const rdsRegionsPromise = rds.describeSourceRegions().promise();
    const lightsailRegionsPromise = lightsail.getRegions().promise();

    return Promise.all([rdsRegionsPromise, lightsailRegionsPromise]).then(
        ([rdsRegions, lightsailRegions]) => {
            return rdsRegions.SourceRegions.map((rdsRegion) => {
                const lsRegion = lightsailRegions.regions.find((x) => x.name === rdsRegion.RegionName);
                return lsRegion ?
                    { id: rdsRegion.RegionName, value: `${rdsRegion.RegionName} (${lsRegion.displayName})` } :
                    { id: rdsRegion.RegionName, value: rdsRegion.RegionName }
            }).sort((a,b) => {
                if (a.value > b.value) return 1;
                if (a.value < b.value) return -1;
                return 0;
            });
        }
    ).catch((err) => {
        console.error(err);
        throw MISSING_OR_INCORRECT_CREDENTIALS_ERROR;
    });
}

module.exports = {
    listRegions,
    listDbParamGroupFamilies
}
