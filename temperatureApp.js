var loginPage
var loginUsername
var loginPassword
var loginButton
var createAccountPageButton

//Account Creation Page Variables
var accountCreationPage
var accountCreationLogin
var accountCreationPassword
var accountCreationVerifyPassword
var createAccountButton
var loginPageButton

//Door Control Variables
var cookingControlPage
var doorControlButton
var faultControlButton
var lightControlButton
var advancedSettingsPageButton
var logoutButton
var doorStatusLabel
var lightStatusLabel

//Advanced Settings Variables
var advancedSettingsPage
var autoCloseToggleButton
var doorCloseSlider
var lightOffTimeSlider
var lightBrightnessSlider
var backToLoginButton
var autoCloseStatusLabel
var lightBrightnessSliderLabel
var doorCloseSliderLabel
var lightOffTimeSliderLabel

function goToLoginPage(){
  accountCreationPage.hidden = true
  loginPage.hidden = false
  cookingControlPage.hidden = true
}

function goTocookingControlPage(){
  accountCreationPage.hidden = true
  loginPage.hidden = true
  cookingControlPage.hidden = false
}

function goToCreateAccountPage(){
  accountCreationPage.hidden = false
  loginPage.hidden = true
  cookingControlPage.hidden = true
}

function targetTemperatureSliderChange(){
  targetTemperatureLabel.innerHTML = " " + targetTemperatureSlider.value + " degrees fahrenheit"
  temperatureSensor.setTargetTemperature(targetTemperatureSlider.value);
  //garage.setDrAutClsT(doorCloseSlider.value * 1000)
  //console.log(garage.doorAutoCloseTime)
}

function updateCurrentTemperature(temperature){
  currentTemperatureLabel.innerHTML = temperature + " degrees fahrenheit";
  console.log("making it in update Current");
  console.log(temperature);
}

function temperatureControlButtonClicked(){
  if(temperatureControlLabel.innerHTML == "Heating"){
    temperatureControlLabel.innerHTML = "Cooling"
    temperatureSensor.setState("cooling");
  }
  else{
    temperatureControlLabel.innerHTML = "Heating"
    temperatureSensor.setState("heating");
  }

}

function newEventStateChange(passedState){
  if (passedState == "Open"){
    garage.setDoorStat("Open")
    garage.setLtStat(false)
    doorStatusLabel.innerHTML = "Open"
    lightStatusChange();
  }
  else if(passedState == "Closed"){
    garage.setDoorStat("Closed");
    doorStatusLabel.innerHTML = "Closed";
    garage.setLtStat(false)
    lightStatusChange();
  }
  else if(passedState == "Closing"){
    garage.setDoorStat("Closing");
    doorStatusLabel.innerHTML = "Closing";
    garage.setLtStat(true)
    lightStatusChange();
  }
  else if(passedState == "Opening"){
    garage.setDoorStat("Opening");
    doorStatusLabel.innerHTML = "Opening";
    garage.setLtStat(true)
    lightStatusChange();
  }
  else if(passedState == "faultedOpening"){
    garage.setDoorStat("faultedOpening");
    doorStatusLabel.innerHTML = "Faulted Opening";
    garage.setLtStat(false)
    lightStatusChange();
  }
  else if(passedState == "faultedClosing"){
    garage.setDoorStat("faultedClosing");
    doorStatusLabel.innerHTML = "Faulted Closing";
    garage.setLtStat(false)
    lightStatusChange();
  }
  else if(passedState == "stoppedOpenning"){
    garage.setDoorStat("stoppedOpening");
    doorStatusLabel.innerHTML = "Stopped Opening";
    garage.setLtStat(false)
    lightStatusChange();
  }
  else if(passedState == "stoppedClosing"){
    garage.setDoorStat("stoppedClosing");
    doorStatusLabel.innerHTML = "Stopped Closing";
    garage.setLtStat(false)
    lightStatusChange();
  }
}

