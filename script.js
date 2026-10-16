const firebaseConfig = {
    apiKey: "AIzaSyCm6vPlapGOIn95I3NER6t1g3FHR1xKI3g",
    authDomain: "adane-hotel.firebaseapp.com",
    databaseURL: "https://adane-hotel-default-rtdb.firebaseio.com",
    projectId: "adane-hotel"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let allHotelsData = [];
let selectedServiceData = null;
let activeHotelKeyForBooking = "";
let activeHotelRawName = "";
let currentLang = localStorage.getItem('adane_lang') || 'am';

const hotelTranslations = {
    "Amanuel": { am: "አማኑኤል", en: "Amanuel", om: "Amaanu'el", ti: "አማኑኤል" },
    "አማኑኤል": { am: "አማኑኤል", en: "Amanuel", om: "Amaanu'el", ti: "አማኑኤል" },
    "Adane": { am: "አዳነ", en: "Adane", om: "Adaane", ti: "አዳነ" },
    "አዳነ": { am: "አዳነ", en: "Adane", om: "Adaane", ti: "አዳነ" },
    "አማን": { am: "አማን", en: "Aman", om: "Amaan", ti: "አማን" },
    "ለባህር": { am: "ለባህር", en: "Lebahir", om: "Labaahir", ti: "ለባህር" }
};

const translations = {
    am: {
        searchPlaceholder: "Search hotels & services...",
        menuTitle: "ምናሌ (Menu)",
        langLabel: "ቋንቋ / Language",
        historyMenu: "የተጠቃሚ ታሪክ (History)",
        profileMenu: "ፕሮፋይል ማስተካከያ (Profile)",
        darkMode: "Dark / Light Mode",
        logoutMenu: "ውጣ (Log Out)",
        authTitle: "የተጠቃሚ ምዝገባ / Sign In",
        loggedInText: "✓ ገብቷል",
        googleBtn: "በ Google ቀጥል (Sign in with Google)",
        lblEmail: "ኢሜል (ከጎግል የተገኘ)",
        lblName: "ሙሉ ስም",
        lblPhone: "ስልክ ቁጥር",
        lblPhoto: "የፕሮፋይል ፎቶ (ከጋለሪ)",
        phEmail: "ከጎግል በራስ-ሰር ይሞላል",
        phName: "ሙሉ ስም ያስገቡ",
        phPhone: "ስልክ ቁጥር ያስገቡ",
        btnSubmitAccount: "ምዝገባውን ቀጥል",
        payModalTitle: "የክፍያ ፎርም",
        paymentOptions: "<b>የክፍያ አማራጮች:-</b><br>• ቴሌብር / Telebirr: 0961807959<br>• የኢትዮጵያ ንግድ ባንክ: 1000123456789",
        payLblName: "ሙሉ ስም",
        payLblPhone: "ስልክ ቁጥር",
        payLblTx: "የትራንዛክሽን ቁጥር / ሊንክ",
        payLblFayda: "የፋይዳ (Fayda) ብሔራዊ መታወቂያ ፎቶ",
        payLblReceipt: "የክፍያ ሪሲት/ደረሰኝ ፎቶ",
        btnPaySubmit: "ክፍያውን ፈፅምና QR ኮድ አውጣ",
        qrModalTitle: "የእርስዎ One-Time QR ኮድ",
        qrModalDesc: "ይህንን QR ኮድ ለሆቴሉ በማሳየት አገልግሎቱን ማግኘት ይችላሉ።",
        qrDoneBtn: "ጨርስ (Done)",
        historyModalTitle: "📜 የእኔ ትዕዛዞች እና ታሪክ",
        thId: "ትዕዛዝ ID", thService: "አገልግሎት", thPrice: "ዋጋ", thStatus: "ሁኔታ",
        tabRooms: "🛏️ መኝታ ክፍሎች", tabRest: "🍔 ሬስቶራንት", tabPool: "🏊 የመዋኛ ገንዳ", tabSpa: "💆 ስፓ", tabClub: "💃 ጭፈራ ቤት",
        aiHeader: "AI የሆቴል እና ጤና አማካሪ",
        aiWelcome: "ሰላም! እኔ የሆቴል መተግበሪያ AI አማካሪዎ ነኝ። ስለ ሆቴሎች፣ የክፍሎች ዋጋ፣ ወይም ስለ አካል ብቃት፣ ስኳር፣ ደም ግፊት፣ ልብ እና ወባ አመጋገብ ማንኛውንም ጥያቄ መጠየቅ ይችላሉ።",
        aiPlaceholder: "ጥያቄዎን እዚህ ይጻፉ...",
        aiSend: "ላክ",
        stockLabel: "የቀረው፡ ",
        bookBtn: "ቦታ ያስያዙ",
        openBtn: "OPEN",
        servicesTag: "አገልግሎቶች",
        doneStatus: "ተፈጽሟል",
        noHotels: "ምንም ሆቴል የለም"
    },
    en: {
        searchPlaceholder: "Search hotels & services...",
        menuTitle: "Menu",
        langLabel: "Language",
        historyMenu: "User History",
        profileMenu: "Profile Settings",
        darkMode: "Dark / Light Mode",
        logoutMenu: "Log Out",
        authTitle: "Customer Sign In",
        loggedInText: "✓ Logged In",
        googleBtn: "Sign in with Google",
        lblEmail: "Email (from Google)",
        lblName: "Full Name",
        lblPhone: "Phone Number",
        lblPhoto: "Profile Photo",
        phEmail: "Auto-filled from Google",
        phName: "Enter full name",
        phPhone: "Enter phone number",
        btnSubmitAccount: "Continue Registration",
        payModalTitle: "Payment Form",
        paymentOptions: "<b>Payment Options:-</b><br>• Telebirr: 0961807959<br>• Commercial Bank of Ethiopia: 1000123456789",
        payLblName: "Full Name",
        payLblPhone: "Phone Number",
        payLblTx: "Transaction Number / Link",
        payLblFayda: "Fayda ID Photo",
        payLblReceipt: "Payment Receipt Photo",
        btnPaySubmit: "Complete Payment & Get QR",
        qrModalTitle: "Your One-Time QR Code",
        qrModalDesc: "Show this QR code to the hotel to receive your service.",
        qrDoneBtn: "Done",
        historyModalTitle: "📜 My Orders & History",
        thId: "Order ID", thService: "Service", thPrice: "Price", thStatus: "Status",
        tabRooms: "🛏️ Rooms", tabRest: "🍔 Restaurant", tabPool: "🏊 Swimming Pool", tabSpa: "💆 Spa", tabClub: "💃 Night Club",
        aiHeader: "AI Hotel & Health Advisor",
        aiWelcome: "Hello! I am your AI assistant. You can ask me anything about hotels, prices, fitness, diet, diabetes, blood pressure, heart health, or malaria.",
        aiPlaceholder: "Type your question here...",
        aiSend: "Send",
        stockLabel: "Remaining: ",
        bookBtn: "Book Now",
        openBtn: "OPEN",
        servicesTag: "SERVICES",
        doneStatus: "Completed",
        noHotels: "No hotels found"
    },
    om: {
        searchPlaceholder: "Hotoota & tajaajila barbaadi...",
        menuTitle: "Menu",
        langLabel: "Afaan / Language",
        historyMenu: "Seenaa Fayyadamaa (History)",
        profileMenu: "Sirreessa Profaayilii (Profile)",
        darkMode: "Dark / Light Mode",
        logoutMenu: "Ba'i (Log Out)",
        authTitle: "Galmee Fayyadamaa / Sign In",
        loggedInText: "✓ Seeneera",
        googleBtn: "Google-niin Itti Fufi",
        lblEmail: "Iimeelii (Google irraa argame)",
        lblName: "Maqaa Guutuu",
        lblPhone: "Lakkoofsa Bilbilaa",
        lblPhoto: "Suuraa Profaayilii",
        phEmail: "Google irraa guutama",
        phName: "Maqaa guutuu galchaa",
        phPhone: "Lakkoofsa bilbilaa galchaa",
        btnSubmitAccount: "Galmee Itti Fufi",
        payModalTitle: "Unka Kaffaltii",
        paymentOptions: "<b>Filannoo Kaffaltii:-</b><br>• Telebirr: 0961807959<br>• Baankii Daldala Itoophiyaa: 1000123456789",
        payLblName: "Maqaa Guutuu",
        payLblPhone: "Lakkoofsa Bilbilaa",
        payLblTx: "Lakkoofsa Jijjiirraa / Liinkii",
        payLblFayda: "Suuraa Eenyummaa Fayda",
        payLblReceipt: "Suuraa Risiitii Kaffaltii",
        btnPaySubmit: "Kaffaltii Raawwadhuu QR Baasi",
        qrModalTitle: "QR Kodi keessan",
        qrModalDesc: "QR kodi kana hoteelichaaf agarsiisuun tajaajila argachuu dandeessu.",
        qrDoneBtn: "Xumuri (Done)",
        historyModalTitle: "📜 Ajaja Koo fi Seenaa",
        thId: "Ajaja ID", thService: "Tajaajila", thPrice: "Gatii", thStatus: "Haala",
        tabRooms: "🛏️ Kutaa Rafsaa", tabRest: "🍔 Nyaata", tabPool: "🏊 Kuusaa Bishaanii", tabSpa: "💆 Spa", tabClub: "💃 Kilabii",
        aiHeader: "Gorsaa AI Hoteelaa & Fayyaa",
        aiWelcome: "Nagaan dhuftan! Ani gorsaa AIiti. Waa'ee hoteelotaa, gatii kutaalee, fayyaa, nyaata ispoortii fi dhibee gaafachuu dandeessu.",
        aiPlaceholder: "Gaaffii keessan asitti barreessaa...",
        aiSend: "Ergi",
        stockLabel: "Hafte: ",
        bookBtn: "Bakka Qabadhu",
        openBtn: "BANI",
        servicesTag: "Tajaajiloota",
        doneStatus: "Raawwatameera",
        noHotels: "Hoteelli hin jiru"
    },
    ti: {
        searchPlaceholder: "ሆቴላትን ኣገልግሎታትን ድለዩ...",
        menuTitle: "መምረጺ (Menu)",
        langLabel: "ቋንቋ / Language",
        historyMenu: "ናይ ተጠቃሚ ታሪኽ (History)",
        profileMenu: "ፕሮፋይል ምዕራይ (Profile)",
        darkMode: "Dark / Light Mode",
        logoutMenu: "ውጻእ (Log Out)",
        authTitle: "ናይ ተጠቃሚ መዝገብ / Sign In",
        loggedInText: "✓ ኣትዩ አሎ",
        googleBtn: "ብ Google ቀጽል (Sign in with Google)",
        lblEmail: "ኢመይል (ካብ ጎግል ዝተረኽበ)",
        lblName: "ምሉእ ሽም",
        lblPhone: "ቁጽሪ ስልኪ",
        lblPhoto: "ናይ ፕሮፋይል ስእሊ",
        phEmail: "ካብ ጎግል ብባዕሉ ይመልእ",
        phName: "ምሉእ ሽም የእትዉ",
        phPhone: "ቁጽሪ ስልኪ የእትዉ",
        btnSubmitAccount: "ምዝገባ ቀጽል",
        payModalTitle: "ናይ ክፍያ ፎርም",
        paymentOptions: "<b>ናይ ክፍያ ኣማራጺታት:-</b><br>• ተለብር / Telebirr: 0961807959<br>• ንግዲ ባንኪ ኢትዮጵያ: 1000123456789",
        payLblName: "ምሉእ ሽም",
        payLblPhone: "ቁጽሪ ስልኪ",
        payLblTx: "ናይ ትራንዛክሽን ቁጽሪ / ሊንክ",
        payLblFayda: "ናይ ፋይዳ መታወቂያ ስእሊ",
        payLblReceipt: "ናይ ክፍያ ደረሰኝ ስእሊ",
        btnPaySubmit: "ክፍያ ፈፅምና QR ኮድ ኣውጽእ",
        qrModalTitle: "ናይካ One-Time QR ኮድ",
        qrModalDesc: "እዚ QR ኮድ ንሆቴል ብምርኣይ ኣገልግሎት ክትረክብ ትኽእል።",
        qrDoneBtn: "ወዳእ (Done)",
        historyModalTitle: "📜 ናተይ ትእዛዛትን ታሪኽን",
        thId: "ትእዛዝ ID", thService: "ኣገልግሎት", thPrice: "ዋጋ", thStatus: "ኩነታት",
        tabRooms: "🛏️ መደቀሲ ክፍፍል", tabRest: "🍔 ረስቶራንት", tabPool: "🏊 ናይ ምሕባሕ ገንዳ", tabSpa: "💆 ስፓ", tabClub: "💃 ክለብ",
        aiHeader: "AI ሆቴልን ጥዕናን አማካሪ",
        aiWelcome: "ሰላም! ኣነ ናይ ሆቴል መተግበሪ AI አማካሪ እየ። ብዛዕባ ሆቴላት፣ ዋጋ ክፍሊ፣ ወይ ጥዕናን ስፖርትን ሕቶታት ክትሓቱ ትኽእሉ።",
        aiPlaceholder: "ሕቶኹም ኣብዚ ጽሓፉ...",
        aiSend: "ልአኽ",
        stockLabel: "ዝተረፈ፡ ",
        bookBtn: "ቦታ ግዛእ",
        openBtn: "OPEN",
        servicesTag: "ኣገልግሎታት",
        doneStatus: "ተፈጺሙ",
        noHotels: "ዝኾነ ሆቴል የለን"
    }
};

function getTranslatedHotelName(rawName) {
    if (!rawName) return "";
    let mapped = hotelTranslations[rawName];
    if (mapped && mapped[currentLang]) {
        return mapped[currentLang];
    }
    return rawName;
}

window.onload = function() {
    document.getElementById('langSelect').value = currentLang;
    applyLanguage(currentLang);

    let savedUser = localStorage.getItem('adane_customer');
    if (savedUser) {
        let user = JSON.parse(savedUser);
        document.getElementById('custEmail').value = user.email || '';
        document.getElementById('custName').value = user.name || '';
        document.getElementById('custPhone').value = user.phone || '';
        updateAccountButtonUI(user.profilePic);
        showActiveAccountPreview(user);
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('adane_lang', lang);
    applyLanguage(lang);
    renderHotelsList(allHotelsData);

    if (activeHotelKeyForBooking) {
        let displayHotelName = getTranslatedHotelName(activeHotelRawName);
        let tag = translations[currentLang].servicesTag;
        document.getElementById('modalHotelTitle').textContent = displayHotelName.toUpperCase() + ' - ' + tag;
        loadSpecificHotelServices(activeHotelKeyForBooking);
    }
}

function applyLanguage(lang) {
    let t = translations[lang] || translations['am'];
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    document.getElementById('menuTitle').innerText = t.menuTitle;
    document.getElementById('langLabel').innerText = t.langLabel;
    document.getElementById('historyMenuText').innerText = t.historyMenu;
    document.getElementById('profileMenuText').innerText = t.profileMenu;
    document.getElementById('darkModeText').innerText = t.darkMode;
    document.getElementById('logoutMenuText').innerText = t.logoutMenu;

    document.getElementById('authTitle').innerText = t.authTitle;
    document.getElementById('loggedInText').innerText = t.loggedInText;
    document.getElementById('googleBtnText').innerText = t.googleBtn;
    document.getElementById('lblEmail').innerText = t.lblEmail;
    document.getElementById('lblName').innerText = t.lblName;
    document.getElementById('lblPhone').innerText = t.lblPhone;
    document.getElementById('lblPhoto').innerText = t.lblPhoto;
    
    document.getElementById('custEmail').placeholder = t.phEmail;
    document.getElementById('custName').placeholder = t.phName;
    document.getElementById('custPhone').placeholder = t.phPhone;

    document.getElementById('btnSubmitAccount').innerText = t.btnSubmitAccount;

    document.getElementById('payModalTitle').innerText = t.payModalTitle;
    document.getElementById('paymentOptionsBox').innerHTML = t.paymentOptions;
    document.getElementById('payLblName').innerText = t.payLblName;
    document.getElementById('payLblPhone').innerText = t.payLblPhone;
    document.getElementById('payLblTx').innerText = t.payLblTx;
    document.getElementById('payLblFayda').innerText = t.payLblFayda;
    document.getElementById('payLblReceipt').innerText = t.payLblReceipt;
    document.getElementById('btnPaySubmit').innerText = t.btnPaySubmit;

    document.getElementById('qrModalTitle').innerText = t.qrModalTitle;
    document.getElementById('qrModalDesc').innerText = t.qrModalDesc;
    document.getElementById('qrDoneBtn').innerText = t.qrDoneBtn;

    document.getElementById('historyModalTitle').innerText = t.historyModalTitle;
    document.getElementById('thId').innerText = t.thId;
    document.getElementById('thService').innerText = t.thService;
    document.getElementById('thPrice').innerText = t.thPrice;
    document.getElementById('thStatus').innerText = t.thStatus;

    document.getElementById('tabRoomsBtn').innerText = t.tabRooms;
    document.getElementById('tabRestBtn').innerText = t.tabRest;
    document.getElementById('tabPoolBtn').innerText = t.tabPool;
    document.getElementById('tabSpaBtn').innerText = t.tabSpa;
    document.getElementById('tabClubBtn').innerText = t.tabClub;

    document.getElementById('aiHeaderTitle').innerText = t.aiHeader;
    document.getElementById('aiWelcomeMsg').innerText = t.aiWelcome;
    document.getElementById('aiUserInput').placeholder = t.aiPlaceholder;
    document.getElementById('aiSendBtn').innerText = t.aiSend;
}

function showActiveAccountPreview(user) {
    let box = document.getElementById('activeAccountContainer');
    let nameEl = document.getElementById('modalAccountName');
    let emailEl = document.getElementById('modalAccountEmail');
    let avatarEl = document.getElementById('modalAvatarPreview');

    if (user && user.email) {
        box.classList.remove('hidden');
        nameEl.innerText = user.name || 'User';
        emailEl.innerText = user.email;
        if (user.profilePic) {
            avatarEl.style.backgroundImage = `url('${user.profilePic}')`;
            avatarEl.innerText = '';
        } else {
            avatarEl.style.backgroundImage = 'none';
            avatarEl.innerText = (user.name || 'A').charAt(0).toUpperCase();
        }
    } else {
        box.classList.add('hidden');
    }
}

function openGoogleLogin() {
    const btn = document.getElementById('googleLoginBtn');
    const btnText = document.getElementById('googleBtnText');
    btn.disabled = true;
    btnText.innerText = "Processing...";

    googleProvider.setCustomParameters({ prompt: 'select_account' });

    auth.signInWithPopup(googleProvider)
        .then((result) => {
            const profile = result.user;
            document.getElementById('custEmail').value = profile.email || '';
            document.getElementById('custName').value = profile.displayName || '';

            let existingUser = JSON.parse(localStorage.getItem('adane_customer')) || {};
            let userData = {
                email: profile.email,
                name: profile.displayName || '',
                phone: existingUser.phone || '',
                profilePic: profile.photoURL || ''
            };
            localStorage.setItem('adane_customer', JSON.stringify(userData));
            updateAccountButtonUI(userData.profilePic);
            showActiveAccountPreview(userData);

            alert("✅ Success: " + (profile.displayName || ''));
            btn.disabled = false;
            btnText.innerText = translations[currentLang].googleBtn;
        })
        .catch((error) => {
            console.error("Google Login Error:", error);
            alert("⚠️ Error: " + (error.message || "Try again"));
            btn.disabled = false;
            btnText.innerText = translations[currentLang].googleBtn;
        });
}

document.getElementById('btnContinue').addEventListener('click', () => {
    document.getElementById('welcomePage').classList.add('hidden');
});

const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
menuToggle.addEventListener('click', () => { drawer.classList.add('open'); overlay.classList.add('active'); });
document.getElementById('drawerClose').addEventListener('click', () => { drawer.classList.remove('open'); overlay.classList.remove('active'); });
overlay.addEventListener('click', () => { drawer.classList.remove('open'); overlay.classList.remove('active'); });

database.ref('hotels').on('value', (snapshot) => {
    allHotelsData = [];
    snapshot.forEach((child) => {
        let h = child.val();
        let key = child.key;
        
        if (key !== 'hotel_005' && key !== 'htoel_005' && h && (h.name || (h.info && h.info.name))) {
            let data = h.info ? { ...h.info, ...h } : h;
            allHotelsData.push({ key: key, data: data });
        }
    });
    renderHotelsList(allHotelsData);
});

function renderHotelsList(hotelsList) {
    const hotelsContainer = document.getElementById('hotelsContainer');
    hotelsContainer.innerHTML = '';
    let t = translations[currentLang] || translations['am'];

    if (!hotelsList.length) {
        hotelsContainer.innerHTML = `<p style="text-align:center;color:#888;padding:40px;">${t.noHotels}</p>`;
        return;
    }
    hotelsList.forEach(item => {
        let h = item.data;
        let rawName = h.name || item.key;
        let displayHotelName = getTranslatedHotelName(rawName);
        let img = h.img || h.logo || '';
        let location = h.location || h.phone || '';
        
        let cardHtml = `
            <div class="list-card">
                <div class="card-info">
                    <div class="circle-icon" style="background-image: url('${img}'); background-size: cover; background-position: center;">${img ? '' : displayHotelName.charAt(0)}</div>
                    <div>
                        <h3>${displayHotelName}</h3>
                        <p style="font-size: 12px; color: var(--text-secondary);">${location}</p>
                    </div>
                </div>
                <button class="btn-open" onclick="openHotelDetails('${rawName.replace(/'/g, "\\'")}', '${item.key}')">${t.openBtn}</button>
            </div>
        `;
        hotelsContainer.innerHTML += cardHtml;
    });
}

function filterHotels() {
    let query = document.getElementById('searchInput').value.toLowerCase().trim();
    let filtered = allHotelsData.filter(item => {
        let rawName = item.data.name || '';
        let displayHotelName = getTranslatedHotelName(rawName).toLowerCase();
        let location = (item.data.location || '').toLowerCase();
        return rawName.toLowerCase().includes(query) || displayHotelName.includes(query) || location.includes(query);
    });
    renderHotelsList(filtered);
}

function openHotelDetails(hotelRawName, hotelKey) {
    activeHotelKeyForBooking = hotelKey;
    activeHotelRawName = hotelRawName;
    let displayHotelName = getTranslatedHotelName(hotelRawName);
    let tag = translations[currentLang].servicesTag;
    document.getElementById('modalHotelTitle').textContent = displayHotelName.toUpperCase() + ' - ' + tag;
    document.getElementById('hotelModal').classList.add('active');
    loadSpecificHotelServices(hotelKey);
}

function closeHotelDetails() {
    document.getElementById('hotelModal').classList.remove('active');
}

function openTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (btn) btn.classList.add('active');
}

function loadSpecificHotelServices(hotelKey) {
    const grids = { rooms: 'rooms-grid', restaurant: 'restaurant-grid', pool: 'pool-grid', spa: 'spa-grid', club: 'club-grid' };
    Object.values(grids).forEach(id => { document.getElementById(id).innerHTML = ''; });
    let t = translations[currentLang] || translations['am'];

    database.ref('hotels/' + hotelKey + '/services').on('value', (snapshot) => {
        Object.values(grids).forEach(id => { document.getElementById(id).innerHTML = ''; });
        if (!snapshot.exists()) return;
        snapshot.forEach((child) => {
            let item = child.val();
            let gridId = grids[item.category];
            if (!gridId) return;
            let cardHtml = `
                <div class="custom-card">
                    <div class="card-image" style="background-image: url('${item.img || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=400'}');">
                        <div class="stock-badge">${t.stockLabel}${item.quantity || item.stock || 1}</div>
                    </div>
                    <div class="card-body-details">
                        <h3>${item.title || item.name}</h3>
                        <p style="font-size:12px; color:var(--text-secondary);">${item.desc || item.description || ''}</p>
                        <div class="card-price">${item.price} ETB</div>
                        <button class="action-btn" onclick='initiateBooking(${JSON.stringify(item).replace(/'/g, "&#39;")})'>${t.bookBtn}</button>
                    </div>
                </div>
            `;
            document.getElementById(gridId).innerHTML += cardHtml;
        });
    });
}

function initiateBooking(item) {
    let savedUser = localStorage.getItem('adane_customer');
    if (!savedUser) {
        alert("⚠️ Please sign in first!");
        openAccountModal();
        return;
    }
    let user = JSON.parse(savedUser);
    selectedServiceData = item;
    document.getElementById('modalServicePrice').innerText = 'Price: ' + item.price + ' ETB';
    document.getElementById('payCustName').value = user.name || '';
    document.getElementById('payCustPhone').value = user.phone || '';
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() { document.getElementById('paymentModal').classList.remove('active'); }

function submitBooking(e) {
    e.preventDefault();
    let name = document.getElementById('payCustName').value.trim();
    let phone = document.getElementById('payCustPhone').value.trim();
    let txRef = document.getElementById('payTxRef').value.trim();
    let faydaFile = document.getElementById('faydaImgFile').files[0];
    let receiptFile = document.getElementById('receiptImgFile').files[0];

    if (!faydaFile || !receiptFile) {
        alert("Please select both Fayda and Receipt photos!");
        return;
    }

    let reader1 = new FileReader();
    let reader2 = new FileReader();

    reader1.readAsDataURL(faydaFile);
    reader1.onload = function(e1) {
        let faydaUrl = e1.target.result;
        reader2.readAsDataURL(receiptFile);
        reader2.onload = function(e2) {
            let receiptUrl = e2.target.result;
            let orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
            let qrCodeToken = 'QR-ONE-TIME-' + Math.random().toString(36).substring(2, 10).toUpperCase();
            let savedUser = JSON.parse(localStorage.getItem('adane_customer')) || {};

            let orderData = {
                id: orderId,
                qrCode: qrCodeToken,
                hotelId: activeHotelKeyForBooking,
                service: selectedServiceData.title || selectedServiceData.name,
                price: selectedServiceData.price,
                customer: name + ' (Email: ' + (savedUser.email || 'N/A') + ', Phone: ' + phone + ')',
                customerName: name,
                phone: phone,
                email: savedUser.email || '',
                txRef: txRef,
                faydaImg: faydaUrl,
                receiptImg: receiptUrl,
                status: "pending",
                used: false,
                timestamp: new Date().toLocaleString(),
                createdAt: Date.now()
            };

            let newOrderKey = database.ref('orders').push().key;
            let updates = {};
            updates['/orders/' + newOrderKey] = orderData;
            updates['/hotels/' + activeHotelKeyForBooking + '/orders/' + newOrderKey] = orderData;

            database.ref().update(updates).then(() => {
                alert("✅ Order submitted successfully! Generating your One-Time QR code...");
                closePaymentModal();
                closeHotelDetails();
                showOneTimeQrCode(qrCodeToken);
            }).catch(err => {
                alert("Database Error: " + err.message);
            });
        };
    };
}

function showOneTimeQrCode(qrToken) {
    document.getElementById('qrcodeContainer').innerHTML = "";
    new QRCode(document.getElementById("qrcodeContainer"), { text: qrToken, width: 180, height: 180 });
    document.getElementById('qrCodeTextDisplay').innerText = 'Code: ' + qrToken;
    document.getElementById('qrModal').classList.add('active');
}
function closeQrModal() { document.getElementById('qrModal').classList.remove('active'); }

function openHistoryModal() {
    let savedUser = localStorage.getItem('adane_customer');
    if (!savedUser) {
        alert("Please sign in first!");
        openAccountModal();
        return;
    }
    let user = JSON.parse(savedUser);
    document.getElementById('historyModal').classList.add('active');

    database.ref('orders').on('value', (snapshot) => {
        let tbody = document.getElementById('customerHistoryBody');
        tbody.innerHTML = '';
        let t = translations[currentLang] || translations['am'];
        if (!snapshot.exists()) return;
        snapshot.forEach((child) => {
            let o = child.val();
            if (o.email === user.email || (o.customer && o.customer.includes(user.email))) {
                tbody.innerHTML += `
                    <tr>
                        <td style="padding:8px; color:var(--primary-gold);"><b>${o.id || '-'}</b></td>
                        <td style="padding:8px;">${o.service || '-'}</td>
                        <td style="padding:8px;">${o.price || 0} ETB</td>
                        <td style="padding:8px; color:${o.used ? '#ef4444' : '#2ecc71'};">${o.used ? t.doneStatus : (o.status || 'pending')}</td>
                    </tr>
                `;
            }
        });
    });
}
function closeHistoryModal() { document.getElementById('historyModal').classList.remove('active'); }

function saveCustomerAccount(e) {
    e.preventDefault();
    let email = document.getElementById('custEmail').value.trim();
    let name = document.getElementById('custName').value.trim();
    let phone = document.getElementById('custPhone').value.trim();
    let profileFile = document.getElementById('custProfileImgFile').files[0];

    if (!email) {
        alert("⚠️ Please sign in with Google first!");
        return;
    }

    let existingUser = JSON.parse(localStorage.getItem('adane_customer')) || {};
    let profilePicUrl = existingUser.profilePic || '';

    if (profileFile) {
        let reader = new FileReader();
        reader.readAsDataURL(profileFile);
        reader.onload = function(evt) {
            profilePicUrl = evt.target.result;
            storeUserData(email, name, phone, profilePicUrl);
        };
    } else {
        storeUserData(email, name, phone, profilePicUrl);
    }
}

function storeUserData(email, name, phone, profilePic) {
    let userData = { email: email, name: name, phone: phone, profilePic: profilePic };
    localStorage.setItem('adane_customer', JSON.stringify(userData));
    updateAccountButtonUI(profilePic);
    showActiveAccountPreview(userData);
    alert("✅ Profile saved successfully!");
    closeAccountModal();
}

function updateAccountButtonUI(picUrl) {
    let btn = document.getElementById('accountBtn');
    if (picUrl) {
        btn.style.backgroundImage = "url('" + picUrl + "')";
        btn.innerText = '';
    } else {
        btn.style.backgroundImage = 'none';
        btn.innerText = 'Ⓐ';
    }
}

function logoutCustomer() {
    localStorage.removeItem('adane_customer');
    auth.signOut().catch(() => {});
    alert("🚪 Logged out.");
    location.reload();
}

function openAccountModal() { document.getElementById('authModal').classList.add('active'); }
function closeAccountModal() { document.getElementById('authModal').classList.remove('active'); }

function toggleAiModal() {
    document.getElementById('aiModal').classList.toggle('active');
}

function sendAiMessage() {
    let input = document.getElementById('aiUserInput');
    let text = input.value.trim();
    if (!text) return;

    let chatBody = document.getElementById('aiChatBody');
    chatBody.innerHTML += '<div class="ai-msg user">' + text + '</div>';
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        let reply = generateSmartAiResponse(text);
        chatBody.innerHTML += '<div class="ai-msg bot">' + reply + '</div>';
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 500);
}

function generateSmartAiResponse(userQuery) {
    let q = userQuery.toLowerCase();
    let lang = currentLang;

    if (q.includes('ስኳር') || q.includes('ደም ግፊት') || q.includes('diab') || q.includes('sukkaara') || q.includes('ጽግያት')) {
        if(lang === 'en') return "<b>For Diabetes & Blood Pressure:</b><br>• High fiber foods, zero sugar and low salt diets.<br>• Boiled chicken or fish.";
        if(lang === 'om') return "<b>Dhukkubsattoota Sukkaaraa & Dhiibbaa Dhiigaatiif:</b><br>• Nyaata faayibarii qaban, nyaata sukkaraafi soogidda hin qabne.<br>• Foon kukkullaa ykn qurxummii.";
        if(lang === 'ti') return "<b>ንሕማም ስኳርን ጸቕጢ ደምን፦</b><br>• ፋይበር ዘለዎም፣ ስኳርን ጨውን ዘይብሎም ምግቢ።<br>• እተፈልሐ ደርሆን ዓሳን።";
        return "<b>ለስኳር እና ደም ግፊት ታማሚዎች የሚመከሩ ምግቦች፦</b><br>• በፋይበር የበለፀጉ፣ ስኳር እና ጨው የሌላቸው ምግቦች<br>• የተቀቀለ ዶሮ ወይም አሳ።";
    }

    if (q.includes('ልብ') || q.includes('heart')) {
        if(lang === 'en') return "<b>For Heart Health:</b><br>• Fat-free foods like boiled vegetables, fish, and olive oil.<br>• Avoid fried and fatty foods.";
        return "<b>ለልብ ጤንነት የሚመከሩ፦</b><br>• ቅባት የሌላቸው እንደ የተቀቀለ አትክልት፣ አሳ እና የኦሊቭ ዘይት ያላቸው ምግቦች<br>• የተጠበሱ እና ቅባታማ ምግቦችን ማስወገድ።";
    }

    if (q.includes('ወባ') || q.includes('በሽታ') || q.includes('ህመም') || q.includes('ትኩሳት') || q.includes('malaria')) {
        if(lang === 'en') return "<b>For Malaria & Fever:</b><br>• Get plenty of fluids (water, fresh juice, chicken soup).<br>• Vitamin C rich fruits.";
        return "<b>ለወባ እና ትኩሳት ህመምተኞች የሚመከሩ፦</b><br>• ብዙ ፈሳሽ ማግኘት (ውሃ፣ አዲስ የተጨመቀ የፍራፍሬ ጁስ፣ የዶሮ ሾርባ)<br>• በቫይታሚን ሲ የበለፀጉ ፍራፍሬዎች።";
    }

    if (q.includes('ምርጥ') || q.includes('ሆቴል') || q.includes('hotel') || q.includes('hoteela')) {
        if (allHotelsData.length === 0) return "No hotels found.";
        let hotelNames = allHotelsData.map(h => "• " + getTranslatedHotelName(h.data.name || h.key)).join("<br>");
        return (lang === 'en' ? "<b>Best Hotels:</b><br>" : "<b>ምርጥ ሆቴሎች፦</b><br>") + hotelNames;
    }

    if(lang === 'en') return "I am your Hotel and Health AI Advisor! You can ask me anything about hotels, room prices, fitness, diet, diabetes, blood pressure, heart health, or malaria.";
    if(lang === 'om') return "Ani gorsaa AIiti. Waa'ee hoteelotaa, nyaataafi fayyaa gaafachuu dandeessu.";
    if(lang === 'ti') return "ኣነ ናይ ሆቴልን ጥዕናን AI አማካሪ እየ! ዝኾነ ሕቶ ክትሕቱ ትኽእሉ።";
    return "እኔ የሆቴል እና የጤና AI አማካሪዎ ነኝ! ማንኛውንም ጥያቄ መጠየቅ ይችላሉ።";
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
});
