'use strict';
const btnAdd = document.getElementById('note-input-button');
const txtNote = document.getElementById('note-input-form');
btnAdd.addEventListener('click', addNote);
txtNote.addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        btnAdd.click();
    }
});

let noteList = [];

if (localStorage.getItem('noteList') != null) {
    noteList = JSON.parse(localStorage.getItem('noteList'));
};

let noteBox = document.getElementById('note-box');

function displayNotes(filter) {
    let ul = document.getElementById('note-box-items');
    ul.innerHTML = '';
    if (noteList.length == 0) {
        ul.innerHTML = '<span>Not Listeniz Boş</span>'
    }
    for (const note of noteList) {
        let completed = note.durum == 'completed' ? 'checked' : '';
        if (filter == note.durum || filter == 'all') {
            let li = `
            <li class="note-box-li note-box-item">
            <div class="form-check">
                <div>
                    <label for="${note.id}" class="form-check-label ${completed}" >${note.note}</label>
                </div>
                <div class="checkbox">
                    <div id="check">
                        <input onclick="updateStatus(this)" type="checkbox" id="${note.id}" class="form-check-input" ${completed}>
                    </div>
                    <div id="remove">
                        <a onclick="removeNote(${note.id})" href="#"><i class="fa-solid fa-trash-can"></i></a>
                    </div>
                </div>
            </div>
            </li>
            `;
            ul.insertAdjacentHTML('beforeend', li);
        };
    };
}

function addNote(event) {
    event.preventDefault();
    if (isFull(txtNote.value) == true) {
        let id;
        if (noteList.length == 0) {
            id = 1;
        }
        else {
            id = noteList[noteList.length - 1].id + 1;
        }
        noteList.push(
            {
                'id': id,
                'note': ilkHarfiBuyut(txtNote.value),
                'durum': 'pending'
            }
        )
    }
    txtNote.value = '';
    displayNotes('all');
    txtNote.focus();
    saveLocal();
};

function updateStatus(selectedNote) {
    let label = selectedNote.parentElement.lastElementChild;
    let durum;
    console.log(label);
    if (selectedNote.checked) {
        label.classList.add('checked');
        durum = 'completed';
    } else {
        label.classList.remove('checked');
        durum = 'pending';
    };
    for (const note of noteList) {
        if (note.id == selectedNote.id) {
            note.durum = durum;
        }
    }
    displayNotes('all');
    saveLocal();
};

function isFull(value) {
    if (value.trim() == '') {
        return false;
    }
    return true;
};

function removeNote(id) {
    let deletedId;
    for (const noteIndex in noteList) {
        if (noteList[noteIndex].id == id) {
            deletedId = noteIndex;
        }
    };

    noteList.splice(deletedId, 1);
    displayNotes('all');
    saveLocal();
}

function ilkHarfiBuyut(value) {
    let ilkHarf = value[0].toUpperCase();
    let geriKalan = value.slice(1);
    return ilkHarf + geriKalan;
};

function saveLocal() {
    localStorage.setItem('noteList', JSON.stringify(noteList));
};

displayNotes('all');