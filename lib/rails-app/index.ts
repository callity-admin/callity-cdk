import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { aws_ec2, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ApplicationLoadBalancedEc2Service, ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { EcsEc2LaunchTarget } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { InstanceClass, InstanceSize, InstanceType, IVpc, Vpc } from 'aws-cdk-lib/aws-ec2';

import Ec2Setup from './ec2-setup';
import { CallityCdkStack } from '../callity-cdk-stack';

export default class RailsApp {
    private stack: CallityCdkStack;
    public repo: ecr.Repository;
    public ecs_service: ApplicationLoadBalancedFargateService;
    public vpc: IVpc;

    constructor(stack: CallityCdkStack, vpc: IVpc){
        this.stack = stack;
        this.repo = this.createEcrRepo();
        this.vpc = vpc;

        new Ec2Setup(this.stack, this.repo, this.vpc);
        // this.ecs_service = this.createEcsService();
    }

    createEcrRepo(){
        return new ecr.Repository(this.stack, 'railsEcrRepo', {
            repositoryName: 'callity',
            removalPolicy: RemovalPolicy.DESTROY
        });
    }

    createEcsService(){
        return new ApplicationLoadBalancedFargateService(this.stack, 'railsEcsServ', {
            // cluster: cluster, // Required
            cpu: 256, // Default is 256
            desiredCount: 1, // Default is 1
            taskImageOptions: { 
                // image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
                image: new ecs.EcrImage(this.repo, "latest")
            },
            memoryLimitMiB: 512, // Default is 512
            publicLoadBalancer: true, // Default is false
        })
    }
}