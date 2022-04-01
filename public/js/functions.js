var Headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text-plain, */*",
    "X-Requested-With": "XMLHttpRequest",
    "X-CSRF-TOKEN": document.getElementById('calendar').getAttribute('data-token')
};

function date_format(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    return year + '-'
        + (month < 10 ? '0' + month : month) + '-'
        + (day < 10 ? '0' + day : day) + ' '
        + (hour < 10 ? '0'+hour : hour) + ':'
        + (min < 10 ? '0' + min : min) + ':'
        + (sec < 10 ? '0' + sec : sec);
}

function updateEvent(route, title, info) {
    return fetch(route, {
        headers: Headers,
        method: 'put',
        credentials: "same-origin",
        body: JSON.stringify({
            title: title,
            started_at: date_format(info.event.start),
            ended_at: date_format(info.event.end)
        })
    });
}

function destroyEvent(route) {
    return fetch(route, {
        headers: Headers,
        method: 'delete',
        credentials: "same-origin"
    });
}

function storeEvent(route, title, event) {
    return fetch(route, {
        headers: Headers,
        method: 'post',
        credentials: "same-origin",
        body: JSON.stringify({
            title: title,
            started_at: date_format(event.start),
            ended_at: date_format(event.end),
        })
    });
}