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
excerpt: 'A few things that one should look for when working with AWS Cloudformation. These things have helped me and my team to write better Cloudformation
templates and deploy more often with confidence.'
---

We heavily use **Cloudformation** to deploy our cloud infrastructure at [Gerald](https://gerald.app). Our infrastructure is fairly complex with a lot of moving parts. From API servers to Big Data Engines and Data Science components everything is deployed using Cloudformation which integrates seamlessly with our CI/CD pipeline. The benefits of using Cloudformation which is an Infrastructure as a Code service provided by AWS is huge.

A few things that I love about using Cloudformation.

- Track your Infrastructure via **version control** since CFN templates are just `.yaml` or `.json` files.

- Easy to replicate. Since CFN templates are just text file you can easily create replicas of your infrastructure to create exact replicas of your existing AWS environments.

- Easily integrates with CI/CD tools and pipelines ❤️.

![Write Better Cloudformation Templates](https://softcrylic.com/wp-content/uploads/2019/06/aws-cloud-formation-template-fi.jpg)

I want to write a few things that one should look for when working with Cloudformation. These things have helped me and my team to write better Cloudformation
templates and deploy more often with confidence. Let's start 🏁

## Don't provide a Resource Name

... if it is not required. A lot of CFN resources have a `Name` or a similar attribute which is used to give a logical name to a resource. One major problem that comes if you provide a static name value to your resources is that CFN cannot replace that resource it if needs to while updating it.

```yaml
Resources:
	APIDockerRepository:
	  Type: AWS::ECR::Repository
    Properties: 
      RepositoryName: "api-repository"
      SomeOtherAttribute: "value"
```

Let's say to perform an update on this **Resource** CFN needs to replace this resource and create a new one in its place. In the above case, CFN won't be able to do that since the `RepositoryName` is a static value. Why? To understand that you need to know how CFN updates resources.

Whenever you make a change to a CFN Stack, CFN will first decide whether it can just update the existing resource or does it need to create a new one and replace the existing with it.

In the case when it just can update the existing resource, it will update the existing resource and remember that action as well as the previous state of that resource. In case it needs to perform a **Rollback** it will just undo the updates performed on that resource and restores the previous state.

Now in the case when it cannot update the existing resource and it needs to create a new one. CFN creates a new resource and replaces the existing one with the new one. It still remembers the previous resource state in case it needs to perform a Rollback. In the case of a **Rollback**, it will delete the newly created resource and bring back the one that was deleted (**in most of the cases**).

Now here's the thing, to replace the ECR-repository with a new one, CFN will try to create a new Repository with the same attributes, one of the attributes is `RepositoryName` which has a static value of *api-repository*. If you've worked with ECR, you might know that you cannot have two repositories with the same name. So when CFN will try to create a new replacement ECR repo, it will fail as ECR will throw an error *"Repository already existed"*.

There are workarounds to this problem but a better solution (if it fits your requirements) is to omit the name attribute at all. By doing that, you leave the responsibility of naming your resources on CFN. CFN will give a pseudo-random name to your resource.

```yaml
Resources:
	APIDockerRepository:
	  Type: AWS::ECR::Repository
    Properties: 
      SomeOtherAttribute: "value"
```

Now, CFN can create a new copy of this resource with a new random name and replace it with the existing one. You don't have to break a sweat when updating resources 😇

## Comment Everything

I can't emphasize how important it is to comment on every resource, parameter, attribute that is not obvious in the first look. A CFN file can be overwhelming to look at when you're seeing it for the first couple of times. It will be an absolute disaster if there are no comments provided to help you understand the reasoning behind the values. That's why I prefer to use `.yaml` files as you can provide multiline comments in a YAML file which is not the case with `.json` templates where there is no way to write comments.

I always make sure to add lines in the comments from the Official Docs as well as lines that describe what was the reason behind adding an attribute. It has helped me more than anyone else especially when I go back to view a template that created a while ago. I don't have to debug/re-think the reasoning as I can read it in the comments.

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

Let's assume that you are using **4GiB** as the RAM value for production. Now you need to deploy the same Stack for testing. Of course, you will not use **4GiB** for the testing environment, it will be something like **1Gib**. Will you create a duplicate Stack for testing? or re-use the same stack with dynamic values for production and testing.

**S3 Bucket Names**

Let's assume in the current Stack you have an S3 bucket with name `user.images` where you are storing all the user images. Now if you want to store user images in different buckets based on the Stack Region. You would need multiple buckets. Would you create duplicate Stacks with different bucket names and deploy them in multiple regions? or you would want to re-use the existing Stack more **intelligently**.

So how to do that? CFN template language has multiple constructs to make our Template dynamic.

### Parameters

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

In this way, I can re-use the same template and deploy it for different environments and it will automatically use the right values.

### Mappings

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

Sometimes you also want to conditionally create resources. For example, you only want **Cloudtrail** enabled for the production account.

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

A lot of times you will have multiple stacks that powers your project's infrastructure. In a lot of those scenarios, you might want to use a resource across multiple stacks. For example, you could have a **Network** stack that manages your **VPC**s and you will need to reference that VPC when creating resources in other stacks. In such cases, it is not the right approach to copy-paste values from one stack and hard code them in another stack. Instead, it's advisable to use Cross-Stack references using **Export** and **Import**.

One caveat with using this approach is that once an exported value is used (imported) in another stack it can not be changed.

## Divide your Stacks into Units

Now I've learned this lesson from real-life where I created a **2500+** lines of CFN templates. Although it was properly organized and all that it still became a bottleneck for us to be able to make updates to it.

In general, your Stack should be like a unit of similar resources that all achieve one primary goal. For instance, a typical web architecture includes a database, API server, frontend server.

You could divide it into the following units.

- **AppName-VPC** - that creates VPC,Subnets,VPC Endpoints, IG, NAT Gateways etc.
- **AppName-API** - that creates the API server resources like AutoScaling group, Launch Config, Security Groups, S3 Buckets, Load Balancers.
- **AppName-Front** - that creates the S3 bucket, Cloudfront distribution, Route53.
- **AppName-DB** - that creates the databases required for the application.

This way you would be able to make targeted changes to the infrastructure which will not affect all parts of it. You can use cross-reference stack values to reference/use resources from other stacks.

## Cloudformation is AWS

80% of the things that I've learned about different AWS services is through Cloudformation docs. A lot of **[Important]** things which you might miss while using the Console have to
be specified when using CFN Templates which provides a wholesome picture of AWS services. You should read about all the attributes in the docs when defining a resource. It will help you gain a more in-depth understanding of how the underlying service works.

## Conclusion

Well, that's about it. In this post, I went through some of the things I learned while working with CloudFormation. Two years back I started using CFN and I've never looked back at the Console for creating things in AWS. From side projects to enterprise CFN has always proven itself to be a great choice for managing Cloud Infrastructure on AWS. If you've never tried it I encourage you to try it once. Start with small and remember Sky is the Limit!
