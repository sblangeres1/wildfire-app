function makeMap(){
    //Getting the NASA api
    fetch("https://eonet.gsfc.nasa.gov/api/v2.1/events")
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
            //Checking if event is a wildfire
            if(element.categories[0].id === 8){
                var marker = new google.maps.Marker({
                    position: {lat: element.geometries[0].coordinates[1], lng: element.geometries[0].coordinates[0]},
                    map: map,
                    icon: icon
                })
            }
        });

        
    });
}
 
window.initMap = makeMap;