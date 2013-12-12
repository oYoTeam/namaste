
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

  if(readCount == 20){
    Serial.println(media / 20);
    sendNode(media / 20);
    readCount = 0;
    media = 0;
  }
  else{
    readCount++;
  }   

  //  Accendi i led in sequenza
  lightMultipleLeds();

  //  Wait every 10ms
  delay(10);
}

