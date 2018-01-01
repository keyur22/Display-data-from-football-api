//Routing Configuration

app.config( ["$routeProvider", function($routeProvider){

     $routeProvider
          .when('/',{

               templateUrl : 'views/index-view.html', // location of the template
               css: 'css/style.css' // stylesheet for that view

           })
           .when('/schedule',{

               templateUrl : 'views/schedule.html', // location of the template
               controller : 'schedule', // which controller it should use
               controllerAs : 'fixture',  // what is the alias of that controller.
               css: 'css/style1.css' // stylesheet for that view

          })
          .when('/display/:leagueName/:matchday/:date/:name1/:code1/:score1/:name2/:code2/:score2',{

              templateUrl : 'views/displayMatch.html', // location of the template
              controller : 'displayMatch', // which controller it should use
              controllerAs : 'display',  // what is the alias of that controller.
              css: 'css/style2.css' // stylesheet for that view

         })
         .when('/statistics',{

            templateUrl : 'views/statistics.html', // location of the template
            controller : 'statistics', // which controller it should use
            controllerAs : 'stats',  // what is the alias of that controller.
            css: 'css/style3.css' // stylesheet for that view

        })
        .otherwise(
           {
               redirectTo:'/'
           }

       );

}]);
