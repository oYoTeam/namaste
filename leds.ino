int currentLed = 0;
int ledArray[] = {5, 6, 7};
int ledLength  = sizeof(ledArray);
int delayTimer = 100;

// illumina il primo led
void lightFirstLed() {
  digitalWrite(ledArray[0], HIGH);
  digitalWrite(ledArray[1], LOW);
  digitalWrite(ledArray[2], LOW);
}

// illumina il secondo led
void lightSecondLed() {
  digitalWrite(ledArray[0], LOW);
  digitalWrite(ledArray[1], HIGH);
  digitalWrite(ledArray[2], LOW);
}

// illumina il secondo led
void lightThirdLed() {
  digitalWrite(ledArray[0], LOW);
  digitalWrite(ledArray[1], LOW);
  digitalWrite(ledArray[2], HIGH);
}

// inizializza array di led
void initLeds() {
  for (int thisLed = 0; thisLed < ledLength; thisLed++) {
    pinMode(ledArray[thisLed], OUTPUT);
    digitalWrite(ledArray[thisLed], LOW);
  }
}

// illumina i led in sequenza
void lightMultipleLeds() {
  lightFirstLed();
  delay(delayTimer);
  lightSecondLed();
  delay(delayTimer);
  lightThirdLed();
  delay(delayTimer); 
}

