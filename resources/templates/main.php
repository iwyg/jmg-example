<!DOCTYPE html>
<html lang="<?=isset($lang) ? $lang : 'en' ?>">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title><?=isset($title) ? $title : ''?></title>
    <meta name="description" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <?= $view->section('head') ?>
    <?= $view->endsection() ?>
  </head>
  <body>
    <?= $view->section('content') ?>
    <p>The default content.</p>
    <?= $view->endsection() ?>

    <?= $view->section('body-scripts') ?>
    <!-- js scripts go here -->
    <?= $view->endsection() ?>
  </body>
</html>
