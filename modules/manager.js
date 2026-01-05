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

  // 週間カレンダー用のダミーデータ
  const weeklyData = {
    "会議室 NORTH": [
      [null, "busy", "available", "busy", null, "available", "busy"],
      ["busy", "busy", "available", null, "available", "busy", null],
      ["available", null, "busy", "available", "busy", null, "available"],
      [null, "available", "busy", "busy", "available", null, "busy"],
      ["busy", "available", null, "available", "busy", "available", null],
    ],
    "多目的ホール": [
      ["busy", "available", null, "busy", "available", null, "busy"],
      [null, "busy", "available", "available", "busy", "available", "busy"],
      ["available", "busy", "busy", null, "available", "busy", null],
      ["busy", null, "available", "busy", null, "available", "available"],
      [null, "available", "busy", "available", "busy", null, "available"],
    ],
    "実験室 A": [
      ["available", "busy", null, "available", "busy", "available", null],
      ["busy", "available", "busy", null, "available", "busy", "available"],
      [null, "busy", "available", "busy", null, "available", "busy"],
      ["available", null, "busy", "available", "busy", null, "available"],
      ["busy", "available", null, "busy", "available", "busy", null],
    ],
    "実験室 B": [
      [null, null, "available", "busy", "available", null, "busy"],
      ["available", "busy", null, "available", "busy", "available", null],
      ["busy", "available", "busy", null, "available", "busy", "available"],
      [null, "busy", "available", "busy", null, "available", null],
      ["available", null, "busy", "available", "busy", null, "available"],
    ],
    "交流ラボ": [
      ["busy", "available", "busy", null, "available", "busy", null],
      [null, "busy", "available", "busy", null, "available", "busy"],
      ["available", null, "busy", "available", "busy", null, "available"],
      ["busy", "available", null, "busy", "available", "busy", null],
      [null, "busy", "available", null, "busy", "available", "busy"],
    ],
    "創造スタジオ": [
      ["available", "busy", null, "available", "busy", "available", "busy"],
      ["busy", null, "available", "busy", "available", null, "available"],
      [null, "available", "busy", null, "busy", "available", null],
      ["available", "busy", "available", "busy", null, "busy", "available"],
      ["busy", "available", null, "available", "busy", null, "busy"],
    ],
  };

  const notificationList = document.getElementById("notification-list");
  const calendar = document.getElementById("calendar");
  const scheduleTitle = document.getElementById("schedule-title");
  const scheduleSub = document.getElementById("schedule-sub");
  const managerApprove = document.getElementById("manager-approve");
  const managerReject = document.getElementById("manager-reject");
  const weeklyCalendar = document.getElementById("weekly-calendar");
  const facilitySelect = document.getElementById("facility-select");

  let currentNotification = null;

  // 週間カレンダーの描画
  const renderWeeklyCalendar = (facility) => {
    if (!weeklyCalendar) return; // 要素がない場合は終了
    
    const today = new Date();
    const days = ["月", "火", "水", "木", "金", "土", "日"];
    const times = ["09:00", "11:00", "13:00", "15:00", "17:00"];
    
    weeklyCalendar.innerHTML = "";
    
    // ヘッダー（空セル + 曜日）
    weeklyCalendar.innerHTML += '<div class="weekly-calendar-header"></div>';
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayStr = `${date.getMonth() + 1}/${date.getDate()} (${days[i % 7]})`;
      weeklyCalendar.innerHTML += `<div class="weekly-calendar-header">${dayStr}</div>`;
    }
    
    // 時間帯ごとの行
    const data = weeklyData[facility] || [];
    times.forEach((time, rowIndex) => {
      weeklyCalendar.innerHTML += `<div class="weekly-calendar-time">${time}</div>`;
      for (let col = 0; col < 7; col++) {
        const status = data[rowIndex]?.[col];
        const className = status ? status : "empty";
        const text = status === "busy" ? "予約済" : status === "available" ? "空き" : "";
        weeklyCalendar.innerHTML += `<div class="weekly-calendar-cell ${className}">${text}</div>`;
      }
    });
  };

  if (facilitySelect) {
    facilitySelect.addEventListener("change", (e) => {
      renderWeeklyCalendar(e.target.value);
    });
  }

  const renderNotifications = () => {
    notificationList.innerHTML = "";
    notifications.forEach((item) => {
      const btn = document.createElement("button");
      btn.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <div style="text-align:left;flex:1;">
            <strong>${item.facility}</strong><br>
            <small>${item.date} ${item.time} ・ ${item.applicant}</small><br>
            <small style="color:var(--muted);">${item.note}</small>
          </div>
          <div style="font-size:20px;opacity:0.5;">❯</div>
        </div>
      `;
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
    scheduleTitle.textContent = `${currentNotification.facility} の使用状況`;
    scheduleSub.textContent = `${currentNotification.date} ${currentNotification.time} / ${currentNotification.applicant} さんからの申請`;
    calendar.innerHTML = "";
    currentNotification.slots.forEach((slot) => {
      const div = document.createElement("div");
      div.className = `slot ${slot.free ? "free" : "busy"}`;
      div.textContent = slot.label;
      calendar.appendChild(div);
    });
  };

  managerApprove.addEventListener("click", () => {
    if (!currentNotification) return;
    showToast(`${currentNotification.facility} を承認しました`, 1800);
  });
  managerReject.addEventListener("click", () => {
    if (!currentNotification) return;
    showToast(`${currentNotification.facility} を拒否しました`, 1800);
  });

  renderNotifications();
  selectNotification("n-1");
  if (weeklyCalendar && facilitySelect) {
    renderWeeklyCalendar(facilitySelect.value);
  }
}
