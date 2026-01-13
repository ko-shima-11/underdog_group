export function initManager(showToast) {
  const notifications = [
    {
      id: "n-1",
      facility: "第一体育館",
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
      facility: "大講義室",
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
      facility: "ワーキングコモンズ",
      applicant: "アンナ",
      date: "8/24",
      time: "10:00-13:00",
      note: "プロト洗浄",
      slots: [
        { label: "10:00 - 11:00", free: true },
        { label: "11:00 - 12:00", free: true },
        { label: "12:00 - 13:00", free: true },
        { label: "13:00 - 14:00", free: true },
      ],
    },
  ];

  // 週間カレンダー用のダミーデータ
  const weeklyData = {
    "大講義室": [
      ["available", "busy", "available", "busy", "available", "available", "busy"],
      ["busy", "busy", "available", "available", "available", "busy", "available"],
      ["available", "available", "busy", "available", "busy", "available", "available"],
      ["available", "available", "busy", "busy", "available", "busy", "busy"],
      ["busy", "available", "available", "available", "busy", "available", "busy"],
    ],
    "ICTホール": [
      ["busy", "available", "busy", "busy", "available", "available", "busy"],
      ["available", "busy", "available", "available", "busy", "available", "busy"],
      ["available", "busy", "busy", "available", "available", "busy", "busy"],
      ["busy", "available", "available", "busy", "busy", "available", "available"],
      ["busy", "available", "busy", "available", "busy", "available", "available"],
    ],
    "ワーキングコモンズ": [
      ["available", "available", "available", "available", "available", "available", "available"],
      ["available", "available", "available", "available", "available", "available", "available"],
      ["available", "available", "available", "available", "available", "available", "available"],
      ["available", "available", "available", "available", "available", "available", "available"],
      ["available", "available", "available", "available", "available", "available", "available"],
    ],
    "PBL演習室": [
      ["busy", "available", "available", "busy", "available", "busy", "busy"],
      ["available", "busy", "available", "available", "busy", "available", "busy"],
      ["busy", "available", "busy", "busy", "available", "busy", "available"],
      ["available", "busy", "available", "busy", "available", "available", "busy"],
      ["available", "busy", "busy", "available", "busy", "available", "available"],
    ],
    "カンファレンスルーム": [
      ["busy", "available", "busy", "available", "available", "busy", "busy"],
      ["available", "busy", "available", "busy", "busy", "available", "busy"],
      ["available", "available", "busy", "available", "busy", "available", "available"],
      ["busy", "available", "busy", "busy", "available", "busy", "available"],
      ["available", "busy", "available", "busy", "busy", "available", "busy"],
    ],
    "第一体育館": [
      ["available", "busy", "available", "available", "busy", "available", "busy"],
      ["busy", "busy", "available", "busy", "available", "available", "available"],
      ["available", "available", "busy", "busy", "busy", "available", "available"],
      ["available", "busy", "available", "busy", "busy", "busy", "available"],
      ["busy", "available", "available", "available", "busy", "available", "busy"],
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
  const managerWeekStart = document.getElementById("manager-week-start");

  let currentNotification = null;
  let weekStartDate = new Date();

  // 今日の日付をデフォルトに設定
  if (managerWeekStart) {
    managerWeekStart.value = weekStartDate.toISOString().slice(0, 10);
  }

  // 週間カレンダーの描画
  const renderWeeklyCalendar = (facility, startDate) => {
    if (!weeklyCalendar) return; // 要素がない場合は終了
    
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const times = ["09:00", "11:00", "13:00", "15:00", "17:00"];
    
    weeklyCalendar.innerHTML = "";
    
    // ヘッダー（空セル + 曜日）
    weeklyCalendar.innerHTML += '<div class="weekly-calendar-header"></div>';
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayOfWeek = days[date.getDay()];
      const dayStr = `${date.getMonth() + 1}/${date.getDate()} (${dayOfWeek})`;
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
      renderWeeklyCalendar(e.target.value, weekStartDate);
    });
  }

  if (managerWeekStart) {
    managerWeekStart.addEventListener("change", (e) => {
      weekStartDate = new Date(e.target.value + "T00:00:00");
      renderWeeklyCalendar(facilitySelect.value, weekStartDate);
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
    renderWeeklyCalendar(facilitySelect.value, weekStartDate);
  }
}
