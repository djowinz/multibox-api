use axum::middleware;
use axum::{http::StatusCode, response::IntoResponse, routing::*, Router};
use tower_http::trace::{self, TraceLayer};
use tracing::Level;

use crate::handlers::middleware::authorize::auth_middleware;
use crate::handlers::toodle::group::{create_group, fetch_by_id, fetch_groups};
use crate::handlers::toodle::inbox_grant::{
    create_inbox_grant, delete_inbox_grant, fetch_inbox_grants, update_inbox_grant,
};
use crate::handlers::toodle::messages::fetch_threads_by_grant;
use crate::handlers::toodle::user::{
    create_user, delete_user, fetch_self, fetch_user, update_user,
};
use crate::AppState;

pub fn app_router(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", get(root))
        .nest(
            "/v1",
            Router::new()
                .nest("/auth", auth_routes(state.clone()))
                .nest("/users", user_routes(state.clone()))
                .nest("/groups", group_routes(state.clone()))
                .nest("/inbox", message_routes(state.clone()))
                .nest("/grants", inbox_grant_routes(state.clone())),
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

fn auth_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/callback", post(create_user))
        .route(
            "/self",
            get(fetch_self).route_layer(middleware::from_fn_with_state(
                state.clone(),
                auth_middleware,
            )),
        )
        .with_state(state)
}

fn user_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route(
            "/:id",
            get(fetch_user)
                .patch(update_user)
                .delete(delete_user)
                .route_layer(middleware::from_fn_with_state(
                    state.clone(),
                    auth_middleware,
                )),
        )
        .with_state(state)
}

fn inbox_grant_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", post(create_inbox_grant).get(fetch_inbox_grants))
        .route("/:id", patch(update_inbox_grant).delete(delete_inbox_grant))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
        .with_state(state)
}

fn group_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/", get(fetch_groups).post(create_group))
        .route("/:id", get(fetch_by_id))
        // .route("/:id", patch(update_group).delete(delete_group))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
        .with_state(state)
}

fn message_routes(state: AppState) -> Router<AppState> {
    Router::new()
        .route("/:id/messages", get(fetch_threads_by_grant))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            auth_middleware,
        ))
        .with_state(state)
}
