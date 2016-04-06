```php
<?php

use Thapp\Jmg\ParamGroup;
use Thapp\Jmg\Http\Psr7\ResponseFactory;
use Thapp\Jmg\Resolver\ImageResolverInterface;
use Psr\Http\Message\ServerRequestInterface;

class ImageController
{
    public function __construct(ImageResolverInterface $imageResolver)
    {
        $this->imageResolver   = $imageResolver;
        $this->responseFactory = new ResponseFactory;
    }

    public function __invoke(ServerRequestInterface $request)
    {
        $src    = $request->getAttribute('src');
        $alias  = $request->getAttribute('alias');
        $params = ParamGroup::fromQuery($request->getQueryParams());

        if (!$resource = $this->imageResolver->resolve($src, $params, $alias)) {
            return $this->resourceNotFound($request);
        }

        return $this->responseFactory->getResponse($request, $resource);
    }
}
```
<small>Example usage of the ResponseFactory helper class contained within the PSR7
package.</small>
