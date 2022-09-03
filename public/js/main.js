const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')


Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})


Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

function loadMapScenario() {
    var searchManager;
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
    search(map, req.body.map);
    function search(map, query) {
        //Create an instance of the search manager and perform the search.
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
            searchManager = new Microsoft.Maps.Search.SearchManager(map);
            geocodeQuery(map, query);
        });
    }
    function geocodeQuery(map, query) {
        var searchRequest = {
            where: query,
            callback: function (r) {
                if (r && r.results && r.results.length > 0) {
                    var pin, pins = [], locs = [], output = 'Results:<br/>';
                    for (var i = 0; i < r.results.length; i++) {
                        //Create a pushpin for each result.
                        pin = new Microsoft.Maps.Pushpin(r.results[i].location, { text: i + '' });
                        pins.push(pin);
                        locs.push(r.results[i].location);
                        output += i + ') ' + r.results[i].name + '<br/>';
                    }
                    //Add the pins to the map
                    map.entities.push(pins);
                    //Display list of results
                    document.getElementById('printoutPanel').innerHTML = output;
                    //Determine a bounding box to best view the results.
                    var bounds;
                    if (r.results.length == 1) {
                        bounds = r.results[0].bestView;
                    }
                    else {
                        //Use the locations from the results to calculate a bounding box.
                        bounds = Microsoft.Maps.LocationRect.fromLocations(locs);
                    }
                    map.setView({ bounds: bounds });
                }
            },
            errorCallback: function (e) {
                //If there is an error, alert the user about it.
                document.getElementById('printoutPanel').innerHTML = 'No results found.';
            }
        };
        //Make the geocode request.
        searchManager.geocode(searchRequest);
    }
    
}