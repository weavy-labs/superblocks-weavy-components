# Weavy Superblocks Components

## Custom components library template

This is a custom component library for projects within [Superblocks](https://www.superblocks.com/).

To learn more about how custom component libraries work, visit the [official documentation](https://docs.superblocks.com/applications/custom-components/).

**You need to register these components in your superblocks app to be able to use them.**

### Install

To be able to use and publish the components, you need to install the dependencies.

```bash
npm install
```

### Sign in to Superblocks

To use the Superblocks utils for development and publishing, first sign into your Superblocks account. You will need [admin permissions](https://docs.superblocks.com/administration/org-roles) in Superblocks.

```bash
npx superblocks login
```

### Create boilerplate app

You can create an empty boilerplate template app with the Weavy components and all needed parts pre-configured.

```bash
npm run create:template
```

### Create demo app

You can install a full demo app with multiple Weavy components and Notifications and navigation pre configured and ready.

```bash
npm run create:demo
```

### Install Weavy components to an existing app

You can install the Weavy components to an existing Superblocks app.

```bash
npm run create:components
```

### Customize components

After installing the components in the demo, boilerplate or your app, you can customize the components however you like using superblocks tooling.

Read about [Superblocks custom components](https://docs.superblocks.com/applications/custom-components/overview).

Change to your app dir to work with the components.

```bash
cd apps/{YOUR_APP}/
```

#### Superblocks developer mode

```bash
npx superblocks components watch
```

### Superblocks components publish

```bash
npx superblocks components upload
```
