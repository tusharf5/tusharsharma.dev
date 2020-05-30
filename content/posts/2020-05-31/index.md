---
uid: 'better-cfn-templates'
title: 'Write Better Cloudformation Templates'
category: 'AWS'
draft: false
tags:
  - aws
  - ecs
  - cloudformation
  - cfn
  - stacks
excerpt: 'Some good practices that me and my team follows while working with Cloudformation. These practices have helped us to write better cloudformation templates and deploy more often with extra confidence. Let's start 🏁'
---

At [Gerald](https://gerald.app) we heavily use **Cloudformation** to deploy our cloud infrastructure. Our backend architecture is fairly complex with a lot of moving parts. From API servers to Big Data Engines and Data Science components, everything is deployed using cloudformation which integrates seamlessly with our CI/CD pipelines. The benefits of using cloudformation which is an Infrastructure as a Code service provided by AWS is huge.

A few things that I love about using Cloudformation.

- Track your Infrastructure via **version control** since CFN templates are just `.yaml` or `.json` files.

- Easy to replicate. Since CFN templates are just text files you can easily create replicas of your existing infrastructure to create new AWS environments.

- Easily integrates with CI/CD tools and pipelines ❤️.

![Write Better Cloudformation Templates](https://softcrylic.com/wp-content/uploads/2019/06/aws-cloud-formation-template-fi.jpg)

I want to write a few good practices that me and my team follows while working with Cloudformation. These practices have helped us to write better cloudformation templates and deploy more often with extra confidence. Let's start 🏁

## Don't provide a Resource Name

... **If** it is not required. A lot of CFN resources have a `Name` or a similar attribute which is used to give a logical name to a resource. One major problem that comes if you provide a static value for that would be that CFN cannot replace that resource if needs to while updating.

```yaml
Resources:
	APIDockerRepository:
	  Type: AWS::ECR::Repository
    Properties: 
      RepositoryName: "api-repository"
      SomeOtherAttribute: "value"
```

Let's say to perform an update on this **ECR Repository** CFN needs to replace it and create a new one in its place. In the above case, CFN won't be able to do that since the `RepositoryName` has a static value. Why? To understand that you need to know how CFN updates resources.

Whenever you make a change to a CFN Stack, CFN will first decide whether it can just update the existing resource or does it need to create a new one and replace the existing one with it.

In the case when it can just update the existing resource, it will do that and remember that action as well as the previous state of that resource. In case it needs to perform a **Rollback** it will undo the updates performed on that resource and will restore its previous state.

Now in the case when it cannot update the existing resource and it needs to create a new one. CFN will create a new resource and replace the existing one with the new one. It will remember the previous resource and its state just in case it needs to perform a Rollback. In the case of a **Rollback**, it will delete the newly created resource and bring back the one that was deleted (**in most of the cases**).

Now here's the thing, to replace the ECR repository with a new one, CFN will try to create a new repository with the same attributes and one of the attributes is `RepositoryName` which has a static value of *api-repository*. Now, if you've worked with ECR, you might know that you cannot have two repositories with the same name. So when CFN tries to create a new ECR repository, it fails as ECR throws an error *"Repository already existed"*.

There are workarounds to this problem (delete first, create after) but a better solution (if it fits your requirements) is to omit the name attribute at all. By doing that, you leave the responsibility of naming your resources on CFN. CFN will give a pseudo-random name to your resource when it creates it.

```yaml
Resources:
	APIDockerRepository:
	  Type: AWS::ECR::Repository
    Properties: 
      SomeOtherAttribute: "value"
```

Now, the next time CFN needs to replace it, it can create a new resource with a new random name and replace it with the existing one. You don't have to break a sweat when updating resources 😇

## Comment Everything

I can't emphasize how important it is to comment every resource, parameter, attribute that is not very obvious in the first look. A CFN file can be overwhelming to look at when you're seeing it for the first couple of times. It will be an absolute disaster if there are no comments provided to help you understand the reasoning behind the values. That's why I prefer to use `.yaml` files as you can add comments in a YAML file which is not the case with `.json` templates where there is no way to add comments.

I also make sure to add references in the comments to the official docs as well as statements that describe what was the reason behind adding an attribute or its value. It has helped me more than anyone else especially when I go back to view a template that I created a while ago. I don't have to re-think the reasoning as I can read it in the comments.

## 3. Don't Hard Code Stuff

Hard coding stuff is bad. Especially when you are creating resources in the cloud. Your infrastructure should be flexible enough to change as per the architecture. I'll list some typical things that I've seen are commonly hardcoded in CFN Templates.

- RAM/Compute/Disk Sizes...
- S3 Bucket Names
- CIDR/IP Ranges
- Instance Types
- AutoScaling/ReplicaSet Values
- ...etc

There will be a problem associated with each one of the above if you hard code their values. Let's go over some of them and see where the problem lies.

**RAM/CPU/Disk Size**

Let's assume that you are using **4GiB** as the RAM value for production. Now you need to deploy the same Stack for testing. Of course, you will not use **4GiB** for the testing environment, it will be something like **1Gib**. Will you create a duplicate stack for testing? or re-use the same stack with dynamic values for `production` and `testing`.

**S3 Bucket Names**

Let's assume in the current Stack you have an S3 bucket with name `user.images` where you are storing all the user images. Now if you want to store user images in different buckets based on the user's region. You would need multiple buckets. Would you create duplicate stacks with different bucket names and deploy them in multiple regions? or you would want to re-use the existing stack more **intelligently**.

But how to do that? CFN template language has multiple constructs to make our templates dynamic and thus more flexible.

### Parameters

Parameters are user provided inputs when CFN is creating/updating a Stack. It comes with type checking, regex validations, pre-defined options etc.

```yaml
Parameters:
  Environment:
    Description: An environment name
    Type: String
    AllowedValues:
      - production
      - stage
  UserRegion:
    Description: "A value for the company's region"
    Type: String
    AllowedValues:
      - asia
      - us
      - eu

Resources:
  TaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      ContainerDefinitions:
        - Environment:
            - Name: NODE_ENV
              Value: production
            - Name: NODE_CONFIG_ENV
              # providing Environment value to docker container as an environment variable
              Value: !Ref Environment
```

In this way, I can re-use the same template and deploy it for different environments and it will automatically use the right values. The value of the environment parameter will be provided by the person deploying the Stack.

### Mappings

Mappings are key-value pairs that have different values based on different context.

Extending the previous example, let's say I want to use different instance types for different environments. Here's how the CFN **Mappings** can help. I am also using different bucket names for different regions.

```yaml
Mappings:
  EnvBased:
    stage:
      mainApiEc2Type: t3.small
      mainApiMem: 512
    production:
      mainApiEc2Type: m5a.xlarge
      mainApiMem: 1024
  RegionBased:
    asia:
      userImageBucket: asia.user.images
    us:
      userImageBucket: us.user.images
    eu:
      userImageBucket: eu.user.images

Resources:
  EC2LaunchConfig:
    Type: AWS::AutoScaling::LaunchConfiguration
    DependsOn: PrivateRoute
    Properties:
      InstanceType: !FindInMap [EnvBased, !Ref Environment, mainApiEc2Type]

  TaskDefinition:
    Type: AWS::ECS::TaskDefinition
    DependsOn: MainAPITaskRole
    Properties:
      ContainerDefinitions:
        - Memory: !FindInMap [EnvBased, !Ref Environment, mainApiMem]

  CodeArtifactsBucket:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: Private
      BucketName: !FindInMap [RegionBased, !Ref UserRegion, userImageBucket]

```

### Conditions

Sometimes you also want to conditionally create resources. For example, you only want **Cloudtrail** enabled for the production account. Conditions help you define conditions which you can used to specify whether to create a resource or not.

```yaml
Parameters:
  Environment:
    Description: An environment name
    Type: String
    AllowedValues:
      - production
      - stage
      
Conditions:
  CreateProdResources: !Equals [!Ref Environment, production]

Resources:
  CloudTrail:
    Type: AWS::CloudTrail::Trail
    Condition: CreateProdResources
    Properties:
      S3BucketName: "cloud-trail"

```

This way if you deploy this template in `stage` environment **Cloudtrail** will not be created.

### Use Cross-Stack References

A lot of times you will have multiple stacks that powers your project's infrastructure. In a lot of those scenarios, you might want to use a resource across multiple stacks. For example, you could have a **Network** stack that manages your **VPC**s and you will need to refer to VPCs defined in that stack when creating resources in other stacks. In such cases, it is not the right approach to copy-paste values from one stack and hardcode them in another stack. Instead, it's advisable to use cross-stack references using **Export** and **Import**.

One caveat with using this approach is that once an exported value is used (imported) in another stack it can not be changed.

## Divide your Stacks into Units

Now I've learned this lesson from a real-life scenario where I created a **2500+** lines of CFN template. Although it was properly organized but it still became a bottleneck for us to make changes to it.

In general, your Stack should be like a unit of similar resources that all achieve one primary goal. For instance, a typical web architecture includes a database, API server, frontend server.

You could divide it into the following units.

- **AppName-VPC** - that creates VPC,Subnets,VPC Endpoints, IG, NAT Gateways etc.
- **AppName-API** - that creates the API server resources like AutoScaling group, Launch Config, Security Groups, S3 Buckets, Load Balancers.
- **AppName-Front** - that creates the S3 bucket, Cloudfront distribution, Route53.
- **AppName-DB** - that creates the databases required for the application.

This way you would be able to make targeted changes to the infrastructure which will not affect all parts of it. You can use cross-reference stack values to reference/use resources from other stacks.

## Cloudformation is AWS

Majority of the things that I've learned about different AWS services is through Cloudformation docs. A lot of **[Important]** things which you might miss while using the Console have to
be explicitly specified when using CFN Templates which provides a wholesome picture of that AWS service. You should read about all the attributes in the docs when defining a resource. It will help you gain a more in-depth understanding of how the service works under the hood.

## Conclusion

Well, that's about it. In this post, I went through some of the things I learned while working with CloudFormation. Two years ago, I started using Cloudformation and I've never looked back at the Console for creating things in AWS. From side projects to enterprise Cloudformation has always proven itself to be a great choice for managing Cloud Infrastructure on AWS. If you've never tried it I encourage you to try it once. Start with small and remember Sky is the Limit! 🚀
