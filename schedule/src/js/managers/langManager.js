export class LangManager {
  constructor(lang) {
    this.translations = {
      en: {
        YEAR: "Year",
        MONTH: "Month",
        WEEK: "Week",
        DAY: "Day",
        EVENTS: "Events",
        TODAY: "Today",
        ADD_EVENT: 'Add availability slot',
        UPDATE_EVENT: 'Update availability slot',
        EVENT_COLOR: 'Color:',
        EVENT_REF: "Ref",
        EVENT_TITLE: 'Title:',
        EVENT_DESCRIPTION: 'Description (optional):',
        START_HOUR: 'Start Hour:',
        END_HOUR: 'End Hour:',
        RECURRENCE: 'Recurrence',
        DATE: 'Date:',
        LIMIT_UNTIL: 'Date limit:',
        DAYS_OF_WEEK: 'Days of the Week:',
        SAVE: 'Save',
        EDIT_CONFIRMATION: "You do not have permission to make modifications here",
        DELETE_CONFIRMATION: 'Are you sure you want to delete this event ?',
        DELETE: 'Delete',
        CANCEL: 'Cancel',
        VALIDATE: 'Ok',
        SELECT_OPTION: 'Select',
        NO_EVENTS: 'No events available',
        DESCRIPTION: 'Description:',
        START: 'Start:',
        END: 'End:',
        EDIT: 'Edit',
        DUPLICATE: 'Duplicate',
        SEARCH_PLACEHOLDER: 'Search events...',
        MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        BACK: 'Back',
        NO_ITEM: "No item available",
      },
      fr: {
        YEAR: "Année",
        MONTH: "Mois",
        WEEK: "Semaine",
        DAY: "Jour",
        EVENTS: "Événements",
        TODAY: "Aujourd'hui",
        ADD_EVENT: 'Ajouter un créneau de disponibilité',
        UPDATE_EVENT: 'Mettre à jour un créneau de disponibilité',
        EVENT_COLOR: 'Couleur:',
        EVENT_REF: "Référent",
        EVENT_TITLE: 'Titre:',
        EVENT_DESCRIPTION: 'Description (optionnelle):',
        START_HOUR: 'Heure de début:',
        END_HOUR: 'Heure de fin:',
        RECURRENCE: 'Récurrence',
        DATE: 'Date:',
        LIMIT_UNTIL: 'Date limite:',
        DAYS_OF_WEEK: 'Jours de la semaine:',
        SAVE: 'Enregistrer',
        EDIT_CONFIRMATION: 'Vous n\'avez pas la permission de faire des modifications ici',
        DELETE_CONFIRMATION: 'Êtes-vous sûr de vouloir supprimer cet événement ?',
        DELETE: 'Supprimer',
        CANCEL: 'Annuler',
        VALIDATE: 'D\'accord',
        SELECT_OPTION: 'Sélectionner',
        NO_EVENTS: 'Aucun événement disponible',
        DESCRIPTION: 'Description:',
        START: 'Début:',
        END: 'Fin:',
        EDIT: 'Modifier',
        DUPLICATE: 'Dupliquer',
        SEARCH_PLACEHOLDER: 'Rechercher des événements...',
        MONTHS: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        WEEKDAYS: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
        BACK: 'Retour',
        NO_ITEM: "Aucun élement disponible",
      }
    };
    this.lang = lang;
  }

  setLang(lang) {
    this.lang = lang;
    this.translateElements();
  }

  translate(key) {
    return this.translations[this.lang][key] || key;
  }

  translateElements() {
    document.querySelectorAll('[data-translate]').forEach(elem => {
      const key = elem.getAttribute('data-translate');
      elem.textContent = this.translate(key);
    });
  }
  getMonths() {
    return this.translations[this.lang].MONTHS;
  }

  getWeekDays() {
    return this.translations[this.lang].WEEKDAYS;
  }
}