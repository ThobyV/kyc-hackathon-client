const baseUrl = "https://us-central1-kyc-app-65a63.cloudfunctions.net/kycAPI";

const defaultHeaders = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
}

export {
    baseUrl,
    defaultHeaders,
}