import { aws_ec2, aws_ecr, aws_ssm, Stack } from "aws-cdk-lib";
import { readFileSync } from 'fs';

export default class Ec2Setup {
    public ecr_repo: aws_ecr.Repository;
    public instance: aws_ec2.Instance;
    public stack: Stack;

    constructor(stack: Stack, ecr_repo: aws_ecr.Repository){
        this.stack = stack;
        this.ecr_repo = ecr_repo;

        // this.instance = this.createInstance();
    }

    createInstance(){
        const userDataScript = readFileSync('./config/ec2/userdata.txt', 'utf8'),
        instance = new aws_ec2.Instance(this.stack, 'railsEc2', {
            instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.MICRO),
            vpc: aws_ec2.Vpc.fromLookup(this.stack, 'defaultVpcRef', {
                vpcId: "vpc-0de26d10041a1efde"
            }),
            machineImage: aws_ec2.MachineImage.latestAmazonLinux({
                // cpuType: aws_ec2.AmazonLinuxCpuType.X86_64 // (DEFAULT)
            }),
            // securityGroup: 
        });

        instance.addUserData(userDataScript);

        return instance;
    }
}