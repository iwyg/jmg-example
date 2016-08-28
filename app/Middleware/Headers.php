<?php
/**
 * Created by PhpStorm.
 * User: malcolm
 * Date: 28.08.16
 * Time: 15:40
 */

namespace App\Middleware;

use Lucid\Infuse\MiddlewareInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class Headers implements MiddlewareInterface
{
    /** @var array */
    private $headers;

    /**
     * Headers constructor.
     * @param array $headers
     */
    public function __construct(array $headers)
    {
        $this->headers = $headers;
    }

    /**
     * {@inheritdoc}
     */
    public function handle(Request $request, Response $response)
    {
        foreach ($this->headers as $key => $val) {
            $response = $response->withAddedHeader($key, $val);
        }

        return [$request, $response];
    }
}