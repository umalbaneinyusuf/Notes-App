const toggleBtn = document.getElementById("toggleDarkMode");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
    toggleBtn.textContent = "Light Mode";
}

toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
        localStorage.setItem("darkMode", "enabled");
        toggleBtn.textContent = "Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        toggleBtn.textContent = "Dark Mode";
    }
});

let add = document.querySelector(".addbtn");
add.addEventListener("click", function () {
    document.getElementById("errorMsg").innerText = "";
    let noteTitle = document.querySelector(".note-title").value;
    let noteBody = document.querySelector(".note-body").value;

    if (noteTitle.trim() !== "" && noteBody.trim() !== "") {
        let newnote = {
            NoteTitle: noteTitle,
            NoteBody: noteBody,
            createdAt: new Date().toLocaleString(),
            pinned: false
        };

        let notesArray = JSON.parse(localStorage.getItem("Notes")) || [];
        notesArray.unshift(newnote); 
        localStorage.setItem("Notes", JSON.stringify(notesArray));


        document.querySelector(".note-title").value = "";
        document.querySelector(".note-body").value = "";

        renderNotes();
    } else {
        document.getElementById("errorMsg").innerHTML = "<p style='text-align:center; color:#888;'>Please fill in both fields.</p>";
    }
});

function renderNotes(filterKeyword = "") {
    let container = document.querySelector(".notescontainer");
    container.innerHTML = "";

    let notesArray = JSON.parse(localStorage.getItem("Notes")) || [];

    notesArray.sort((a, b) => (b.pinned === true) - (a.pinned === true));

    notesArray.forEach((noteObj, index) => {
        if (noteObj.NoteTitle.toLowerCase().includes(filterKeyword.toLowerCase())) {
            let note = document.createElement("div");
            note.className = "notes";

            let titleContainer = document.createElement("div");
            titleContainer.style.display = "flex";
            titleContainer.style.justifyContent = "space-between";
            titleContainer.style.alignItems = "center";
            titleContainer.style.padding = "10px";
            titleContainer.style.backgroundColor = "#ffc445";

            let title = document.createElement("h1");
            title.textContent = noteObj.NoteTitle;
            title.style.margin = "0";
            title.style.fontSize = "18px";

            let menuBtn = document.createElement("button");
            menuBtn.textContent = "⋮";
            menuBtn.style.background = "none";
            menuBtn.style.border = "none";
            menuBtn.style.cursor = "pointer";
            menuBtn.style.fontSize = "25px";
            menuBtn.title = "menu";


            let menu = document.createElement("div");
            menu.style.position = "absolute";
            menu.style.background = "#fff";
            menu.style.border = "1px solid #ccc";
            menu.style.padding = "10px";
            menu.style.margin = "10px";
            menu.style.borderRadius = "5px";
            menu.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
            menu.style.display = "none";
            menu.style.zIndex = "1000";
            menu.className = "note-menu";

            let editOption = document.createElement("button");
            editOption.textContent = "Edit";
            editOption.style.display = "block";
            editOption.style.width = "100%";
            editOption.style.border = "none";
            editOption.style.background = "none";
            editOption.style.cursor = "pointer";
            editOption.addEventListener("click", () => {
                menu.style.display = "none";

                let titleInput = document.createElement("input");
                titleInput.value = noteObj.NoteTitle;
                titleInput.className = "note-title";
                title.replaceWith(titleInput);

                let bodyTextarea = document.createElement("textarea");
                bodyTextarea.value = noteObj.NoteBody;
                bodyTextarea.className = "note-body";
                body.replaceWith(bodyTextarea);

                let saveBtn = document.createElement("button");
                saveBtn.textContent = "Save";
                saveBtn.className = "delbtn";
                note.appendChild(saveBtn);

                saveBtn.addEventListener("click", () => {
                    let updatedTitle = titleInput.value;
                    let updatedBody = bodyTextarea.value;

                    if (updatedTitle && updatedBody) {
                        notesArray[index].NoteTitle = updatedTitle;
                        notesArray[index].NoteBody = updatedBody;
                        localStorage.setItem("Notes", JSON.stringify(notesArray));
                        renderNotes(filterKeyword);
                    }
                });
            });

            let pinOption = document.createElement("button");
            pinOption.textContent = noteObj.pinned ? "Unpin" : "Pin";
            pinOption.style.display = "block";
            pinOption.style.width = "100%";
            pinOption.style.border = "none";
            pinOption.style.background = "none";
            pinOption.style.cursor = "pointer";
            pinOption.addEventListener("click", () => {
                notesArray[index].pinned = !noteObj.pinned;
                localStorage.setItem("Notes", JSON.stringify(notesArray));
                renderNotes(filterKeyword);
            });

            menu.appendChild(editOption);
            menu.appendChild(pinOption);
            document.body.appendChild(menu);
            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                document.querySelectorAll(".note-menu").forEach(m => {
                    m.style.display = "none";
                });

                menu.style.display = "block";
                let rect = menuBtn.getBoundingClientRect();
                menu.style.top = `${rect.bottom + window.scrollY}px`;
                menu.style.left = `${rect.left + window.scrollX}px`;
            });

            document.addEventListener("click", () => {
                menu.style.display = "none";
            });

            titleContainer.appendChild(title);
            titleContainer.appendChild(menuBtn);

            let body = document.createElement("p");
            body.textContent = noteObj.NoteBody;

            let deletebtn = document.createElement("button");
            deletebtn.className = "delbtn";
            deletebtn.textContent = "Delete";
            deletebtn.addEventListener("click", function () {
                let confirmDelete = confirm("Are you sure?");
                if (confirmDelete) {
                    notesArray.splice(index, 1);
                    localStorage.setItem("Notes", JSON.stringify(notesArray));
                    renderNotes(filterKeyword);
                }
            });

            let time = document.createElement("small");
            time.style.padding = "10px";
            time.style.display = "block";
            time.textContent = noteObj.createdAt;

            note.appendChild(titleContainer);
            note.appendChild(body);
            note.appendChild(deletebtn);
            note.appendChild(time);
            container.appendChild(note);
        }
    });

    if (notesArray.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#888;'>No Notes yet...</p>";
        return;
    }
}



renderNotes();
document.querySelector(".search-input").addEventListener("input", function (e) {
    renderNotes(e.target.value);
});