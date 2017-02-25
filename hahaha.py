#! /usr/bin/env python3
import serial
import sys

ser = serial.Serial('/dev/ttyACM0', 9600)

while 1 :
    tmp = ser.readline()
    print tmp,
    sys.stdout.flush()

