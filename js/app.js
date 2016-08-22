(function(){
	
    var app = angular.module('store',[]);
          
    app.controller('AppController', function($scope, $http){
        //get all projects by AJAX

        //DD get all goods from DB use AJAX

        $http({
            method : "GET",
            url : "../backend/getAllProjects.php"
        }).then(function mySucces(response) {
            $scope.projects = transformData(response.data);

            angular.element(document).ready(function () {
                jQuery(".datepicker").datepicker();
                jQuery(".datepicker").each(function() {
                    jQuery(this).datepicker('setDate', new Date($(this).val()));
                });

                jQuery(".datepicker").datepicker({
                    onSelect: function() {
                        jQuery(this).change();
                    }
                });
            });

        }, function myError(response) {
            alert(" Can't do because: " + response.statusText);
        });


    });

    //dd transform data from db
    function transformData(data){
        var projects = [];
        var projectId = undefined;
        for(var i=0;i<data.length;i++){

            if(projectId===undefined||projectId!==data[i].project_id){
                var project = {
                    projectID:data[i].project_id,
                    name:data[i].project_name,
                    deadLine:data[i].deadline,
                    tasks:[]
                };
                projects.push(project);

                projectId=data[i].project_id;
            }

            if(data[i].id){
                var task = {
                    taskID:data[i].id,
                    taskDone:data[i].status,
                    taskName:data[i].name,
                    priority:Number(data[i].priority),
                };

                projects[projects.length-1].tasks.push(task);
            }

        }

        //sort by priority
        for(var j=0;j<projects.length;j++){
            projects[j].tasks.sort(function(a, b) {
                return b.priority -a.priority;
            });
        }

        return projects;
    }

    ///////////////////////////////////JQuery functions/////////////////////////////////////
    $(document).ready(function(){

        //////////////////////////////////////PROJECT EVENTS/////////////////////////////////////

        //dd add new project
        $('.add-todo-list').on('click',function(){
            var self = this;
            //add new project on server
            $.ajax({
                type:'POST',
                url:'../backend/addProject.php',
                data:{'data':true},
                dataType: 'json',
                success: function(data) {
                    /* console.log(data); */
                    //processServerResponseOrder(data);

                    var newTaskContent = '<div class="project-wrapper ng-scope"><div class="project-header-wrapper" data-id="'+data.id+'"> <button type="button" class="deadline-project" aria-label="Left Align"><input type="text" class="datepicker" value="2016-08-30"></button> <input class="edit-project-name" type="text" readonly="true" placeholder="Please typing here name of the project..."> <button type="button" class="remove-project" aria-label="Left Align"></button> <button type="button" class="edit-project" aria-label="Left Align"></button> </div> <div class="project-body-wrapper"> <div class="add-task-wrapper"> <button type="button" class="add-task-icon" aria-label="Left Align"></button> <div class="add-task-input-wrapper"> <input class="new-task-name" type="text" placeholder="Please typing here to create a task..."> <button type="button" class="add-task" aria-label="Left Align">Add Task</button> </div> </div>'
                    $(self).closest('.add-todo-list-wrapper').before(newTaskContent);
                    $(self).closest('.add-todo-list-wrapper').prev().find('.edit-project').trigger('click');
                    $(".datepicker").datepicker();

                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });

        });

        $("body").on('change',".datepicker",function(){
            var projectId       = $(this).closest('.project-header-wrapper').attr('data-id');
            var projectName     = $(this).closest('.project-header-wrapper').find('input.edit-project-name').val();
            var projectDeadline = $(this).closest('.project-header-wrapper').find('input.datepicker').datepicker( "getDate" );
            projectDeadline.setMinutes(projectDeadline.getMinutes() - projectDeadline.getTimezoneOffset());

            var projectData = {
                'operation':'edit',
                'id':projectId,
                'name':projectName,
                'deadline':projectDeadline
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };

            //fix new name of project via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });
        });


        //dd enter to editing name project
        $("body").on('click',".edit-project",function(){
            //save new name of project on backend via AJAX
            var inputNameProj = $(this).closest('.project-header-wrapper').find('.edit-project-name');
            inputNameProj.prop('readonly', false);
            inputNameProj.trigger('focus');

        });
        //dd edit name project
        $("body").on('blur',".edit-project-name",function(){
            var projectId       = $(this).closest('.project-header-wrapper').attr('data-id');
            var projectName     = $(this).closest('.project-header-wrapper').find('input.edit-project-name').val();
            var projectDeadline = $(this).closest('.project-header-wrapper').find('input.datepicker').datepicker( "getDate" );
            projectDeadline.setMinutes(projectDeadline.getMinutes() - projectDeadline.getTimezoneOffset());

            var projectData = {
                'operation':'edit',
                'id':projectId,
                'name':projectName,
                'deadline':projectDeadline
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };

            //fix new name of project via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });
            $(this).prop('readonly', true);

        });


        //dd remove project
        $("body").on('click',".remove-project",function(){
            var self = this;
            //remove on backend via AJAX and if success
            var projectId       = $(this).closest('.project-header-wrapper').attr('data-id');
            var projectData = {
                'operation':'remove',
                'id':projectId
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };

            //fix new name of project via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    $(self).closest('.project-wrapper').remove();
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });

        });


        //dd add new task to project
        $("body").on('click',".add-task-icon, .add-task",function(){

            var self = this;

            var newTaskInput = $(this).closest('.add-task-wrapper').find('input.new-task-name');
            var taskName = newTaskInput.val();
            taskName = taskName.trim();
            if(!taskName){
                return;
            }

            //add task on backend via AJAX
            var projectId       = $(this).closest('.project-wrapper').find('.project-header-wrapper').attr('data-id');
            var priority = 1;
            $(this).closest('.project-wrapper').find('.task-name-wrapper').each(function(){
                var thisPriority = Number($(this).attr('data-priority'));
                if(thisPriority>priority){
                    priority=thisPriority;
                }
            });
            ++priority;


            var projectData = {
                'operation':'addtask',
                'projectid':projectId,
                'taskname':taskName,
                'priority':priority
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };

            //fix new name of project via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    var newTaskContent = '<div class="task-wrapper"> <div class="done-wrapper"> <input type="checkbox"/> </div> <div class="task-name-wrapper" data-id="'+data.id+'" data-priority="'+priority+'"> <h4>'+taskName+'</h4> <input class="edit-task-name" type="text" value="'+taskName+'"/> </div> <div class="task-right-buttons-wrapper"> <button type="button" class="change-priority-task" aria-label="Left Align"></button> <button type="button" class="edit-task" aria-label="Left Align"></button> <button type="button" class="remove-task" aria-label="Left Align"></button> </div> </div>';

                    var projectBody = $(self).closest('.project-body-wrapper');
                    if(projectBody.find('.task-wrapper').length){
                        projectBody.find('.task-wrapper').eq(0).before(newTaskContent);
                    }else{
                        projectBody.append(newTaskContent);
                    }

                    newTaskInput.val('');
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });



        });

        //////////////////////////////////////TASK EVENTS/////////////////////////////////////

        //dd done checkbox changing
        $("body").on('change',".done-wrapper input",function(){
            //update input on backend via AJAX
            var status      = $(this).prop('checked')?1:0;
            var taskId      = $(this).closest('.task-wrapper').find('.task-name-wrapper').attr('data-id');
            var projectData = {
                'operation':'statustask',
                'taskid':taskId,
                'status':status
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };

            //remove on backend via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });

        });

        //dd change priority of task
        $("body").on('click',".change-priority-task",function(){
            var self = this;
            var thisTask = $(this).closest('.task-wrapper');
            var prevTask = thisTask.prev();

            var thisTaskId      = thisTask.find('.task-name-wrapper').attr('data-id');
            var prevTaskId      = prevTask.find('.task-name-wrapper').attr('data-id');
            var thisTaskPriority = Number($(this).closest('.task-wrapper').find('.task-name-wrapper').attr('data-priority'));
            if(prevTask.hasClass('task-wrapper')){
                var prevTaskPriority = Number(thisTask.prev().find('.task-name-wrapper').attr('data-priority'));
            }else {
                var prevTaskPriority = 1;
            }
            var projectData = {
                'operation':'prioritytask',
                'thistaskid':thisTaskId,
                'thisTaskPriority':thisTaskPriority,
                'prevtaskid':prevTaskId,
                'prevTaskPriority':prevTaskPriority
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };
            //remove on backend via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    if(prevTask.hasClass('task-wrapper')){
                        prevTask.before(thisTask);
                    }else{
                        $(self).closest('.project-body-wrapper').append(thisTask);
                    }
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });

        });

        //dd enter to editing task
        $("body").on('click',".edit-task",function(){
            var input = $(this).closest('.task-wrapper').find('.task-name-wrapper .edit-task-name');
            input.css('display','block');
            input.trigger('focus');
        });

        //dd editing task
        $("body").on('blur',".task-name-wrapper .edit-task-name",function(){
            //change task on backend via AJAX
            var self        = this;
            var taskId      = $(this).closest('.task-wrapper').find('.task-name-wrapper').attr('data-id');
            var taskName    = $(this).val();
            var projectData = {
                'operation':'edittask',
                'taskid':taskId,
                'name':taskName
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };

            //remove on backend via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    $(self).closest('.task-name-wrapper').find('h4').text($(this).val());
                    $(self).css('display','none');
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });


        });

        //dd removing task
        $("body").on('click',".remove-task",function(){
            var self        = this;
            var taskId      = $(this).closest('.task-wrapper').find('.task-name-wrapper').attr('data-id');
            var projectData = {
                'operation':'removetask',
                'taskid':taskId
            };

            if(!validate(projectData)){
                alert('Not valid data!');
                return;
            };
            //remove on backend via AJAX
            $.ajax({
                type:'POST',
                url:'../backend/changeProject.php',
                data:{'data':JSON.stringify(projectData)},
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    $(self).closest('.task-wrapper').remove();
                },
                error: function (request, error) {
                    console.log(arguments);
                    alert(" Can't do because: " + error);
                }
            });


        });

        //dd simple validation
        function validate(data)
        {
            valid = true;
            var regexp = /^[A-Za-z0-9-_+. ,@/b]/;

            for(var prop in data){


                if ( (typeof(data[prop]) == "string")) {

                    if(!(regexp.test(data[prop]))){
                        valid = false;
                        break;
                    }
                }else if(data[prop] instanceof Date){

                    if(isNaN(data[prop].valueOf())){
                        valid = false;
                        break;
                    }

                }

            }

            return valid;
        }
    });

})();