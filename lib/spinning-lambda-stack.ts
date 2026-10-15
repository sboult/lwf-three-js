import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CfnOutput,
  Duration,
  Stack,
  type StackProps,
} from "aws-cdk-lib";
import {
  Architecture,
  FunctionUrlAuthType,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";

const directory = path.dirname(fileURLToPath(import.meta.url));

export class SpinningLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webFunction = new NodejsFunction(this, "WebFunction", {
      entry: path.join(directory, "../src/handler.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_22_X,
      architecture: Architecture.ARM_64,
      memorySize: 256,
      timeout: Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // This demo is intentionally public so a browser can open it directly.
    const functionUrl = webFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, "WebFunctionUrl", {
      value: functionUrl.url,
      description: "Public URL for the spinning Lambda page",
    });
  }
}
