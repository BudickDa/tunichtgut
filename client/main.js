Template.field.onRendered(function () {
    var field = document.getElementById('field'),
        preview = document.getElementById('preview');
    if (!field) {
        throw new Meteor.Error(500, 'Canvas for field not found');
    }
    if (!preview) {
        throw new Meteor.Error(500, 'Canvas for preview not found');
    }

    var game = new Game(field, preview);

    game.controls()

    Tracker.autorun(function () {
        var cursor = Blocks.find({preview: false});
        game.render(cursor);
    });
});



