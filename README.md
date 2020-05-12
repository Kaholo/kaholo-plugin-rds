# kaholo-plugin-rds
Kaholo plugin for AWS RDS

**Description**

This plugin wraps methods in AWS-RDS based on the [Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html)

**Settings**

1. Access key - Type Vault
2. Secret key - Type Vault

**Methods**

1. createDbInstance
2. deleteDbInstances
3. modifyDBCluster

## Method: createDbInstance

**Description**

This method create a new DB Instance based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBInstance-property)

**Parameters**
1. Access key - Type Vault
2. Secret key - Type Vault
3. Region - Type option
4. DB Instance Class - Type String
5. DB Instance Identifier - Type String
6. Database Engine - Type String
7. Additional Object of values - Type String

## Method: deleteDbInstances

**Description**

The DeleteDBInstance action deletes a previously provisioned DB instance. When you delete a DB instance, all automated backups for that instance are deleted and can't be recovered. Manual DB snapshots of the DB instance to be deleted by DeleteDBInstance are not deleted.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#deleteDBInstance-property)

**Parameters**

1. Access key - Type Vault
2. Secret key - Type Vault
3. DB Instance Identifier - Type String
4. Skip Final Snapshot - Type Boolean
5. Final DB Snapshot Identifier - String

## Method: modifyDBCluster

**Description**

Modify a setting for an Amazon Aurora DB cluster. You can change one or more database configuration parameters by specifying these parameters and the new values in the request.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBCluster-property)

**Parameters**

1. Access key - Type Vault
2. Secret key - Type Vault
3. Region - Type Option
4. DB Cluster Identifier - Type String
5. Scaling Min Capacity - Type String
6. Scaling Max Capacity - Type String
7. Master User Password - Type String
8. Domain - Type String
9. Preferred Backup Window - Type String
10. Preferred Maintenance Window - Type String
