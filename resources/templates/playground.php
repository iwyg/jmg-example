<?php $view->extend('main.php')?>
<?php $view->section('head')?>
    <link href="/dist/css/playground.css" rel="stylesheet"/>
<?php $view->endsection() ?>
<?php $view->section('content')?>
<?php $view->endsection() ?>

<?php $view->section('body-scripts') ?>
    <script type="text/javascript">
        (function (exports, undefined) {
            exports.DEFAULT_URL = '/api/v1/media/q/images';
            exports.JMG_CONFIG = <?=$jmg_config?>;
        }(this));
    </script>
    <script src="dist/playground/index.js"></script>
<?php $view->endsection() ?>
