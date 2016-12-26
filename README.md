Svg to React Component Convertor
==

For designer folks using `OSX`, please follow the instructions below to use this tool.

- Download the `NodeJs` runtime installer from [the official site](https://nodejs.org/en/).

- Download this repository to `~/Downloads` folder by opening https://codeload.github.com/genxium/SvgToReactComponent/zip/master in a browser, e.g. Chrome or Firefox, and choose the `Downloads` folder under your username space.
  - After unzipping, you should have got `~/Downloads/SvgToReactComponent`.


- Remind yourself that you're reading this `README.md` file is of path `<proj-root>/README.md`.
  - In other words, `<proj-root>` means `~/Downloads/SvgToReactComponent` for you if you follow the instructions above strictly.


- Open a [terminal](https://en.wikipedia.org/wiki/Terminal_(macOS), then execute the following commands.

```
shell@anywhere> cd ~/Downloads/SvgToReactComponent

shell@proj-root> npm install
```  

- Wait until the download is completed.

- Put any of your `.svg` file(s) under `<proj-root>/svg_files`.
  - Be careful, you should have assigned proper `id`s and `class`es, e.g. using lowercase/uppercase English characters, '-', '_' and numbers ONLY, to each tag within the `.svg` file(s).


- Open the [terminal](https://en.wikipedia.org/wiki/Terminal_(macOS) again, execute the following commands.

```
shell@anywhere> cd ~/Downloads/SvgToReactComponent

shell@proj-root> node to_designer_pack.js
```

- Find the generated `.html + .css` files under `<proj-root>/designer_pack`.
