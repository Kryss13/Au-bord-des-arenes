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

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
document.addEventListener('DOMContentLoaded', function() {
  // --- code PRINCIPAL --- //
  $('.fa-bars').on('click', onClickBarsMenu)//Ajout d'une écoute sur le bouton de menu en mode téléphone
});
