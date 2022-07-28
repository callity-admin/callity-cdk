### Adding a new environment
Ideally each stage-environment, dev.us-east-1 for example, would have a separate aws account. this minimizes blast radius and give better visibility into costs/billing causalities and experiments.

1. Add stage config in `config/stages.ts`
1. `npm run build`
1. `cdk ls` you should see your new stack listed there in the output, this is the STACK_NAME;
1. `cdk bootstrap`
1. `cdk deploy STACK_NAME`

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
