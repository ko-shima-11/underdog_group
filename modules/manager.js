export function initManager(showToast) {
  const notifications = [
    {
      id: "n-1",
      facility: "創造スタジオ",
      applicant: "佐藤 花",
      date: "8/22",
      time: "14:00-16:00",
      note: "試作レビュー",
      slots: [
        { label: "13:00 - 14:00", free: true },
        { label: "14:00 - 15:00", free: false },
        { label: "15:00 - 16:00", free: false },
        { label: "16:00 - 17:00", free: true },
      ],
    },
    {
      id: "n-2",
      facility: "会議室 NORTH",
      applicant: "李 龍",
      date: "8/23",
      time: "09:00-11:00",
      note: "採用面談",
      slots: [
        { label: "09:00 - 10:00", free: false },
        { label: "10:00 - 11:00", free: true },
        { label: "11:00 - 12:00", free: true },
        { label: "13:00 - 14:00", free: true },
      ],
    },
    {
      id: "n-3",
      facility: "実験室 A",
      applicant: "アンナ",
      date: "8/24",
      time: "10:00-13:00",
      note: "プロト洗浄",
      slots: [
        { label: "10:00 - 11:00", free: false },
        { label: "11:00 - 12:00", free: false },
        { label: "12:00 - 13:00", free: false },
        { label: "13:00 - 14:00", free: true },
      ],
    },
  ];

  const notificationList = document.getElementById("notification-list");
  const calendar = document.getElementById("calendar");
  const scheduleTitle = document.getElementById("schedule-title");
  const scheduleSub = document.getElementById("schedule-sub");
  const managerApprove = document.getElementById("manager-approve");
  const managerReject = document.getElementById("manager-reject");

  let currentNotification = null;

  const renderNotifications = () => {
    notificationList.innerHTML = "";
    notifications.forEach((item) => {
      const btn = document.createElement("button");
      btn.innerHTML = `<strong>${item.facility}</strong> / ${item.date} ${item.time}<br><small>${item.applicant}・${item.note}</small>`;
      btn.dataset.id = item.id;
      btn.addEventListener("click", () => selectNotification(item.id));
      notificationList.appendChild(btn);
    });
  };

  const selectNotification = (id) => {
    currentNotification = notifications.find((n) => n.id === id) || null;
    document.querySelectorAll(".notification-list button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.id === id);
    });
    if (!currentNotification) return;
    scheduleTitle.textContent = `${currentNotification.facility} / ${currentNotification.date} ${currentNotification.time}`;
    scheduleSub.textContent = `${currentNotification.applicant} さんからの申請`;
    calendar.innerHTML = "";
    currentNotification.slots.forEach((slot) => {
      const div = document.createElement("div");
      div.className = `slot ${slot.free ? "free" : "busy"}`;
      div.textContent = slot.label + (slot.free ? "  空き" : "  埋まり");
      calendar.appendChild(div);
    });
  };

  managerApprove.addEventListener("click", () => {
    if (!currentNotification) return;
    showToast(`${currentNotification.facility} を承認しました`, 1500);
  });
  managerReject.addEventListener("click", () => {
    if (!currentNotification) return;
    showToast(`${currentNotification.facility} を拒否しました`, 1500);
  });

  renderNotifications();
  selectNotification("n-1");
}
