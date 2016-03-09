<?= $view->extend('main.php') ?>
<?= $view->section('head')?>
    <link href="/dist/css/index.css" rel="stylesheet"/>
<?= $view->endsection() ?>

<?= $view->section('content') ?>
<section class="hero">
</section>
<h1>this shouldn't be here</h1>
<?= $view->endsection() ?>

<?= $view->section('body-scripts') ?>
    <script type="text/javascript">
        (function (exports, undefined) {
            //alert('fuck off.');
        }(this));
    </script>
    <script src="dist/index/index.js"></script>
<?= $view->endsection() ?>
