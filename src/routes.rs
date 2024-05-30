use axum::{http::StatusCode, response::IntoResponse, routing::*, Router};
use tower_http::trace::{self, TraceLayer};
use tracing::Level;

use crate::handlers::toodle::group::{create_group, fetch_groups};
use crate::handlers::toodle::user::{create_user, delete_user, fetch_user, update_user};
use crate::AppState;

pub fn app_router(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", get(root))
        .nest(
            "/v1",
            Router::new()
                .nest("/users", user_routes(state.clone()))
                .nest("/groups", group_routes(state.clone())),
            // .nest("/messages", message_routes(state.clone())),
        )
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)),
        )
        .fallback(handler_404)
}

async fn root() -> &'static str {
    "Server is running"
}

async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        "The requested resource was not found",
    )
}

fn user_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_user))
        .route(
            "/:id",
            get(fetch_user).patch(update_user).delete(delete_user),
        )
        .with_state(state)
}

fn group_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", get(fetch_groups).post(create_group))
        .route("/:id", patch(update_group).delete(delete_group))
        .with_state(state)
}

// TODO implement message handlers
// fn message_routes(state: AppState) -> Router<AppState> {
//     Router::new()
//         .route("/", post(create_message))
//         .route("/:id", patch(update_message).delete(delete_message))
//         .with_state(state)
// }
