use std::net::SocketAddr;

use config::Config;
use deadpool_diesel::postgres::{Manager, Pool};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::config::config;
use crate::routes::app_router;

// modules
mod config;
mod domain;
mod errors;
mod handlers;
mod infra;
mod routes;
mod utils;

// Embedded database migrations
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

// App state
#[derive(Clone)]
pub struct AppState {
    pub jwks: jsonwebtoken::jwk::JwkSet,
    pub pool: Pool,
    pub config: Config,
}

// Entry point
#[tokio::main]
async fn main() {
    init_tracing();

    let config = config().await;

    let manager = Manager::new(
        config.db_url().to_string(),
        deadpool_diesel::Runtime::Tokio1,
    );
    let pool = Pool::builder(manager).build().unwrap();

    // apply pending migrations
    run_migrations(&pool).await;

    let jwks = utils::auth_utils::fetch_jwks(config.issuer())
        .await
        .unwrap();

    let state = AppState {
        jwks,
        pool,
        config: config.clone(),
    };

    // apply cors and rate limiting
    let app = app_router(state.clone())
        .with_state(state)
        .layer(CorsLayer::permissive());

    let host = config.server_host();
    let port = config.server_port();

    let address = format!("{}:{}", host, port);
    let socket_addr = address.parse::<SocketAddr>().unwrap();

    tracing::info!("Server running at http://{}", socket_addr);
    let listener = tokio::net::TcpListener::bind(&socket_addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}

fn init_tracing() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .with(tracing_subscriber::fmt::layer())
        .init()
}

async fn run_migrations(pool: &Pool) {
    let conn = pool.get().await.unwrap();
    conn.interact(|conn| conn.run_pending_migrations(MIGRATIONS).map(|_| ()))
        .await
        .unwrap()
        .unwrap();
}
