#include "Arduino.h"

float voltage;
float tempC;
const int FILTER_COUNTS = 10;
float average[FILTER_COUNTS];
int count = 0;
unsigned long elapsedCheck1 = 0;
const int checkTime = 5000;
double sum;
float averageTempC;
int currentTemperature = 0;
int targetTemperature = 0;
String telephoneNumber = "";
int coolingLightPin = D1;
int heatingLightPin = D2;
Timer publishTemp(checkTime, checkLoop);

enum State {
  heating,
  cooling
};

State currState = heating;

int publishState(String s) {
  String data = "";
  if(currState == 0){
    data += "heating";
  }
  else if(currState == 1){
    data += "cooling";
  }
  //data += currState;
  if(currentTemperature < 10){
    data += "0";
  }
  if(currentTemperature < 100){
    data += "0";
  }
  data += currentTemperature;
  if(targetTemperature < 10){
    data += "0";
  }
  if(targetTemperature < 100){
    data += "0";
  }
  data += targetTemperature;
  data += telephoneNumber;
  Serial.println("Publishing:");
  Serial.println(data);
  String topic = "event";
  //Particle.publish(topic, data, 60, PRIVATE);
  Particle.publish("event", data, PRIVATE);
  return 0;
}

int updatePart(String s){
  var thisCurrState = s.substring(0, 6);
  if(thisCurrState == "heating"){
    currState = heating;
  }
  else{
    currState = cooling;
  }
  currentTemperature = Number(s.substring(6, 9));
  targetTemperature = Number(stringData.substring(9, 12));
  telephoneNumber = stringData.substring(12, 15);
  return 0;
}

void setup() {
  Serial.begin(9600);
  Particle.function("publishState", publishState);
  Particle.function("updatePart", updatePart);
  pinMode(coolingLightPin, OUTPUT);
  pinMode(heatingLightPin, OUTPUT);
  //pinMode(7, OUTPUT);
  publishTemp.start();
  //analogReference(INTERNAL);
}

void loop() {
    if(currState == heating){
      digitalWrite(coolingLightPin, 0);
      digitalWrite(heatingLightPin, 1);
      if(currentTemperature >= targetTemperature){
        // DO SOMETHING! (NOTIFY)

      }
    }
    else{
      digitalWrite(coolingLightPin, 1);
      digitalWrite(heatingLightPin, 0);
      if(currentTemperature <= targetTemperature){
        // DO SOMETHING! (NOTIFY)

      }
    }
}

void checkLoop(){
  //if (millis() > elapsedCheck1) {
  for (int i = 0; i < FILTER_COUNTS; ++i) {
    readTemp();
  }
  Serial.println(averageTempC);
  currentTemperature = (int)averageTempC;
  publishState("hi");
  elapsedCheck1 += checkTime;
  //}
}

void readTemp() {
  voltage = (analogRead(1) / 1023.0) * 1.1;
  tempC = 25.0 + (voltage - (0.75)) * 100.0;
  average[count % FILTER_COUNTS] = tempC;
  if (count == FILTER_COUNTS) {
    count = 0;
    sum = 0;
    for (int i = 0; i < FILTER_COUNTS; ++i) {
      sum += average[i];
      if (i == FILTER_COUNTS - 1) {
        sum /= ((double) FILTER_COUNTS);
        averageTempC = sum;
//                Serial.print(sum);
//                Serial.print(",");
//                Serial.println(tempC);
      }
    }
  }
  else {
    ++count;
  }
}
