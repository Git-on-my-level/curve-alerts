import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const botFunction = new lambda.Function(this, "BotFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("dist"),
      timeout: cdk.Duration.minutes(5),
      memorySize: 256,
    });

    // Create EventBridge rule to trigger Lambda every 15 minutes
    const rule = new events.Rule(this, "ScheduleRule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(15)),
    });

    // Add Lambda as target
    rule.addTarget(new targets.LambdaFunction(botFunction));
  }
}
