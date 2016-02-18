<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>title</title>
    <meta name="description" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
  </head>
  <body>
    <div id="main">
      <?= $view->section('content') ?>
        <p>The default content.</p>
      <?= $view->endsection() ?>
    </div>
  </body>
</html>
