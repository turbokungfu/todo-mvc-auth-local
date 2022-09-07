

const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req,res)=>{
       
        try{  
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            const place = await Todo.find({userId:req.user.id})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, locs: place, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{console.log(req.body)
            await Todo.create({todo: req.body.todoItem, completed: false, map: req.body.map, date: req.body.date, userId: req.user.id})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile, 'hello')
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },
    loadMapScenario: async(req, res)=> {
        console.log(req.body.todoIdFromJSFile, 'hello')
        var searchManager;
        var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
        search(map, 'Paris');
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

} 