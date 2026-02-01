<?php
header('Content-Type: application/json');

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!$payload) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid payload']);
    exit;
}

$baseDir = dirname(__DIR__) . '/data';
if (!is_dir($baseDir)) {
    mkdir($baseDir, 0777, true);
}

$type = $payload['type'] ?? 'leaderboard';

if ($type === 'groups') {
    $file = $baseDir . '/connections_groups.json';
    $groups = $payload['groups'] ?? [];
    file_put_contents($file, json_encode($groups, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'ok']);
    exit;
}

$file = $baseDir . '/connections_leaderboard.json';
$existing = [];
if (file_exists($file)) {
    $existing = json_decode(file_get_contents($file), true) ?: [];
}
$existing[] = $payload;
file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT));

echo json_encode(['status' => 'ok']);
