#include <CapacitiveSensor.h>

CapacitiveSensor cs_4_2 = CapacitiveSensor(4,2);

void initCapacitive() {
  //  turn off autocalibrate on channel 1 - just as an example   
  //  a noi fa comodo che mantenga la stessa sensibilità alla vicinanza nel tempo
  cs_4_2.set_CS_AutocaL_Millis(0xFFFFFFFF); 
}

long getCapacitive() {
  //  Valore in arrivo dal sensore capacitivo
  return cs_4_2.capacitiveSensor(30);
}

