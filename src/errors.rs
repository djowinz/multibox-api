use axum::http::StatusCode;
use axum::Json;
use axum::response::IntoResponse;
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    InternalServerError,
    BodyParsingError(String),
}

pub fn internal_error<E>(_err: E) -> AppError {
    AppError::InternalServerError
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::InternalServerError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
            Self::BodyParsingError(msg) => (
                StatusCode::BAD_REQUEST,
                format!("Bad request error: {}", msg),
            ),
        };
        (status, Json(json!({"message": err_msg}))).into_response()
    }
}