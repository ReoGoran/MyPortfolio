<?php
require_once 'admin/config.php';
header('Content-Type: application/json');

$stmt = $pdo->query('SELECT * FROM projects ORDER BY created_at DESC');
$projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($projects);
