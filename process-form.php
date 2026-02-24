<?php
// Plik: process-form.php - umieść ten plik na swoim serwerze

// Ustaw nagłówki, aby zapobiec problemom CORS (jeśli formularz jest wysyłany z innej domeny)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Sprawdź, czy request jest metodą POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["status" => "error", "message" => "Nieprawidłowa metoda żądania"]);
    exit;
}

// Pobierz dane z formularza
$postData = json_decode(file_get_contents("php://input"), true);

// Jeśli używasz tradycyjnego formularza zamiast AJAX z JSONem, użyj:
// $name = $_POST["name"];
// $email = $_POST["email"];
// itd.

// Sprawdź wymagane pola
if (empty($postData["name"]) || empty($postData["email"]) || empty($postData["subject"]) || empty($postData["message"])) {
    http_response_code(400); // Bad Request
    echo json_encode(["status" => "error", "message" => "Wszystkie wymagane pola muszą być wypełnione"]);
    exit;
}

// Przypisz zmienne
$name = htmlspecialchars($postData["name"]);
$email = filter_var($postData["email"], FILTER_SANITIZE_EMAIL);
$phone = isset($postData["phone"]) ? htmlspecialchars($postData["phone"]) : "Nie podano";
$subject = htmlspecialchars($postData["subject"]);
$message = htmlspecialchars($postData["message"]);

// Walidacja email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Nieprawidłowy adres email"]);
    exit;
}

// Adres email, na który ma być wysłana wiadomość
$to = "info@greenai-web.pl";

// Temat emaila
$emailSubject = "Nowa wiadomość z formularza kontaktowego: $subject";

// Treść emaila
$emailContent = "
<html>
<head>
  <title>Nowa wiadomość kontaktowa</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h2 { color: #2D6B4A; }
    .info { margin-bottom: 20px; }
    .label { font-weight: bold; }
    .message { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #2D6B4A; }
  </style>
</head>
<body>
  <div class='container'>
    <h2>Nowa wiadomość z formularza kontaktowego</h2>
    <div class='info'>
      <p><span class='label'>Imię i nazwisko:</span> $name</p>
      <p><span class='label'>Email:</span> $email</p>
      <p><span class='label'>Telefon:</span> $phone</p>
      <p><span class='label'>Temat:</span> $subject</p>
    </div>
    <div class='message'>
      <p><span class='label'>Wiadomość:</span></p>
      <p>" . nl2br($message) . "</p>
    </div>
  </div>
</body>
</html>
";

// Nagłówki emaila
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $name <$email>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();


// Wysłanie emaila
$success = mail($to, $emailSubject, $emailContent, $headers);

if ($success) {
    echo json_encode(["status" => "success", "message" => "Wiadomość została wysłana. Dziękujemy za kontakt!"]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["status" => "error", "message" => "Wystąpił błąd podczas wysyłania wiadomości. Prosimy spróbować ponownie."]);
}