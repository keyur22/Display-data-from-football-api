//Declaring a module
var app = angular.module("myApp", ['ngRoute', 'angularCSS', 'ngAnimate', 'angular.filter']);

/*app.filter( 'custom', function(){

     return function(items, score){

          console.log(score);
          return items;

     };

});*/

/*Converting gd from string to integer for ordering purposes*/
app.filter('stringToInteger', function() {

       return function(input) {

             angular.forEach(input, function(value) {
                   value.gd =  parseInt(value.gd);
             })

       return input;
       };

 });

/* Controller to display schedule for all matches */
app.controller("schedule", ["$http", "$scope", "$location", "$timeout",  function($http, $scope, $location, $timeout){

     var main = this; // Create a context
     var rounds = []; // for getting rounds from JSON1
     this.leagueNames = []; // for storing all leagueNames
     this.teams = []; // for storing all teams in JSON
     this.scores = []; // for storing all scores
     this.matchdays = []; // for storing all matchdays
     this.matchDetails = []; // for storing all match details and leagues from JSON
     this.matchDetails1 = []; // for storing all match details from JSON
     $scope.myDate = new Date(); // initialize input date
     this.heading = "Schedule";

     // function to get data from both JSON files
     this.allDetails = function(){

          //Getting data from 1st JSON file
          $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json')
          .then(function(res){

               main.rounds = res.data.rounds; // storing JSON1 rounds in rounds array
               main.leagueNames.push(res.data.name); // storing leaguenames in array

               // looping through rounds to combine all match details
               main.rounds.map(function (x){

                    if ( x.name == "Play-Off um 1 Premierleague-Platz:"){

                         var matchday =  "Play-Off um 1 Premier league Platz:"
                         main.matchdays.push( { day: matchday } ); // storing matchdays in array

                    }
                    else{

                         var matchday = x.name; // storing matchday in variable
                         main.matchdays.push( { day: matchday } ); // storing matchdays in array

                    }

                    x.matches.map(function(details){

                         // separating single match details in array
                         main.matchDetails1.push( {

                              matchday: matchday, date: details.date, teamKey1: details.team1.key, teamKey2: details.team2.key,
                              teamCode1: details.team1.code, teamCode2: details.team2.code, teamName1: details.team1.name,
                              teamName2: details.team2.name, score1: details.score1, score2: details.score2

                         } );

                         main.teams.push({ key: details.team1.key, name: details.team1.name }); // storing teams in array
                         main.teams.push({ key: details.team2.key, name: details.team2.name }); // storing teams in array

                         if( details.score1 != null && details.score2 != null ){

                              main.scores.push( { score: details.score1 } ); // storing scores in array
                              main.scores.push( { score: details.score2 } ); // storing scores in array

                         }

                    })

               })//End loop

               main.matchDetails.push(  { name: res.data.name, details: main.matchDetails1 } );// pushing league name & match Details in array
               main.rounds = [];
               main.matchDetails1 = []; // clearing both arrays for reuse

               //Getting data from 2nd JSON file
               $http.get('JSON/epl2016.json')
               .then(function(res){

                    main.rounds = res.data.rounds; // storing JSON2 rounds in round2 array
                    main.leagueNames.push(res.data.name); // storing leaguenames in array

                    //looping through rounds to get all match details
                    main.rounds.map(function (x){

                         var matchday = x.name; // Storing matchday in variable

                         x.matches.map(function(details){

                              // separating single match details in array
                              main.matchDetails1.push( {

                                   matchday: matchday, date: details.date, teamKey1: details.team1.key, teamKey2: details.team2.key,
                                   teamCode1: details.team1.code, teamCode2: details.team2.code, teamName1: details.team1.name,
                                   teamName2: details.team2.name, score1: details.score1, score2: details.score2

                              } );

                              main.teams.push({ key: details.team1.key, name: details.team1.name }); // storing teams in array
                              main.teams.push({ key: details.team2.key, name: details.team2.name }); // storing teams in array
                              main.matchdays.push( { day: matchday } ); // storing matchdays in array

                              if( details.score1 != null && details.score2 != null ){

                                   main.scores.push( { score: details.score1 } ); // storing scores in array
                                   main.scores.push( { score: details.score2 } ); // storing scores in array

                              }

                         })


                    })//End loop

                    main.matchDetails.push(  { name: res.data.name, details: main.matchDetails1 } );// pushing league name & match Details in array
                    console.log(main.matchDetails);

               });// End getting data from JSON2

          });// End getting data from JSON1

     }//End function to get JSON data

     //Function to reset all filters
     this.clear = function(){

          $scope.leagueName = undefined;
          $scope.teamKey = undefined;
          $scope.mday = undefined;
          if ( $scope.myDate.date = undefined ){
               console.log("ok");
          }
          else{
               $scope.myDate.date = undefined;
          }
          $scope.score = undefined;

     } // End function to reset all filters

     // custom filter for filtering data
     /*$scope.custom =  function ( tkey ) {

          return function(items) {

              var matchDetails = [];
              console.log(items);

          }
     }*/

     /*Function to pass parameters to display page*/
     this.passParams = function(lname,matchday,date,name1,code1,score1,name2,code2,score2){

          var leaguename = lname;
          var leagueName = leaguename.replace("/","-"); // replacing / with -

          $timeout(function () {

               $location.path("/display/"+ leagueName + "/" + matchday+  "/" + date + "/" + name1+  "/" + code1 + "/" +
                    score1 + "/" + name2+  "/" + code2 + "/" + score2); // passing parameters

          });

     };

}]); // End Controller

