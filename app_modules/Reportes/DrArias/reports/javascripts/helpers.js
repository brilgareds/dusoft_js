function getJSON (data) {
    return `'${JSON.stringify(data)}'`
}

function totalTasksUnresolved (tasks) {
    return tasks.filter((t) => t.status !== 'Done').length
}

function totalTasksResolved (tasks) {
    return tasks.filter((t) => t.status === 'Done').length
}

function totalTasksInProgress (tasks) {
    return tasks.filter((t) => t.status === 'In Progress').length
}

function totalTasksInReview (tasks) {
    return tasks.filter((t) => t.status === 'In Review').length
}

function iconByStatus(t) {
    switch (t.status) {
        case 'Done': return 'status-done'
        case 'In Review': return 'status-selected'
        case 'In Progress': return 'status-in-progress'
        case 'Backlog': return 'status-backlog'
        case 'Selected': return 'status-selected'
    }
}

function iconByPriority(t) {
      switch (t.priority) {
        case 'Blocker': return 'priority-blocker'
        case 'Major': return 'priority-major'
        case 'Critical': return 'priority-critical'
        case 'Minor': return 'priority-minor'
        case 'Trivial': return 'priority-trivial'
    }
}

function formatMoney (num) {
    var numero = num || 0;
    return "$" + numero.toFixed(0).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

function toJSON (data) {
  return JSON.stringify(data);
}
function nene () {
document.getElementById('placeholder').value  = "Johnny Bravo";
}

