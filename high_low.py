import ASUS.GPIO as GPIO
import time, sys

LED_Pin = 11

GPIO.setmode(GPIO.BOARD) #Physical Pin
GPIO.setup(LED_Pin, GPIO.OUT)

if sys.args[1] == "T":
    GPIO.output(LED_Pin, GPIO.HIGH)
else if sys.args[1] == "F":
    GPIO.output(LED_Pin, GPIO.LOW)

