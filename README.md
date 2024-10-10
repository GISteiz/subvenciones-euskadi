# Subvenciones Euskadi

This is an [Observable Framework](https://observablehq.com/framework) app.

## Local setup

After cloning the repo, install all the dependencies in your project running:

```
npm install
```

To start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your app.

If you like, you can run your data loader manually in the terminal:

```
node src/data/<data_loader_name>.json.js
```

For more, see <https://observablehq.com/framework/getting-started>.

## Deployment

### On Observable

Run script:

```
npm run deploy
```

### On GitHub Pages

Steps to deploy only `dist` folder.

Install [npm gh-pages](https://www.npmjs.com/package/gh-pages):

```
npm install gh-pages --save-dev
```

Add `deploy-github` script to `package.json` (already done in this repo):

```js
"scripts": {
  "deploy-github": "gh-pages -d dist"
}
```

Run script (then enable github pages publicly):

```
npm run deploy-github
```

## Project structure

A typical Framework project looks like this:

```ini
.
├─ dist                        # folder containing built app - deployable as static website
├─ src
│  ├─ components
│  │  └─ timeline.js           # an importable module
│  ├─ data
│  │  ├─ launches.csv.js       # a data loader
│  │  └─ events.json           # a static data file
│  ├─ example-dashboard.md     # a page
│  ├─ example-report.md        # another page
│  └─ index.md                 # the home page
├─ .gitignore
├─ observablehq.config.js      # the app config file
├─ package.json
└─ README.md
```

**`src`** - This is the “source root” — where your source files live. Pages go here. Each page is a Markdown file. Observable Framework uses [file-based routing](https://observablehq.com/framework/routing), which means that the name of the file controls where the page is served. You can create as many pages as you like. Use folders to organize your pages.

**`src/index.md`** - This is the home page for your app. You can have as many additional pages as you’d like, but you should always have a home page, too.

**`src/data`** - You can put [data loaders](https://observablehq.com/framework/loaders) or static data files anywhere in your source root, but we recommend putting them here.

**`src/components`** - You can put shared [JavaScript modules](https://observablehq.com/framework/javascript/imports) anywhere in your source root, but we recommend putting them here. This helps you pull code out of Markdown files and into JavaScript modules, making it easier to reuse code across pages, write tests and run linters, and even share code with vanilla web applications.

**`observablehq.config.js`** - This is the [app configuration](https://observablehq.com/framework/config) file, such as the pages and sections in the sidebar navigation, and the app’s title.

## Command reference

| Command                 | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm install`           | Install or reinstall dependencies                        |
| `npm run dev`           | Start local preview server                               |
| `npm run build`         | Build your static site, generating `./dist`              |
| `npm run deploy`        | Deploy your app to Observable                            |
| `npm run clean`         | Clear the local data loader cache                        |
| `npm run observable`    | Run commands like `observable help`                      |
| `npm run deploy-github` | Deploy your app to gh-pages branch                       |
