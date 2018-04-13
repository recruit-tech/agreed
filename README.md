# Agreed UI

UI for [Agreed](https://www.npmjs.com/package/agreed-core)

![ScreenShot](https://raw.githubusercontent.com/recruit-tech/agreed-ui/master/screenshot.png)

# Install

```
$ npm install agreed-ui --save-dev
```

# Usage

```
$ agreed-ui --path ./test/agreed.json --port 3000
```
Serve with [Express](https://www.npmjs.com/package/express)
Open http://localhost:3000 to view it in the browser.

```
$ agreed-ui build --path ./test/agreed.json --dest ./build
```
Builds the app for static-hosting to the build folder

# Features

## Set title and description to contract

```
{
  title: 'get store information',
  description: 'get store information',
  request: {
    ...
  },
  response: {
    ...
  }
}
```

title and descripion will be displayed at naviation and each section's title
