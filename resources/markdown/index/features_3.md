```php
<?php

namespace Acme\Loaders;

use Thapp\Jmg\Loader\AbstractLoader

class AWSLoader extends AbstractLoader
{
    /**
     * @throws Thapp\Jmg\Exception\SourceLoaderException
     * @return Thapp\Jmg\Resource\FileResourceInterface
     */
    public function load($file)
    {
        //…
    }

    /**
     * @return bool
     */
    public function supports($path)
    {
        //…
    }
}
```
