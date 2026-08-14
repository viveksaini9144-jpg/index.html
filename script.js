/* DATE */

document.getElementById("today").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });


/* NAVIGATION */

function openPage(page, button) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    document.querySelectorAll(".nav").forEach(n => {
        n.classList.remove("active");
    });

    if (button) button.classList.add("active");

    document.querySelector(".sidebar").classList.remove("show");
}


/* MOBILE SIDEBAR */

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("show");
}


/* DARK MODE */

function toggleTheme() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "dark",
        document.body.classList.contains("dark")
    );
}

if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
}


/* TARGETS */

let targets =
    JSON.parse(localStorage.getItem("jeeTargets")) || [];


function addTarget() {

    const input = document.getElementById("targetInput");

    const text = input.value.trim();

    if (!text) {
        alert("Please enter a target.");
        return;
    }

    targets.push({
        text: text,
        done: false
    });

    input.value = "";

    saveTargets();
    renderTargets();
}


function saveTargets() {
    localStorage.setItem(
        "jeeTargets",
        JSON.stringify(targets)
    );
}


function renderTargets() {

    const list = document.getElementById("targetList");
    const dash = document.getElementById("dashboardTargets");

    list.innerHTML = "";
    dash.innerHTML = "";

    let completed = 0;

    targets.forEach((target, index) => {

        if (target.done) completed++;

        const div = document.createElement("div");

        div.className = "target";

        if (target.done) {
            div.classList.add("done");
        }

        div.innerHTML = `
            <span>🎯 ${escapeHTML(target.text)}</span>

            <div>
                <button onclick="completeTarget(${index})">
                    ✓
                </button>

                <button onclick="deleteTarget(${index})">
                    🗑
                </button>
            </div>
        `;

        list.appendChild(div);


        if (index < 3) {

            const small = document.createElement("div");

            small.className = "target";

            if (target.done) small.classList.add("done");

            small.innerHTML = `
                <span>🎯 ${escapeHTML(target.text)}</span>
                <button onclick="completeTarget(${index})">✓</button>
            `;

            dash.appendChild(small);
        }
    });


    document.getElementById("completedCount").textContent =
        completed;

    let percentage =
        targets.length === 0
        ? 0
        : Math.round((completed / targets.length) * 100);

    document.getElementById("progressCircle").textContent =
        percentage + "%";
}


function completeTarget(index) {

    targets[index].done =
        !targets[index].done;

    saveTargets();
    renderTargets();
}


function deleteTarget(index) {

    targets.splice(index, 1);

    saveTargets();
    renderTargets();
}


/* SECURITY */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


renderTargets();


/* TIMER */

/* CUSTOM FOCUS TIMER */

let seconds = 25 * 60;
let interval = null;
let selectedMinutes = 25;


function updateTimer() {

    const minutes =
        Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");

    const secs =
        (seconds % 60)
        .toString()
        .padStart(2, "0");

    document.getElementById("timerDisplay")
        .textContent = `${minutes}:${secs}`;
}


function setCustomTime() {

    const input =
        document.getElementById("customMinutes");

    const minutes =
        Number(input.value);


    if (!minutes || minutes < 1 || minutes > 180) {

        alert("Please enter a time between 1 and 180 minutes.");

        return;
    }


    pauseTimer();

    selectedMinutes = minutes;

    seconds = minutes * 60;

    updateTimer();

    document.getElementById("timerStatus")
        .textContent = "READY";
}


function startTimer() {

    if (interval !== null) return;

    document.getElementById("timerStatus")
        .textContent = "FOCUSING";


    interval = setInterval(() => {

        if (seconds > 0) {

            seconds--;

            updateTimer();

        } else {

            clearInterval(interval);

            interval = null;

            document.getElementById("timerStatus")
                .textContent = "COMPLETED";

            alert("🎉 Focus session completed!");

        }

    }, 1000);
}


function pauseTimer() {

    if (interval !== null) {

        clearInterval(interval);

        interval = null;
    }

    document.getElementById("timerStatus")
        .textContent = "PAUSED";
}


function resetTimer() {

    pauseTimer();

    seconds = selectedMinutes * 60;

    updateTimer();

    document.getElementById("timerStatus")
        .textContent = "READY";
}


updateTimer();


/* NOTES */

const notes =
    document.getElementById("notesBox");

notes.value =
    localStorage.getItem("jeeNotes") || "";


function saveNotes() {

    localStorage.setItem(
        "jeeNotes",
        notes.value
    );

    document.getElementById("noteStatus")
        .textContent = "✓ Saved successfully";
}


function clearNotes() {

    notes.value = "";

    localStorage.removeItem("jeeNotes");

    document.getElementById("noteStatus")
        .textContent = "Notes cleared";
}


/* DEMO AI */

function askAI() {

    const input =
        document.getElementById("question");

    const question =
        input.value.trim();

    if (!question) return;

    const chat =
        document.getElementById("chatBox");


    chat.innerHTML += `
        <div class="message user">
            ${escapeHTML(question)}
        </div>
    `;


    chat.innerHTML += `
        <div class="message bot">
            <b>✦ JEE AI</b>
            <p>
                Doubt received! Real AI answer ke liye
                is app ko AI API/backend se connect karna hoga.
            </p>
        </div>
    `;


    input.value = "";

    chat.scrollTop = chat.scrollHeight;
}