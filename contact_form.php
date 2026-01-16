<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize form data
$fullName = filter_input(INPUT_POST, 'full_name', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
$marketing = isset($_POST['marketing']) ? 'Yes' : 'No';

// Validation
$errors = [];

if (empty($fullName)) {
    $errors[] = 'Full name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Email is not valid';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required';
}

// If there are errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Email configuration
$to = "your-email@example.com"; // Change this to your email address
$subject = "New Contact Form Submission";

// Email content
$message = "
<html>
<head>
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; max-width: 600px; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>New Contact Form Submission</h2>
    <table>
        <tr>
            <th>Field</th>
            <th>Value</th>
        </tr>
        <tr>
            <td><strong>Full Name</strong></td>
            <td>{$fullName}</td>
        </tr>
        <tr>
            <td><strong>Email</strong></td>
            <td>{$email}</td>
        </tr>
        <tr>
            <td><strong>Phone</strong></td>
            <td>{$phone}</td>
        </tr>
        <tr>
            <td><strong>Marketing Consent</strong></td>
            <td>{$marketing}</td>
        </tr>
        <tr>
            <td><strong>Submission Time</strong></td>
            <td>" . date('Y-m-d H:i:s') . "</td>
        </tr>
    </table>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: {$fullName} <{$email}>" . "\r\n";
$headers .= "Reply-To: {$email}" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Optional: CC or BCC additional emails
// $headers .= "Cc: another@example.com\r\n";
// $headers .= "Bcc: hidden@example.com\r\n";

// Send email
if (mail($to, $subject, $message, $headers)) {
    echo json_encode([
        'success' => true, 
        'message' => 'Message sent successfully!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Failed to send message. Please try again later.'
    ]);
}
?>