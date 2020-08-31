---
uid: "aws-cfn-with-ssm-parameters"
title: "Managing AWS Infrastructure with SSM Parameters"
category: "AWS"
draft: true
tags:
  - aws
  - cloudformation
  - stack
  - ssm parameters
  - system manager
  - cfn
excerpt: "hello"
---

One thing that keeps me excited about technology (everyday work) is to always look out for newer trends, design patterns and innovations. For instance, I've built quite a few react projects in the past and all of them followed a different structure/philosophy right from the start. All the findings (good parts and bad parts) that you learn or experience while working on a project will help you look out for better alternatives. This habbit also prevents the chances of someone becoming bored of getting repetitive work.

This post is about one such lesson that I learned while working with AWS CloudFormation and how adapting to changes quickly helped us keep our sanity.

At Gerald, I maintain a fairly medium sized AWS infrastructure but it has a lot of moving parts. We're using around 50 different AWS services. So while setting up the infrastructure from scratch I knew maintaining all those services from the Console would become a nightmare for me.

> **Experience #1** - From past AWS projects I knew that managing AWS from console could become difficult for even a small to medium size infrastructure.

I spent some days evaluating between different IaC (Infrastructure as Code) providers and decided to go with AWS CloudFormation (CFN) for various reasons. Now, one quality that you need to learn or work with CFN is being patient.
Whether it is writing the CFN template file or while creating the Stack, it takes time.

After days of continously modifying CFN templates, then re-deploying then seeing the deployment fails, **I became comfortable with this process** which still helps me to this day. So I deployed my first CFN Stack and it was working. That was an amazing feeling, you want to make so and so changes in your AWS?, just update the template file, deploy the Stack and it's done. Cloudformation or IaC in general is an awesome piece of technology.

> **Learning #1** - Get comfortable with seeing lots & lots of configuration when working with CFN.

At this point, I was ready to use my recently acquired CFN knowledge to deploy the AWS infrastructure at our company. So I wrote a template that defines the basic Networking constructs like VPC, Security Groups, NACLs, IAM Roles & Policies, Gateways, VPC Endpoints, and many more. Once that was ready, I added even more resources to the template for our API servers, file storage, workflows etc. Pretty soon I realized that our template was becoming huge in terms of both size and the number of resources that it defined. I was comfortable with seeing lots of configuration in CFN templates but this was different, this was **A LOT** 3000+ lines of configuration.

> **Learning #2** - Make smaller CFN templates that collectively achieve the same goal. Do not make a single template for the entire solution.

Another thing that I quickly noticed was that, I was constantly switching between our CFN template and AWS Documentation to understand the meaning of some configuration. A good solution for that was that any configuration which was not obvious to understand I started to add comments on top of it. The comment could be a line taken from the documentation or it could be my own definition of that configuration. Just a quick tip `JSON` doesn't support comments, `yaml` supports comments.

<NoteBox type="primary" />

> **Learning #3** - Add a lot of comments to your CFN templates. They will be helpful to you and to anyone who's new.

I was fortunate that we were at a stage where we could shut down some of our aws components to split our templates without majorly effecting our users. So we split one big CFN template into 5 separate templates. I realized the importance of this decision later on when I was setting up our CI/CD pipelines. Since there were a lot of shared resources between these 5 templates, I read about the exporting outputs solution which is the default solution provided by AWS for this scenarior.

I exported a bunch of resources from every CFN stack and started using them in other stacks. Everything seems to be working good until the requirements changed and we needed to add more components to our AWS infrastructure. That sounds straight forward. The issue came because of how we were using some of the AWS components in our applications.

-- could not use outputs in applications

-- thought of using ssm parameters

-- how to use ssm parameters in node.js

-- everything can be monitored

-- that's it
