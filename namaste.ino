#include <CapacitiveSensor.h>
#include <SPI.h>
#include <Ethernet.h>
CapacitiveSensor   cs_4_2 = CapacitiveSensor(4,2);  

// Enter a MAC address for your controller below.
// Newer Ethernet shields have a MAC address printed on a sticker on the shield
byte mac[] = { 
  0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
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

long media = 0;
    int i = 0;
int status = 0;
long init1 = 0;
boolean fatto = false;


void setup() {
  
  cs_4_2.set_CS_AutocaL_Millis(0xFFFFFFFF);     // turn off autocalibrate on channel 1 - just as an example   

  // Open serial communications and wait for port to open:
  Serial.begin(9600);

  Ethernet.begin(mac, ip);

    
}

void loop()
{
      long total1 =  cs_4_2.capacitiveSensor(30); 
      if(fatto == false && i == 5)
      {
        init1 = total1;
        Serial.println(init1);  
        fatto = true;
      }
      media += total1;
 
      if(i == 20){
        Serial.println(media / 20); 
       long desantis = media / 20; 
        if((desantis - init1) < 300){
        status = 0;
        Serial.println("nessuno");  
      } else if( (desantis - init1) > 300 && (desantis - init1) < 650 ){
        status = 1;
        Serial.println("basso");  
      } else if ( (desantis - init1) >= 650 && (desantis - init1 ) < 950){
        status = 2;
        Serial.println("medio");  
      } else if ( (desantis - init1) >= 950){
        Serial.println("alto");  
        status =3 ;
      }
      sendNode(media / 20);
       i = 0;
       media = 0;
      }else{
        i++;
      }   
      
       
 
     
  
//  Serial.flush();
delay(10);

  // capacicoso


  //long total1 =  cs_4_2.capacitiveSensor(30);      

  //Serial.println(millis() - start);                      // OPTIONAL: check on performance in milliseconds   
  // Serial.print(" ");                                     // OPTIONAL: tab character for debug windown spacing


  // arbitrary delay to limit data to serial port 
}

void sendNode(long val){
    if (client.connect(server, 8080)) {
    //  Serial.println("connected");
    } 
    else {
      // kf you didn't get a connection to the server:
      Serial.println("connection failed");
    }
    client.print("GET /arduino?value=");
    client.print(val);
    client.println(" HTTP/1.0");
    client.println();
    client.stop();
//
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
  }
  
}
