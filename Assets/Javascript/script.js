var date = new Date();
var year = date.getYear();
console.log(year)

function yearFormat(a){
    var yearNum = Number(a) - 1900;
    return yearNum;
}

function makeMap(){
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
 
window.initMap = makeMap;