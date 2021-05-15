---
uid: "aws-services-events"
title: "Listen To Events By AWS Services"
category: "AWS"
draft: false
tags:
  - aws
  - eventbridge
  - cloudtrail
  - serverless
  - cloudwatch
excerpt: "We recently needed to run some custom logic whenever one of our SQS-Lambda integration was disabled. In fact, at times there are use cases when we need to take some action when something happens in our AWS account. Here's how we use EventBridge to do just that."
---

From the moment you create an AWS Account, AWS starts to track all sorts of events happening in your account. Like
when someone logs in, creates a VPC, see the list of EC2 instances, delete an s3 bucket, etc. The list of events
is endless which is not surprising when you consider the number of services it has.

Even in a new account you can see the list of these events by going to the AWS CloudTrail's dashboard and then clicking on the Event History tab as seen in the image below.

![CloudTrail Dashboard](./cloudtrail.png)

One way AWS is able to listen to these events is because a lot of the AWS services report events to AWS. You can take a look that full list [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-service-event.html). AWS has a service called EventBridge that is responsible for receiving these events.

We won't go into details of how EventBridge works but at a high level, it has something called as an event bus which are like conveyor belts in a factory. When you create a new AWS account, it comes with a pre-installed conveyor belt i.e an event bus. All of events emitted by the above AWS services are received by this default event bus.

The cool thing about EventBridge is that we can add rules to it when we are interested in listening to some event emitted
by an AWS service. So for example we can add a rule to send a notification to us whenever someone creates a new EC2 instance.

The moment EventBridge will receive the event that we're interested in, it will take the specified action based on the rule.

Let's take an example. Let's say we want to execute a lambda function whenever someone stops or terminates any EC2 instance in our AWS account. Let's open the EventBridge console and click on Create Rule.

You provide a name, the event pattern and the action to take. There are some other minor configuration but these 3 are 
the important ones.

The console provide a GUI to create your event pattern using some pre-defined options which or you can provide a json pattern for the event. See how to create event patterns [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html). 

For the s3 event above, our event pattern would look like this.

```json
{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change Notification"],
  "detail": {
    "state": ["stopped", "terminated"]
  }
}
```

Now as soon as someone tries to stop or terminate the instance, AWS EC2 service will send that event to the default 
event bus in EventBridge, EventBridge will know that we have a rule setup to match that event and it will thus invoke our
lambda function with the details about the event.

Now sometimes, An AWS service natively does not send one or more events to EventBridge. For instance if we want to take an action anytime someone creates a new S3 bucket in our AWS account. S3 does not natively send this bucket creation event to
EventBridge. So we have to use some other way to listen to such events.

This is where our friend CloudTrail comes in and help us out. CloudTrail is similar to EventBridge in the sense that it also monitors events happening in our account. But the thing with CloudTrail is that it also listens to the API calls being made to our account.

CloudTrail listen to all the API calls being made to our account. Now I hope you know that when you use AWS Console and you perform some action like view all the EC2 instances or create an S3 bucket or switch roles, etc. All of these actions triggers API calls being made to your account by AWS. So even when you are using the console, almost all of the actions are being performed by making API calls behind the scenes and CloudTrail tracks all of these api calls too.

CloudTrail then send these API call events to EventBridge. So for example when someone creates a new S3 bucket. 
S3 does not send the event to EventBridge directly but CloudTrail tracks the API call that was made behind the scenes to create the S3 bucket and sends this event to EventBridge.

So for when an AWS service does not send an event directly to EventBridge, you should check if CloudTrail tracks that event or not.

Alright so let's set up our EventBridge rule to catch one of these API call event by CloudTrail.

> We want to take an action anytime someone creates a new S3 bucket in our AWS account

This is the event pattern.

```json
{
  "source": ["aws.s3"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["s3.amazonaws.com"],
    "eventName": ["CreateBucket"]
  }
}
```

Did you notice the _AWS API Call via CloudTrail_? This tells that this event is being provided by CloudTrail.

What's so powerful about this is that it EventBridge and CloudTrail are both serverless offerings from AWS so you only
pay for what you use. Also EventBridge supports lots of AWS services as actions to when a rule is matched. 
