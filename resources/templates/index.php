<?= $view->extend('main.php') ?>
<?= $view->section('head')?>
<link href="/dist/css/index.css" rel="stylesheet"/>
<?= $view->endsection() ?>

<?= $view->section('content') ?>
<header id="site-header" class="site-header">
    <h1>I stay on top</h1>
    <div class="hero">hero image here</div>
    <section class="main-nav">
        <nav>
            <ul>
                <li>About</li>
                <li>Playground</li>
            </ul>
        </nav>
    </section>
</header>
<section class="container">
    <div class="content">
        <?= $func('markdown', 'test.md') ?>
    </div>
</section>
<footer>
    <p>this is the footer</p>
</footer>
<?= $view->endsection() ?>

<?= $view->section('body-scripts') ?>
    <script type="text/javascript">
        (function (exports, undefined) {
            //alert('fuck off.');
        }(this));
    </script>
<?= $view->endsection() ?>
