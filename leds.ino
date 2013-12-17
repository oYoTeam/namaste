long intervalValue = 200;
int currentLed = 0;
int lightCount = 5; //quanti giri devono fare i led ?

//  disposizione led:
//  5 -> blu
//  6 -> verde
//  7 -> giallo
int ledArray[] = {5, 6, 7};
int ledLength  = sizeof(ledArray);
int delayTimer = 200;

// illumina il primo led (blu)
void lightBlueLed() {
  digitalWrite(ledArray[0], HIGH);
  digitalWrite(ledArray[1], LOW);
//  digitalWrite(ledArray[2], LOW);
}

// illumina il secondo led (verde)
void lightGreenLed() {
  digitalWrite(ledArray[0], LOW);
  digitalWrite(ledArray[1], HIGH);
  digitalWrite(ledArray[2], LOW);
}

// illumina il terzo led (giallo)
void lightYellowLed() {
//  digitalWrite(ledArray[0], LOW);
  digitalWrite(ledArray[1], LOW);
  digitalWrite(ledArray[2], HIGH);
}

// inizializza i led
void initLeds() {
  for (int thisLed = 0; thisLed < ledLength; thisLed++) {
    pinMode(ledArray[thisLed], OUTPUT);
    digitalWrite(ledArray[thisLed], LOW);
  }
}

// illumina i led in sequenza
void lightMultipleLeds() {
  for(int i = 0; i <= lightCount; i++){
    lightBlueLed();
    delay(delayTimer);
    lightGreenLed();
    delay(delayTimer);
    lightYellowLed();
    delay(delayTimer); 
  }
  //e dopo spengo tutto
  initLeds();
}


void lightGreenOrYellow(long value){
  if (value <= intervalValue){
    lightYellowLed();
  }else{
    lightGreenLed();
  }
}
