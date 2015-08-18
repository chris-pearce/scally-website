---
layout:             default
title:              "Documentation for the Core section"
excerpt:            "Documentation for the Core section. Scally core is the
                    foundation of a project's UI build."
exclude_from_nav:   true
section:            2
---


## Core

### What is it?

Scally Core is the foundation of a project's UI build providing things like:

<ul class="o-list">
  <li>Sensible global styles.</li>
  <li>Global settings (Sass variables).</li>
  <li>Handy Sass functions and mixins.</li>
  <li>Global Sass silent placeholder selectors.</li>
  <li>A powerful reset, and <a href="http://necolas.github.io/normalize.css/" rel="external">normalize.css</a>.</li>
</ul>

<div class="c-alert  u-s-mb-base">
  <p>Without Core Scally won't work. It is the only mandatory part of the framework.</p>
</div>

### The breakdown

Core is broken down into the following sections:

<ul class="o-list">
  <li><a href="core-base.html">Base</a></li>
  <li><a href="core-functions.html">Functions</a></li>
  <li><a href="core-mixins.html">Mixins</a></li>
  <li><a href="core-placeholders.html">Placeholders</a></li>
  <li><a href="core-settings.html">Settings</a></li>
</ul>

And a few things not sectioned:

#### normalize.css

[normalize.css](http://necolas.github.io/normalize.css/) is a third party solution and Scally always makes sure it's using the latest version.

#### Reset

In addition to [normalize.css](http://necolas.github.io/normalize.css/) Scally also provides a powerful reset, resetting
things like:

<ul class="o-list">
  <li><code class="c-inline-code">margin</code>, <code class="c-inline-code">padding</code>, and <code class="c-inline-code">border</code> to zero, for <strong>ALL</strong> HTML elements.</li>
  <li><code class="c-inline-code">box-sizing</code> to the more friendly <code class="c-inline-code">border-box</code> value.</li>
  <li>No bullets for unordered (<code class="c-inline-code">ul</code>) and ordered (<code class="c-inline-code">ol</code>) lists.</li>
</ul>

### Specificity

Scally Core is the foundation of the framework therefore it sits right at the
bottom when it comes to specificity (CSS' first C; the cascade) as any styles
defined in Core need to be easily overridden.

That's why Core is declared first when pulling in the Scally framework via your
<a href="">master stylesheet</a> so it's compiled before everything else.

<!-- ### Further reading -->

<!-- <ul class="o-list">
  <li><a href="http://thesassway.com/advanced/pure-sass-functions" rel="external">Using pure Sass functions to make reusable logic more useful</a></li>
  <li><a href="http://thesassway.com/intermediate/leveraging-sass-mixins-for-cleaner-code" rel="external">Leveraging Sass mixins for cleaner code</a></li>
  <li><a href="http://csswizardry.com/2014/11/when-to-use-extend-when-to-use-a-mixin/" rel="external">When to use <code class="c-inline-code">@extend</code>; when to use a mixin</a></li>
  <li><a href="http://necolas.github.io/normalize.css/" rel="external">normalize.css</a></li>
</ul> -->

{% include section-nav.html %}
