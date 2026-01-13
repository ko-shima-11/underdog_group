export function initApplicant(showToast) {
  // サンプル予約データ
  const reservations = [
    { id: 1, facility: "大講義室", date: "2026-01-20", time: "10:00-12:00", purpose: "チーム勉強会", status: "approved" },
    { id: 2, facility: "ICTホール", date: "2026-01-25", time: "14:00-16:00", purpose: "製品セミナー", status: "pending" },
    { id: 3, facility: "ワーキングコモンズ", date: "2026-02-05", time: "09:00-11:00", purpose: "実験レビュー", status: "approved" },
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
      ["available", "busy", "available", "available", "busy", "available", "busy"],
      ["busy", "available", "busy", "available", "available", "busy", "available"],
      ["available", "busy", "available", "busy", "busy", "available", "busy"],
      ["available", "available", "busy", "available", "busy", "busy", "available"],
      ["busy", "available", "busy", "busy", "available", "busy", "available"],
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

  const preview = {
    facility: document.getElementById("facility"),
    date: document.getElementById("date"),
    start: document.getElementById("start"),
    end: document.getElementById("end"),
    people: document.getElementById("people"),
    purpose: document.getElementById("purpose"),
    memo: document.getElementById("memo"),
  };
  
  // 今日の日付をデフォルトに設定
  const today = new Date().toISOString().slice(0, 10);
  preview.date.value = today;

  const applicantCalendar = document.getElementById("applicant-calendar");
  const applicantFacilitySelect = document.getElementById("applicant-facility-select");
  const applicantWeekStart = document.getElementById("applicant-week-start");
  const reservationList = document.getElementById("reservation-list");
  
  let weekStartDate = new Date();

  // 今日の日付をデフォルトに設定
  if (applicantWeekStart) {
    applicantWeekStart.value = weekStartDate.toISOString().slice(0, 10);
  }

  const previewChip = {
    facility: document.querySelector("#preview .chip.accent"),
    date: document.querySelector("#preview .chip.warn"),
    time: document.querySelector("#preview .chip:nth-child(3)"),
    people: document.querySelector("#preview .chip:nth-child(4)"),
    purpose: document.getElementById("preview-purpose"),
    memo: document.getElementById("preview-memo"),
  };

  const quickFill = document.getElementById("quick-fill");
  const submitRequest = document.getElementById("submit-request");
  const clearForm = document.getElementById("clear-form");

  const formatDateInput = (value) => {
    if (!value) return "-";
    const [, m, d] = value.split("-");
    return `${Number(m)}月${Number(d)}日`;
  };

  const refreshPreview = () => {
    previewChip.facility.textContent = `施設: ${preview.facility.value}`;
    previewChip.date.textContent = `日付: ${formatDateInput(preview.date.value)}`;
    previewChip.time.textContent = `時間: ${preview.start.value || "--"} - ${preview.end.value || "--"}`;
    previewChip.people.textContent = `人数: ${preview.people.value || "-"} 名`;
    previewChip.purpose.textContent = `用途: ${preview.purpose.value || "-"}`;
    previewChip.memo.textContent = `連絡事項: ${preview.memo.value || "-"}`;
  };

  // 週間カレンダーの描画
  const renderWeeklyCalendar = (facility, startDate) => {
    if (!applicantCalendar) return;
    
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    const times = ["09:00", "11:00", "13:00", "15:00", "17:00"];
    
    applicantCalendar.innerHTML = "";
    
    // ヘッダー（空セル + 曜日）
    applicantCalendar.innerHTML += '<div class="weekly-calendar-header"></div>';
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayOfWeek = days[date.getDay()];
      const dayStr = `${date.getMonth() + 1}/${date.getDate()} (${dayOfWeek})`;
      applicantCalendar.innerHTML += `<div class="weekly-calendar-header">${dayStr}</div>`;
    }
    
    // 時間帯ごとの行
    const data = weeklyData[facility] || [];
    times.forEach((time, rowIndex) => {
      applicantCalendar.innerHTML += `<div class="weekly-calendar-time">${time}</div>`;
      for (let col = 0; col < 7; col++) {
        const status = data[rowIndex]?.[col];
        const className = status ? status : "empty";
        const text = status === "busy" ? "予約済" : status === "available" ? "空き" : "";
        applicantCalendar.innerHTML += `<div class="weekly-calendar-cell ${className}">${text}</div>`;
      }
    });
  };

  // 予約リストの描画
  const renderReservations = () => {
    reservationList.innerHTML = "";
    
    if (reservations.length === 0) {
      reservationList.innerHTML = '<li style="text-align:center;color:var(--muted);">予約はありません</li>';
      return;
    }

    reservations.forEach(reservation => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="reservation-info">
          <strong>${reservation.facility}</strong><br>
          <small>${formatDateInput(reservation.date)} ${reservation.time}</small><br>
          <small style="color:var(--muted);">${reservation.purpose}</small>
        </div>
        <div class="reservation-actions">
          <span class="reservation-status ${reservation.status}">${reservation.status === "approved" ? "承認済" : "承認待ち"}</span>
          <button class="btn-cancel" data-id="${reservation.id}">キャンセル</button>
        </div>
      `;
      reservationList.appendChild(li);
    });

    // キャンセルボタンのイベント
    document.querySelectorAll(".btn-cancel").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const index = reservations.findIndex(r => r.id === id);
        if (index !== -1) {
          if (confirm(`${reservations[index].facility}の予約をキャンセルしますか?`)) {
            reservations.splice(index, 1);
            renderReservations();
            showToast("予約をキャンセルしました", 1800);
          }
        }
      });
    });
  };

  // イベントリスナー
  if (applicantFacilitySelect) {
    applicantFacilitySelect.addEventListener("change", (e) => {
      renderWeeklyCalendar(e.target.value, weekStartDate);
    });
  }

  if (applicantWeekStart) {
    applicantWeekStart.addEventListener("change", (e) => {
      weekStartDate = new Date(e.target.value + "T00:00:00");
      renderWeeklyCalendar(applicantFacilitySelect.value, weekStartDate);
    });
  }

  Object.values(preview).forEach((el) => el.addEventListener("input", refreshPreview));

  quickFill.addEventListener("click", () => {
    preview.facility.value = "ICTホール";
    preview.date.value = new Date().toISOString().slice(0, 10);
    preview.start.value = "14:00";
    preview.end.value = "16:00";
    preview.people.value = 25;
    preview.purpose.value = "社外向け製品セミナー";
    preview.memo.value = "配信用カメラとマイクを希望";
    refreshPreview();
  });

  submitRequest.addEventListener("click", () => {
    // 簡単なバリデーション
    if (!preview.date.value || !preview.purpose.value) {
      showToast("必須項目を入力してください", 2000);
      return;
    }
    showToast("申請を送信しました！", 2000);
  });

  clearForm.addEventListener("click", () => {
    preview.facility.selectedIndex = 0;
    preview.date.value = today;
    preview.start.value = "10:00";
    preview.end.value = "12:00";
    preview.people.value = 6;
    preview.purpose.value = "";
    preview.memo.value = "";
    refreshPreview();
    showToast("フォームをクリアしました", 1500);
  });

  // 初期描画
  if (applicantCalendar && applicantFacilitySelect) {
    renderWeeklyCalendar(applicantFacilitySelect.value, weekStartDate);
  }
  renderReservations();
  refreshPreview();
}