function doorStatusChange(){
  console.log("door Status " + garage.doorStatus + " autoCloseStatus " + garage.autoCloseStatus)
  if(garage.doorStatus == "Closed" && garage.autoCloseStatus){
    console.log("1")
    lightStatusChange()
    garage.setDoorStat("Opening")
    garage.setLtStat(false)
    doorStatusLabel.innerHTML = "Opening"
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Open";garage.setDoorStat("Open")}}, 1000)
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closing";garage.setDoorStat("Closing")}}, 1000 + (garage.doorAutoCloseTime))
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, (garage.doorAutoCloseTime) + 2000)
  }
  else if(garage.doorStatus == "Closed" && !garage.autoCloseStatus){
    console.log("2")
    garage.setLtStat(false)
    lightStatusChange()
    doorStatusLabel.innerHTML = "Opening"
    garage.setDoorStat("Opening")
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Open";garage.setDoorStat("Open")}}, 1000)
  }
  else if(garage.doorStatus == "Open" && garage.autoCloseStatus){
    console.log("3")
    garage.setLtStat(false)
    lightStatusChange()
    doorStatusLabel.innerHTML = "Closing"
    garage.setDoorStat("Closing")
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, 1000)
  }
  else if(garage.doorStatus == "Open" && !garage.autoCloseStatus){
    console.log("4")
    garage.setLtStat(false)
    lightStatusChange()
    garage.setDoorStat("Closing")
    doorStatusLabel.innerHTML = "Closing"
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, 1000)
  }
  else if(garage.doorStatus == "Opening"){
    doorStatusLabel.innerHTML = "Stopped Opening"
    garage.setDoorStat("stoppedOpening")
    garage.setLtStat(false)
    lightStatusChange()
  }
  else if(garage.doorStatus == "Closing"){
    doorStatusLabel.innerHTML = "Stopped Closing"
    garage.setDoorStat("stoppedClosing")
    garage.setLtStat(false)
    lightStatusChange()
  }
  else if(garage.doorStatus == "faultedOpening" && !garage.autoCloseStatus){
    garage.setLtStat(false)
    lightStatusChange()
    doorStatusLabel.innerHTML = "Opening"
    garage.setDoorStat("Opening")
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Open";garage.setDoorStat("Open")}}, 1000)

  }
  else if(garage.doorStatus == "faultedOpening" && garage.autoCloseStatus){
    lightStatusChange()
    garage.setDoorStat("Opening")
    garage.setLtStat(false)
    doorStatusLabel.innerHTML = "Opening"
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Open";garage.setDoorStat("Open")}}, 1000)
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closing";garage.setDoorStat("Closing")}}, 1000 + (garage.doorAutoCloseTime))
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, (garage.doorAutoCloseTime) + 2000)
  }
  else if(garage.doorStatus == "faultedClosing"){
    garage.setLtStat(false)
    lightStatusChange()
    garage.setDoorStat("Closing")
    doorStatusLabel.innerHTML = "Closing"
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, 1000)
  }
  else if(garage.doorStatus == "stoppedOpening"){
    garage.setLtStat(false)
    lightStatusChange()
    garage.setDoorStat("Closing")
    doorStatusLabel.innerHTML = "Closing"
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, 1000)
  }
  else if(garage.doorStatus == "stoppedClosing" && garage.autoCloseStatus){
    lightStatusChange()
    garage.setDoorStat("Opening")
    garage.setLtStat(false)
    doorStatusLabel.innerHTML = "Opening"
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Open";garage.setDoorStat("Open")}}, 1000)
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closing";garage.setDoorStat("Closing")}}, 1000 + (garage.doorAutoCloseTime))
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Closed";garage.setDoorStat("Closed");lightStatusChange()}}, (garage.doorAutoCloseTime) + 2000)
  }
  else if(garage.doorStatus == "stoppedClosing" && !garage.autoCloseStatus){
    garage.setLtStat(false)
    lightStatusChange()
    doorStatusLabel.innerHTML = "Opening"
    garage.setDoorStat("Opening")
    setTimeout(function() {if(garage.doorStatus != "faultedOpening" && garage.doorStatus != "faultedClosing" && garage.doorStatus != "stoppedClosing" && garage.doorStatus != "stoppedOpening"){doorStatusLabel.innerHTML = "Open";garage.setDoorStat("Open")}}, 1000)
  }
  else{
    console.log("door status not right UI?")
  }
}

