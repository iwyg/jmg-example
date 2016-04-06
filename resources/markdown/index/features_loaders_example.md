```php
<?php

namespace Acme\Loaders;

use Thapp\Jmg\Loader\AbstractLoader

class AWSLoader extends AbstractLoader
{
    public function load($file)
    {
        // loading logic goes here
    }

    public function supports($path)
    {
        // must return boolean
    }
}
```

<small>Jmg lets you define custom resource loaders, for instance, an AWS loader would look something like the example above.</small>
