from machine import Pin, PWM
import network
import urequests
import utime

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
ssid = 'Galaxy S97ea3'
password = 'Starwars22'
wlan.connect(ssid, password)

while not wlan.isconnected():
    print("Waiting to connect...")
    utime.sleep(1)

led_pins = [PWM(Pin(10, mode=Pin.OUT)), PWM(Pin(13, mode=Pin.OUT)), PWM(Pin(15, mode=Pin.OUT))]
for led in led_pins:
    led.freq(1000)
    led.duty_u16(0)

color_map = {
    "Gryffindor": [65535, 0, 0],  # Red
    "Hufflepuff": [65535, 65535, 0],  # Yellow
    "Ravenclaw": [0, 0, 65535],  # Blue
    "Slytherin": [0, 65535, 0]  # Green
}

url = "http://192.168.85.79:3000"

def update_led_color(house):
    colors = color_map.get(house, [65535, 65535, 65535])  
    for i, color in enumerate(colors):
        led_pins[i].duty_u16(65535 - color)  

while True:
    try:
        response = urequests.get("http://192.168.85.79:3000").json()  # Ensure this URL is correct
        print("Current house:", response['message'])
        update_led_color(response['message'])
        utime.sleep(1)  
    except Exception as e:
        print("Error:", e)

