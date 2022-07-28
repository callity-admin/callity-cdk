export interface CallityStage {
    aws_account: string;
    region: string;
    stack_prefix: string;
}

export interface CallityStageConfig {
    [env_name: string]: CallityStage
}

const stages: CallityStageConfig = {
    dev: {
        aws_account: "854156568176",
        region: "us-west-2",
        stack_prefix: "duw1"
    }
}

export default stages;