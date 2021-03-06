# Tools:

- [Blog](https://eltoroit.github.io/)
- [Blog](https://js4iot.com/)

## Website

- Installation
```
# Install Ruby
sudo apt-get install ruby-full build-essential
sudo gem install bundler jekyll
# Install dependencies
npm install
cd docs
bundle install
# Test local site
bundle exec jekyll serve --watch --port 3001 --unpublished --drafts
```

- builder:
  - Tool: https://jekyllrb.com/
    - `bundle exec jekyll serve --watch --port 3001 --unpublished --drafts`
    - [Template](https://github.com/pages-themes/architect)
  - Test `bundle exec jekyll doctor` helps find errors

It takes at least one minute after pushing for the changes to be published to pages ;-)

- Code: https://gist.github.com/

## Circuits

## Simulate

- https://everycircuit.com/app/
  - Others
    - Fritzing: https://fritzing.org/ (Computer app)
    - Pretty Simulator: https://dcaclab.com/en/lab
    - Fancy circuits: https://www.circuitlab.com/
      - Includes eBook

## Draw

- https://www.circuit-diagram.org/editor/

## Math

- Graph Calculator: https://www.desmos.com/calculator

## Other Bloggers

- https://wdmartins.medium.com/

## Common Links

- [RPIO](https://www.npmjs.com/package/rpio)
- [PIGPIO](https://www.npmjs.com/package/pigpio) <<<< BEST!

## HTML

- Video

<p style="text-align:center;">
    <video src="/assets/blog/2021-04-04/NoisyButton.mov" style="max-width: 100%;" autoplay controls loop></video>
</p>

- Images

![Node.js WebServer @ Localhost](/assets/blog/2021-03-14/NodeJS_WebServer_Localhost.png)

- Links to posts

[GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %})

- GIST

<script src="https://gist.github.com/eltoroit/f8fb7d4fe49eb1f90f44e82ad950b934.js"></script>

- Markdown

Text can be **bold**, _italic_, or ~~strikethrough~~.

[Link to another page](./another-page.html).

There should be whitespace between paragraphs.

There should be whitespace between paragraphs. We recommend including a README, or a file with information about your project.

# Header 1

This is a normal paragraph following a header. GitHub is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.

## Header 2

> This is a blockquote following a header.
>
> When something is important enough, you do it even if the odds are not in your favor.

### Header 3

**JavaScript**

```js
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require("./lang/" + l);
  return true;
};
```

```node
// Javascript code with syntax highlighting.
var fun = function lang(l) {
  dateformat.i18n = require("./lang/" + l);
  return true;
};
```

**Ruby**

```ruby
# Ruby code with syntax highlighting
GitHubPages::Dependencies.gems.each do |gem, version|
  s.add_dependency(gem, "= #{version}")
end
```

[Other languages](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml)

#### Header 4

- This is an unordered list following a header.
- This is an unordered list following a header.
- This is an unordered list following a header.

##### Header 5

1.  This is an ordered list following a header.
2.  This is an ordered list following a header.
3.  This is an ordered list following a header.

###### Header 6

| head1        | head two          | three |
| :----------- | :---------------- | :---- |
| ok           | good swedish fish | nice  |
| out of stock | good and plenty   | nice  |
| ok           | good `oreos`      | hmm   |
| ok           | good `zoute` drop | yumm  |

### There's a horizontal rule below this.

---

### Here is an unordered list:

- Item foo
- Item bar
- Item baz
- Item zip

### And an ordered list:

1.  Item one
1.  Item two
1.  Item three
1.  Item four

### And a nested list:

- level 1 item
  - level 2 item
  - level 2 item
    - level 3 item
    - level 3 item
- level 1 item
  - level 2 item
  - level 2 item
  - level 2 item
- level 1 item
  - level 2 item
  - level 2 item
- level 1 item

### Definition lists can be used with HTML syntax.

<dl>
<dt>Name</dt>
<dd>Godzilla</dd>
<dt>Born</dt>
<dd>1952</dd>
<dt>Birthplace</dt>
<dd>Japan</dd>
<dt>Color</dt>
<dd>Green</dd>
</dl>

```
Long, single-line code blocks should not wrap. They should horizontally scroll if they are too long. This line should be long enough to demonstrate this.
```

```
The final element.
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

===
