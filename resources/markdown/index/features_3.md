Jmg lets you define custom resource loaders, for instance, an AWS loader would look something like this

```php
<?php

namespace Acme\Loaders;

use Thapp\Jmg\Loader\AbstractLoader

class AWSLoader extends AbstractLoader
{
    public function load($file)
    {
        //...
    }

    public function supports($path)
    {
        //...
    }
}
```
