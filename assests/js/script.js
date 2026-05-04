let customers = [
    { id: 1, name: "Max Mustermann", balance: 500, image: "https://via.placeholder.com/50" },
    { id: 2, name: "Erika Mustermann", balance: 1000, image: "https://via.placeholder.com/50" },
    { id: 3, name: "Admin", balance: Infinity, image: "https://via.placeholder.com/50" } // Admin-Konto mit unendlichem Geld
];

function renderCustomers() {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '';
    customers.forEach(customer => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${customer.image}" alt="${customer.name}"> ${customer.name}: ${customer.balance === Infinity ? "Unbegrenzt" : customer.balance + " €"}`;
        customerList.appendChild(li);
    });
}

document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    if (username === 'admin' && password === 'admin') {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('bankSection').style.display = 'block';
        renderCustomers();
        loginMessage.textContent = '';
    } else {
        loginMessage.textContent = "Falscher Benutzername oder Passwort!";
        loginMessage.style.color = "red";
    }
});

document.getElementById('transferForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fromName = document.getElementById('fromName').value;
    const toName = document.getElementById('toName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const messageDiv = document.getElementById('message');

    const fromCustomer = customers.find(c => c.name.toLowerCase() === fromName.toLowerCase());
    const toCustomer = customers.find(c => c.name.toLowerCase() === toName.toLowerCase());

    if (!fromCustomer || !toCustomer) {
        messageDiv.textContent = "Kunde nicht gefunden!";
        messageDiv.style.color = "red";
        return;
    }

    if (fromCustomer.balance < amount && fromCustomer.id !== 3) { // Admin-Konto kann immer Geld senden
        messageDiv.textContent = "Unzureichendes Guthaben!";
        messageDiv.style.color = "red";
        return;
    }

    if (fromCustomer.id === 3) {
        messageDiv.textContent = "Admin hat erfolgreich Geld überwiesen!";
    } else {
        fromCustomer.balance -= amount;
        messageDiv.textContent = "Überweisung erfolgreich!";
    }
    toCustomer.balance += amount;

    renderCustomers();
});

// Autovervollständigung
function autocomplete(input, array) {
    let currentFocus;
    input.addEventListener("input", function() {
        const value = this.value;
        closeAllLists();
        if (!value) return;

        currentFocus = -1;
        const listDiv = document.createElement("div");
        listDiv.setAttribute("id", this.id + "autocomplete-list");
        listDiv.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(listDiv);

        array.forEach(customer => {
            if (customer.name.toLowerCase().includes(value.toLowerCase())) {
                const itemDiv = document.createElement("div");
                itemDiv.innerHTML = "<strong>" + customer.name.substr(0, value.length) + "</strong>";
                itemDiv.innerHTML += customer.name.substr(value.length);
                itemDiv.innerHTML += "<input type='hidden' value='" + customer.name + "'>";
                itemDiv.addEventListener("click", function() {
                    input.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                listDiv.appendChild(itemDiv);
            }
        });
    });

    input.addEventListener("keydown", function(e) {
        const items = document.getElementById(this.id + "autocomplete-list");
        if (items) items = items.getElementsByTagName("div");
        if (e.keyCode === 40) { // Pfeil nach unten
            currentFocus++;
            addActive(items);
        } else if (e.keyCode === 38) { // Pfeil nach oben
            currentFocus--;
            addActive(items);
        } else if (e.keyCode === 13) { // Enter
            e.preventDefault();
            if (currentFocus > -1 && items) items[currentFocus].click();
        }
    });

    function addActive(items) {
        if (!items) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add("suggestion");
    }

    function removeActive(items) {
        for (let item of items) {
            item.classList.remove("suggestion");
        }
    }

    function closeAllLists(element) {
        const items = document.getElementsByClassName("autocomplete-items");
    }
}
