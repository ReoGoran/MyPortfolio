<?php
header('Content-Type: application/json');
require_once 'admin/config.php';
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'list') {
    $stmt = $pdo->query('SELECT * FROM experience ORDER BY start_date ASC, created_at ASC');
    $experience = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'experience' => $experience]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $stmt = $pdo->prepare('SELECT * FROM experience WHERE id = ?');
    $stmt->execute([$_GET['id']]);
    $exp = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($exp) {
        echo json_encode($exp);
    } else {
        echo json_encode(['error' => 'Not found']);
    }
    exit();
}
echo json_encode(['success' => false, 'error' => 'Invalid request']);
