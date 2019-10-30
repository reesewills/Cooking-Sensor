//garage js 2
//Reese's Photon
var myParticleAccessToken = "20a7132cadf20803de9ebaa1bba6d7af65b327b4"
//var myDeviceId =            "30001f000c47343438323536"

//Jared's Photon
//var myParticleAccessToken = "4e1add4e168b2e4faa478ffae92fb56a1b943c59"
var myDeviceId = "47004b000851363136363935"
//var topic =                 "cse222Lights/thisLamp/color"

/*function newGarageEvent(objectContainingData){
  console.log("are we making it in HERE");
  alert("hey");
  var garageObject = JSON.parse(objectContainingData.data);
  this.doorStatus = garageObject.state;
  this.lightStatus = garageObject.lightStatus;
  garage.stateChange();
}*/

var temperatureSensor = {
  state: "heating",
  currentTemperature: 0,
  targetTemperature: 80,
  telephoneNumber: "",
  /*doorStatus: "Closed",
  lightStatus: false,
  doorAutoCloseTime: 25,
  autoCloseStatus: false,
  lightAutoCloseTime: 25,
  lightBrightness: 100,*/
  particle: null,
  setState: function(state){
    this.state = state;
    this.updatePart("hi");
  },
  setTargetTemperature: function(temperature){
    this.targetTemperature = temperature;
    this.updatePart("hi");
  },
  setTelephoneNumber: function(number){
    this.telephoneNumber = number;
    this.updatePart("hi");
  },
  updatePart: function(anything){
    var data = "";
    data += this.state;
    if(this.currentTemperature < 10){
      data += "0";
    }
    if(this.currentTemperature < 100){
      data += "0";
    }
    data += this.currentTemperature;
    if(this.targetTemperature < 10){
      data += "0";
    }
    if(this.targetTemperature < 100){
      data += "0";
    }
    data += this.targetTemperature;
    data += this.telephoneNumber;
    var functionData = {
      deviceId:myDeviceId,
      name: "updatePart",
      argument: "" + data,
      auth: myParticleAccessToken
    }
    particle.callFunction(functionData);
  },
  setStChgLstn: function(aListener) {
      // DONE
      this.stateChangeListener = aListener;
  },
  stateChange: function() {
      // DONE
      // If there's a listener, call it with the data
      if(this.stateChangeListener) {
        var state = { currentTemperature:this.currentTemperature,
                      targetTemperature:this.targetTemperature,
                      telephoneNumber:this.telephoneNumber};
          this.stateChangeListener(state);
      }
  },
  setup: function() {
      // Create a particle object
      console.log("setup called");
      particle = new Particle();
      particle.getEventStream({ deviceId: myDeviceId, auth: myParticleAccessToken }).then(function(stream) {
        stream.on('event', function(data) {
            console.log("y no work");
            var stringData = data.data;
            console.log("1");
            console.log(stringData);
            console.log(stringData.length);
            var thisState = stringData.substring(0, 6);
            console.log("2");
            var thisCurrentTemperature = stringData.substring(6, 9);
            console.log(stringData.substring(6, 9) + " this current temp");
            var thisTargetTemperature = stringData.substring(9, 12);
            console.log("3");
            var thisTelephoneNumber = stringData.substring(12, 15);
            console.log("4");
            updateCurrentTemperature(Number(thisCurrentTemperature));
            console.log("5");
            /*var stateObject = JSON.parse(data.data);
            console.log(stateObject);
            console.log(stateObject.state);
            newEventStateChange(stateObject.state);*/
        });
      });
    }
}