function faultStatusChange(){
  if(garage.doorStatus == "Opening"){
    garage.setLtStat(false)
    garage.setDoorStat("faultedOpening");
    doorStatusLabel.innerHTML = " Faulted Opening"
  }
  else if(garage.doorStatus == "Closing"){
    garage.setDoorStat("faultedClosing");
    doorStatusLabel.innerHTML = " Faulted Closing"
  }
  else{
    console.log("Fault status problem")
  }
}

function lightStatusChange(){
  console.log("light status: " + garage.lightStatus + " autoCloseStatus: " + garage.autoCloseStatus)

  if(garage.lightStatus == true && garage.autoCloseStatus == true){
    lightStatusLabel.innerHTML = "Off"
    garage.setLtStat(false)
  }
  else if (garage.lightStatus == true && garage.autoCloseStatus == false){
    lightStatusLabel.innerHTML = "Off"
    garage.setLtStat(false)
  }
  else if(garage.lightStatus == false && garage.autoCloseStatus == true){
    lightStatusLabel.innerHTML = "On"
    garage.setLtStat(true)
    setTimeout(function() { lightStatusLabel.innerHTML = "Off";garage.setLtStat(false)}, garage.lightAutoCloseTime * 1000)
  }
  else if(garage.lightStatus == false && garage.autoCloseStatus == false){
    console.log("made it")
    lightStatusLabel.innerHTML = "On"
    garage.setLtStat(true)
  }
  else{
    console.log("problem with light status change ui")
  }
}


document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Document Loaded")
  //Login Page Variables
  loginPage = document.getElementById("login")
  loginUsername = document.getElementById("login_username")
  loginPassword = document.getElementById("login_password")
  loginButton = document.getElementById("login_button")
  createAccountPageButton = document.getElementById("create_account_page_button");

  //Account Creation Page Variables
  accountCreationPage = document.getElementById("account_creation")
  accountCreationLogin = document.getElementById("account_creation_login")
  accountCreationPassword = document.getElementById("account_creation_password")
  accountCreationVerifyPassword = document.getElementById("account_creation_verify_password")
  createAccountButton = document.getElementById("create_account_button")
  loginPageButton = document.getElementById("login_page_button")

  //Door Control Variables
  cookingControlPage = document.getElementById("cooking_control")
  doorControlButton = document.getElementById("door_control_button")
  //faultControlButton = document.getElementById("fault_control_button")
  //lightControlButton = document.getElementById("light_control_button")
  //advancedSettingsPageButton = document.getElementById("advanced_settings_page_button")
  logoutButton = document.getElementById("logout_button")
  currentTemperatureLabel = document.getElementById("current_temperature_label")
  targetTemperatureLabel = document.getElementById("target_temperature_label")
  telephoneNumberLabel = document.getElementById("telephone_number_label")
  targetTemperatureSlider = document.getElementById("target_temperature_slider")
  temperatureControlLabel = document.getElementById("temp_control_label");
  temperatureControlButton = document.getElementById("temp_control_button");

  goToLoginPage()

  // Event handlers
  createAccountButton.addEventListener("click", goToLoginPage)
  loginButton.addEventListener("click", goTocookingControlPage)
  createAccountPageButton.addEventListener("click", goToCreateAccountPage)
  //advancedSettingsPageButton.addEventListener("click", goToAdvancedSettingsPage)
  logoutButton.addEventListener("click", goToLoginPage)
  //backToLoginButton.addEventListener("click", goTocookingControlPage)
  loginPageButton.addEventListener("click", goToLoginPage)
  //autoCloseToggleButton.addEventListener("click", autoCloseStatusToggle)
  targetTemperatureSlider.addEventListener("change", targetTemperatureSliderChange)
  temperatureControlButton.addEventListener("click", temperatureControlButtonClicked)
  //lightBrightnessSlider.addEventListener("change", lightBrightnessSliderChange)
  //lightOffTimeSlider.addEventListener("change", lightOffTimeSliderChange)
  //doorControlButton.addEventListener("click", doorStatusChange)
  //faultControlButton.addEventListener("click", faultStatusChange)
  //lightControlButton.addEventListener("click", lightStatusChange)

  // Getting the initial state
  console.log("Getting Initial State")
  //loadingPage(true)
  //garage.getState(stateUpdate)
  temperatureSensor.setup();
})
