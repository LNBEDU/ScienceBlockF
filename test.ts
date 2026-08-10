// ===== 초기 설정 =====
LCD.init()

// 상태 메시지
LCDGraph.drawStatus("시작 중...", LCD.yellow())

// ESP32 초기화
ESP32UART.initEsp32()

// WiFi 연결
ESP32UART.connectWifi("LnB", "XX")

// 상태 아이콘 표시
LCDFont.drawStatusIcons()

// ===== 반복 루프 =====
basic.forever(function () {

    // WiFi 연결 상태 확인
    if (ESP32UART.isWifiConnected()) {

        // micro:bit LED
        basic.showIcon(IconNames.Heart)

        // TFT 상태 표시
        LCDGraph.drawStatus("Connected WiFi", LCD.green())

    } else {

        basic.showIcon(IconNames.No)

        LCDGraph.drawStatus("Disconnected WiFi", LCD.red())
    }

    // 아이콘 업데이트
    LCDFont.drawStatusIcons()

    basic.pause(1000)
})