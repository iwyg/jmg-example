### Load images from your favourite storage solution

Jmg ships with two basic resource loaders, a filesystem loader, which is capable of loading resources from your local filesystem, and a http loader, that can load public http resources.

Although this serves well for general usecases, you might want to load your images from different sources, like FTP servers or an AWS cloud storage.

Don't worry, Jmg has your back: there's already a [flysystem](http://flysystem.thephpleague.com/ "Flysystem package from thephpleague.com") loader available [here](https://github.com/iwyg/jmg-flysystem "Jmg flystem loader on GitHub").
