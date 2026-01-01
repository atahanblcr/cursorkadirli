// Ortak yetki kontrol yardımcı fonksiyonları

// Tablo satırları için buton HTML'i oluştur
function getActionButtons(entityId, editFunc, deleteFunc) {
    let buttons = '';
    if (auth.canEdit()) {
        buttons += `<button class="btn-small btn-edit" onclick="${editFunc}('${entityId}')">✏️ Düzenle</button>`;
    }
    if (auth.canDelete()) {
        buttons += `<button class="btn-small btn-delete" onclick="${deleteFunc}('${entityId}')">🗑️ Sil</button>`;
    }
    if (!buttons) {
        buttons = '<span class="badge">Sadece Görüntüleme</span>';
    }
    return buttons;
}

// Sayfa yüklendiğinde "Ekle" butonunu göster/gizle
function setupAddButton(buttonId) {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById(buttonId);
        if (btn && auth.canCreate()) {
            btn.style.display = 'inline-flex';
        }
    });
}

