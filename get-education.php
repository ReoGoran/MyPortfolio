<?php
header('Content-Type: application/json');
require_once 'admin/config.php';
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'list') {
    // Ubah urutan ASC agar dari SD ke pendidikan terakhir
    $stmt = $pdo->query('SELECT * FROM education ORDER BY start_date ASC, created_at ASC');
    $education = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'education' => $education]);
    exit();
}
echo json_encode(['success' => false, 'error' => 'Invalid request']);
