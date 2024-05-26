use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Router,
};
use tower_http::trace::{self, TraceLayer};
use tracing::Level;

use crate::AppState;

pub fn app_router(_state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", get(root))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new()
                    .level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new()
                    .level(Level::INFO))
        )
        .fallback(handler_404)
}

async fn root() -> &'static str {
    "Server is running"
}

async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        "The requested resource was not found"
    )
}