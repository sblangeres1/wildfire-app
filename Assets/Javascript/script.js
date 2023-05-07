var city;
var date = new Date();
var year = date.getYear()-1;
var saveButton = document.querySelector('#save');

function yearFormat(a){
    var yearNum = Number(a) - 1900;
    return yearNum;
}

window.addEventListener('load', ()=> {
    let long;
    let lat;
    // Not sure if these acutally will prove useful. I am unable to find a workaround to pull local Lat Long information
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.degree');
    let locationTimezone = document.querySelector(".location-timezone");

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => { 
            const proxy = "https://cors-anywhere.herokuapp.com/";
            const APIkey = `5b2e2bc67a6c73ff4f0998fcebd047ad`;
            const queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + String(position.coords.latitude) + "&lon=" + String(position.coords.longitude) + "&limit=10&units=imperial&appid=" + APIkey;
            // the "CONST" is the original and the fail safe 
            // const queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Sacramento&units=imperial&limit=10&appid=5b2e2bc67a6c73ff4f0998fcebd047ad";
            
            // This fetch command pulls from the queryURL for the weahter API
        fetch(queryURL)
            .then(response => {
                return response.json();
            }) // This .then statement is replacing the information provided in the local variables
               // including the document.queryselector's
            .then(data => {
                // Console.log so the graders can see what information is being pulled from openweathermaps.org
                console.log(data);
                const {temp, humidity} = data.main;
                // Set DOM elements pulled from the API
                temperatureDegree.textContent = "Temp* " + temp;
                temperatureDescription.textContent = "Humidity% " + humidity;
                locationTimezone.textContent = data.name;
            });
        });
    }
});

function initMap(){
    //Getting the NASA api
    fetch("https://eonet.gsfc.nasa.gov/api/v3/events")
    .then(res => res.json())
    .then(data => {
        //Creating the map
        var map = new google.maps.Map(document.getElementById("fireMap"), {
            zoom: 6,
            center: { lat: 38.782449813306606, lng: -121.22187219433563 },
            mapTypeId: 'terrain',
        });
        //Setting some icon properties
        var icon = {
            url: "./Assets/Images/fire.png",
            scaledSize: new google.maps.Size(30,30),
        }
        //Adding the fire locations to map
        var eventList = data.events;
        eventList.forEach(element => {
            var eventYear = element.geometry[0].date
            //Checking if event is a wildfire and from this year, then running newItem() if true
            if(element.categories[0].id === 'wildfires' && yearFormat(element.geometry[0].date.split('-')[0]) == year){
                newItem();
            }
            //Function to create markers for every event in nasa api
            function newItem(){
                var contentString = '<h3>' + element.title + '</h3>' + '<h5>' + 'Sources: ' + '</h5>' + '<a href=' + element.sources[0].url + '>' + element.sources[0].url + '</a>' + '<p>' + element.geometry[0].date + '</p>';
                var marker = new google.maps.Marker({
                    position: {lat: element.geometry[0].coordinates[1], lng: element.geometry[0].coordinates[0]},
                    map: map,
                    icon: icon
                });
                //Options for info window
                var infoWindowOptions = {
                    content: contentString,
                    map: map,
                    anchor: marker
                }
                //Creating the info window when we click on a fire pin
                google.maps.event.addDomListener(marker, 'click', function(){
                    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);   
                })
            }
        }); 
    });
}

function save(){
    var inputs = document.querySelectorAll('input[type="checkbox"]');
    var arrayData =[];
    inputs.forEach(function(input){
        if(input.id.split("x")[0] == 'checkbo'){
            arrayData.push({id: input.id, checked: input.checked})
        }
        
    })
    localStorage.setItem('inputs', JSON.stringify(arrayData));
    console.log(arrayData);
}

function load(){
    var inputs = JSON.parse(localStorage.getItem('inputs'));
    inputs.forEach(function(input){
        document.getElementById(input.id).checked = input.checked;
    });
}

saveButton.addEventListener('click', function(){
    save();
    console.log("saved");
})

load();
 
window.initMap = initMap;