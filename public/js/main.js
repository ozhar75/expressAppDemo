$(document).ready(function () {
    $('.deleteUser').on('click', deleteUser);
});

function deleteUser() {
    var confifirmation = confirm('Are you sure');
    if (confifirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$(this).data('id')
        }).done(function (response) {
            window.location.replace('/');
        });
        window.location.replace('/');
    } else {
        return false;
    }
}