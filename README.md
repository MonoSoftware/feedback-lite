Feedback Lite
=============

Small feedback library inspired by https://github.com/ivoviz/feedback
Gets screenshot, url, browser info, html, and comments from user.

Filesize minified/compressed: ~6KB (html2canvas not included)

![screenshot](https://cloud.githubusercontent.com/assets/222611/21775345/511dcf0c-d65b-11e6-81c5-7de6d7abf1bc.png)

### Usage

```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>
  <script>
  var feedback = new Feedback({ onSubmit: function(data) {
    // do something
    console.log(data);
  } });
  feedback.showButton();
  // or
  // feedback.attach(document.getElementById('my-feedback-btn'));
  </script>
```

Use `feedback.showButton` to render a button or attach to your own with `feedback.attach`.

### Options

- `onSubmit` <Function> Callback that receives feedback data object
- `html2canvas` <Object> Pass html2canvas object. Default: `window.html2canvas`
- `includeBrowserInfo`: <Bool> Default: true
- `includeUrl`: <Bool> Default: true
- `includeHtml`: <Bool> Default: true

### Returned Data

```
{
  browser: <Object>
  html: <String>
  img: <String>
  url: <String>
  note: <String>
}
```

### Development

```
npm install
// run weback dev server
npm start
// build dist
npm run build
```

### License

MIT
