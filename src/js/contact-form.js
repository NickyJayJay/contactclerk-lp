$(document).ready(function () {
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();

        const $submitBtn = $('#submit-btn');
        const $loadingIndicator = $('#loading-indicator');
        const $messagesDiv = $('#form-messages');

        // Show loading state
        $submitBtn.prop('disabled', true);
        $loadingIndicator.show();
        $messagesDiv.hide();

        // Get Turnstile token
        const turnstileToken = $('[name="cf-turnstile-response"]').val();

        // Check if Turnstile was completed
        if (!turnstileToken) {
            showMessage('Please complete the security verification.', 'error');
            $submitBtn.prop('disabled', false);
            $loadingIndicator.hide();
            return;
        }

        // Get form data
        const data = {
            name: $('#name').val(),
            email: $('#email').val(),
            website: $('#website').val(),
            phone: $('#phone').val(),
            message: $('#message').val(),
            referrer: $('#referrer').val(),
            'cf-turnstile-response': turnstileToken
        };

        // Make API request to your Django backend
        $.ajax({
            url: 'https://api.spotterscan.com/intake/contact/',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (result) {
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                $('#contact-form')[0].reset();
            },
            error: function (xhr) {
                const errorMsg = xhr.responseJSON?.error || 'An error occurred. Please try again.';
                showMessage(errorMsg, 'error');
            },
            complete: function () {
                // Reset loading state
                $submitBtn.prop('disabled', false);
                $loadingIndicator.hide();
            }
        });
    });

    function showMessage(message, type) {
        const $messagesDiv = $('#form-messages');
        $messagesDiv.text(message);
        $messagesDiv.removeClass('alert-success alert-danger');
        $messagesDiv.addClass(`alert mb-3 ${type === 'success' ? 'alert-success' : 'alert-danger'}`);
        $messagesDiv.show();
        $messagesDiv[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
