const $calendar = document.getElementById('calendar');
let nbClick = 0;

const createEvent = (data_url, title, event) => {
    if (!title) {
        return Swal.showValidationMessage("Title required");
    }
    return storeEvent($calendar.getAttribute(data_url), title, event).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .catch(error => Swal.showValidationMessage(`Request failed: ${error}`))
}

const editEvent = (title, info) => {
    if (!title) {
        return Swal.showValidationMessage("Title required");
    }

    let route = $calendar.getAttribute('data-url-update');
    route = route.replace(':event', info.event.id);
    if (isNaN(info.event.id)) {
        route = $calendar.getAttribute('data-url-gc-update');
        route = route.replace(':event_id', info.event.id);
    }

    return updateEvent(route, title, info).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .catch(error => Swal.showValidationMessage(`Request failed: ${error}`))
}

const deleteEvent = (info) => {
    let route = $calendar.getAttribute('data-url-delete');
    route = route.replace(':event', info.event.id);
    if (isNaN(info.event.id)) {
        route = $calendar.getAttribute('data-url-gc-delete');
        route = route.replace(':event_id', info.event.id);
    }

    destroyEvent(route).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then(() => {
        Swal.fire('Bravo !', "L'événement a bien été supprimé", 'success')
            .then(() => calendar.refetchEvents());
    })
    .catch(error => Swal.showValidationMessage(`Request failed: ${error}`))
}

const Calendar = FullCalendar.Calendar;

const calendar = new Calendar($calendar, {
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    locale: $calendar.getAttribute('data-locale'),
    editable: true,
    eventResizableFromStart: true,
    selectable: true,
    dayMaxEvents: true,
    displayEventTime: false,
    events: $calendar.getAttribute('data-url-events'),

    eventClassNames: arg => arg.event.extendedProps.type,

    eventDidMount: info => {
        console.log('event did mount', info);
    },

    select: event => {
        Swal.fire({
            title: 'Création',
            input: 'text',
            inputAttributes: { autocapitalize: 'off' },
            showCancelButton: true,
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Ajouter',
            showLoaderOnConfirm: true,
            showDenyButton: true,
            denyButtonText: 'Ajouter (Google Agenda)',
            returnInputValueOnDeny: true,
            preConfirm: (title) => createEvent('data-url-store', title, event),
            preDeny: (title) => createEvent('data-url-gc-create', title, event),
            allowOutsideClick: () => !Swal.isLoading()
        })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Bravo !', 'Votre événement a été ajouté avec succès', 'success')
                    .then(() => calendar.refetchEvents());
            }
            else if (result.isDenied) {
                Swal.fire('Bravo !', 'Votre événement a été ajouté avec succès sur Google Calendar', 'success')
                    .then(() => calendar.refetchEvents());
            }
        });
    },

    eventDrop: info => editEvent(info.event.title, info),
    
    eventResize: info => editEvent(info.event.title, info),

    eventClick: info => {
        Swal.fire({
            title: 'Modification',
            input: 'text',
            inputValue: info.event.title,
            inputAttributes: { autocapitalize: 'off' },
            showCancelButton: true,
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Modifier',
            showLoaderOnConfirm: true,
            showDenyButton: true,
            denyButtonText: 'Supprimer',
            preConfirm: (title) => editEvent(title, info),
            allowOutsideClick: () => !Swal.isLoading()
        })
        .then((result) => {
            console.log('result', result);
            if (result.isConfirmed) {
                Swal.fire('Bravo !', 'Votre événement a été modifié avec succès', 'success')
                    .then(() => calendar.refetchEvents());
            }
            else if (result.isDenied) {
                Swal.fire({
                    title: 'Suppresion',
                    text: "Êtes-vous sûr de vouloir supprimer cet événement ?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Oui',
                    cancelButtonText: 'Non'
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        deleteEvent(info);
                    }
                })
            }
        });
    }
});

calendar.render();
