const { getRds, getAwsCallback, parseLegacyParam } = require("./helpers");
const parsers = require("./parsers");
const { getRegions } = require("./autocomplete");

function createDbInstance(action, settings){
    const rds = getRds(action, settings);
    let params = {
        DBInstanceClass: parsers.string(action.params.DB_INSTANCE_CLASS), /* required */
        DBInstanceIdentifier: parsers.string(action.params.DB_INSTANCE_IDENTIFIER), /* required */
        Engine: parsers.string(action.params.ENGINE), /* required */
    };
    if(action.params.ADDITIONAL_VALUES){
        const values = parseLegacyParam(action.params.ADDITIONAL_VALUES, parsers.object);
        if(values){
            params = {...params, ...values};
        }
    }
    
    return new Promise((resolve,reject)=>{
        rds.createDBInstance(params, getAwsCallback(resolve, reject))
    });
}

async function deleteDbInstances(action, settings){
    const rds = getRds(action, settings);
    const params = {
        DBInstanceIdentifier: parsers.string(action.params.DB_INSTANCE_IDENTIFIER), /* required */
        SkipFinalSnapshot: action.params.SKIP_FINAL_SNAPSHOT,
        FinalDBSnapshotIdentifier: parsers.string(action.params.FINAL_DB_SNAPSHOT_IDENTIFIER)
    }
    return new Promise((resolve,reject)=>{
        rds.deleteDBInstance(params, getAwsCallback(resolve, reject));
    });
}

function modifyDBCluster(action, settings){
    const rds = getRds(action, settings);

    const params = {
        DBClusterIdentifier : parsers.string(action.params.dbClusterIdentifier),
        MasterUserPassword: action.params.masterUserPassword,
        Domain: parsers.string(action.params.domain),
        PreferredBackupWindow: parsers.string(action.params.preferredBackupWindow),
        PreferredMaintenanceWindow: parsers.string(action.params.preferredMaintenanceWindow)
    }
    if(action.params.scalingConfigurationMinCapacity || action.params.scalingConfigurationMaxCapacity){
        params.ScalingConfiguration = {
            MinCapacity: parsers.number(action.params.scalingConfigurationMinCapacity),
            MaxCapacity: parsers.number(action.params.scalingConfigurationMaxCapacity)
        }
    }
    return new Promise((resolve,reject)=>rds.modifyDBCluster(params, getAwsCallback(resolve, reject)));
}

function createDBCluster(action, settings){
    const rds = getRds(action, settings);
    let params = {
        DBClusterIdentifier: parsers.string(action.params.dbClusterIdentifier),
        Engine: parsers.string(action.params.engine),
        AvailabilityZones: parsers.array(action.params.availabilityZones),
        MasterUsername: parsers.string(action.params.masterUsername),
        MasterUserPassword: action.params.masterUserPassword,
        PreferredBackupWindow: parsers.string(action.params.preferredBackupWindow),
        PreferredMaintenanceWindow: parsers.string(action.params.preferredMaintenanceWindow),
        Port: parsers.number(action.params.port),
        VpcSecurityGroupIds: parsers.array(action.params.vpcSecurityGroupIds),
        Tags: parsers.tags(action.params.tags)
    };
    if(action.params.scalingConfigurationMinCapacity || action.params.scalingConfigurationMaxCapacity){
        params.ScalingConfiguration = {
            MinCapacity: parsers.number(action.params.scalingConfigurationMinCapacity),
            MaxCapacity: parsers.number(action.params.scalingConfigurationMaxCapacity)
        }
    }
    if (action.params.additionalParams){
        const additional = parsers.object(action.params.additionalParams);
        params = { ...params, ...additional};
    }
    return new Promise((resolve,reject)=>rds.createDBCluster(params, getAwsCallback(resolve, reject)));
}

function createDBParameterGroup(action, settings){
    const rds = getRds(action, settings);
    const params = {
        DBParameterGroupFamily: parsers.string(action.params.dbParameterGroupFamily),
        DBParameterGroupName: parsers.string(action.params.name),
        Description: parsers.string(action.params.description),
        Tags: parsers.tags(action.params.tags)
    };
    return new Promise((resolve,reject)=>rds.createDBParameterGroup(params, getAwsCallback(resolve, reject)));
}

function createDBSubnetGroup(action, settings){
    const rds = getRds(action, settings);
    const params = {
        DBSubnetGroupName: parsers.string(action.params.name),
        DBSubnetGroupDescription: parsers.string(action.params.description),
        SubnetIds: parsers.array(action.params.subnetIds),
        Tags: parsers.tags(action.params.tags)
    };
    return new Promise((resolve,reject)=>rds.createDBSubnetGroup(params, getAwsCallback(resolve, reject)));
}

module.exports = {
    createDbInstance,
    deleteDbInstances,
    modifyDBCluster,
    createDBCluster,
    createDBParameterGroup,
    createDBSubnetGroup,
    // auto complete
    getRegions
};