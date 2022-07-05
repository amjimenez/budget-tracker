let db;
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.online) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    
    budgetObjectStore.add(record);
}

function uploadBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    const getALL = budgetObjectStore.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/budget' , {
                method: 'POST' ,
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })

        .then(response => response.json())
        .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }

            const transaction = db.transaction(['new_budget'], 'readwrite');
            const budgetObjectStore = transaction.objectStore('new_budget');

            budgetObjectStore.clear();

            alert('all saved budgets have been submitted!');
        })

        .catch(err => {
            console.log(err);
        });
    }
 };

}

window.addEventListener('online', uploadBudget);