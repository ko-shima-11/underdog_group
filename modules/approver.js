export function initApprover(showToast) {
  console.log("initApprover called");
  const deck = document.getElementById("deck");
  const deckEmpty = document.getElementById("deck-empty");
  const decisionLog = document.getElementById("decision-log");
  const approveBtn = document.getElementById("approve-btn");
  const rejectBtn = document.getElementById("reject-btn");

  console.log("Elements:", { deck, deckEmpty, decisionLog, approveBtn, rejectBtn });

  const pendingCards = [
    { id: 1, applicant: "佐藤 花", facility: "会議室 NORTH", date: "1/20 (月)", time: "10:00-12:00", purpose: "部署横断MTG", equipment: "モニター, ホワイトボード" },
    { id: 2, applicant: "李 龍", facility: "多目的ホール", date: "1/22 (水)", time: "13:00-15:00", purpose: "社外セミナー", equipment: "PAセット, 配信" },
    { id: 3, applicant: "アンナ", facility: "実験室 B", date: "1/24 (金)", time: "09:00-10:30", purpose: "デモ準備", equipment: "3Dプリンタ, 工具" },
    { id: 4, applicant: "高橋 光", facility: "交流ラボ", date: "1/25 (土)", time: "16:00-18:00", purpose: "採用向け会社説明", equipment: "スクリーン" },
    { id: 5, applicant: "田中 健", facility: "実験室 A", date: "1/27 (月)", time: "14:00-17:00", purpose: "新製品テスト", equipment: "測定器, PC" },
    { id: 6, applicant: "鈴木 美咲", facility: "創造スタジオ", date: "1/28 (火)", time: "10:00-12:00", purpose: "ワークショップ", equipment: "プロジェクター" },
  ];
  console.log("pendingCards:", pendingCards);
  let currentQueue = [...pendingCards];
  let decisionHistory = []; // 判定履歴を保存
  let dragging = false;
  let startX = 0;
  let activeCard = null;

  const renderDeck = () => {
    console.log("renderDeck called, currentQueue length:", currentQueue.length);
    deck.innerHTML = "";
    if (!currentQueue.length) {
      deck.style.display = "none";
      deckEmpty.style.display = "grid";
      deckEmpty.innerHTML = '<div style="text-align:center;"><div>新規の申請はありません</div><div style="margin-top:8px;color:var(--muted);font-size:13px;">すべて処理済みです</div></div>';
      return;
    }
    deck.style.display = "block";
    deckEmpty.style.display = "none";
    const stack = [...currentQueue].slice(0, 3).reverse();
    console.log("Rendering stack:", stack);
    stack.forEach((item, idx) => {
      const isTop = idx === stack.length - 1;
      const card = document.createElement("div");
      card.className = "swipe-card";
      // card.dataset.hint = "スワイプ可";
      card.style.zIndex = 10 + idx;
      card.style.transform = `translateY(${idx * 6}px) scale(${1 - idx * 0.02})`;
      card.style.pointerEvents = isTop ? "auto" : "none";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">
          <h4 style="margin:0;">${item.facility}</h4>
          <span class="chip accent" style="font-size:11px;">残り${currentQueue.length}件</span>
        </div>
        <p style="margin:4px 0;"><strong>申請者:</strong> ${item.applicant}</p>
        <p style="margin:4px 0;"><strong>日時:</strong> ${item.date} / ${item.time}</p>
        <p style="margin:4px 0;"><strong>用途:</strong> ${item.purpose}</p>
        <p style="margin:4px 0;"><strong>備品:</strong> ${item.equipment}</p>
        <div style="margin-top:14px;padding-top:10px;border-top:1px dashed rgba(255,255,255,0.1);color:var(--muted);font-size:12px;text-align:center;">
          ← 左にスワイプで拒否 / 右にスワイプで承認 →
        </div>
      `;
      if (isTop) attachSwipe(card, item);
      deck.appendChild(card);
    });
  };

  const attachSwipe = (card, data) => {
    card.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      activeCard = { card, data };
      card.setPointerCapture(e.pointerId);
    });

    card.addEventListener("pointermove", (e) => {
      if (!dragging || activeCard?.card !== card) return;
      const dx = e.clientX - startX;
      const rot = dx / 18;
      card.style.transform = `translateX(${dx}px) rotate(${rot}deg)`;
      card.style.boxShadow = `0 12px 40px rgba(0,0,0,0.35), 0 0 0 2px ${
        dx > 0 ? "rgba(79,209,197,0.4)" : "rgba(255,107,107,0.35)"
      }`;
    });

    const endDrag = (e) => {
      if (!dragging || activeCard?.card !== card) return;
      dragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 90) {
        const decision = dx > 0 ? "approve" : "reject";
        card.style.transition = "transform 0.2s ease, opacity 0.2s ease";
        card.style.transform = `translateX(${dx > 0 ? 240 : -240}px) rotate(${dx > 0 ? 20 : -20}deg)`;
        card.style.opacity = "0";
        setTimeout(() => finalizeDecision(decision, data), 180);
      } else {
        card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
        card.style.transform = "";
        card.style.boxShadow = "";
      }
      activeCard = null;
    };

    card.addEventListener("pointerup", endDrag);
    card.addEventListener("pointercancel", endDrag);
  };

  const renderDecisionLog = () => {
    decisionLog.innerHTML = "";
    decisionHistory.forEach((decision, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${decision.data.facility}</strong> / ${decision.data.date} ${decision.data.time}<br>
          <small>${decision.data.applicant} ・ ${decision.data.purpose}</small>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <span class="chip ${decision.type === "approve" ? "accent" : "danger"}">
            ${decision.type === "approve" ? "承認" : "拒否"}
          </span>
          <button class="btn-undo" data-index="${index}" style="background:rgba(0,0,0,0.05);border:1px solid var(--border);padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">
            取消
          </button>
        </div>
      `;
      decisionLog.prepend(li);
    });

    // 取消ボタンのイベント
    document.querySelectorAll(".btn-undo").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        const decision = decisionHistory[index];
        if (confirm(`${decision.data.facility}の${decision.type === "approve" ? "承認" : "拒否"}を取り消しますか？`)) {
          // 決定を取り消してキューに戻す
          currentQueue.unshift(decision.data);
          decisionHistory.splice(index, 1);
          renderDeck();
          renderDecisionLog();
          showToast("判定を取り消しました", 1500);
        }
      });
    });
  };

  const finalizeDecision = (type, data) => {
    currentQueue = currentQueue.filter((item) => item.id !== data.id);
    
    // 判定履歴に追加
    decisionHistory.push({ type, data });
    
    renderDecisionLog();
    showToast(type === "approve" ? "申請を承認しました" : "申請を拒否しました", 1800);
    renderDeck();
  };

  approveBtn.addEventListener("click", () => {
    if (!currentQueue.length) return;
    finalizeDecision("approve", currentQueue[0]);
  });
  rejectBtn.addEventListener("click", () => {
    if (!currentQueue.length) return;
    finalizeDecision("reject", currentQueue[0]);
  });

  renderDeck();
  renderDecisionLog();
}
