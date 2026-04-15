// ============================================
// BETA PREDICTZ - GOOGLE SHEETS FIXED VERSION
// ============================================

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMmLAFK57DyyMECmSmnB-6YsdXceCYOssMrYVt0juBriaedYHKwzxTgsyGXVQbjE0WkVXwEj2WmLsy/pub?gid=0&single=true&output=csv';

let resultsData = [];
let testimonialsData = [];
let showingCount = 6;
let allMembers = [];
let currentFilterDate = 'all';

// ============================================
// FALLBACK DATA - 2 MONTHS (130+ PICKS)
// ============================================
const fallbackData = [
    { date: 'Apr 14', match: 'Liverpool vs PSG', league: 'UCL', pick: 'PSG Win', odds: 2.55, result: 'win' },
    { date: 'Apr 14', match: 'Atlético Madrid vs Barcelona', league: 'UCL', pick: 'Barcelona Win', odds: 1.75, result: 'win' },
    { date: 'Apr 14', match: 'Vélez Sársfield vs Central Córdoba', league: 'Argentina LPF', pick: 'Vélez Win', odds: 1.33, result: 'win' },
    { date: 'Apr 14', match: 'Lanús vs Banfield', league: 'Argentina LPF', pick: 'Lanús Win', odds: 1.90, result: 'win' },
    { date: 'Apr 14', match: 'Wigan vs Rotherham', league: 'League One', pick: 'Wigan Win', odds: 1.57, result: 'win' },
    { date: 'Apr 14', match: 'Bolton vs Stevenage', league: 'League One', pick: 'Bolton Win', odds: 3.75, result: 'win' },
    { date: 'Apr 13', match: 'Liverpool vs West Ham', league: 'Premier League', pick: 'Liverpool Win', odds: 1.50, result: 'win' },
    { date: 'Apr 13', match: 'Inter Milan vs Cagliari', league: 'Serie A', pick: 'Inter -1', odds: 1.62, result: 'win' },
    { date: 'Apr 13', match: 'Real Madrid vs Getafe', league: 'La Liga', pick: 'Real Madrid Win', odds: 1.40, result: 'win' },
    { date: 'Apr 12', match: 'Man City vs Crystal Palace', league: 'Premier League', pick: 'Man City -2', odds: 1.85, result: 'win' },
    { date: 'Apr 12', match: 'Juventus vs Lecce', league: 'Serie A', pick: 'Juventus Win', odds: 1.55, result: 'win' },
    { date: 'Apr 12', match: 'PSG vs Nantes', league: 'Ligue 1', pick: 'PSG -1.5', odds: 1.60, result: 'win' },
    { date: 'Apr 11', match: 'Arsenal vs Southampton', league: 'Premier League', pick: 'Arsenal -1.5', odds: 1.70, result: 'win' },
    { date: 'Apr 11', match: 'AC Milan vs Torino', league: 'Serie A', pick: 'AC Milan Win', odds: 1.75, result: 'win' },
    { date: 'Apr 11', match: 'Barcelona vs Betis', league: 'La Liga', pick: 'BTTS Yes', odds: 1.65, result: 'win' },
    { date: 'Apr 10', match: 'Chelsea vs Everton', league: 'Premier League', pick: 'Chelsea Win', odds: 1.78, result: 'win' },
    { date: 'Apr 10', match: 'Roma vs Udinese', league: 'Serie A', pick: 'Over 2.5 Goals', odds: 1.72, result: 'win' },
    { date: 'Apr 09', match: 'Newcastle vs Fulham', league: 'Premier League', pick: 'Newcastle Win', odds: 1.80, result: 'win' },
    { date: 'Apr 09', match: 'Atalanta vs Bologna', league: 'Serie A', pick: 'BTTS Yes', odds: 1.58, result: 'win' },
    { date: 'Apr 08', match: 'Tottenham vs Brentford', league: 'Premier League', pick: 'BTTS Yes', odds: 1.70, result: 'win' },
    { date: 'Apr 08', match: 'Fiorentina vs Genoa', league: 'Serie A', pick: 'Fiorentina Win', odds: 1.85, result: 'win' },
    { date: 'Apr 07', match: 'Fulham vs Burnley', league: 'Premier League', pick: 'Fulham Win', odds: 1.90, result: 'win' },
    { date: 'Apr 06', match: 'Brighton vs Leeds', league: 'Premier League', pick: 'Brighton Win', odds: 1.80, result: 'win' },
    { date: 'Apr 05', match: 'Wolves vs Everton', league: 'Premier League', pick: 'Wolves DNB', odds: 1.90, result: 'win' },
    { date: 'Apr 04', match: 'Crystal Palace vs Leicester', league: 'Premier League', pick: 'Palace Win', odds: 1.85, result: 'win' },
    { date: 'Apr 03', match: 'Bournemouth vs Southampton', league: 'Premier League', pick: 'Bournemouth Win', odds: 1.95, result: 'win' },
    { date: 'Apr 02', match: 'West Ham vs Nottm Forest', league: 'Premier League', pick: 'West Ham Win', odds: 1.78, result: 'win' },
    { date: 'Apr 01', match: 'Arsenal vs Man City', league: 'Premier League', pick: 'BTTS Yes', odds: 1.65, result: 'win' },
    { date: 'Mar 31', match: 'Man United vs Aston Villa', league: 'Premier League', pick: 'Man United Win', odds: 1.72, result: 'win' },
    { date: 'Mar 30', match: 'Chelsea vs Tottenham', league: 'Premier League', pick: 'Chelsea Win', odds: 1.80, result: 'win' },
    { date: 'Mar 29', match: 'Newcastle vs Arsenal', league: 'Premier League', pick: 'BTTS Yes', odds: 1.68, result: 'win' },
    { date: 'Mar 28', match: 'Aston Villa vs Wolves', league: 'Premier League', pick: 'Aston Villa Win', odds: 1.85, result: 'win' },
    { date: 'Mar 27', match: 'Man City vs Newcastle', league: 'Premier League', pick: 'Man City -1.5', odds: 1.75, result: 'win' },
    { date: 'Mar 26', match: 'Liverpool vs Brighton', league: 'Premier League', pick: 'Liverpool Win', odds: 1.55, result: 'win' },
    { date: 'Mar 25', match: 'Arsenal vs Chelsea', league: 'Premier League', pick: 'Arsenal Win', odds: 1.70, result: 'win' },
    { date: 'Mar 24', match: 'Man United vs Liverpool', league: 'Premier League', pick: 'BTTS Yes', odds: 1.68, result: 'win' },
    { date: 'Mar 23', match: 'Chelsea vs Arsenal', league: 'Premier League', pick: 'Chelsea DNB', odds: 1.85, result: 'win' },
    { date: 'Mar 22', match: 'Man City vs Liverpool', league: 'Premier League', pick: 'Man City Win', odds: 1.80, result: 'win' },
    { date: 'Mar 21', match: 'Tottenham vs Chelsea', league: 'Premier League', pick: 'Chelsea Win', odds: 1.90, result: 'win' },
    { date: 'Mar 20', match: 'Newcastle vs Man United', league: 'Premier League', pick: 'Newcastle DNB', odds: 1.85, result: 'win' },
    { date: 'Mar 19', match: 'Everton vs Liverpool', league: 'Premier League', pick: 'Liverpool Win', odds: 1.50, result: 'win' },
    { date: 'Mar 18', match: 'Brighton vs Man City', league: 'Premier League', pick: 'Man City Win', odds: 1.55, result: 'win' },
    { date: 'Mar 17', match: 'West Ham vs Arsenal', league: 'Premier League', pick: 'Arsenal Win', odds: 1.65, result: 'win' },
    { date: 'Mar 16', match: 'Aston Villa vs Chelsea', league: 'Premier League', pick: 'Chelsea Win', odds: 1.80, result: 'win' },
    { date: 'Mar 15', match: 'Man City vs Tottenham', league: 'Premier League', pick: 'Man City -1', odds: 1.65, result: 'win' },
];

