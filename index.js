const bdJsonClubs = ` [
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]`;

const bdJsonUsers = `[
    {
        "id": 1,
        "name": "Павел",
        "clubId": 1
        
    },
        {
        "id": 2,
        "name": "Виктор",
        "clubId": 2
        
    }
]`;

const keyClubs = "clubs";
const keyUsers = "user";

if (!localStorage.getItem(keyClubs)) {
  localStorage.setItem(keyClubs, bdJsonClubs);
}

if (!localStorage.getItem(keyUsers)) {
  localStorage.setItem(keyUsers, bdJsonUsers);
}

const clubs = JSON.parse(localStorage.getItem(keyClubs));
const users = JSON.parse(localStorage.getItem(keyUsers));

const containerTableEl = document.querySelector(".containerTable");

function createClubHtml(club) {
  const isCurrentUserEnrolled = currentUser.clubId === club.id;
  const isMaxParticipantsReached =
    club.currentParticipants >= club.maxParticipants;

  return `<div class="club" data-id = "${club.id}">
              <div class="name">Название клуба: ${club.name}</div>
              <div class="time">Время проведения:${club.time}</div>
              <div class="maxParticipants">Максимальное кол-во участников:${
                club.maxParticipants
              }</div>
              <div class="currentParticipants">Текущее кол-во участников:${
                club.currentParticipants
              }</div>
              <button class = "makeAnAppointment ${
                isMaxParticipantsReached || isCurrentUserEnrolled
                  ? "disabled"
                  : ""
              }">Записаться</button>
              <button class="cancelAnAppointment" ${
                !isCurrentUserEnrolled ? "disabled" : ""
              }>Отменить запись</button>
            </div>
            `;
}

function showClubs() {
  containerTableEl.innerHTML = clubs
    .map((element) => createClubHtml(element))
    .join("");
}

function loginUser() {
  let userName = "";
  while (!userName) {
    userName = prompt("Введите имя (или оставьте пустым для регистрации)");
    if (!userName) {
      alert("Необходимо быть пользователем!");
    }
  }

  let user = users.find((user) => user.name === userName);

  if (!user) {
    const newUser = {
      id: users.length + 1,
      name: userName,
      clubId: null,
    };
    users.push(newUser);
    localStorage.setItem(keyUsers, JSON.stringify(users));
    user = newUser;
  }
  alert(`Добро пожаловать, ${user.name}!`);
  return user;
}

const currentUser = loginUser();

showClubs();

containerTableEl.addEventListener("click", (event) => {
  if (!event.target || !event.target.classList) {
    return;
  }
  if (event.target.classList.contains("makeAnAppointment")) {
    const clubEl = event.target.closest(".club");
    const clubId = +clubEl.getAttribute("data-id");
    const club = clubs.find((club) => club.id === clubId);

    if (currentUser.clubId === clubId) {
      alert(`Вы уже записаны в "${club.name}"`);
    }

    if (currentUser.clubId !== null) {
      alert(
        `Вы уже записаны в клуб "${currentUser.clubId}". Отмените запись в текущем клубе, прежде чем записываться в другой`
      );
      return;
    }

    if (club.currentParticipants < club.maxParticipants) {
      club.currentParticipants++;
      currentUser.clubId = clubId;
      localStorage.setItem(keyClubs, JSON.stringify(clubs));
      localStorage.setItem(keyUsers, JSON.stringify(users));
      showClubs();
    } else {
      alert("Мест нет");
    }
  }

  if (event.target.classList.contains("cancelAnAppointment")) {
    const clubEl = event.target.closest(".club");
    const clubId = +clubEl.getAttribute("data-id");
    const club = clubs.find((club) => club.id === clubId);

    if (currentUser.clubId === clubId) {
      club.currentParticipants--;
      currentUser.clubId = null;
      localStorage.setItem(keyClubs, JSON.stringify(clubs));
      localStorage.setItem(keyUsers, JSON.stringify(users));
      showClubs();
    } else {
      alert("Вы не записаны в этот клуб");
    }
  }
});
