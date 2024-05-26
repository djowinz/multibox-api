#[dervice(Clone, Debug, PartialEq)]
pub struct UserModel {
    pub id: Uuid,
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub grant_token: String,
    created_at: DateTime<Utc>,
    updated_at: DateTime<Utc>,
}

#[derive(Debug)]
pub enum UserError {
    InternalServerError,
    NotFound(Uuid),
    InfraError(InfraError),
}

impl IntoResponse for UserError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(id) => (
                StatusCode::NOT_FOUND,
                format!("User with id {} not found", id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Internal server error: {}", db_error),
            ),
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
        };
        (
            status,
            Json(
                json!({"resource": "UserModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}