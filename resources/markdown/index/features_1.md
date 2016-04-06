<h2>And there's more <sup>*</sup></h2>

### Parameter chaining

In some cases you want to resize an image before cropping (or the other way around). That's where parameter chaining comes in handy as you can join multiple parameters.

### Define recipes

Recipes are conceptual predefined parameters that will be applied to your
images.

### Filters

Filters can be used to further manipulate images. They're a good place for
performing more complex operations than resizing and cropping.

Jmg ships with a few basic filters, like autorotate, grayscale, colorize, and a circle shape.

### Processing constraints.

It's possible to restrict the usage of dynamic processing by signing the
generated image URL. This way processing is restricted to the
request defined in you application.

Furthermore, image dimension can be
restricted to not exceed predefined boundaries.

### Ready for your favourite templating engine

Thanks to the view helper class it's easy to integrate jmg image requests in
your templating layer of your choice.

### Caching

Jmg also comes with a poweful caching layer.

<footer>
    <sub>* jmg is still in a pre releas state. listed features are considered stable
        and unlikley to change.
    </sub>
</footer>
