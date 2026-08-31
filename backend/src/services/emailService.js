const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const RESEND_TIMEOUT_MS = 20_000;

const getResendConfig = () => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;

    if (!apiKey?.trim() || !from?.trim()) {
        const error = new Error("Email delivery is not configured");
        error.code = "EMAIL_CONFIGURATION_ERROR";
        throw error;
    }

    return {
        apiKey: apiKey.trim(),
        from: from.trim()
    };
};

const sendOtpEmail = async (email, otp) => {
    if (typeof email !== "string" || !email.trim()) {
        throw new Error("A recipient email address is required");
    }

    const normalizedOtp = String(otp);

    if (!/^\d{6}$/.test(normalizedOtp)) {
        throw new Error("OTP must be a 6-digit numeric code");
    }

    const { apiKey, from } = getResendConfig();
    const response = await fetch(RESEND_EMAILS_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from,
            to: [email.trim()],
            subject: "SecureNotes Verification Code",
            text: `Your SecureNotes verification code is ${normalizedOtp}. It expires in 5 minutes.`,
            html: [
                "<p>Your SecureNotes verification code is:</p>",
                `<p><strong>${normalizedOtp}</strong></p>`,
                "<p>This code expires in 5 minutes.</p>"
            ].join("")
        }),
        signal: AbortSignal.timeout(RESEND_TIMEOUT_MS)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(
            typeof result?.message === "string"
                ? result.message
                : "Resend email delivery failed"
        );
        error.name = typeof result?.name === "string"
            ? result.name
            : "ResendError";
        error.code = "RESEND_API_ERROR";
        error.command = "POST /emails";
        error.responseCode = response.status;
        throw error;
    }

    if (typeof result?.id !== "string" || !result.id) {
        const error = new Error("Resend returned an invalid response");
        error.name = "ResendError";
        error.code = "RESEND_INVALID_RESPONSE";
        throw error;
    }

    return result;
};

module.exports = {
    sendOtpEmail
};
