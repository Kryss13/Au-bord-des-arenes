<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
require 'functions/functions.php';

if (empty($_POST)) {
  //Permet d'avoir les champs vide lors de l'arriver sur la page
  $lastName = '';
  $email = '';
  $message = '';
}

if (!empty($_POST)) {

  $lastName = htmlspecialchars($_POST['lastName']);
  $emailTo = htmlspecialchars($_POST['email']);

  $adresseMailDest = 'chris_of_13200@hotmail.com';
  $subject = 'Contact via le site web';
  $message = "<p>Vous avez reçu un message la part de <b>" . $lastName . "</b></p>";
  $message .= "<p>Adresse email de contact : " . $emailTo . "</p>";
  $message .= "<p>" . htmlspecialchars($_POST['message']) . "</p>";
  sendMail($adresseMailDest, $subject, $message);

  // Redirection vers la page d'accueil du site::
  header("Location: index.php");
}

$title = 'Contact';
$page = 'contact.phtml';
include ('base.phtml');
