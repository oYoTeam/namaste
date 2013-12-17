//  effettua la chiamata GET
void sendNode(long val, boolean special) {
  if (client.connect(server, 8080)) {
      Serial.println("connected");
  } else {
    // kf you didn't get a connection to the server:
    Serial.println("connection failed");
  }
  client.print("GET /arduino?value=");
  client.print(val);
  client.print("&special=");
  client.print(special);
  client.println(" HTTP/1.0");
  client.println();
  client.stop();
  //
  while (client.available()) {
    char c = client.read();
    Serial.print(c);
  }
}
