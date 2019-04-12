<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Envoi de mails
function sendMail($adresseMailDest, $subject, $message)
{
  // Instantiation and passing `true` enables exceptions
  $mail = new PHPMailer(true);
  try {
      // To load the French version
      $mail->setLanguage('fr', '/optional/path/to/language/directory/');
      $mail->CharSet = 'utf-8';
      //Server settings
      $mail->isSMTP();
      $mail->Host       = 'smtp.gmail.com';
      $mail->SMTPAuth   = true;
      $mail->Username   = 'auborddesarenes@gmail.com';
      $mail->Password   = 'pYim&c*X@5Ni3zsz';
      $mail->SMTPSecure = 'ssl';
      $mail->Port       = 465;

      //Recipients
      $mail->setFrom('from@example.com', 'Contact');
      $mail->addAddress($adresseMailDest);
      //$mail->addAddress('ellen@example.com', 'Name');               // Name is optional
      //$mail->addReplyTo('info@example.com', 'Information');
      //$mail->addCC('cc@example.com');
      //$mail->addBCC('bcc@example.com');

      // Attachments
      //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
      //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

      // Content
      $mail->isHTML(true);
      $mail->Subject = $subject;
      $mail->Body    = $message;
      $mail->AltBody = strip_tags($message);

      $mail->send();
  } catch (Exception $e) {
      echo "Le message n'as pas été envoyeé. Erreur Mailer : {$mail->ErrorInfo}";
  }
}
