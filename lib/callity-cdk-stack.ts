import { aws_ec2, aws_route53, aws_secretsmanager, Stack, StackProps } from 'aws-cdk-lib';
import { IVpc, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import RailsApp from './rails-app';

export class CallityCdkStack extends Stack {
  public hosted_zone: aws_route53.IHostedZone;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc: IVpc = aws_ec2.Vpc.fromLookup(this, 'defaultVpcRef', {
      vpcId: "vpc-0de26d10041a1efde"
    });

    const appHzId = "Z069931226DTH7CJF777B";
    this.hosted_zone = aws_route53.HostedZone.fromHostedZoneAttributes(this, 'appCallityHz', {
      hostedZoneId: appHzId,
      zoneName: "app.callity.info"
    });

    new RailsApp(this, vpc);
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CallityCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
