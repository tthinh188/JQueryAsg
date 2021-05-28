const readJsonFile = (() => {
    const getAllStudents = (fileName) => (
        $.getJSON(fileName)
    )
    return { getAllStudents }
})();

const View = (() => {
    // dom keywords;
    const domString = {
        table: 'table',
        editForm: 'edit_form',
        searchForm: 'search_form',
    }

    // build tmp;
    const showRecords = (records, numOfRecords) => {
        $(domString.table).find("tr:gt(1)").remove()

        let listOfRecord = records.slice(0, numOfRecords)
        listOfRecord.map((person, i) => {
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

    return {
        domString,
        showRecords
    };
})();


const Module = ((api, view) => {
    const getAllStudents = api.getAllStudents;

    class State {
        #studentList = [];
        #numOfRecords = 10;
        #index = -1;

        get numOfRecords() {
            return this.#numOfRecords;
        }

        set numOfRecords(num) {
            this.#numOfRecords = num;
        }

        get studentList() {
            return this.#studentList;
        }

        set studentList(arr) {
            this.#studentList = arr;
            view.showRecords(this.#studentList, this.#numOfRecords);
        }

        get studentIndex() {
            return this.#index;
        }

        set studentIndex(num) {
            this.#index = num;
        }
    }

    return {
        getAllStudents,
        State
    }
})(readJsonFile, View)

const Controller = ((view, module) => {
    const state = new module.State();
    const addListenerElements = () => {
        $('#submit').on('click', () => {
            state.numOfRecords = parseInt($('#limit').val());
            view.showRecords(state.studentList, state.numOfRecords);
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
            if (state.studentIndex >= 0) {
                state.studentList[state.studentIndex] = student;
            }
            else {
                state.studentList.unshift(student);
            }
            closeEditForm();
            state.studentIndex = -1;
            View.showRecords(state.studentList, state.numOfRecords)
        })
        $('.search_form').submit((e) => {
            e.preventDefault();
            const option = $('#searchOption').val();
            const searchTerm = $('#search_term').val();
            let filteredStudent = state.studentList;
            switch (option) {
                case 'firstname':
                    filteredStudent = filteredStudent.filter((student) => student.firstname.toLowerCase() === searchTerm.toLowerCase())
                    View.showRecords(filteredStudent, state.numOfRecords);
                    break;
                case 'lastname':
                    filteredStudent = filteredStudent.filter((student) => student.lastname.toLowerCase() === searchTerm.toLowerCase())
                    View.showRecords(filteredStudent, state.numOfRecords);
                    break;
                case 'location':
                    filteredStudent = filteredStudent.filter((student) => student.location.includes(searchTerm))
                    View.showRecords(filteredStudent, state.numOfRecords);
                    break;
                case 'phone':
                    filteredStudent = filteredStudent.filter((student) => student.phone === searchTerm)
                    View.showRecords(filteredStudent, state.numOfRecords);
                    break;
                default:
                    break;
            }
        })
        windowScroll();

    }

    const init = async () => {
        await module.getAllStudents('jqueryassignmentdummydata.json').then(data => {
            state.studentList = data;
        })
        addListenerElements();

    }

    return {
        init,
        state,
    };
})(View, Module);

const handleDelete = (index) => {
    const students = Controller.state.studentList;
    students.splice(index, 1)
    View.showRecords(students, Controller.state.numOfRecords);
}

const showForm = (i) => {
    const students = Controller.state.studentList;
    $('.edit_form').addClass('show');
    if (i >= 0) {
        Controller.state.studentIndex = i
        $('#firstName').val(students[i].firstname)
        $('#lastName').val(students[i].lastname)
        $('#email').val(students[i].email)
        $('#location').val(students[i].location)
        $('#phone').val(students[i].phone)
        $('#communication').val(students[i].address.communication)
        $('#permanent').val(students[i].address.permanent)
        $('#english').val(students[i].marks.english)
        $('#science').val(students[i].marks.science)
        $('#computers').val(students[i].marks.computers)
        $('#hardware').val(students[i].marks.hardware)
    }
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

const windowScroll = () => {
    $(window).on('scroll', () => {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            Controller.state.numOfRecords += 10;
            let students = Controller.state.studentList.slice(0, Controller.state.numOfRecords);
            View.showRecords(students, Controller.state.numOfRecords);

            if (Controller.state.numOfRecords > Controller.state.studentList.length) {
                $('table').append(`<tr><th colspan="13">No more record to show</th></tr>`)
                $(window).off('scroll');
            }
        }
    });
}
Controller.init();