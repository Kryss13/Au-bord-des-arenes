'use strict';

/*************************************************************************************************/
/* ***************************************** CLASS ********************************************* */
/*************************************************************************************************/
var FormValidator = function($form) {
  this.$form = $form; // Objet jQuery contenant le formulaire à valider
  this.errors = []; // Tableau d'erreurs
};

FormValidator.prototype.run = function() {
  // Installation d'un gestionnaire d'évènement sur la soumission du formulaire.
  this.$form.on('submit', this.onSubmitForm.bind(this));
}

FormValidator.prototype.onSubmitForm = function(event) {

  this.errors = []; // On réinitialise les erreurs
  this.checkRequiredFields(this.errors); // Vérification des champs obligatoires
  this.checkMinimumLength(this.errors);

  if (this.errors.length > 0) {
    //Efface les erreurs quand elles sont corigées par l'utilisateur
    $('.red').remove();
    $('.lastName p').remove();
    $('.email p').remove();
    $('.password p').remove();
    $('.message p').remove();

    this.errors.forEach(function(error) {
      $('.' + error.fieldId).before($('<p>').addClass('red').text("le champ " + error.fieldName + error.message));
    });
    event.preventDefault(); //Annule le comportement du navigateur
  }
}

// VERIFIE LES CHAMPS OBLIGATOIRES
FormValidator.prototype.checkRequiredFields = function(errors) {
  this.$form.find('[data-required]').each(function() {
    //fonction executée pour chaque élément trouvé

    // Si sa valeur est vide sans les erreurs (grâce a la fonction trim)
    if ($(this).val().trim().length == 0) {
      // Alors on ajoute un objet erreur dans le tableau des erreurs
      // 1 erreur = un objet avec 3 propriétés : fieldId, fieldName et message
      // * fieldId : attribut id du champ
      // * fieldName : valeur d'un attribut data-name (qu'il faudra ajouter dans le HTML) le nom du champ pour l'utilisateur
      // * message : le message par exemple 'est requis' ou 'doit comporter au moins x caractères' etc
      errors.push({
        fieldId: this.id,
        fieldName: $(this).data('name'),
        message: ' est requis'
      });
    }
  })
};

FormValidator.prototype.checkMinimumLength = function(errors) {
  this.$form.find('[data-min-length = "8"]').each(function() {
    if ($(this).val().length < 8) {
      errors.push({
        fieldId : this.id,
        fieldName: $(this).data('name'),
        message: ' doit contenir au minimum 8 caractères'
      })
    }
  })
};
