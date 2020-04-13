## Building Developer portal from source

### Existing problems 
1. Swagger-UI which came with the portal has a major issue in it . 
2. The usual deployement was happenening using the code Dev portal had pre-compiled. the problem with this was any modifications we did , did not reflect in the front end 
3. Swagger-UI had a react dependency (V15.2.6) and Dev portal has React Dependency(16.8.4) and node doesnt allow you to have multiple react rependencies , this caused a lot of problems. 

This is the reason we have gone ahead and build a new portal from scratch so that all our changes are visible and swagger-ui can be updated. 


## How to Run

1. Make sure Node(>=12) is installed if not run
 ``` sudo apt update && sudo apt install nodejs npm```
2. Clone the Aws repository 
3. cd /<path_to_repo>/dev-portal/
4. install all node packages by running 
  ``` npm install ```
5. Since swagger-UI is manually installed we will need to add it as a soft link to the build
  ``` ln -s <abs_path_of_repo>/dev-portal/node_modules/swagger-ui   <abs_path_of_repo>/dev-portal/src/swagger-ui ```
6. Build the node module 
  ``` npm run build ```
if the above runs successfully we move ahead with the sam deployments
7. create sam package
    ``` sam package --template-file ./cloudformation/template.yaml --output-template-file ./cloudformation/packaged_devtest3.yaml --s3-bucket devops-test-sam<n> --region us-east-2 ```
 8. Deploy the sam package
 ``` sam deploy --template-file ./cloudformation/packaged_devtest3.yaml --stack-name "dev-portal-prakyath<n>"  --s3-bucket devops-test-sam<n>  --capabilities CAPABILITY_NAMED_IAM  --parameter-overrides DevPortalSiteS3BucketName="devops-test-devportal-assets<n>" ArtifactsS3BucketName="devops-test-devportal-artifacts<n>" CognitoIdentityPoolName="DevPortalIdentityPool<n>" CognitoDomainNameOrPrefix="sam-test-prakyath<n>" DevPortalCustomersTableName="DevPortalCustomers21" StaticAssetRebuildToken="MonApr13-07:02:28-UTC-2121" DevPortalPreLoginAccountsTableName='dev-portal-prakyath<n>' --region us-east-2 ```
