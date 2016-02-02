Meteor.startup(function () {
    Meteor.call('reset');
    Meteor.setInterval(()=> {
        Meteor.call('moveDown')
    }, 1000);
});