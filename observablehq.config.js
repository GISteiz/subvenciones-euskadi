// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Subvenciones Euskadi",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    //{
    //  name: "Visores",
    //  open: false,
    //  pages: [
    //    {name: "Visor2", path: "/visores/visor2"},
    //    //{name: "Report", path: "/example-report"}
    //  ]
    //},
    {
      name: "Visor",
      path: "/visor"
    }
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="assets/images/favicon.ico" type="image/x-icon" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  // theme: "dashboard", // try "light", "dark", "slate", etc.
  // header: "<h1>Subvenciones en Euskadi</h1>", // what to show in the header (HTML)
  // footer: ''
  //footer: ({path}) => `<a href="https://github.com/example/test/blob/main/src${path}.md?plain=1">view source</a>`,
  // footer: '<row style="height: 40px; background-color: #1c4da9"></row>'
  footer: "<row>Built with <a href='https://observablehq.com/' target='_blank' rel='noopener noreferrer'>Observable</a>. Desarrollado por GISteiz. Si encuentras algún problema o quieres contribuir, puedes hacerlo en <a href='https://github.com/GISteiz/subvenciones-euskadi' target='_blank' rel='noopener noreferrer'>GitHub</a>.", //<div style='text-align: end;'><img src='assets/images/logo_gisteiz.svg' height='60px'/></div></row>", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs
};