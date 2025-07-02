<?php
session_start();
header('Content-Type: application/json');
require_once 'admin/config.php';
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get single or all
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT * FROM activity WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $activity = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($activity) {
            echo json_encode($activity);
        } else {
            echo json_encode(['error' => 'Not found']);
        }
        exit();
    } else {
        $stmt = $pdo->query('SELECT * FROM activity ORDER BY created_at DESC');
        $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'activity' => $activities]);
        exit();
    }
}

if ($method === 'POST') {
    $action = $_POST['action'] ?? '';
    // Handle file upload jika ada
    $image_url = $_POST['image_url'] ?? '';
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../images/activities/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $ext = pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION);
        $filename = 'activity_' . time() . '_' . rand(1000,9999) . '.' . $ext;
        $targetPath = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetPath)) {
            $image_url = 'images/activities/' . $filename;
        }
    }
    if ($action === 'add') {
        $stmt = $pdo->prepare('INSERT INTO activity (title, category, date, description, image_url) VALUES (?, ?, ?, ?, ?)');
        $ok = $stmt->execute([
            $_POST['title'],
            $_POST['category'],
            $_POST['date'],
            $_POST['description'],
            $image_url
        ]);
        echo json_encode(['success' => $ok]);
        exit();
    } elseif ($action === 'edit') {
        $stmt = $pdo->prepare('UPDATE activity SET title=?, category=?, date=?, description=?, image_url=? WHERE id=?');
        $ok = $stmt->execute([
            $_POST['title'],
            $_POST['category'],
            $_POST['date'],
            $_POST['description'],
            $image_url,
            $_POST['id']
        ]);
        echo json_encode(['success' => $ok]);
        exit();
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare('DELETE FROM activity WHERE id=?');
        $ok = $stmt->execute([$_POST['id']]);
        echo json_encode(['success' => $ok]);
        exit();
    }
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);