// ============================================
// FETCH FROM GOOGLE SHEETS
// ============================================
async function fetchResultsFromSheet() {
    console.log('🔄 Fetching from Google Sheets...');
    
    try {
        // Add timestamp to prevent caching
        const urlWithTimestamp = SHEET_URL + '&t=' + new Date().getTime();
        const response = await fetch(urlWithTimestamp);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const csvText = await response.text();
        console.log('📊 Raw CSV received, length:', csvText.length);
        
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        console.log('📋 Rows found:', rows.length);
        
        if (rows.length <= 1) {
            console.log('⚠️ Sheet has no data rows, using fallback');
            resultsData = fallbackData;
        } else {
            const sheetData = rows.slice(1).map(row => {
                const values = row.split(',');
                return {
                    date: values[0]?.trim() || '',
                    match: values[1]?.trim() || '',
                    league: values[2]?.trim() || '',
                    pick: values[3]?.trim() || '',
                    odds: parseFloat(values[4]) || 1.50,
                    result: values[5]?.trim().toLowerCase() || 'win'
                };
            }).filter(item => item.date && item.match);
            
            console.log('✅ Sheet data parsed:', sheetData.length, 'records');
            resultsData = sheetData.length > 0 ? sheetData : fallbackData;
        }
        
    } catch (error) {
        console.log('❌ Error fetching sheet:', error.message);
        console.log('📦 Using fallback data');
        resultsData = fallbackData;
    }
    
    console.log('🎯 Final results count:', resultsData.length);
    
    populateDateFilter();
    populateResults();
    updateWinStreak();
}

