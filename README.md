### Adding a new environment
Ideally each stage-environment, dev.us-east-1 for example, would have a separate aws account. this minimizes blast radius and give better visibility into costs/billing causalities and experiments.

1. Add stage config in `config/stages.ts`
1. `npm run build`
1. `cdk ls` you should see your new stack listed there in the output, this is the STACK_NAME;
1. `cdk bootstrap`
1. `cdk deploy STACK_NAME`
1. create a key pair in aws console named `ssh-mario` and download it
1. you will need to add a ingress rule in the ec2 security group for you to be able to ssh and a rule from load balancer security group to instance in instange Sg -- manual for now, from console.
1. ssh into the ec2 instance and add ec2-user to the docker users
1. then run `aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 854156568176.dkr.ecr.us-west-2.amazonaws.com` and `docker pull 854156568176.dkr.ecr.us-west-2.amazonaws.com/callity:latest`
1. start app in container

### Gotchas
1. every time you deploy, or recreate, a stage, you need to manually create the security group rules.

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
