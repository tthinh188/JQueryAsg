const AppAPI = (() => {
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
    }

    return {
        getAllStudents,
        State
    }
})(AppAPI, View)

const Controller = ((view, module) => {
    const state = new module.State();

    const addListenerElements = () => {
        $('#submit').on('click', () => {
            state.numOfRecords = $('#limit').val();
            view.showRecords(state.studentList,state.numOfRecords);
        })


    }

    const init = async () => {
        await module.getAllStudents('jqueryassignmentdummydata.json').then(data => {
            state.studentList = data;
        })
        addListenerElements();
    }

    return {
        init
    };
})(View, Module);

Controller.init();
