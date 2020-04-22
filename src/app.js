const aws = require("aws-sdk");

function _getRds(action,settings){
    return new aws.RDS({
        region: action.params.REGION,
        accessKeyId: action.params.AWS_ACCESS_KEY_ID || settings.AWS_ACCESS_KEY_ID,
        secretAccessKey: action.params.AWS_SECRET_ACCESS_KEY || settings.AWS_SECRET_ACCESS_KEY
    })
}

function handleInstance(type){
    return function(action, settings){
        return new Promise((resolve,reject)=>{
            
            const rds = _getRds(action,settings);

            function callback(err, result){
                if (err) return reject(err);
                resolve(result);
            }

            if(type=='new'){
                let params = {
                    DBInstanceClass: action.params.DB_INSTANCE_CLASS, /* required */
                    DBInstanceIdentifier: action.params.DB_INSTANCE_IDENTIFIER, /* required */
                    Engine: action.params.ENGINE, /* required */
                }

                if(action.params.ADDITIONAL_VALUES){
                    let values;
                    if(typeof(action.params.ADDITIONAL_VALUES)=='string'){
                        try{ values = JSON.parse(action.params.ADDITIONAL_VALUES) }catch(err){}
                    } else if(typeof(action.params.ADDITIONAL_VALUES)=='object'){
                        values = action.params.ADDITIONAL_VALUES;
                    }

                    if(values){
                        for(let key in values){
                            params[key] == values[key];
                        }
                    }
                }

                rds.createDBInstance(params,callback)
            } else {
                let params = {
                    DBInstanceIdentifier: action.params.DB_INSTANCE_IDENTIFIER, /* required */
                    SkipFinalSnapshot: action.params.SKIP_FINAL_SNAPSHOT,
                    FinalDBSnapshotIdentifier: action.params.FINAL_DB_SNAPSHOT_IDENTIFIER
                }

                rds.deleteDBInstance(params,callback);
            }
        })
    }
}

function modifyDBCluster(action,settings){
    return new Promise((resolve,reject)=>{
        const rds = _getRds(action,settings);

        const params = {
            DBClusterIdentifier : action.params.dbClusterIdentifier
        }

        if(action.params.scalingConfigurationMinCapacity || action.params.scalingConfigurationMaxCapacity){
            params.ScalingConfiguration = {
                MinCapacity: action.params.scalingConfigurationMinCapacity,
                MaxCapacity: action.params.scalingConfigurationMaxCapacity
            }
        }

        if(action.params.masterUserPassword){
            params.MasterUserPassword = action.params.masterUserPassword;
        }

        if(action.params.domain){
            params.Domain = action.params.domain;
        }

        if(action.params.preferredBackupWindow){
            params.PreferredBackupWindow = action.params.preferredBackupWindow;
        }

        if(action.params.preferredMaintenanceWindow){
            params.PreferredMaintenanceWindow = action.params.preferredMaintenanceWindow;
        }

        rds.modifyDBCluster(params, (err,result)=>{
            if(err) return reject(err);
            resolve(result)
        })
    })
    
}

module.exports = {
    createDbInstance: handleInstance('new'),
    deleteDbInstances: handleInstance('delete'),
    modifyDBCluster : modifyDBCluster
};