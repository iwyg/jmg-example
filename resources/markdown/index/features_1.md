### Dynamic, per request, image processing

At its core, Jmg will manipulate images by a given set of parameters. Parameters
are defined by their mode where each mode represents a different basic task
(mainly resizing and cropping). Parametes can also be joind by filters.

Parameters may be passed as query or you may define them as placeholder
parameter in the routing framework of your choice.

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

### Use dynamic processing or recipes in your views

Jmg comes with a helper class that makes it easy to integrate image request in
your template layer.

### Caching

Jmg can cache processed images for better performance.
