(function($) {
    var TaskList = {
        init: function() {
            this.rootElement = $("#application");
            this.drawApplication();
            this.addEventListeners();
        },
        addEventListeners: function() {
            this.newTaskButtonElement.on("click", this.showCreateNewTaskPopup.bind(this));
        },
        showCreateNewTaskPopup: function() {
            var content = $("<div />", {
                class: "task-list_new-task"
            });
            var nameInput = $("<input />", {
                class: "new-task_name-input jsCreateNewTaskName"
            });
            var createButton = $("<input />", {
                class: "new-task_submit-button",
                value: "Create",
                type: "Button"
            });
            createButton.on("click", this.createNewTask.bind(this));
            content.append(nameInput);
            content.append(createButton);
            this.openPopup(content);
        },
        createNewTask: function() {
            var task = $("<div />", {
                class: "task-list__container-task"
            });
            task.append(this.openedPopup.find(".jsCreateNewTaskName").val());
            this.taskListContaner.append(task);
            this.openedPopup.hide();
        },
        openPopup: function(content) {
            var popup = $("<div />", {
                class: "task-list_popup"
            });
            popup.append(content);
            this.rootElement.append(popup);
            popup.show();
            this.openedPopup = popup;
        },
        drawApplication: function() {
            this.rootElement.append(this.createControlPanel());
            this.rootElement.append(this.createTaskListContainer());            
        },
        createNewTaskButton: function() {
            var button = $("<input />", {
                class: "task-list__create-button",
                value: "New task",
                type: "button"
            });
            this.newTaskButtonElement = button;
            return button;
        },
        createTaskListContainer: function() {
            var container = $("<div />", {
                class: "task-list__container"
            });
            this.taskListContaner = container;
            return container;
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