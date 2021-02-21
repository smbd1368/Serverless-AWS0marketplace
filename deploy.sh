#! /bin/bash
echo 'runing pwd'
pwd
echo 'runing ls .'
ls 
echo 'runing whoami'
whoami
echo 'running $CODEBUILD_SRC_DIR/target/$env'
echo $CODEBUILD_SRC_DIR/target/$env
echo 'runing ls $CODEBUILD_SRC_DIR/target/$env'
ls $CODEBUILD_SRC_DIR/target/$env
export SLS_DEBUG=* 
#ls -la /usr/local/lib/node_modules
#sudo chown -R $(whoami) ~/.npm
#sudo chown -R $(whoami) /usr/lib/node_modules
npm i 
npm install -g serverless --unsafe-perm=true --allow-root
#npm install --save-dev serverless-aws-alias-fixed --unsafe-perm=true --allow-root
#npm install --save-dev sserverless-domain-manager --unsafe-perm=true --allow-root 
#serverless deploy --stage $env --package $CODEBUILD_SRC_DIR/target/$env -v -r ap-southeast-2
rm serverless.yml && cp serverless-deploy.yml serverless.yml
serverless deploy    #ap-southeast-2
#--package $CODEBUILD_SRC_DIR/target/$env -v -r --masterAlias 
