#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SpinningLambdaStack } from "../lib/spinning-lambda-stack.ts";

const HOME_REGION = "us-east-2";

const app = new cdk.App();

new SpinningLambdaStack(app, "SpinningLambdaStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: HOME_REGION,
  },
  description: "A tiny web page served by Lambda with a spinning orange lambda.",
});
