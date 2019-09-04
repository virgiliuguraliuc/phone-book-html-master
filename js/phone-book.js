
window.PhoneBook = {

    API_BASE_URL: "http://localhost:8083/agenda",


    display: function(persons) {
        var rows = ``;

        // ES6 function systax inside forEach
        persons.forEach(person => rows += PhoneBook.getRow(person));

        $('#phone-book tbody').html(rows);
    },

    getRow: function(person) {
        // ES6 string template
        return `<tr>
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.phoneNumber}</td>
            <td>${person.email}</td>
            <td>
                <a href='#' data-id='${person.id}' class='delete'>&#10006;</a>
                <a href='#' data-id='${person.id}' class='edit'>&#9998;</a>
            </td>
        </tr>`;
    },


    load: function () {
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method: "GET"
        }
        ).done(function (persons) {
            console.info('Successfully received');
            PhoneBook.display(JSON.parse(persons));
        });
    },

    delete: function(id) {
        $.ajax({
            url: PhoneBook.API_BASE_URL + "?id=" + id,
            method: "DELETE"
        }).done(function (response) {
            PhoneBook.load();
        });
    },

    add: function() {
        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var phoneNumber = $("#phoneNumber").val();
        var email = $("#email").val();

        var person;
        person = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber
        };

        $.ajax({
                url: PhoneBook.API_BASE_URL,
                method: "POST",
                contentType: 'application/json',
                data: JSON.stringify(person)
            },
        ).done(function (response) {
            console.log("Added" + person);
            console.log(response);
            PhoneBook.load();

        })

    },

    update: function(id) {

        var firstName = $("#firstName").val();
        var lastName = $("#lastName").val();
        var phoneNumber = $("#phoneNumber").val();
        var email = $("#email").val();

        var persons;
        person = {
            email: email,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber
        };
        $.ajax({
            url: PhoneBook.API_BASE_URL,
            method:"PUT",
            contentType: 'application/json',
            data: JSON.stringify(person)
        }).done(function (response) {
                PhoneBook.startEdit();
                PhoneBook.cancelEdit();
                PhoneBook.load();

        });
    },

    bindEvents: function() {
        $('#phone-book tbody').delegate('a.edit', 'click', function () {
            var id = $(this).data('id');
            PhoneBook.update(id);
        });

        $('#phone-book tbody').delegate('a.delete', 'click', function () {
            event.preventDefault();
            var id = $(this).data('id');
            console.info('click on ', this, id);
            PhoneBook.delete(id);
        });

        $(".add-form").submit(function(event) {
            event.preventDefault();
            PhoneBook.add();

        });

        document.getElementById('search').addEventListener('input', function(ev) {
            //const value = document.getElementById('search').value;
            const value = this.value;
            PhoneBook.search(value);
        });
        document.querySelector('.add.js-form').addEventListener('reset', function(ev) {
            PhoneBook.search("");
        });
    },

    // startEdit: function (id) {
    //     // ES5 function systax inside find
    //     var editPerson = persons.find(function (person) {
    //         console.log(person.firstName);
    //         return person.id == id;
    //     });
    //     console.debug('startEdit', editPerson);
    //
    //     $('input[id=firstName]').val(editPerson.firstName);
    //     $('input[id=lastName]').val(editPerson.lastName);
    //     $('input[id=phoneNumber]').val(editPerson.phoneNumber);
    //     $('input[id=email]').val(editPerson.email);
    //     editId = id;
    // },

    cancelEdit: function() {
        editId = '';
        document.querySelector(".add.js-form").reset();
    },



    search: function (value) {
        value = value.toLowerCase();

        var filtered = persons.filter(function (person) {
            return person.firstName.toLowerCase().includes(value) ||
                person.lastName.toLowerCase().includes(value) ||
                person.phoneNumber.toLowerCase().includes(value) ||
                person.email.toLowerCase().includes(value);
        });

        PhoneBook.display(filtered);
    }
};


console.info('Loading database info');
PhoneBook.load();
PhoneBook.bindEvents();