# JSON Test Spec

### Introduction

One of the challenges we have is taking user created JSON and converting into something that we can visualise to a designer **\*\***and**\*\*** that they can use in Figma. This is what we’re going to focus on.

We have some [raw final space JSON](https://gist.github.com/robbiehudson/6fbdd1f4a3dceb5c0d10a4f8122441c5) that we would like you to process.

Please read the JSON and generate three “resources”: Episodes, Characters and Quotes. In this context, you could think of a resource as something that would be in a single database table. This is an entity we show to a designer.

For the Episodes we would only like the episode information without characters array, and include the character count.

For the Characters we would like a unique array of all the characters that appear from all the episodes and which episodes they appeared in.

For the Quotes we would like a unique array of all the quotes with a character ID reference and the episode ID reference.
