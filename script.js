function getNextWeekend() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const nextFriday = new Date();
    
    if (dayOfWeek === 5 && now.getHours() >= 19) {
        nextFriday.setDate(now.getDate()); // It's already past 19:00 on Friday
    } else {
        nextFriday.setDate(now.getDate() + ((5 - dayOfWeek + 7) % 7)); // Get next Friday
    }
    nextFriday.setHours(19, 0, 0, 0); // Set to 19:00 (7 PM) Friday

    const endOfSunday = new Date(nextFriday);
    endOfSunday.setDate(nextFriday.getDate() + 2); // Add 2 days to get to Sunday
    endOfSunday.setHours(23, 59, 59, 999); // Set to end of Sunday

    return { nextFriday, endOfSunday };
}

function updateCountdown() {
    const now = new Date();
    const { nextFriday, endOfSunday } = getNextWeekend();

    let target;
    let headerText;
    let message;

    if (now < nextFriday) {
        target = nextFriday;
        headerText = "Það styttist í helgina!";
        message = "Það verður komin helgi eftir:";
    } else if (now <= endOfSunday) {
        target = endOfSunday;
        headerText = "Góða helgi!";
        message = "Það svona mikið eftir af helginni:";
    } else {
        target = getNextWeekend().nextFriday;
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
    linkInput.setSelectionRange(0, 99999); // For mobile devices

    document.execCommand("copy");

    alert("Hlekkur afritaður: " + linkInput.value);
}
