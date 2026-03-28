# ESP32 + RC522 Wiring

Use SPI pins on ESP32.

- `RC522 SDA (SS)` -> `ESP32 GPIO5`
- `RC522 SCK` -> `ESP32 GPIO18`
- `RC522 MOSI` -> `ESP32 GPIO23`
- `RC522 MISO` -> `ESP32 GPIO19`
- `RC522 RST` -> `ESP32 GPIO22`
- `RC522 3.3V` -> `ESP32 3V3`
- `RC522 GND` -> `ESP32 GND`

## Notes
- Do not power RC522 with 5V.
- Update WiFi credentials and backend URL in `esp32_rc522_attendance.ino`.
- Keep backend reachable from ESP32 network (use local IP, not localhost).