/* Controller to display details of a single match */
app.controller("displayMatch", [ "$http","$routeParams", function($http, $routeParams){

     /* Extracting parameters from url */
     this.league = $routeParams.leagueName;
     this.matchday = $routeParams.matchday;
     this.date = $routeParams.date;
     this.team1 = $routeParams.name1;
     this.code1 = $routeParams.code1;
     this.score1 = $routeParams.score1;
     this.team2 = $routeParams.name2;
     this.code2 = $routeParams.code2;
     this.score2 = $routeParams.score2;
     this.sclass1 = "";// Initializing class for bold text
     this.sclass2 = "";

     /* Make the greater score bold */
     if ( this.score1 > this.score2 ){

          this.sclass1 = "text_type_bold"

     }

     /* Make the greater score bold */
     if ( this.score2 > this.score1 ){

          this.sclass2 = "text_type_bold"

     }

}]);// End Controller

/*COntroller to display statistics*/
app.controller( "statistics", [ "$http", "$filter", function( $http, $filter ){

     var main = this; // Create a context
     var rounds = []; // for getting rounds from JSON
     this.leagueNames = []; // for storing all leagueNames
     this.teams = []; // for storing all teams from JSON
     this.uniqueTeams = []; // for storing teams according to unique names
     this.finalTeams = []; // for storing final details of all teams
     this.teamDetails = []; // for storing team details from both JSON
     this.heading = "Statistics";

     // function to get data from both JSON files
     this.stats = function(){

          //Getting data from 1st JSON file
          $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2015-16/en.1.json')
          .then(function(res){

               main.rounds = res.data.rounds; // storing JSON1 rounds in round1 array
               main.leagueNames.push(res.data.name); // storing leaguenames in array

               // looping through rounds to combine all match details
               main.rounds.map(function (x){

                    x.matches.map(function(details){

                         // separating single match details in array
                         main.teams.push( { name: details.team1.name, code: details.team1.code, gf: details.score1, ga: details.score2 } );

                         main.teams.push( { name: details.team2.name,  code: details.team2.code, gf: details.score2, ga: details.score1 } );

                    })

               })//End loop

               main.uniqueTeams = ($filter('unique')(main.teams, 'name')); // getting only different teams in array

               for ( i = 0 ; i < main.uniqueTeams.length ; i++ ){

                    var name = main.uniqueTeams[i].name;
                    var code = main.uniqueTeams[i].code;
                    var p = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0, gd = 0, points = 0; // initailize played,won,draw,lost,goals for,against,difference and points

                    // looping through teams to store all their statistics individually
                    main.teams.map( function( x ){

                         if ( x.name == name ){

                              gf += x.gf;
                              ga += x.ga;

                              if ( x.gf > x.ga ){

                                   w += 1;

                              }
                              else if ( x.gf < x.ga ) {

                                   l += 1;

                              }
                              else{

                                   d +=1;

                              }

                         }

                    });

                    gd = gf-ga;

                    main.finalTeams.push( { name: name, code: code, p: w + l + d, w: w, l: l, d: d, gf: gf, ga: ga, gd: gf - ga,
                         gd: ( gd < 0? "" : "+" ) + gd, points: (3 * w) + (1 * d) } ); // pushing all details in array

               }

               main.teamDetails.push(  { name: res.data.name, teamDetails: main.finalTeams } );// pushing league name & team Details in array

               main.rounds = [];
               main.teams = [];
               main.uniqueTeams = [];
               main.finalTeams = []; // Initializing all arrays for reuse

               //Getting data from 2nd JSON file
               $http.get('https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json')
               .then(function(res){

                    main.rounds = res.data.rounds; // storing JSON2 rounds in round array
                    main.leagueNames.push(res.data.name); // storing leaguenames in array

                    // looping through rounds to combine all match details
                    main.rounds.map(function (x){

                         x.matches.map(function(details){

                              // separating single match details in array
                              main.teams.push( { name: details.team1.name, code: details.team1.code, gf: details.score1, ga: details.score2 } );

                              main.teams.push( { name: details.team2.name, code: details.team2.code, gf: details.score2, ga: details.score1 } );

                         })

                    })//End loop

                    main.uniqueTeams = ($filter('unique')(main.teams, 'name'));// getting only different teams in array

                    // looping through teams to store all their statistics individually
                    for ( i = 0 ; i < main.uniqueTeams.length ; i++ ){

                         var name = main.uniqueTeams[i].name;
                         var code = main.uniqueTeams[i].code;
                         var p = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0, gd = 0, points = 0; // initailize played,won,draw,lost,goals for,against,difference and points


                         main.teams.map( function( x ){

                              if ( x.name == name ){

                                   gf += x.gf;
                                   ga += x.ga;

                                   if ( x.gf > x.ga ){

                                        w += 1;

                                   }
                                   else if ( x.gf < x.ga ) {

                                        l += 1;

                                   }
                                   else{

                                        d +=1;

                                   }

                              }

                         });

                         gd = gf-ga;

                         main.finalTeams.push( { name: name, code: code, p: w + l + d, w: w, l: l, d: d, gf: gf, ga: ga, gd: gf - ga,
                              gd: ( gd < 0? "" : "+" ) + gd, points: (3 * w) + (1 * d) } );

                    }

                    main.teamDetails.push(  { name: res.data.name, teamDetails: main.finalTeams } );// pushing league name & team Details in array

               });// End getting data from JSON2

          });// End getting data from JSON1

          console.log(main.leagueNames);
          console.log(main.teamDetails);

     }//End function to get JSON data

}]);// End Controller
