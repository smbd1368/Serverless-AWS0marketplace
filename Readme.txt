
"Dependencies": You can review package.json

1 - npm i 

Note: 
The file serverless-deploy is very matter and be careful


We work with two yaml file for deploy and offline test.

So if you have any changes you can edit serverless-deploy , serverless-offline
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
How to run on windows:
"run offline" :   .\offline_win.sh ; serverless offline
_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
How to run on mac:
"run offline" :   .\offline_mac.sh && serverless offline

Deployment
for deployment just push your branch.Remember update serverless-deploy.yml with any new functions or changed coinfiguration.

Each branch will be deployed as separate runtime enviroment."Service  name" in serverless.yml should be uniqe for all brannch to keep name convension right.
you just keep update "Stage" with branch name .

service: mp-api # for all branch 
stage= [prod|dev|uat]