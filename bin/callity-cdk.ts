#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CallityCdkStack } from '../lib/callity-cdk-stack';

import stages, { CallityStage, CallityStageConfig } from "../config/stages";

const app = new cdk.App();

for(const stage_env in stages){
  const stage: CallityStage = stages[stage_env],
  stackName = `Callity-${stage.stack_prefix}`;

  new CallityCdkStack(app, stackName, {
    env: {
      account: stage.aws_account,
      region: stage.region
    }
  });
}

// new CallityCdkStack(app, 'CallityCdkStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });