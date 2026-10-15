# Spinning Lambda

A tiny web page served by an AWS Lambda Function URL. It displays a spinning
orange Lambda icon and uses the same page renderer locally and in AWS.

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

The Function URL is intentionally public (`AuthType: NONE`) so the page can be
opened in any browser. It has no built-in rate limiting or WAF; put CloudFront
and AWS WAF in front of it before using this pattern for a production site.
