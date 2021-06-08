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
11. DB Cluster Param Group Name (String)

## Method: Create DB Cluster

### Description

Creates a new Amazon Aurora DB cluster.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBCluster-property)

### Parameters

1. Access key (Vault) **Optional** - Used for authemticationg to AWS.
2. Secret key (Vault) **Optional** - Used for authemticationg to AWS.
3. Region (Options) **Required** - The AWS region to create the cluster in.
4. DB Cluster Identifier (String) **Required** - The DB cluster identifier. This parameter is stored as a lowercase string. 
5. Engine (Options) **Optional** - The name of the database engine to be used for this DB cluster. Valid Values: aurora (for MySQL 5.6-compatible Aurora)|aurora-mysql (for MySQL 5.7-compatible Aurora)|aurora-postgresql. Default values is aurora.
6. Engine Mode (Options) **Optional** - The DB engine mode of the DB cluster, either provisioned|serverless|parallelquery|global|multimaster. Default Value is provisioned.
7. Availability Zones (Text/Array) **Optional** - A list of Availability Zones (AZs) where instances in the DB cluster can be created.
8. Scaling Min Capacity (Int) **Optional** - The minimum capacity for an Aurora DB cluster in serverless DB engine mode.
9. Scaling Max Capacity(Int) **Optional** - The maximum capacity for an Aurora DB cluster in serverless DB engine mode.
10. Master Usermame (String) **Required** - The username for the master User of this DB Cluster.
11. Master User Password (Vault) **Required** - The password for the master User of this DB Cluster.
12. Port (Int) **Optional** -   The port number on which the instances in the DB cluster accept connections. **Default:** 3306 if engine is set as aurora or 5432 if set to aurora-postgresql.
13. Vpc Security Group IDs (Text/Array) **Optional** - A list of EC2 VPC security groups to associate with this DB cluster.
14. Tags (Object/Text) **Optional** - If specified, tag the DB Cluster with the tags specified. Each tag should either be in the format of Key=Value or just Key. To enter multiple values seperate each with a new line. Also accepts getting an array of objects in the form of { Key, Value } or { Key }, or getting an object.
15. Additional Parameters(Object/Text) **Optional** - If specified, add all the parameters provided, to the request sent to the AWS API. Can be provided either as an object from code, or as text. If provided as text, only accepts string parameter values. If entered as text should be provided in the format of: PARAM-NAME=Value.

## Method: Create DB Parameter Group

### Description

Creates a new DB/DB Cluster Paramater Group.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBParameterGroup-property)

### Parameters

1. Access key (Vault) **Optional** - Used for authemticationg to AWS.
2. Secret key (Vault) **Optional** - Used for authemticationg to AWS.
3. Region (Options) **Required** - The AWS region to create the cluster in.
4. DB Parameter Group Family (String) **Required** - The DB parameter group family name. 
5. Name (String) **Required** - The name of the Parameter Group to create.
6. Parameter Group Type (Options) **Required** - The type of parameter group to create. Possible values are DB Parameter Group/DB Cluster Parameter Group. Default value is DB Parameter Group.
7. Description (Text) **Optional** - The description of the parameter group.
8. Parameters (Array Of Objects) **Optional** - An array of parameter objects to assign to the new created group. You can see how to create parameter objects in this [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBParameterGroup-property).
9. DB Identifier (String) **Optional** - If specified, attach the specified Database or Database Cluster to this parameter group.
10. Tags (Object/Text) **Optional** - If specified, tag with the tags specified. Each tag should either be in the format of Key=Value or just Key. To enter multiple values seperate each with a new line. Also accepts getting an array of objects in the form of { Key, Value } or { Key }, or getting an object.

## Method: Describe DB Clusters

### Description

Returns information about specified Aurora DB clusters.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#describeDBClusters-property)

### Parameters

1. Access key (Vault) **Optional** - Used for authemticationg to AWS.
2. Secret key (Vault) **Optional** - Used for authemticationg to AWS.
3. Region (Options) **Required** - The AWS region to create the cluster in.
4. DB Cluster IDs (Text/Array) **Optional** - If specified, return information only about the specified DB clusters. To enter multiple values seperate each with a new line.

## Method: Create DB Subnet Group

### Description

Creates a new DB subnet group. DB subnet groups must contain at least one subnet in at least two AZs in the AWS Region.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBSubnetGroup-property)

### Parameters

1. Access key (Vault) **Optional** - Used for authemticationg to AWS.
2. Secret key (Vault) **Optional** - Used for authemticationg to AWS.
3. Region (Options) **Required** - The AWS region to create the cluster in.
4. Name (String) **Required** - The name of the new subnet group to create.
5. Description (Text) **Optional** - The description of the subnet group.
6. Subnet IDs (Text/Array) **Required** - The IDs of all subnets to include in the subnet group.
7. Tags (Object/Text) **Optional** - If specified, tag with the tags specified. Each tag should either be in the format of Key=Value or just Key. To enter multiple values seperate each with a new line. Also accepts getting an array of objects in the form of { Key, Value } or { Key }, or getting an object.

## Method: Modify DB Parameter Group

Modify an existion DB Cluster with the specified values. Used to assign values to parameter of an existing parametr group.
This method is based on the [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#modifyDBParameterGroup-property)

### Parameters

1. Access key (Vault) **Optional** - Used for authemticationg to AWS.
2. Secret key (Vault) **Optional** - Used for authemticationg to AWS.
3. Region (Options) **Required** - The AWS region of the parameter group.
4. Name (String) **Required** - The name of the parameter group to modify.
5. Parameter Group Type (Options) **Required** - The type of the existing parameter group. Can't be changed.
6. Parameters (Array Of Objects) **Required** - An array of parameter objects to assign to the specified parameter group. You can see how to create parameter objects in this [documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#createDBParameterGroup-property).
