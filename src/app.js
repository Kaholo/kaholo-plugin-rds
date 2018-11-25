const aws = require("aws-sdk");

function handleInstance(type){
    return function(action){
        return new Promise((resolve,reject)=>{
            aws.config.update({
                region: action.params.REGION,
                accessKeyId: action.params.AWS_ACCESS_KEY_ID,
                secretAccessKey: action.params.AWS_SECRET_ACCESS_KEY
            });

            let rds = new aws.RDS();

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

module.exports = {
    createDbInstance: handleInstance('new'),
    deleteDbInstances: handleInstance('delete')
};