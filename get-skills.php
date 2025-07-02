<?php
require_once 'admin/config.php';
header('Content-Type: application/json');

$stmt = $pdo->query('SELECT * FROM skills ORDER BY created_at DESC');
$skills = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($skills as &$skill) {
    if (isset($skill['technical_skills'])) {
        $skill['technical_skills'] = json_decode($skill['technical_skills'], true) ?: [];
    }
}
echo json_encode(['skills' => $skills]);
