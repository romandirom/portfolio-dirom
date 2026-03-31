<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recupero dati
    $tipologia = strip_tags(trim($_POST["Tipologia_Richiesta"]));
    $nome = strip_tags(trim($_POST["Nome_Cognome"]));
    $email = filter_var(trim($_POST["Email"]), FILTER_SANITIZE_EMAIL);
    $telefono = strip_tags(trim($_POST["Telefono"]));
    $oggetto_msg = strip_tags(trim($_POST["Oggetto"]));
    $messaggio = strip_tags(trim($_POST["Messaggio"]));

    // Validazione base
    if (empty($nome) || empty($email) || empty($oggetto_msg) || empty($messaggio) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Dati incompleti o email non valida.";
        exit;
    }

    // Destinatario
    $recipient = "info@dirom.it";

    // Oggetto Email
    $subject = "Nuovo Messaggio dal Sito DI ROM: $oggetto_msg";

    // Contenuto Email
    $email_content = "Tipologia: $tipologia\n";
    $email_content .= "Nome: $nome\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Telefono: $telefono\n\n";
    $email_content .= "Messaggio:\n$messaggio\n";

    // Intestazioni Email
    $email_headers = "From: DI ROM Portfolio <no-reply@dirom.it>\r\n";
    $email_headers .= "Reply-To: $email\r\n";

    // Invio
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo "Successo";
    } else {
        http_response_code(500);
        echo "Si è verificato un errore nell'invio del messaggio.";
    }

} else {
    http_response_code(403);
    echo "Metodo non consentito.";
}
?>
