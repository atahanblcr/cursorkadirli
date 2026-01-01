// Authentication & Authorization Management

const auth = {
    // Kullanıcı bilgilerini localStorage'dan al
    getUser() {
        const userStr = localStorage.getItem('admin_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    // Kullanıcı bilgilerini localStorage'a kaydet
    setUser(userData) {
        localStorage.setItem('admin_user', JSON.stringify(userData));
    },

    // Kullanıcı çıkışı
    logout() {
        localStorage.removeItem('admin_user');
        window.location.href = 'login.html';
    },

    // Giriş yapılmış mı kontrol et
    isAuthenticated() {
        return this.getUser() !== null;
    },

    // Kullanıcı rolünü al
    getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    // Yetki kontrolü fonksiyonları
    canCreate() {
        const role = this.getRole();
        return role === 0 || role === 2; // Admin veya Creator
    },

    canEdit() {
        const role = this.getRole();
        return role === 0 || role === 2; // Admin veya Creator
    },

    canDelete() {
        const role = this.getRole();
        return role === 0 || role === 3; // Admin veya Deletor
    },

    canManageUsers() {
        const role = this.getRole();
        return role === 0; // Sadece Admin
    },

    // Rol adını al
    getRoleName(role) {
        const roles = {
            0: 'Admin',
            1: 'ReadOnly Admin',
            2: 'Creator',
            3: 'Deletor'
        };
        return roles[role] || 'Bilinmeyen';
    },

    // Yetki mesajı göster
    showPermissionError(action) {
        showNotification(`Bu işlem için yetkiniz yok. ${action} işlemi sadece yetkili kullanıcılar tarafından yapılabilir.`, 'error');
    }
};

// Sayfa yüklendiğinde yetki kontrolü yap
document.addEventListener('DOMContentLoaded', () => {
    // Login sayfası değilse ve giriş yapılmamışsa login'e yönlendir
    if (!window.location.pathname.includes('login.html') && !auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Kullanıcı bilgilerini header'a ekle
    if (auth.isAuthenticated() && !window.location.pathname.includes('login.html')) {
        const user = auth.getUser();
        const header = document.querySelector('.admin-header');
        if (header) {
            const userInfo = document.createElement('div');
            userInfo.style.cssText = 'margin-left: auto; display: flex; align-items: center; gap: 1rem;';
            userInfo.innerHTML = `
                <span style="color: rgba(255,255,255,0.9);">👤 ${user.username} (${auth.getRoleName(user.role)})</span>
                <button onclick="auth.logout()" class="back-btn" style="cursor: pointer;">Çıkış Yap</button>
            `;
            header.querySelector('.header-content')?.appendChild(userInfo);
        }
    }
});

