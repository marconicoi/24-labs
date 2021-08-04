# 24-labs
## Introduction

## live-preview
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.20/jquery.live-preview.js
```
Usage
```
<input id="fname" />
<div data-24-bind="#fname"></div>
```
or
```
<input type="number" id="a" />
<input type="number" id="b" />
<div data-24-calc="#a+#b"></div>
```
or
```
<input type="checkbox" id="make-visible" />
<div data-24-show="#make-visible">Visible if checked</div>
<input type="checkbox" id="make-invisible" />
<div data-24-hide="#make-invisible">Visible if unchecked</div>
```

## email-autocomplete
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.20/jquery.email-autocomplete.js
```
Usage
```
<input data-24-email-autocomplete="mydomain.com" />
```

## intl-phone-mask


## brreg-api
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.20/jquery.brreg-api.js
```
Usage
```
<input data-dd-company-request="hjemmeside,navn" data-dd-company-ignore="terra,microsoft" />
<input data-dd-company-autocomplete="navn" data-dd-company-template="<div>{{ navn }}</div><cite># {{organisasjonsnummer}}</cite>" />
<input data-dd-company-response="organisasjonsnummer" />
```
`data-dd-company-ignore` and `data-dd-company-template` attributes are optional.

CSS
```
ul.company-dropdown-list {
	margin: 0;
	padding: 0;
	border: solid 1px #aaa;
	background-color: #fff;
	list-style: none;
}
ul.company-dropdown-list li {
	padding: 4px 8px;
	cursor: pointer;
}
ul.company-dropdown-list li:hover {
	background-color: #eee;
}
ul.company-dropdown-list li.selected {
	background-color: #ddd;
}
```

## local-storage
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.20/jquery.local-storage.js
```
Usage
```
<input type="hidden" data-dd-storage="unique_id" value="unique-value-here" />
<input data-dd-storage="email" />
<div data-dd-hideif="unique_id">content</div>
<div data-dd-showif="unique_id">content</div>
<div data-dd-clickif="email">content</div>
<div data-dd-removeif="email">content</div>
<a href="#" data-dd-unstore="email">Click here to remove email value from localStorage</a>
```

## summary
Generate summaries from HTML content autommatically.
#### CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.20/jquery.summary.js
```
#### Usage
Use attribute `data-dd-toc-context` to create a TOC (Table Of Content) from HTML.
Example:
```
<div data-dd-toc-context="#content"></div>
<div id="content">
  <h1 id="title-1">Title 1</h1>
  <h2 id="subtitle-1">Subtitle 1.1</h2>
  <h1 id="title-2">Title 2</h1>
  <h2 id="subtitle-2">Subtitle 2.1</h2>
</div>
```
Will generate this result:
```
<div data-dd-toc-context="#content">
  <ul>
    <li>
      <a href="#title-1">Title 1</a>
      <ul>
        <li>
	  <a href="#subtitle-1">Subtitle 1.1</a>
	</li>
      </ul>
    </li>
      <a href="#title-2">Title 2</a>
      <ul>
        <li>
	  <a href="#subtitle-2">Subtitle 2.1</a>
	</li>
      </ul>
    </li>
  </ul>
</div>
<div id="content">
  <h1 id="title-1">Title 1</h1>
  <h2 id="subtitle-1">Subtitle 1.1</h2>
  <h1 id="title-2">Title 2</h1>
  <h2 id="subtitle-2">Subtitle 2.1</h2>
</div>
```
If HTML headings not are H1, H2..., H6 use `data-dd-toc-targets`:

```
<div data-dd-toc-context="#content" data-dd-toc-targets="h3,h5"></div>
<div id="content">
  <h3 id="title-1">Title 1</h3>
  <h5 id="subtitle-1">Subtitle 1.1</h5>
  <h3 id="title-2">Title 2</h3>
  <h5 id="subtitle-2">Subtitle 2.1</h5>
</div>
```
To custom template, use `data-dd-toc-level` to set each level container:

```
<div data-dd-toc-context="#content" data-dd-toc-targets="h3,h5">
  <div data-dd-toc-level="h1">
    <a></a>
    <div data-dd-toc-level="h2">
      <a></a>
    </div>
  </div>
</div>
<div id="content">
  <h3 id="title-1" class="green">Title 1</h3>
  <h5 id="subtitle-1">Subtitle 1.1</h5>
  <h3 id="title-2" class="blue">Title 2</h3>
  <h5 id="subtitle-2">Subtitle 2.1</h5>
</div>
```
Use `data-dd-class-match` to get specific classes from headings:
```
<div data-dd-toc-context="#content" data-dd-toc-targets="h3,h5">
  <ul data-dd-toc-level="h3">
    <li data-dd-class-match="blue,red,green">
      <a></a>
      <ul data-dd-toc-level="h5">
        <li data-dd-class-match="bold,italic" class="any-class other-class">
          <a></a>
        </li>
      </ul>
    </li>
  </ul>
</div>
<div id="content">
  <h3 id="title-1" class="green">Title 1</h3>
  <h5 id="subtitle-1" class="bold">Subtitle 1.1</h5>
  <h3 id="title-2" class="blue">Title 2</h3>
  <h5 id="subtitle-2" class="italic">Subtitle 2.1</h5>
</div>
```

## translate
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.20/jquery.translate.js
```
Usage
```
<head>
  ...
  <meta name="dictionary-url" content="https://hook.integromat.com/2befs9yvjppxsulofmfkzkwfnswxv6cw" />
  ...
</head>
<body>
  ...
  <a href="#" data-dd-setlang="no">Norwegian</a>
  <button type="button" data-dd-setlang="se">Swedish</button>
  <div data-dd-setlang="en">English</div>
  ...
  <span lang="en">Translatable text</span>
  ...
</body>

```
Click elements with `data-dd-setlang` attribute will change language to each element with `lang` attribute.
