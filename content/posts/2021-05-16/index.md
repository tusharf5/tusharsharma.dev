---
uid: "aws-services-events"
title: "Listen To Events By AWS Services"
category: "AWS"
draft: false
tags:
  - aws
  - eventbridge
  - s3
  - cloudtrail
  - serverless
  - cloudwatch
  - cloudwatch events
excerpt: "We recently needed to run some custom logic whenever one of our SQS-Lambda integration was disabled. In fact, at times there are use cases when we need to take some action when something happens in our AWS account. Here's how we use EventBridge to do just that."
---

From the moment you create an AWS Account, AWS starts to track all sorts of events happening in your account. Like
when someone logs in, creates a VPC, see the list of EC2 instances, delete an s3 bucket, etc. The list of events
is endless which is not surprising when you consider the number of services it has.

Even in a new account you can see the list of these events by going to the AWS CloudTrail's dashboard and then clicking on the Event History tab as seen in the image below.

![CloudTrail Dashboard](./cloudtrail.png)

Before we look at thow to listen to these events we first need to take a deeper look at these events.

There are three types of events available to us via CLoudTrail.

1. [Management Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html)
2. [Data Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html)
3. [Insights Events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-insights-events-with-cloudtrail.html)

> Management events provide visibility into management operations that are performed on resources in your AWS account. These are also known as control plane operations.

In other words, anytime a configuration change or an activity that happens in an AWS account it's most likely to be a Management Event.

> Data events provide visibility into the resource operations performed on or within a resource. These are also known as data plane operations. Data events are often high-volume activities.

You can think of Data Events as events that captures data centric operations like uploading something to an S3 bucket, payload for lambda invocations, dynamodb calls that modifes data.

For our use case we wanted to listen whenever our SQS-Lambda Integration was disabled. This is a configuration change which means that the event for that is a management event.

CloudTrail is not the only service that has to do with Events from different services. There is another service called
EventBridge (used to be called CloudWatch Events).

We won't go into details of how EventBridge works but at a high level, it has something called as an event bus which are like conveyor belts in a factory. When you create a new AWS account, it comes with a pre-installed conveyor belt i.e an event bus. A lot of the AWS services sends events to EventBridge in the default event bus.You can take a look that full list [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-service-event.html).

So now we know that CloudTrail records three different types of events and EventBridge also recevies events from some AWS
services. It is possible that an event is recorded by both. For instance when you shut down an EC2 Instance that event is recorded by CloudTrail and EC2 service also sends that event natively to EventBridge.

The cool thing about EventBridge is that we can add rules to it when we are interested in listening to some event emitted
by an AWS service. So for example we can add a rule to send a notification to us whenever someone creates a new EC2 instance or when someone creates a S3 bucket.

The first thing to do when you are interested in listening to an event in an AWS account is figure out whether that event
is being [sent to EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-service-event.html) natively by that service or not.

If yes, then you can skip setting up CloudTrail and directly configure EventBridge to start listening to that event.

If not, then first you have to check [here](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-aws-service-specific-topics.html#cloudtrail-aws-service-specific-topics-list) that whether CloudTrail records that event or not. There are very high chances that CloudTrail will have support for recording the event you are interested in.

**But how does CloudTrail supports so many events?**

One reason is because it is older than EventBridge and the second is that because CloudTrail records API calls to our account whether they are being made by us or by AWS itself. That's how it is able to record a lot of events because most
of the events are a result of an API call being made to our AWS account. It can also send these events that it captures to EventBridge.

Now that we know we know that our event is supported by CloudTrail via an API call. You need to set up a Trail.

_This was the thing that I spent the most time struggling with. I though just because CloudTrail is showing an event is the Event History tab, it means it will also send that event to EventBridge. But that is not true, for most of the events you need to set up a Trail first before CloudTrail will send that event to EventBridge._

As the name suggests a Trail is basically a series of events that are recorded by CloudTrail and saved on an S3 bucket.
You can view the S3 bucket to see the list of all the past events that were recorded by CloudTrail.

My suggestion is that if you are only interested in listening to some events and do not care about those events being saved on S3 by the Trail then you can configure the S3 bucket to use the cheapest storage type so your s3 storage cost gets reduced.

A Trail can be set up for storing management events, data events or Insights events. Management events are the cheapest. Basically free but data events comes with a cost. Check the pricing [here](https://aws.amazon.com/cloudtrail/pricing/).

For our use case, we were only interested in Management Events so we created a Trail which only stored Management Events.

Now let's take an example. Let's say we want to execute a lambda function whenever someone stops or terminates any EC2 instance in our AWS account. Let's open the EventBridge console and click on Create Rule.

You provide a name, the event pattern and the action to take. There are some other minor configuration but these 3 are
the important ones.

The console provide a GUI to create your event pattern using some pre-defined options which or you can provide a json pattern for the event. See how to create event patterns [here](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html).

For the EC2 event above, our event pattern would look like this. This event is being send to EventBridge by the EC2 service
itslef so we don't have to set up a CloudTrail for this event. It would work out of the box.

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

Now let's take another example where the service does not natively send an event to EventBridge which means we need to listen to that event using CloudTrail. Let's create a rule to listen to anytime someone creates a S3 bucket.

This is how the the event pattern would look like.

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

If you're curious to know what the event pattern for our use case was. Here's it.

```json
{
  "source": ["aws.lambda"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["lambda.amazonaws.com"],
    "eventName": [{ "prefix": "UpdateEventSourceMapping" }]
  }
}
```

Did you notice the _AWS API Call via CloudTrail_? This tells that this event is being provided by CloudTrail.

What's so powerful about this is that it EventBridge and CloudTrail are both serverless offerings from AWS so you only
pay for what you use. Also EventBridge supports lots of AWS services as actions to when a rule is matched.
