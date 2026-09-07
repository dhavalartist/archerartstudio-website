<?php
/*
 * Archer Art Studio - Contact Form
 * BigRock / cPanel compatible version
 *
 * IMPORTANT:
 * Put your Google reCAPTCHA SECRET KEY in the line below.
 * Never put the Secret Key in index.html or JavaScript.
 */

header('Content-Type: application/json; charset=UTF-8');

/* Keep this AJAX endpoint JSON-only if PHP emits a warning/error. */
ini_set('display_errors', '0');
ini_set('log_errors', '1');

set_error_handler(function ($severity, $message, $file, $line) {
    error_log("Archer inquiry PHP warning: {$message} in {$file}:{$line}");
    return true;
});

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], array(E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR), true)) {
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode(array(
            'success' => false,
            'message' => 'A server error occurred while sending your inquiry. Please try again.'
        ));
    }
});



/* =========================================================
   CONFIGURATION
   ========================================================= */

$recaptchaSecret = '6LfTVoItAAAAAGbY3u474Tsq14ryBqLR2hIZ0Ax3';

$toEmail   = 'contact@archerartstudio.com';
$fromEmail = 'contact@archerartstudio.com';


/* =========================================================
   JSON RESPONSE
   ========================================================= */

function aas_response($success, $message, $statusCode)
{
    http_response_code($statusCode);

    echo json_encode(
        array(
            'success' => $success,
            'message' => $message
        )
    );

    exit;
}


/* =========================================================
   ONLY ACCEPT POST
   ========================================================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    aas_response(false, 'Invalid request method.', 405);
}


/* =========================================================
   GET FORM DATA
   ========================================================= */

$name     = isset($_POST['name']) ? trim($_POST['name']) : '';
$email    = isset($_POST['email']) ? trim($_POST['email']) : '';
$company  = isset($_POST['company']) ? trim($_POST['company']) : '';
$project  = isset($_POST['project']) ? trim($_POST['project']) : '';
$timeline = isset($_POST['timeline']) ? trim($_POST['timeline']) : '';
$budget   = isset($_POST['budget']) ? trim($_POST['budget']) : '';
$message  = isset($_POST['message']) ? trim($_POST['message']) : '';
$captcha  = isset($_POST['g-recaptcha-response']) ? trim($_POST['g-recaptcha-response']) : '';


/* =========================================================
   REQUIRED FIELDS
   ========================================================= */

if ($name === '' || $email === '' || $budget === '' || $message === '') {
    aas_response(false, 'Please complete all required fields.', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    aas_response(false, 'Please enter a valid email address.', 422);
}

if ($budget === 'Not decided yet' || $budget === 'Select your budget range') {
    aas_response(false, 'Please select a budget range.', 422);
}

if ($captcha === '') {
    aas_response(false, 'Please complete the reCAPTCHA verification.', 422);
}

if ($recaptchaSecret === '' || $recaptchaSecret === 'YOUR_NEW_SECRET_KEY_HERE') {
    aas_response(false, 'reCAPTCHA Secret Key is not configured on the server.', 500);
}


/* =========================================================
   GOOGLE reCAPTCHA VERIFICATION
   ========================================================= */

$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

$postData = http_build_query(
    array(
        'secret'   => $recaptchaSecret,
        'response' => $captcha,
        'remoteip' => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : ''
    ),
    '',
    '&'
);

$googleResponse = false;
$transportError = '';


/*
 * Use cURL if the hosting account has it enabled.
 */

if (function_exists('curl_init')) {

    $ch = curl_init($verifyUrl);

    if ($ch === false) {

        $transportError = 'Could not initialize cURL.';

    } else {

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array('Content-Type: application/x-www-form-urlencoded')
        );

        $googleResponse = curl_exec($ch);

        if ($googleResponse === false) {
            $transportError = curl_error($ch);
        }

        curl_close($ch);
    }


/*
 * If cURL is unavailable, use PHP's stream method.
 */

} else {

    $context = stream_context_create(
        array(
            'http' => array(
                'method'  => 'POST',
                'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $postData,
                'timeout' => 20
            )
        )
    );

    $googleResponse = @file_get_contents(
        $verifyUrl,
        false,
        $context
    );

    if ($googleResponse === false) {
        $transportError = 'The server could not connect to Google reCAPTCHA.';
    }
}


