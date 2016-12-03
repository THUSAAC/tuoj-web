$(document).ready(function() {
    $('#submit').click(function() {
        $('#info').html('shooting');
        $('#error').html('');
        $.post('/api/notification/broadcast', {
            text: $('#text').val()
        }, function(res) {
            $('#info').html(JSON.stringify(res.res));
            $('#error').html(JSON.stringify(res.error));
        });
    });
});
