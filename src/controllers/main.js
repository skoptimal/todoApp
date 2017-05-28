angular.module('todoApp')
  .controller('TodoController', ['$scope', '$http', 'Todos', 'moment', function($scope, $http, Todos, moment) {

    var vm = this;

    //Function calc avg	
    vm.calculateAverage = function(inputValue) {
      var sum = 0;
      for (var i = 0; i < inputValue.length; i++) {
        sum += parseInt(inputValue[i].difficulty, 10); //don't forget to add the base 
      }
      var avg = sum / inputValue.length;
      return avg;
    };

    //Init: Page load info
    vm.date = moment().format('DD-MM-YYYY');
    vm.loading = true;

    //formData: Todo init
    vm.formData = {};
    vm.formData.tags;
    vm.formData.difficulty = 3;

    //Init: Todo (They should be date objects)
    vm.todoDoc = {};
    vm.todoDoc.dateModified = "2/2/2018";
    vm.todoDoc.dateCompleted = "3/3/2019";

    //Init: Datepicker
    vm.datePicker = {};

    //Init datePicker format
    var startDateMoment = moment().subtract(1, "days").format('DD-MM-YYYY');
    var endDateMoment = moment().format('DD-MM-YYYY');
    
    //Issue with this property for some reason
    vm.datePicker.date = {
      startDate: moment().subtract(1, 'days'),
      endDate: moment()
    };

    vm.options = {
      locale: {
        applyLabel: "Apply",
        fromLabel: "From",
        format: "DD/MM/YYYY", //will give you 2017-01-06
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
      },
      ranges: {
        'Yesterday': [moment().subtract(1, 'days'), moment()],
        'Last 2 Days': [moment().subtract(2, 'days'), moment()],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 14 Days': [moment().subtract(14, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()]
      }
    }

    //Search init (dummy data)
    vm.availableSearchParams = [{
      key: "emailAddress",
      name: "E-Mail",
      placeholder: "E-Mail...",
      allowMultiple: true
    }];

    // GET =====================================================================
    // when landing on the page, get all todos and show them
    // use the service to get all the todos
    Todos.get()
      .then(function(data) {
        vm.todos = data.data;
        vm.loading = false;
        console.log(data);
      });

    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    vm.createTodo = function(text, tags, difficulty) {

      console.log('Controller :' + vm.formData.text);
      console.log('Controller :' + vm.formData.tags);
      console.log('Controller :' + vm.formData.difficulty);
      // validate the formData to make sure that something is there
      // if form is empty, nothing will happen
      if (vm.formData.text != undefined) {
        vm.loading = true;
        // call the create function from our service (returns a promise object)
        Todos.create(vm.formData.text, vm.formData.tags, vm.formData.difficulty)
          // if successful creation, call our get function to get all the new todos
          .then(function(data) {
            vm.loading = false;
            vm.formData = {}; // clear the form so our user is ready to enter another
            vm.todos = data.data; // assign our new list of todos
          });
      }
    };

    // UPDATE ==================================================================
    // when submitting the add form, send the text to the node API
    vm.updateTodo = function(id, text, difficulty, completed) {
      console.log(id, text, difficulty, completed);
      // call the create function from our service (returns a promise object)
      Todos.put(id, text, difficulty, completed)
        // if successful creation, call our get function to get all the new todos
        .then(function(data) {
          vm.loading = false;
          vm.formData = {}; // clear the form so our user is ready to enter another
          vm.todos = data.data; // assign our new list of todos
        });
    };

    // DELETE ==================================================================
    // delete a todo after checking it
    vm.deleteTodo = function(id) {
      vm.loading = true;
      Todos.delete(id)
        // if successful creation, call our get function to get all the new todos
        .then(function(data) {
          vm.loading = false;
          vm.todos = data.data; // assign our new list of todos
        });
    };
  }]);