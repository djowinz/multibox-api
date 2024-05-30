use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    BodyParsingError(String),
}

// Implement the `IntoResponse` trait for the `AppError` enumeration
impl IntoResponse for AppError {
    // Define the conversion to an Axum response
    fn into_response(self) -> axum::response::Response {
        // Define status and error message based on the error variant
        let (status, err_msg) = match self {
            Self::BodyParsingError(message) => (
                StatusCode::BAD_REQUEST,
                format!("Bad request error: {}", message),
            ),
        };

        // Create a JSON response containing the error message
        (status, Json(json!({ "message": err_msg }))).into_response()
    }
}
