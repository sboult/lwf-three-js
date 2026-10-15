import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CfnOutput,
  Stack,
  Validations,
  type StackProps,
} from "aws-cdk-lib";
import {
  CfnWebFunction,
  CfnWebFunctionEndpoint,
  CfnWebFunctionRevision,
} from "aws-cdk-lib/aws-lambda";
import {
  ManagedPolicy,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import type { Construct } from "constructs";

const directory = path.dirname(fileURLToPath(import.meta.url));

export class SpinningLambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    Validations.of(this).acknowledge({
      id: "CloudFormation-Validate::F3006",
      reason:
        "The generated CDK Web Function constructs are newer than CDK's bundled CloudFormation validation schema.",
    });

    const lambdaService = new ServicePrincipal("lambda.amazonaws.com");
    const executionRole = new Role(this, "WebFunctionExecutionRole", {
      assumedBy: lambdaService,
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole",
        ),
      ],
    });

    const code = new Asset(this, "WebFunctionCode", {
      path: path.join(directory, "../dist/web"),
    });
    code.grantRead(lambdaService);

    const webFunction = new CfnWebFunction(this, "WebFunction", {
      functionName: `${this.stackName}-web`,
    });

    const revision = new CfnWebFunctionRevision(this, "WebFunctionRevision", {
      functionName: webFunction.ref,
      description: "Adapterless Express spinning Lambda demo",
      buildConfig: {
        codeConfig: {
          s3Object: {
            bucket: code.s3BucketName,
            key: code.s3ObjectKey,
          },
        },
        runtimeConfig: {
          runtime: "nodejs24.x",
        },
      },
      serviceConfig: {
        executionRoleArn: executionRole.roleArn,
        maxConcurrencyPerEnvironment: 10,
        timeoutSeconds: 30,
      },
    });

    const endpoint = new CfnWebFunctionEndpoint(this, "WebFunctionEndpoint", {
      authType: "ApplicationManaged",
      description: "Public endpoint for the adapterless Express demo",
      endpointName: "live",
      endpointType: "HomeRegion",
      functionName: webFunction.ref,
      revisionWeights: [
        {
          revisionId: revision.attrRevisionId,
          weight: 100,
        },
      ],
      scalingConfig: {
        maxEnvironments: 2,
      },
      throttleConfig: {
        rateLimit: 100,
      },
    });

    new CfnOutput(this, "WebFunctionUrl", {
      value: `https://${endpoint.attrDomainName}`,
      description: "Public URL for the AWS Lambda Web Function",
    });
  }
}
