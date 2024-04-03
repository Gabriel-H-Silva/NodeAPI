class Task {
    constructor(id, description, userId) {
        this.id= id;
        this.description = description;
        this.userId = userId;
        this.completed = false;
    }}
module.exports = Task;