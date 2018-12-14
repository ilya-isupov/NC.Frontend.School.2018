(function($) {
    function Task(params) {
        this.title = params.title;
        this.description = params.description;
        this.createHtml();
    };
    function ControlPanel(params) {
        this.controls = params.controls;
    };
    function TaskListHolder(params) {
        this.tasks = params.tasks !== undefined && params.tasks.length > 0 ? params.tasks : [];
        this.anchor = params.anchor;
    };
    function Button(params) {
        this.title = params.title;
        this.clickHandler = params.clickHandler;
        this.createHtml();
        this.html.on("click", this.clickHandler);
    };

    function Popup(params) {
        this.title = params.title;
        this.model = params.model;
        this.customCssClass = params.customCssClass;
        this.createHtml();
    };

    function Form(params) {
        this.model = params;
        this.create();
    }

    Button.prototype.draw = function() {
        return this.html;
    }

    Button.prototype.createHtml = function() {
        var _this = this;
        var button = $("<a />", {
            class: "task-list__control-panel-button",
            text: _this.title
        });
        this.html = button;
    }



    Task.prototype.createHtml = function() {
        var _this = this;
        var task = $("<div />", {
            class: "task-list__container-task",
            text: _this.title
        });
        this.html = task;
    }

    Task.prototype.draw = function() {
        return this.html;
    }

    TaskListHolder.prototype.init = function() {
        this.container = $("<div />", {
            class: "task-list__container"
        });
        this.anchor.append(this.container);
        this.drawTasks();
    }

    TaskListHolder.prototype.add = function(task) { 
        var taskData = {
            title: task.title,
            description: task.description
        }
        Backendless.Data.of( "Tasks" ).save( taskData )
        .then( ( savedTask ) => {
            this.tasks.push(task);
            this.redraw();
        })
        .catch( function( error ) {
        });

    }

    TaskListHolder.prototype.redraw = function(task) {
        this.container.html("");
        this.drawTasks();
    }

    TaskListHolder.prototype.drawTasks = function() {
        this.tasks.forEach(task => {
            this.container.append(task.draw());
        });
    }

    TaskListHolder.prototype.setTasks = function(tasks) {
        tasks.forEach((task) => {
            this.tasks.push(new Task(task));
        });
        this.redraw();
    }


    

    Popup.prototype.show = function() {
        $("body").append(this.popup);
        this.popup.show();
    }

    Popup.prototype.createHtml = function() {
        var content = new Form(this.model);
        var popup = $("<div />", {
            class: "popup"
        });
        popup.append(content.getContent());
        this.popup = popup;
    }

    Form.FieldTypes = {
        input: "input",
        select: "select"
    }

    Form.prototype.create = function() {
        var form = $("<form />", {
            class: "popup__form"
        });
        this.model.fields.forEach((field) => {
            var fieldDOM;
            if(field.type == Form.FieldTypes.input) {
                fieldDOM = $("<input />", {
                    class: "popup__form-input"
                });
                form.append(field);
            }
        });
        this.form = form;
    }

    Form.getFieldTypes = function() {
        return this.FieldTypes;
    }

    Form.prototype.getContent = function() {
        return this.form;
    }








    var TaskList = {
        init: function() {
            this.rootElement = $("#application");
            this.initializeApplication();
            this.drawApplication();
            this.addEventListeners();
        },
        initializeApplication: function() {
            var _this = this;
            this.TaskListHolder = new TaskListHolder({
                anchor: _this.rootElement
            });
            Backendless.Data.of( "Tasks" ).find()
            .then( function( tasks ) {
                _this.TaskListHolder.setTasks(tasks);
            })
            .catch( function( error ) {
            });
            
        },
        addEventListeners: function() {
        },
        showCreateNewTaskPopup: function() {
            // var nameInput = $("<input />", {
            //     class: "new-task_name-input jsCreateNewTaskName"
            // });
            // var createButton = $("<input />", {
            //     class: "new-task_submit-button",
            //     value: "Create",
            //     type: "Button"
            // });

            var model = {
                model: {
                    customCssClass: "task-list_new-task",
                    fields: [
                        {
                            type: Form.getFieldTypes().input
                        }
                    ]
                }                
            }

            var popup = new Popup(model);
            popup.show();





            // createButton.on("click", this.createNewTask.bind(this));
            // content.append(nameInput);
            // content.append(createButton);
            //this.openPopup(content);
        },
        createNewTask: function() {
            var task = new Task({
                title: this.openedPopup.find(".jsCreateNewTaskName").val()
            });
            this.TaskListHolder.add(task);
            this.openedPopup.remove();
        },
        openPopup: function(content) {
            var popup = $("<div />", {
                class: "task-list_popup"
            });
            popup.append(content);
            var closeButton = $("<a />", {
                class: "task-list_popup-close-button",
                text: "x"
            });
            popup.append(closeButton);
            closeButton.on("click", function() {
                popup.remove();
            });
            this.rootElement.append(popup);
            popup.show();
            this.openedPopup = popup;
        },
        drawApplication: function() {
            this.rootElement.append(this.createControlPanel());
            this.TaskListHolder.init();           
        },
        createNewTaskButton: function() {
            var _this = this;
            var button = new Button({
                title: "Create Task",
                clickHandler: _this.showCreateNewTaskPopup.bind(this)
            });
            return button.draw();
        },
        createControlPanel: function() {
            var controlPanel = $("<div />", {
                class: "task-list__control-panel"
            });
            controlPanel.append(this.createNewTaskButton());
            return controlPanel;
        }
    }

    $(document).ready(function() {
        TaskList.init();
    });


})(jQuery);