if ($googleResponse === false || $googleResponse === '') {

    aas_response(
        false,
        'Could not connect to Google reCAPTCHA from the server. ' .
        ($transportError !== '' ? $transportError : 'Please try again.'),
        502
    );
}


/* =========================================================
   CHECK GOOGLE RESPONSE
   ========================================================= */

$captchaResult = json_decode($googleResponse, true);

if (!is_array($captchaResult)) {

    aas_response(
        false,
        'Google returned an invalid reCAPTCHA response.',
        502
    );
}


if (empty($captchaResult['success'])) {

    $errorCodes = '';

    if (
        isset($captchaResult['error-codes']) &&
        is_array($captchaResult['error-codes'])
    ) {
        $errorCodes = ' [' .
            implode(', ', $captchaResult['error-codes']) .
            ']';
    }

    aas_response(
        false,
        'reCAPTCHA verification failed. Please check the box again.' .
        $errorCodes,
        422
    );
}


/* =========================================================
   CLEAN HEADER VALUES
   ========================================================= */

$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$safeEmail = preg_replace('/[\r\n]+/', '', $email);
$safeCompany = preg_replace('/[\r\n]+/', ' ', $company);
$safeProject = preg_replace('/[\r\n]+/', ' ', $project);
$safeTimeline = preg_replace('/[\r\n]+/', ' ', $timeline);
$safeBudget = preg_replace('/[\r\n]+/', ' ', $budget);


/* =========================================================
   EMAIL TO ARCHER ART STUDIO
   ========================================================= */

$subject = 'New Project Inquiry - Archer Art Studio';

$emailBody =
    "New Project Inquiry - Archer Art Studio\n\n" .
    "Name: " . $safeName . "\n" .
    "Email: " . $safeEmail . "\n" .
    "Company / Studio: " .
        ($safeCompany !== '' ? $safeCompany : 'Not provided') . "\n" .
    "Project Type: " .
        ($safeProject !== '' ? $safeProject : 'Not provided') . "\n" .
    "Timeline: " .
        ($safeTimeline !== '' ? $safeTimeline : 'Not provided') . "\n" .
    "Budget Range: " . $safeBudget . "\n\n" .
    "Project Brief:\n" .
    $message . "\n";


$emailHeaders =
    "From: Archer Art Studio <" . $fromEmail . ">\r\n" .
    "Reply-To: " . $safeEmail . "\r\n" .
    "MIME-Version: 1.0\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";


$studioSent = @mail(
    $toEmail,
    $subject,
    $emailBody,
    $emailHeaders
);


if (!$studioSent) {

    aas_response(
        false,
        'The form was verified, but the server could not send the inquiry email. Please try again or email contact@archerartstudio.com directly.',
        500
    );
}


/* =========================================================
   AUTOMATIC EMAIL TO THE CLIENT
   ========================================================= */

$clientSubject =
    'We received your project inquiry - Archer Art Studio';


$clientBody =
    "Hi " . $safeName . ",\n\n" .
    "Thank you for contacting Archer Art Studio.\n\n" .
    "We have received your project inquiry and will review " .
    "the details shortly. We will get back to you as soon as possible.\n\n" .
    "Project Type: " .
        ($safeProject !== '' ? $safeProject : 'Not provided') . "\n" .
    "Timeline: " .
        ($safeTimeline !== '' ? $safeTimeline : 'Not provided') . "\n" .
    "Budget Range: " . $safeBudget . "\n\n" .
    "Best regards,\n" .
    "Archer Art Studio\n" .
    "https://archerartstudio.com/\n";


$clientHeaders =
    "From: Archer Art Studio <" . $fromEmail . ">\r\n" .
    "Reply-To: " . $fromEmail . "\r\n" .
    "MIME-Version: 1.0\r\n" .
    "Content-Type: text/plain; charset=UTF-8\r\n";


/*
 * The main inquiry has already been accepted.
 * A failure of the confirmation email should not
 * make the client's inquiry appear unsuccessful.
 */

@mail(
    $safeEmail,
    $clientSubject,
    $clientBody,
    $clientHeaders
);


/* =========================================================
   SUCCESS
   ========================================================= */

aas_response(
    true,
    'Thank you! Your inquiry has been sent successfully. We will get back to you shortly.',
    200
);

?>