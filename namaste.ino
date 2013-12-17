
#include <SPI.h>
#include <Ethernet.h>


// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
// if you don't want to use DNS (and reduce your sketch size)
// use the numeric IP instead of the name for the server:
//IPAddress server(74,125,232,128);  // numeric IP for Google (no DNS)
char server[] = "169.254.129.244";    // name address for Google (using DNS)
// Set the static IP address to use if the DHCP fails to assign
IPAddress ip(169,254,129,243);

// Initialize the Ethernet client library
// with the IP address and port of the server 
// that you want to connect to (port 80 is default for HTTP):
EthernetClient client;


int status = 0;
long init1 = 0;
boolean fatto = false;
long media = 0;
int readCount = 0;
int numeroGiochi = 0;
boolean special = false;
int proximityValue = 500; //il valore minimo per far partire fabryz con il responso
int specialGameNumber = 2; //quante giocate prima di far partire la special?
void setup() {

  initCapacitive();

  // Open serial communications and wait for port to open:
  Serial.begin(9600);

  // Inizializza scheda ethernet senza DHCP
  Ethernet.begin(mac, ip);

  // Inizializza leds
  initLeds();
}

void loop() {
  
  media += getCapacitive();

  if(readCount == 10){
    Serial.println(media / 10);
      if(numeroGiochi == specialGameNumber ){ //se sono alla N giocata parte special max 
        special = true;
        specialFabryz();        
      }
    sendNode(media / 10,special);    
    special = false;
    if(media/10 < proximityValue){
      almostThere();
    }
    if(media / 10 > proximityValue){ // ho raggiunto la prossimità necessaria. Parte l'animazione di fabryz e dopo tot secondi si riparte    
      //  Accendi i led in sequenza
      lightMultipleLeds();
      youGotIt();
      numeroGiochi++; //conto il numero di giocate, in modo che alla 3 faccio partire la special max
      startThinking();
    }
    readCount = 0;
    media = 0;
  }
  else{
    readCount++;
  }   

  //  Wait every 10ms
  delay(5);
}

void startThinking(){
  delay(5000);
}

void almostThere(){
  lightYellowLed();
}
void youGotIt(){
  lightGreenLed();
}

void specialFabryz(){
  lightBlueLed();
}
