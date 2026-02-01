<?php
// save_game.php
//
// Simple file creator for local WAMP use.
// Takes game_name, html_file, js_file, html_code, js_code.
// Writes html_file and js_file into the current directory.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Only POST is allowed.";
    exit;
}

$gameName  = isset($_POST['game_name'])  ? trim($_POST['game_name'])  : '';
$htmlFile  = isset($_POST['html_file'])  ? trim($_POST['html_file'])  : '';
$jsFile    = isset($_POST['js_file'])    ? trim($_POST['js_file'])    : '';
$htmlCode  = isset($_POST['html_code'])  ? $_POST['html_code']        : '';
$jsCode    = isset($_POST['js_code'])    ? $_POST['js_code']          : '';

if ($gameName === '' || $htmlFile === '' || $jsFile === '') {
    echo "Missing required fields.";
    exit;
}

// Basic safety for local WAMP:
// - Only allow .html/.htm for HTML
// - Only allow .js for JS
// - Strip directory separators

function clean_filename($name) {
    $name = basename($name); // remove any path
    $name = preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);
    return $name;
}

$htmlFile = clean_filename($htmlFile);
$jsFile   = clean_filename($jsFile);

$htmlExt = strtolower(pathinfo($htmlFile, PATHINFO_EXTENSION));
$jsExt   = strtolower(pathinfo($jsFile, PATHINFO_EXTENSION));

if (!in_array($htmlExt, ['html', 'htm'])) {
    echo "HTML file must end in .html or .htm";
    exit;
}
if ($jsExt !== 'js') {
    echo "JS file must end in .js";
    exit;
}

// Overwrite existing files without prompting (local dev use)
$htmlResult = file_put_contents($htmlFile, $htmlCode);
$jsResult   = file_put_contents($jsFile, $jsCode);

if ($htmlResult === false || $jsResult === false) {
    echo "Error writing files. Check file permissions.";
    exit;
}

echo "<h1>Game Files Created</h1>";
echo "<p>Game Name: <strong>" . htmlspecialchars($gameName) . "</strong></p>";
echo "<p>HTML File: <code>" . htmlspecialchars($htmlFile) . "</code></p>";
echo "<p>JS File: <code>" . htmlspecialchars($jsFile) . "</code></p>";
echo "<p>You can now register this game in the Admin Panel and use it in your site.</p>";
?>
