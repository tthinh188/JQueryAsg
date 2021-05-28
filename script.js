let people;
let index = -1;
let limit = 10;

const fetchData = async (fileName) => {
    await $.getJSON(fileName).then(data => people = data);
    showRecord(people, limit);
}
fetchData('jqueryassignmentdummydata.json');

const showRecord = async (records, numOfRecords) => {
    $('table').find("tr:gt(1)").remove()
    let listOfRecord = records.slice(0, numOfRecords)
    await listOfRecord.map((person, i) => {
        $('table').append(
            `<tr id=row${i}>
                    <td>${person.firstname}</td>
                    <td>${person.lastname}</td>
                    <td>${person.email}</td>
                    <td>${person.location}</td>
                    <td>${person.phone}</td>
                    <td>${person.address.communication}</td>
                    <td>${person.address.permanent}</td>
                    <td>${person.marks.english}</td>
                    <td>${person.marks.science}</td>
                    <td>${person.marks.computers}</td>
                    <td>${person.marks.hardware}</td>
                    <td><button onclick='showForm(${i})' class='primary_btn' id='edit_btn' >Edit</button></td>
                    <td><button onclick='handleDelete(${i})' class='secondary_btn' id='delete_btn'>Delete</button></td>
                </tr>`
        )
    });

    localStorage.setItem('students', JSON.stringify(listOfRecord))
}

const showForm = (i) => {
    $('.edit_form').addClass('show');
    if (i >= 0) {
        index = i;
        $('#firstName').val(people[i].firstname)
        $('#lastName').val(people[i].lastname)
        $('#email').val(people[i].email)
        $('#location').val(people[i].location)
        $('#phone').val(people[i].phone)
        $('#communication').val(people[i].address.communication)
        $('#permanent').val(people[i].address.permanent)
        $('#english').val(people[i].marks.english)
        $('#science').val(people[i].marks.science)
        $('#computers').val(people[i].marks.computers)
        $('#hardware').val(people[i].marks.hardware)
    }
}

const handleDelete = (index) => {
    people.splice(index, 1)
    showRecord(people, limit);
}

const closeEditForm = () => {
    index = -1;
    $('#firstName').val('');
    $('#lastName').val('');
    $('#email').val('');
    $('#location').val('');
    $('#phone').val('');
    $('#communication').val('');
    $('#permanent').val('');
    $('#english').val('');
    $('#science').val('');
    $('#computers').val('');
    $('#hardware').val('');
    $('.edit_form').removeClass('show');
}

$('#submit').on('click', () => {
    limit = parseInt($('#limit').val());
    showRecord(people, limit);
    windowScroll();
})

$('.edit_form').submit((e) => {
    e.preventDefault();
    const location = $('#location').val().split(',');

    const student = {
        firstname: $('#firstName').val(),
        lastname: $('#lastName').val(),
        email: $('#email').val(),
        location: location,
        phone: $('#phone').val(),
        address: {
            communication: $('#communication').val(),
            permanent: $('#permanent').val()
        },
        marks: {
            english: $('#english').val(),
            science: $('#science').val(),
            computers: $('#computers').val(),
            hardware: $('#hardware').val(),
        }
    }
    if (index >= 0) {
        people[index] = student;
    }
    else {
        people.push(student);
    }
    closeEditForm();
    index = -1;
    showRecord(people, limit)
})

$('.search_form').submit((e) => {
    e.preventDefault();
    const option = $('#searchOption').val();
    const searchTerm = $('#search_term').val();
    let filteredStudent = people;
    switch (option) {
        case 'firstname':
            filteredStudent = filteredStudent.filter((student) => student.firstname.toLowerCase() === searchTerm.toLowerCase())
            showRecord(filteredStudent);
            break;
        case 'lastname':
            filteredStudent = filteredStudent.filter((student) => student.lastname.toLowerCase() === searchTerm.toLowerCase())
            showRecord(filteredStudent)
            break;
        case 'location':
            filteredStudent = filteredStudent.filter((student) => student.location.includes(searchTerm))
            showRecord(filteredStudent)
            break;
        case 'phone':
            filteredStudent = filteredStudent.filter((student) => student.phone === searchTerm)
            showRecord(filteredStudent)
            break;
        default:
            break;
    }
})

const windowScroll = () => {
    $(window).on('scroll', async () => {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            limit += 10;
            let copy = people.slice(0, limit);
            await showRecord(copy, limit);

            if (limit > people.length) {
                $('table').append(`<tr><th colspan="13">No more record to show</th></tr>`)
                $(window).off('scroll');
            }
        }
    });
}

windowScroll();
