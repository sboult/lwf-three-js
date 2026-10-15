# Spinning Lambda Web Function

A tiny Express app served by an AWS Lambda Web Function. It displays a spinning
orange Lambda icon and runs the same standard Express HTTP server locally and
in AWS.

There is deliberately no Lambda handler, Function URL, API Gateway integration,
or web adapter. Express listens directly on `AWS_LAMBDA_HTTP_ENDPOINT`.

## Run locally

```bash
npm install
npm run local
```

Open `http://127.0.0.1:3000`. Set `PORT` to use a different port.

## Test and synthesize

```bash
npm test
npm run build
npm run synth
```

## Deploy with CDK

Configure AWS credentials, then bootstrap the target account/Region once:

```bash
npx cdk bootstrap
npm run deploy
```

CDK prints `WebFunctionUrl` when deployment completes.

The stack uses CDK's native L1 constructs for
`AWS::Lambda::WebFunction`, `AWS::Lambda::WebFunctionRevision`, and
`AWS::Lambda::WebFunctionEndpoint` CloudFormation resource types.

The endpoint uses application-managed authentication so the demo can be opened
in a browser. It is limited to two execution environments and 100 requests per
second for cost control. Put CloudFront and AWS WAF in front of it before using
this pattern for a production site.
