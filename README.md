GitHub Actionsが使用するIAMロールを作成します。

```bash
aws cloudformation create-stack --stack-name github-actions-role --template-body file://cfn-template.yaml --capabilities CAPABILITY_NAMED_IAM
```

ECRリポジトリを作成します。

```bash
aws ecr create-repository --repository-name ts-dockerfile-sample
```
