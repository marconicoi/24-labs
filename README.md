# 24-labs
## Introduction

## live-preview
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.5/jquery.live-preview.js
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
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.5/jquery.email-autocomplete.js
```
Usage
```
<input data-24-email-autocomplete="mydomain.com" />
```

## intl-phone-mask


## brreg-api
CDN
```
https://cdn.jsdelivr.net/gh/marconicoi/24-labs@0.5/jquery.brreg-api.js
```
Usage
```
<input data-tfso-brreg-api-request="hjemmeside,navn" data-tfso-brreg-api-ignore="terra,microsoft" />
<input data-tfso-brreg-api-autocomplete="navn" data-tfso-brreg-api-template="<div>{{ navn }}</div><cite># {{organisasjonsnummer}}</cite>" />
<input data-tfso-brreg-api-response="organisasjonsnummer" />
```
`data-tfso-brreg-api-ignore` and `data-tfso-brreg-api-template` attributes are optional.
