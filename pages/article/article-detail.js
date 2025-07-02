// Fungsi untuk mendapatkan parameter dari URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

// Fungsi untuk memformat tanggal
function formatDateLong(dateStr) {
    if (!dateStr) return "";
    // Mendukung yyyy-mm-dd atau yyyy/mm/dd
    let parts = dateStr.includes("-") ? dateStr.split("-") : dateStr.split("/");
    if (parts.length === 3) {
        // yyyy-mm-dd atau yyyy/mm/dd
        let year = parts[0];
        let month = parts[1].padStart(2, "0");
        let day = parts[2].split(" ")[0].padStart(2, "0");
        // Nama bulan Indonesia
        const bulan = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        let monthIdx = parseInt(month, 10) - 1;
        return `${parseInt(day)} ${bulan[monthIdx]} ${year}`;
    }
    return dateStr;
}

// Fungsi untuk mendapatkan label kategori
function getCategoryLabel(category) {
    const labels = {
        'webdev': 'Web Development',
        'tech': 'Technology',
        'tutorial': 'Tutorial',
        'review': 'Review',
        'ai': 'AI & Machine Learning'
    };
    return labels[category] || category;
}

// Fungsi untuk menghitung waktu baca
function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// Animasi loading
function showLoading() {
    const content = document.getElementById('articleContent');
    content.innerHTML = `
        <div class="loading-content">
            <div class="loading-line"></div>
            <div class="loading-line"></div>
            <div class="loading-line" style="width: 70%;"></div>
        </div>`;
}

// Tampilkan error
function showError(message) {
    const content = document.getElementById('articleContent');
    content.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="window.history.back()" class="back-button">
                <i class="fas fa-arrow-left"></i> Kembali ke Daftar Artikel
            </button>
        </div>`;
}

// Format konten artikel
function formatArticleContent(content) {
    if (!content) return '<p class="article-paragraph">No content available for this article.</p>';
    
    // Ganti newlines dengan tag <br> dan <p>
    let formattedContent = content
        .replace(/\n\s*\n/g, '</p><p class="article-paragraph">') // Paragraf baru
        .replace(/\n/g, '<br>'); // Baris baru dalam paragraf
    
    // Pastikan konten diawali dengan tag <p>
    if (!formattedContent.startsWith('<p')) {
        formattedContent = '<p class="article-paragraph">' + formattedContent;
    }
    
    // Pastikan konten diakhiri dengan tag </p>
    if (!formattedContent.endsWith('</p>')) {
        formattedContent = formattedContent + '</p>';
    }
    
    // Format heading
    formattedContent = formattedContent
        .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="article-heading">$1</h2>')
        .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="article-subheading">$1</h3>');
    
    // Format list
    formattedContent = formattedContent
        .replace(/<ul>/g, '<ul class="article-list">')
        .replace(/<ol>/g, '<ol class="article-list">')
        .replace(/<li>/g, '<li class="article-list-item">');
    
    return formattedContent;
}

// Fungsi untuk memuat data artikel
function loadArticle() {
    const articleId = getUrlParameter('id');
    
    if (!articleId) {
        showError('Artikel tidak ditemukan. ID artikel tidak valid.');
        document.getElementById('articleTitle').textContent = 'Artikel Tidak Ditemukan';
        return;
    }

    // Tampilkan loading state
    showLoading();
    document.getElementById('articleTitle').textContent = 'Memuat Artikel...';
    document.getElementById('articleCategory').textContent = 'Memuat...';
    document.getElementById('articleDate').textContent = '...';

    // Ambil data artikel dari API
    const apiUrl = `/get-articles.php?id=${articleId}&ts=${Date.now()}`;
    console.log('Mengambil data dari:', apiUrl);
    fetch(apiUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal memuat artikel. Kode: ' + response.status);
            }
            return response.json();
        })
        .then(article => {
            if (!article || article.error) {
                throw new Error(article?.error || 'Artikel tidak ditemukan');
            }

            // Update UI dengan data artikel
            document.title = `${article.title} | Artikel`;
            document.getElementById('articleTitle').textContent = article.title;
            document.getElementById('articleCategory').textContent = getCategoryLabel(article.category);
            document.getElementById('articleDate').textContent = formatDateLong(article.date);
            
            // Hitung dan tampilkan waktu baca
            const readingTime = calculateReadingTime(article.content || '');
            document.getElementById('readingTime').textContent = readingTime;
            
            // Set gambar jika ada
            const articleImage = document.getElementById('articleImage');
            if (article.image_url) {
                // Pastikan path gambar relatif ke root website
                let imagePath = article.image_url;
                // Hanya tambahkan path relatif jika bukan URL lengkap
                if (!imagePath.startsWith('http') && !imagePath.startsWith('data:')) {
                    // Hapus leading slash jika ada
                    imagePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
                    // Tambahkan path relatif
                    imagePath = `../../${imagePath}`;
                }
                articleImage.src = imagePath;
                articleImage.alt = article.title;
                articleImage.onload = () => {
                    articleImage.style.opacity = 1;
                };
                articleImage.onerror = () => {
                    console.error('Gagal memuat gambar:', article.image_url);
                    articleImage.src = '../../assets/images/default-article.jpg';
                };
            } else {
                // Gunakan gambar default jika tidak ada gambar
                articleImage.src = '../../assets/images/default-article.jpg';
                articleImage.alt = 'Default article image';
            }

            // Set konten artikel dengan format yang benar
            document.getElementById('articleContent').innerHTML = formatArticleContent(article.content);
            
            // Tambahkan smooth scroll untuk heading
            document.querySelectorAll('.article-content h2, .article-content h3').forEach(heading => {
                heading.innerHTML = `<a href="#${heading.id || ''}" class="heading-anchor">${heading.innerHTML}</a>`;
            });
        })
        .catch(error => {
            console.error('Error loading article:', error);
            showError('Gagal memuat artikel. ' + (error.message || 'Silakan coba lagi nanti.'));
            document.getElementById('articleTitle').textContent = 'Terjadi Kesalahan';
        });
}

// Jalankan saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Tambahkan gaya inline untuk menghindari FOUC
    document.body.style.opacity = '1';
    
    // Jalankan fungsi utama
    loadArticle();
    
    // Tambahkan event listener untuk tombol kembali
    document.querySelector('.back-button')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.back();
    });
});
