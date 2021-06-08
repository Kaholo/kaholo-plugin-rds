const { getRds, getAwsCallback, parseLegacyParam } = require("./helpers");
const parsers = require("./parsers");
const { getRegions } = require("./autocomplete");

const CLUSTER_TYPE = "DB Cluster Parameter Group";

async function createDbInstance(action, settings){
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

async function modifyDBCluster(action, settings){
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

async function createDBCluster(action, settings){
    const rds = getRds(action, settings);
    let params = {
        DBClusterIdentifier: parsers.string(action.params.dbClusterIdentifier),
        Engine: parsers.string(action.params.engine),
        AvailabilityZones: parsers.array(action.params.availabilityZones),
        MasterUsername: parsers.string(action.params.masterUsername),
        MasterUserPassword: action.params.masterUserPassword,
        Port: parsers.number(action.params.port),
        VpcSecurityGroupIds: parsers.array(action.params.vpcSecurityGroupIds),
        DBSubnetGroupName: parsers.string(action.params.dbSubnetGroupName),
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

async function createDBParameterGroup(action, settings){
    const rds = getRds(action, settings);
    const name = parsers.string(action.params.name);
    const params = {
        DBParameterGroupFamily: parsers.string(action.params.dbParameterGroupFamily),
        Description: parsers.string(action.params.description),
        Tags: parsers.tags(action.params.tags)
    };
    let resultPromise;
    if (action.params.type === CLUSTER_TYPE){
        params.DBClusterParameterGroupName = name;
        resultPromise = new Promise((resolve,reject)=>rds.createDBClusterParameterGroup(params, getAwsCallback(resolve, reject)));
    }
    else {
        params.DBParameterGroupName = name;
        resultPromise = new Promise((resolve,reject)=>rds.createDBParameterGroup(params, getAwsCallback(resolve, reject)));
    }
    const result = await resultPromise;
    if (action.params.parameters){
        try {
            await modifyDBParameterGroup(action, settings);
        }
        catch (err){
            throw { 
                createDBParameterGroup: result, 
                modifyDBParameterGroup: err
            };
        }
    }
    // if specified dbClusterIdentifier then associate with DB Cluster specified using modifyDBCluster
    if (action.params.type === CLUSTER_TYPE && action.params.dbClusterIdentifier){
        try {
            action.params.dbClusterPGName = name;
            await modifyDBCluster(action, settings);
        }
        catch (err){
            throw { 
                createDBParameterGroup: result, 
                modifyDBCluster: err
            };
        }
    }
    return result;
}

async function describeDBClusters(action, settings){
    const rds = getRds(action, settings);
    const params = {};
    const dbClusterIds = parsers.array(action.params.dbClusterIds);
    if (dbClusterIds.length > 0){
        params.Filters = [{
            Name: "db-cluster-id",
            Values: dbClusterIds
        }];
    }
    return new Promise((resolve,reject)=>rds.describeDBClusters(params, getAwsCallback(resolve, reject)));
}

async function createDBSubnetGroup(action, settings){
    const rds = getRds(action, settings);
    const params = {
        DBSubnetGroupName: parsers.string(action.params.name),
        DBSubnetGroupDescription: parsers.string(action.params.description),
        SubnetIds: parsers.array(action.params.subnetIds),
        Tags: parsers.tags(action.params.tags)
    };
    return new Promise((resolve,reject)=>rds.createDBSubnetGroup(params, getAwsCallback(resolve, reject)));
}

async function modifyDBParameterGroup(action, settings){
    const name = parsers.string(action.params.name);
    const rds = getRds(action, settings);
    const params = {
        Parameters: action.params.parameters
    };
    if (action.params.type === CLUSTER_TYPE){
        params.DBClusterParameterGroupName = name;
        return new Promise((resolve,reject)=>rds.modifyDBClusterParameterGroup(params, getAwsCallback(resolve, reject)));
    }
    else {
        params.DBParameterGroupName = name;
        return new Promise((resolve,reject)=>rds.modifyDBParameterGroup(params, getAwsCallback(resolve, reject)));
    }
}

module.exports = {
    createDbInstance,
    deleteDbInstances,
    modifyDBCluster,
    createDBCluster,
    createDBParameterGroup,
    createDBSubnetGroup,
    modifyDBParameterGroup,
    describeDBClusters,
    // auto complete
    getRegions
};