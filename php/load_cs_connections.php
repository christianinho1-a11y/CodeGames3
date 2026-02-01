<?php
header('Content-Type: application/json');

$baseDir = dirname(__DIR__) . '/data';
$leaderboardFile = $baseDir . '/connections_leaderboard.json';
$groupsFile = $baseDir . '/connections_groups.json';

$leaderboard = [];
$groups = [];

if (file_exists($leaderboardFile)) {
    $leaderboard = json_decode(file_get_contents($leaderboardFile), true) ?: [];
}

if (file_exists($groupsFile)) {
    $groups = json_decode(file_get_contents($groupsFile), true) ?: [];
}

echo json_encode([
    'leaderboard' => $leaderboard,
    'groups' => $groups
]);
