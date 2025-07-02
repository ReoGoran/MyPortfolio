<?php
session_start();
header('Content-Type: application/json');
require_once 'admin/config.php';
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Hanya admin yang boleh akses CRUD
$isAdmin = isset($_SESSION['admin_id']);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get single or all
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare('SELECT id, title, category, DATE_FORMAT(date, "%Y-%m-%d") as date, excerpt, content, image_url, created_at FROM articles WHERE id = ?');
        $stmt->execute([$_GET['id']]);
        $article = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($article) {
            // Pastikan content tidak null
            if (!isset($article['content'])) {
                $article['content'] = '<p>No content available for this article.</p>';
            }
            echo json_encode($article);
        } else {
            echo json_encode(['error' => 'Article not found']);
        }
        exit();
    } else {
        // Untuk daftar artikel, tidak perlu mengambil content lengkap
        $stmt = $pdo->query('SELECT id, title, category, DATE_FORMAT(date, "%Y-%m-%d") as date, excerpt, image_url, created_at FROM articles ORDER BY created_at DESC');
        $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'articles' => $articles]);
        exit();
    }
}

if ($method === 'POST' && $isAdmin) {
    $action = $_POST['action'] ?? '';
    // Handle file upload jika ada
    $image_url = $_POST['image_url'] ?? '';
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../../images/articles/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $ext = pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION);
        $filename = 'article_' . time() . '_' . rand(1000,9999) . '.' . $ext;
        $targetPath = $uploadDir . $filename;
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetPath)) {
            $image_url = 'images/articles/' . $filename;
        }
    }
    if ($action === 'add') {
        $stmt = $pdo->prepare('INSERT INTO articles (title, category, date, excerpt, content, image_url, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
        $ok = $stmt->execute([
            $_POST['title'],
            $_POST['category'],
            $_POST['date'],
            $_POST['excerpt'],
            $_POST['content'] ?? '',
            $image_url
        ]);
        echo json_encode(['success' => $ok]);
        exit();
    } elseif ($action === 'edit') {
        $stmt = $pdo->prepare('UPDATE articles SET title=?, category=?, date=?, excerpt=?, content=?, image_url=? WHERE id=?');
        $ok = $stmt->execute([
            $_POST['title'],
            $_POST['category'],
            $_POST['date'],
            $_POST['excerpt'],
            $_POST['content'] ?? '',
            $image_url,
            $_POST['id']
        ]);
        echo json_encode(['success' => $ok]);
        exit();
    } elseif ($action === 'delete') {
        $stmt = $pdo->prepare('DELETE FROM articles WHERE id=?');
        $ok = $stmt->execute([$_POST['id']]);
        echo json_encode(['success' => $ok]);
        exit();
    }
}
echo json_encode(['success' => false, 'error' => 'Invalid request']);
