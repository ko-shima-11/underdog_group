export function initApplicant(showToast) {
  const preview = {
    facility: document.getElementById("facility"),
    date: document.getElementById("date"),
    start: document.getElementById("start"),
    end: document.getElementById("end"),
    people: document.getElementById("people"),
    purpose: document.getElementById("purpose"),
    memo: document.getElementById("memo"),
  };
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

  Object.values(preview).forEach((el) => el.addEventListener("input", refreshPreview));

  quickFill.addEventListener("click", () => {
    preview.facility.value = "多目的ホール";
    preview.date.value = new Date().toISOString().slice(0, 10);
    preview.start.value = "14:00";
    preview.end.value = "16:00";
    preview.people.value = 25;
    preview.purpose.value = "社外向け製品セミナー";
    preview.memo.value = "配信用カメラとマイクを希望";
    refreshPreview();
  });

  submitRequest.addEventListener("click", () => {
    showToast("申請を送信しました");
  });

  refreshPreview();
}
