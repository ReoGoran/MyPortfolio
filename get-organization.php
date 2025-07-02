<?php
session_start();
require_once 'admin/config.php';

header('Content-Type: application/json');

// Cek login jika akses dari admin, jika public tidak perlu
$isAdmin = isset($_SESSION['admin_id']);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // Detail satu organization
        $stmt = $pdo->prepare('SELECT * FROM organization WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $org = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($org) {
            echo json_encode($org);
        } else {
            echo json_encode(['error'=>'Not found']);
        }
        exit();
    }
    // List all organization
    $stmt = $pdo->query('SELECT * FROM organization ORDER BY start_date DESC, created_at DESC');
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success'=>true, 'organization'=>$data]);
    exit();
}

// Untuk admin: CRUD via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $isAdmin) {
    $action = $_POST['action'] ?? '';
    if ($action === 'add') {
        $stmt = $pdo->prepare('INSERT INTO organization (name, role, start_date, end_date, description) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $_POST['name'], $_POST['role'], $_POST['start_date'], $_POST['end_date'], $_POST['description']
        ]);
        echo json_encode(['success'=>true]);
        exit();
    } elseif ($action === 'edit') {
        $stmt = $pdo->prepare('UPDATE organization SET name=?, role=?, start_date=?, end_date=?, description=? WHERE id=?');
        $stmt->execute([
            $_POST['name'], $_POST['role'], $_POST['start_date'], $_POST['end_date'], $_POST['description'], $_POST['id']
        ]);
        echo json_encode(['success'=>true]);
        exit();
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare('DELETE FROM organization WHERE id=?');
        $stmt->execute([$_POST['id']]);
        echo json_encode(['success'=>true]);
        exit();
    }
}

echo json_encode(['error'=>'Invalid request']);
