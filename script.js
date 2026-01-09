// Kalp oluşturma fonksiyonu
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
    
    document.getElementById('heartsContainer').appendChild(heart);
    
    // Kalbi kaldır
    setTimeout(() => {
        heart.remove();
    }, 20000);
}

// Sürekli kalp oluştur
setInterval(createHeart, 500);

// İlk kalpleri oluştur
for (let i = 0; i < 10; i++) {
    setTimeout(() => createHeart(), i * 200);
}

// Yırtma mekanizması
const letter = document.getElementById('letter');
const tornPieces = document.getElementById('tornPieces');
const hiddenMessage = document.getElementById('hiddenMessage');
let isDragging = false;
let tearCount = 0;
let totalTears = 0;
let startX = 0;
let startY = 0;
const pieces = [];

// Mouse/Touch event handlers
letter.addEventListener('mousedown', startTear);
letter.addEventListener('touchstart', startTear);

document.addEventListener('mousemove', continueTear);
document.addEventListener('touchmove', continueTear);

document.addEventListener('mouseup', endTear);
document.addEventListener('touchend', endTear);

function startTear(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = letter.getBoundingClientRect();
    startX = clientX - rect.left;
    startY = clientY - rect.top;
    
    createRipple(startX, startY);
    tearCount++;
    totalTears++;
}

function continueTear(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = letter.getBoundingClientRect();
    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;
    
    // Yırtma efekti oluştur
    if (Math.abs(currentX - startX) > 5 || Math.abs(currentY - startY) > 5) {
        createTearPiece(startX, startY, currentX, currentY);
        startX = currentX;
        startY = currentY;
    }
}

function endTear() {
    if (!isDragging) return;
    isDragging = false;
    
    // Yeterince yırtma yapıldıysa mektubu aç
    if (totalTears >= 5) {
        setTimeout(() => {
            openLetter();
        }, 500);
    }
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    letter.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function createTearPiece(x1, y1, x2, y2) {
    // Mektubun üzerinde yırtık görünümü oluştur
    const tear = document.createElement('div');
    tear.style.position = 'absolute';
    tear.style.left = Math.min(x1, x2) + 'px';
    tear.style.top = Math.min(y1, y2) + 'px';
    tear.style.width = Math.abs(x2 - x1) + 'px';
    tear.style.height = Math.abs(y2 - y1) + 'px';
    tear.style.background = 'rgba(0, 0, 0, 0.1)';
    tear.style.borderRadius = '50%';
    tear.style.pointerEvents = 'none';
    letter.appendChild(tear);
    
    setTimeout(() => tear.remove(), 2000);
    
    // Parça oluştur
    const piece = document.createElement('div');
    piece.className = 'torn-piece';
    
    const width = Math.abs(x2 - x1) + 30;
    const height = Math.abs(y2 - y1) + 30;
    const left = Math.min(x1, x2) - 15;
    const top = Math.min(y1, y2) - 15;
    
    piece.style.width = width + 'px';
    piece.style.height = height + 'px';
    piece.style.left = left + 'px';
    piece.style.top = top + 'px';
    piece.style.borderRadius = '50%';
    piece.style.clipPath = `polygon(${Math.random() * 30}% ${Math.random() * 30}%, ${70 + Math.random() * 30}% ${Math.random() * 30}%, ${70 + Math.random() * 30}% ${70 + Math.random() * 30}%, ${Math.random() * 30}% ${70 + Math.random() * 30}%)`;
    
    tornPieces.appendChild(piece);
    pieces.push(piece);
    
    // Parçayı uzağa fırlat
    setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 300;
        const rotation = Math.random() * 720 - 360;
        
        piece.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${rotation}deg)`;
        piece.style.opacity = '0';
    }, 10);
}

function openLetter() {
    // Mektubu gizle
    letter.style.opacity = '0';
    letter.style.transform = 'scale(0.8) rotate(10deg)';
    letter.style.pointerEvents = 'none';
    
    // Tüm parçaları temizle
    setTimeout(() => {
        pieces.forEach(piece => {
            if (piece.parentNode) {
                piece.remove();
            }
        });
        letter.style.display = 'none';
    }, 500);
    
    // Mesajı göster
    setTimeout(() => {
        hiddenMessage.classList.add('show');
        
        // Ekstra kalpler ekle
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createHeart(), i * 100);
        }
    }, 800);
}

// Sayfa yüklendiğinde animasyon başlat
window.addEventListener('load', () => {
    letter.style.animation = 'none';
    setTimeout(() => {
        letter.style.animation = 'letterAppear 0.8s ease-out';
    }, 10);
});

// CSS animasyonu için style ekle
const style = document.createElement('style');
style.textContent = `
    @keyframes letterAppear {
        from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;
document.head.appendChild(style);
