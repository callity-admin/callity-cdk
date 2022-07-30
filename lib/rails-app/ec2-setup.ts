import { aws_certificatemanager, aws_ec2, aws_ecr, aws_elasticloadbalancingv2, aws_iam, aws_ram, aws_route53, aws_route53_targets, aws_ssm, Duration, Stack } from "aws-cdk-lib";
import { HealthCheck } from "aws-cdk-lib/aws-autoscaling";
import { InstanceIdTarget } from "aws-cdk-lib/aws-elasticloadbalancingv2-targets";
import { LoadBalancerTarget, Route53RecordTarget } from "aws-cdk-lib/aws-route53-targets";
import { readFileSync } from 'fs';
import { CallityCdkStack } from "../callity-cdk-stack";

export default class Ec2Setup {
    public ecr_repo: aws_ecr.Repository;
    public instance: aws_ec2.Instance;
    public stack: CallityCdkStack;
    public vpc: aws_ec2.IVpc;
    public role: aws_iam.Role;
    private sg: aws_ec2.SecurityGroup;
    private lb: aws_elasticloadbalancingv2.ApplicationLoadBalancer;

    constructor(stack: CallityCdkStack, ecr_repo: aws_ecr.Repository, vpc: aws_ec2.IVpc){
        this.stack = stack;
        this.ecr_repo = ecr_repo;
        this.vpc = vpc;

        this.role = this.instancePermissions();
        this.instance = this.createInstance();
        this.lb = this.loadBalancer();
        this.hostedZoneLink();
    }

    createInstance(){
        const userDataScript = readFileSync('./config/ec2/userdata.txt', 'utf8'),
        sg = new aws_ec2.SecurityGroup(this.stack, 'railsEc2sg', {
            securityGroupName: 'railsEc2Sg',
            vpc: this.vpc
        }),
        instance = new aws_ec2.Instance(this.stack, 'railsEc2', {
            instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T4G, aws_ec2.InstanceSize.SMALL),
            vpc: this.vpc,
            machineImage: aws_ec2.MachineImage.genericLinux({
                'us-west-2': 'ami-08e93a9522bbe6df6'
            }),
            // machineImage: aws_ec2.MachineImage.latestAmazonLinux({
            //     cpuType: aws_ec2.AmazonLinuxCpuType.ARM_64, // (DEFAULT = aws_ec2.AmazonLinuxCpuType.X86_64)
            // }),
            securityGroup: sg,
            role: this.role,
            keyName: 'mario-ssh'
        });

        instance.addUserData(userDataScript);

        this.ecr_repo.grantPull(instance);

        this.sg = sg;

        return instance;
    }

    instancePermissions(){
        return new aws_iam.Role(this.stack, 'railsEc2InstRole', {
            assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com')
        })
    }

    loadBalancer(){
        const lbSecGroup = new aws_ec2.SecurityGroup(this.stack, 'albSecGroup', {
            vpc: this.vpc
        });
        

        const lb = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this.stack, 'ec2StackRailsAlb', {
            loadBalancerName: 'railsEc2',
            deletionProtection: false,
            securityGroup: lbSecGroup,
            vpc: this.vpc,
            internetFacing: true
        });

        const listener = lb.addListener('callityRailsEc2AlbList', {
            protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
            certificates: [
                aws_certificatemanager.Certificate.fromCertificateArn(this.stack, 'cert', 'arn:aws:acm:us-west-2:854156568176:certificate/6cf8a0a4-36d7-43dd-929a-96354d0bcef8')
            ]
        });

        lb.addRedirect({
            sourceProtocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
            targetProtocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
            open: true
        })

        listener.addTargets('callityRailsAlbListnTarget', {
            healthCheck: {
                enabled: true,
                path: "/ping",
                protocol: aws_elasticloadbalancingv2.Protocol.HTTP
            },
            targets: [
                new InstanceIdTarget(this.instance.instanceId, 80)
            ],
            protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
            
        });

        return lb;
    }

    hostedZoneLink(){
        this.stack.hosted_zone

        new aws_route53.ARecord(this.stack, 'albArecord', {
            // recordName: '',
            ttl: Duration.seconds(60),
            target: aws_route53.RecordTarget.fromAlias(new aws_route53_targets.LoadBalancerTarget(this.lb)),
            zone: this.stack.hosted_zone,
        });
    }
}