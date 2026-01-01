let currentEditingId = null;
const roleNames = {
    0: 'Admin',
    1: 'ReadOnly Admin',
    2: 'Creator',
    3: 'Deletor'
};

// Yetki kontrolü
if (!auth.canManageUsers()) {
    window.location.href = 'index.html';
}

// Load all users
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Yükleniyor...</td></tr>';
    
    try {
        const data = await api.get('/Auth/users');
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">Kayıt bulunamadı</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.map(user => `
            <tr>
                <td class="id-cell">${user.id.substring(0, 8)}...</td>
                <td><strong>${user.username}</strong></td>
                <td><span class="badge badge-type-${user.role}">${roleNames[user.role]}</span></td>
                <td>${formatDateTime(user.createdAt)}</td>
                <td class="actions">
                    <button class="btn-small btn-edit" onclick="editUser('${user.id}')">✏️ Düzenle</button>
                    <button class="btn-small btn-delete" onclick="deleteUser('${user.id}')">🗑️ Sil</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" class="error">Veri yüklenirken hata oluştu</td></tr>';
        showNotification('Veriler yüklenemedi: ' + error.message, 'error');
    }
}

// Open add modal
function openAddModal() {
    currentEditingId = null;
    document.getElementById('modalTitle').textContent = 'Yeni Kullanıcı Ekle';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('password').required = true;
    document.getElementById('passwordLabel').innerHTML = 'Şifre *';
    document.getElementById('modal').classList.add('show');
}

// Edit user
async function editUser(id) {
    try {
        const users = await api.get('/Auth/users');
        const user = users.find(u => u.id === id);
        
        if (!user) {
            showNotification('Kullanıcı bulunamadı', 'error');
            return;
        }
        
        currentEditingId = id;
        
        document.getElementById('modalTitle').textContent = 'Kullanıcı Düzenle';
        document.getElementById('userId').value = id;
        document.getElementById('username').value = user.username;
        document.getElementById('password').value = '';
        document.getElementById('password').required = false;
        document.getElementById('passwordLabel').innerHTML = 'Şifre (boş bırakılırsa değiştirilmez)';
        document.getElementById('role').value = user.role;
        
        document.getElementById('modal').classList.add('show');
    } catch (error) {
        showNotification('Kayıt yüklenemedi: ' + error.message, 'error');
    }
}

// Save user (POST or PUT)
async function saveUser(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const formData = {
        username: document.getElementById('username').value,
        role: parseInt(document.getElementById('role').value),
    };
    
    try {
        if (currentEditingId) {
            // Düzenlemede şifre varsa ekle
            if (password) {
                formData.password = password;
            }
            await api.put(`/Auth/users/${currentEditingId}`, formData);
            showNotification('Kullanıcı güncellendi', 'success');
        } else {
            // Yeni kullanıcıda şifre zorunlu
            if (!password) {
                showNotification('Yeni kullanıcı için şifre gereklidir', 'error');
                return;
            }
            formData.password = password;
            await api.post('/Auth/register', formData);
            showNotification('Kullanıcı eklendi', 'success');
        }
        
        closeModal();
        loadUsers();
    } catch (error) {
        showNotification('Kayıt edilemedi: ' + error.message, 'error');
    }
}

// Delete user
async function deleteUser(id) {
    const currentUser = auth.getUser();
    if (currentUser && currentUser.id === id) {
        showNotification('Kendi kullanıcınızı silemezsiniz', 'error');
        return;
    }
    
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        await api.delete(`/Auth/users/${id}`);
        showNotification('Kullanıcı silindi', 'success');
        loadUsers();
    } catch (error) {
        showNotification('Silinemedi: ' + error.message, 'error');
    }
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('show');
    currentEditingId = null;
}

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
});

