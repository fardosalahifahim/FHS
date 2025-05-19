<?php
session_start();

$ADMIN_USERNAME = 'FaridpurHighSchool';
$ADMIN_PASSWORD = 'FHS2025faridpurhighschool';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === $ADMIN_USERNAME && $password === $ADMIN_PASSWORD) {
        $_SESSION['loggedin'] = true;
        header('Location: dashboard.html');
        exit();
    } else {
        $error = 'Invalid username or password';
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Admin Login</title>
  <link rel="stylesheet" href="css/admin-style.css" />
</head>
<body>
  <div class="login-container">
    <h2>Admin Login</h2>
    <?php if (!empty($error)): ?>
      <p style="color: red;"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>
    <form method="POST" action="login.php">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required autocomplete="off" />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required autocomplete="off" />
      <button type="submit">Login</button>
    </form>
  </div>
</body>
</html>