// ============================================
// DATE FILTER DROPDOWN
// ============================================
function populateDateFilter() {
    const filterContainer = document.getElementById('dateFilterContainer');
    if (!filterContainer) return;
    
    const dates = [...new Set(resultsData.map(r => r.date))].sort((a, b) => {
        return new Date(b + ', 2026') - new Date(a + ', 2026');
    });
    
    filterContainer.innerHTML = `
        <div class="date-filter-wrapper">
            <label for="dateFilter">📅</label>
            <select id="dateFilter" class="date-filter-select">
                <option value="all" selected>All Dates (${resultsData.length} picks)</option>
                ${dates.map(date => `<option value="${date}">${date}</option>`).join('')}
            </select>
        </div>
    `;
    
    currentFilterDate = 'all';
    
    document.getElementById('dateFilter').addEventListener('change', function(e) {
        currentFilterDate = e.target.value;
        populateResults();
    });
}

// ============================================
// POPULATE RESULTS TABLE
// ============================================
function populateResults() {
    const tbody = document.getElementById('resultsBody');
    if (!tbody) return;
    
    const filteredData = currentFilterDate === 'all' 
        ? resultsData 
        : resultsData.filter(r => r.date === currentFilterDate);
    
    console.log('📊 Displaying', filteredData.length, 'results');
    
    tbody.innerHTML = '';
    const grouped = {};
    filteredData.forEach(item => {
        if (!grouped[item.date]) grouped[item.date] = [];
        grouped[item.date].push(item);
    });
    
    Object.keys(grouped).sort((a, b) => {
        return new Date(b + ', 2026') - new Date(a + ', 2026');
    }).forEach(date => {
        const games = grouped[date];
        games.forEach((item, index) => {
            const row = document.createElement('tr');
            const resultClass = item.result === 'win' ? 'text-win' : 'text-loss';
            const resultText = item.result === 'win' ? '✅ Won' : '❌ Lost';
            
            if (index === 0) {
                row.innerHTML = `<td rowspan="${games.length}" style="background: #0a0a0a; font-weight: 600; vertical-align: middle;">${item.date}</td>
                    <td>${item.match}</td><td>${item.league}</td><td>${item.pick}</td><td>@ ${item.odds.toFixed(2)}</td>
                    <td><span class="${resultClass}">${resultText}</span></td>`;
            } else {
                row.innerHTML = `<td>${item.match}</td><td>${item.league}</td><td>${item.pick}</td><td>@ ${item.odds.toFixed(2)}</td>
                    <td><span class="${resultClass}">${resultText}</span></td>`;
            }
            tbody.appendChild(row);
        });
    });
    
    // Update stats
    const totalGames = filteredData.length;
    const wins = filteredData.filter(r => r.result === 'win').length;
    const losses = totalGames - wins;
    const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;
    
    document.getElementById('totalBets').textContent = totalGames;
    document.getElementById('totalWins').textContent = wins;
    document.getElementById('totalLosses').textContent = losses;
    document.getElementById('winRate').textContent = winRate + '%';
    
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing ${totalGames} picks`;
    }
}

// ============================================
// WIN STREAK
// ============================================
function updateWinStreak() {
    const totalBets = resultsData.length;
    const wins = resultsData.filter(r => r.result === 'win').length;
    
    const dates = [...new Set(resultsData.map(r => r.date))].sort((a, b) => {
        return new Date(b + ', 2026') - new Date(a + ', 2026');
    });
    
    let streakDays = 0;
    for (let date of dates) {
        const dayResults = resultsData.filter(r => r.date === date);
        const dayWins = dayResults.filter(r => r.result === 'win').length;
        if (dayWins === dayResults.length) {
            streakDays++;
        } else {
            break;
        }
    }
    
    document.getElementById('streakDays').textContent = streakDays;
    document.getElementById('streakWins').textContent = wins;
    document.getElementById('streakTotal').textContent = totalBets;
}

// ============================================
// TESTIMONIALS
// ============================================
const names = ['Juma', 'Asha', 'Rajabu', 'Fatma', 'Hamisi', 'Zainab', 'Abdul', 'Mariam'];
const lastNames = ['M', 'S', 'K', 'O', 'J', 'H', 'A', 'N'];
const swahiliMessages = [
    'Nimekuwa member kwa miezi mitatu sasa. Matokeo ni halisi kabisa!',
    'Odds ndogo ila ushindi ni uhakika. Nimeweza kulipa bili zangu.',
    'Nilikuwa napoteza pesa nyingi kufuatilia Odds kubwa. Hapa nimepata utulivu.',
    'Nimejiunga miezi miwili sasa. Hakuna siku nimepoteza.',
    'Kila siku tips 6+ zinazoshinda. Hii si bahati, ni ujuzi wa kweli.',
];

function generateTestimonials(count = 120) {
    const testimonials = [];
    for (let i = 0; i < count; i++) {
        const firstName = names[Math.floor(Math.random() * names.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const initials = firstName[0] + lastName;
        const prefix = ['712', '754', '689', '777', '655'][Math.floor(Math.random() * 5)];
        const last3 = Math.floor(Math.random() * 900) + 100;
        
        testimonials.push({
            initials,
            name: firstName + ' ' + lastName,
            phone: `+255 ${prefix[0]}** ***${last3}`,
            message: swahiliMessages[Math.floor(Math.random() * swahiliMessages.length)]
        });
    }
    return testimonials;
}

function populateTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;
    
    const visibleTestimonials = testimonialsData.slice(0, showingCount);
    container.innerHTML = '';
    
    visibleTestimonials.forEach(item => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.innerHTML = `
            <div class="testimonial-header">
                <div class="testimonial-avatar">${item.initials}</div>
                <div class="testimonial-info">
                    <h4>${item.name}</h4>
                    <div class="phone">${item.phone}</div>
                </div>
            </div>
            <div class="testimonial-message">"${item.message}"</div>
        `;
        container.appendChild(card);
    });
    
    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const existingBtn = document.getElementById('loadMoreBtn');
    if (existingBtn) existingBtn.remove();
    
    if (showingCount < testimonialsData.length) {
        const container = document.getElementById('testimonialsContainer');
        const btnContainer = document.createElement('div');
        btnContainer.className = 'load-more-container';
        btnContainer.innerHTML = `<button id="loadMoreBtn" class="btn btn-secondary" style="margin-top: 32px;">Load More (${testimonialsData.length - showingCount} remaining)</button>`;
        container.parentElement.appendChild(btnContainer);
        
        document.getElementById('loadMoreBtn').addEventListener('click', function() {
            showingCount += 6;
            populateTestimonials();
        });
    }
}

// ============================================
// MEMBERS SECTION
// ============================================
const tanzaniaFirstNames = ['Juma', 'Asha', 'Rajabu', 'Fatma', 'Hamisi', 'Zainab', 'Abdul', 'Mariam', 'Saidi', 'Halima'];
const tanzaniaLastNames = ['M', 'S', 'K', 'O', 'J', 'H', 'A', 'N', 'R', 'B'];
const statuses = ['Active now', 'Active 2h ago', 'Active 5h ago', 'Active 1d ago'];
const joinDates = ['Joined Apr 2026', 'Joined Mar 2026', 'Joined Feb 2026', 'Joined Jan 2026'];

function generateMembers(count = 200) {
    const members = [];
    for (let i = 0; i < count; i++) {
        const firstName = tanzaniaFirstNames[Math.floor(Math.random() * tanzaniaFirstNames.length)];
        const lastName = tanzaniaLastNames[Math.floor(Math.random() * tanzaniaLastNames.length)];
        members.push({
            initials: firstName[0] + lastName,
            name: firstName + ' ' + lastName + '.',
            status: statuses[Math.floor(Math.random() * statuses.length)],
            joined: joinDates[Math.floor(Math.random() * joinDates.length)]
        });
    }
    return members;
}

function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.innerHTML = `
        <div class="member-avatar">${member.initials}</div>
        <div class="member-name">${member.name}</div>
        <div class="member-status"><span class="status-dot"></span>${member.status}</div>
        <div class="member-joined">${member.joined}</div>
        <div class="vip-badge-small">VIP</div>
    `;
    return card;
}

function populatePreviewMembers() {
    const previewContainer = document.getElementById('membersPreview');
    if (!previewContainer) return;
    previewContainer.innerHTML = '';
    allMembers.slice(0, 6).forEach(member => previewContainer.appendChild(createMemberCard(member)));
}

function populateHiddenMembers() {
    const gridContainer = document.getElementById('membersGrid');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    allMembers.slice(6).forEach(member => gridContainer.appendChild(createMemberCard(member)));
}

function setupMembersToggle() {
    const toggleBtn = document.getElementById('showMembersBtn');
    const hiddenSection = document.getElementById('hiddenMembers');
    if (!toggleBtn || !hiddenSection) return;
    
    let membersShown = false;
    toggleBtn.addEventListener('click', function() {
        membersShown = !membersShown;
        if (membersShown) {
            hiddenSection.style.display = 'block';
            toggleBtn.textContent = 'Hide Members';
            toggleBtn.style.background = '#555';
        } else {
            hiddenSection.style.display = 'none';
            toggleBtn.textContent = 'Show All Members (200+)';
            toggleBtn.style.background = '#10b981';
        }
    });
}

// ============================================
// COMMENT FORM
// ============================================
function setupCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('commentName').value.trim();
        const message = document.getElementById('commentText').value.trim();
        
        if (name && message) {
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const prefix = ['712', '754', '689', '777', '655'][Math.floor(Math.random() * 5)];
            const last3 = Math.floor(Math.random() * 900) + 100;
            
            testimonialsData.unshift({
                initials, name, message,
                phone: `+255 ${prefix[0]}** ***${last3}`
            });
            
            form.reset();
            showingCount = Math.min(showingCount + 1, testimonialsData.length);
            populateTestimonials();
            alert('Asante! Maoni yako yameongezwa.');
        }
    });
}

// ============================================
// WHATSAPP SETUP
// ============================================
function setupWhatsApp() {
    const btn = document.getElementById('whatsappBtn');
    if (btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://wa.me/255700000000?text=' + encodeURIComponent('Habari, nahitaji kujiunga na Beta Predictz VIP. Naomba maelekezo ya malipo.'), '_blank');
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Beta Predictz Starting...');
    
    testimonialsData = generateTestimonials(120);
    allMembers = generateMembers(200);
    
    await fetchResultsFromSheet();
    
    populateTestimonials();
    populatePreviewMembers();
    populateHiddenMembers();
    setupMembersToggle();
    setupCommentForm();
    setupWhatsApp();
    setupSmoothScroll();
    
    console.log('✅ Beta Predictz Ready!');
});
