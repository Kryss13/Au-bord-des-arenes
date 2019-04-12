'use strict';

/*************************************************************************************************/
/* ****************************************** DONNEES ****************************************** */
/*************************************************************************************************/


/*************************************************************************************************/
/* ***************************************** FONCTIONS ***************************************** */
/*************************************************************************************************/
//AFFICHE OU CACHE LE MENU EN MODE TELEPHONE
function onClickBarsMenu() {
  $('.hideHeaderMenu').toggleClass('showHeaderMenu');
}

//FONCTION POUR LA VALIDATION DES FORMULAIRES COTE CLIENT
function runFormValidator() {
  var $form;
  var $formValidator;
  $form = $('form:not([data-no-validation = true])');//Selection des formulaires en jquery avec seulement ceux qui n'ont pas l'attribut data no-validation
  if ($form.length > 0) {//si on trouve au moin un formulaire sur la page
    $formValidator = new FormValidator($form);
    $formValidator.run();
  }
}

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
document.addEventListener('DOMContentLoaded', function() {
  // --- code PRINCIPAL --- //
  runFormValidator();
  
  $('.fa-bars').on('click', onClickBarsMenu)//Ajout d'une écoute sur le bouton de menu en mode téléphone
});
