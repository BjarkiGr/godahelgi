function getNextWeekend() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const nextFriday = new Date(now);

    // Calculate the next Friday at 19:00
    if (dayOfWeek > 5 || (dayOfWeek === 5 && now.getHours() >= 19)) {
        nextFriday.setDate(now.getDate() + ((12 - dayOfWeek) % 7));
    } else {
        nextFriday.setDate(now.getDate() + ((5 - dayOfWeek + 7) % 7));
    }
    nextFriday.setHours(19, 0, 0, 0);

    // Calculate the end of Sunday at 21:00
    const endOfSunday = new Date(nextFriday);
    endOfSunday.setDate(nextFriday.getDate() + 2);
    endOfSunday.setHours(21, 0, 0, 0);

    return { nextFriday, endOfSunday };
}

function updateCountdown() {
    const now = new Date();
    const { nextFriday, endOfSunday } = getNextWeekend();

    let target;
    let headerText;
    let message;

    // Check if the current time is during the weekend (Friday 19:00 to Sunday 21:00)
    if ((now.getDay() === 5 && now.getHours() >= 19) || (now.getDay() === 6) || (now.getDay() === 0 && now.getHours() < 21)) {
        target = new Date(now);
        target.setDate(target.getDate() + (7 - now.getDay()) % 7);
        target.setHours(21, 0, 0, 0);
        headerText = "Góða helgi!";
        message = "Það svona mikið eftir af helginni:";
    } else if (now < nextFriday) {
        target = nextFriday;
        headerText = "Það styttist í helgina!";
        message = "Það verður komin helgi eftir:";
    } else {
        const nextWeekend = getNextWeekend();
        target = nextWeekend.nextFriday;
        headerText = "Það styttist í helgina!";
        message = "Það verður komin helgi eftir:";
    }

    const diff = target - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('header').innerText = headerText;
    document.getElementById('countdown').innerHTML = `
        <p>${message}</p>
        <p>${days} dagar ${hours} klst ${minutes} mínútur ${seconds} sekúndur</p>
    `;
}

setInterval(updateCountdown, 1000);
updateCountdown();

function generateLink() {
    const name = document.getElementById('nameInput').value;
    const linkContainer = document.getElementById('linkContainer');

    if (name.trim() === "") {
        linkContainer.innerHTML = "<p>Sláðu inn nafn</p>";
        return;
    }

    const encodedName = btoa(name);  // Base64 encode the name
    const link = `${window.location.href}greet.html?name=${encodedName}`;
    const linkHTML = `
        <p>Afritaðu þennan hlekk og sendu á viðkomandi:</p>
        <input type="text" id="generatedLink" value="${link}" readonly>
        <button id="copy" onclick="copyLink()">Afrita</button>
    `;
    linkContainer.innerHTML = linkHTML;
}

function copyLink() {
    const linkInput = document.getElementById('generatedLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);

    document.execCommand("copy");

    alert("Hlekkur afritaður: " + linkInput.value);
}
