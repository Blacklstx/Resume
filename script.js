/* ============================================================
   script.js — โค้ด JavaScript ของหน้า resume
   หน้าที่: ย่อ/ขยายกระดาษ A4 ให้พอดีความกว้างจอ (รองรับมือถือ)
   * รูปโปรไฟล์ฝังไว้ในโค้ด (index.html → photo.jpg) จึงไม่ต้องใช้ JS แล้ว
   ============================================================ */

/* ==================================================
   ระบบย่อ-ขยายให้พอดีจอ (responsive scaling)
   กระดาษกว้างคงที่ 794px ถ้าจอเล็กกว่านั้นจะ "ย่อทั้งใบ"
   ลงตามสัดส่วนเดิม แทนการจัดเรียงใหม่ → สวยเท่าเดิมทุกจอ
   ================================================== */
var CARD_WIDTH = 794;   // ความกว้างจริงของกระดาษ (px)

// ฟังก์ชันคำนวณและปรับขนาด
function fitToScreen() {
  var wrap = document.getElementById('resume-scaler-wrap');
  var card = document.getElementById('resume-card');
  if (!wrap || !card) return;

  // ความกว้างที่ใช้ได้ = ความกว้างของ element แม่ (หรือความกว้างหน้าจอ)
  var avail = (wrap.parentElement ? wrap.parentElement.clientWidth : 0) || window.innerWidth || 0;

  // กันกรณีจอยังวัดค่าไม่ได้ (ค่าเป็น 0 ตอนเพิ่งโหลด) → รอเฟรมถัดไปแล้วลองใหม่
  if (!avail || avail < 50) { requestAnimationFrame(fitToScreen); return; }

  var margin = avail < 820 ? 0 : 24;                  // จอเล็กไม่ต้องเว้นขอบ
  var scale = Math.min(1, (avail - margin) / CARD_WIDTH);   // ย่อได้ แต่ไม่ขยายเกิน 100%

  // ย่อจากมุมซ้ายบน แล้วปรับขนาดกล่องครอบให้เท่าขนาดหลังย่อ (กันที่ว่างเกิน)
  card.style.transformOrigin = 'top left';
  card.style.transform = 'scale(' + scale + ')';
  wrap.style.width  = (CARD_WIDTH * scale) + 'px';
  wrap.style.height = (card.offsetHeight * scale) + 'px';
  wrap.style.marginTop = margin + 'px';
  wrap.style.marginBottom = margin + 'px';
}

// ตอนสั่งพิมพ์ : รีเซ็ตกลับเป็นขนาดเต็ม 100% เพื่อให้ได้ A4 พอดีหน้า
function resetScale() {
  var wrap = document.getElementById('resume-scaler-wrap');
  var card = document.getElementById('resume-card');
  if (!wrap || !card) return;
  card.style.transform = 'none';
  wrap.style.width = 'auto';
  wrap.style.height = 'auto';
}

// เรียก fitToScreen ใหม่ทุกครั้งที่ขนาดหน้าต่างเปลี่ยน
window.addEventListener('resize', fitToScreen);
// ก่อนพิมพ์รีเซ็ตขนาด, พิมพ์เสร็จปรับกลับ
window.addEventListener('beforeprint', resetScale);
window.addEventListener('afterprint', fitToScreen);

// ResizeObserver : คอยดูขนาดกล่องแม่ ถ้าเปลี่ยนก็ปรับให้เอง (แม่นกว่า resize)
if (window.ResizeObserver) {
  var wrapEl = document.getElementById('resume-scaler-wrap');
  if (wrapEl && wrapEl.parentElement) {
    new ResizeObserver(fitToScreen).observe(wrapEl.parentElement);
  }
}

// เรียกครั้งแรกตอนโหลดหน้า (เผื่อฟอนต์โหลดช้า จึงเรียกซ้ำอีกครั้ง)
requestAnimationFrame(fitToScreen);
setTimeout(fitToScreen, 400);
