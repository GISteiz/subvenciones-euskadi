# Subvenciones Euskadi

This is the home page of your new Observable Framework app.

For more, see <https://observablehq.com/framework/getting-started>.

```js
const granted_benefits = FileAttachment("./data/granted-benefits.json").json();
```

```js
display(granted_benefits);
```

<div class="grid grid-cols-1">
  <div class="card">${Inputs.table(granted_benefits)}</div>
</div>