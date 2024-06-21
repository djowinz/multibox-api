use dotenvy::dotenv;
use std::env;
use tokio::sync::OnceCell;

#[derive(Debug, Clone)]
struct ServerConfig {
    host: String,
    port: u16,
    authorization_key: String,
}

#[derive(Debug, Clone)]
struct DatabaseConfig {
    url: String,
}

#[derive(Debug, Clone)]
struct Auth0Config {
    issuer: String,
    domain: String,
    secret: String,
    client_id: String,
    client_secret: String,
}

#[derive(Debug, Clone)]
pub struct Config {
    server: ServerConfig,
    db: DatabaseConfig,
    auth0: Auth0Config,
    nylas_api_key: String,
}

impl Config {
    pub fn server_host(&self) -> &str {
        &self.server.host
    }

    pub fn server_port(&self) -> u16 {
        self.server.port
    }

    pub fn db_url(&self) -> &str {
        &self.db.url
    }

    pub fn nylas_api_key(&self) -> &str {
        &self.nylas_api_key
    }

    pub fn domain(&self) -> &str {
        &self.auth0.domain
    }

    pub fn secret(&self) -> &str {
        &self.auth0.secret
    }

    pub fn client_id(&self) -> &str {
        &self.auth0.client_id
    }

    pub fn client_secret(&self) -> &str {
        &self.auth0.client_secret
    }

    pub fn issuer(&self) -> &str {
        &self.auth0.issuer
    }
}

pub static CONFIG: OnceCell<Config> = OnceCell::const_new();

async fn init_config() -> Config {
    dotenv().ok();

    let server_config = ServerConfig {
        host: env::var("SERVER_HOST").unwrap_or_else(|_| String::from("127.0.0.1")),
        port: env::var("SERVER_PORT")
            .unwrap_or_else(|_| String::from("3080"))
            .parse::<u16>()
            .unwrap(),
        authorization_key: env::var("AUTHORIZATION_KEY").expect("AUTHORIZATION_KEY must be set"),
    };

    let database_config = DatabaseConfig {
        url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
    };

    let auth0_config = Auth0Config {
        issuer: env::var("AUTH0_ISSUER_BASE_URL").expect("AUTH0_ISSUER_BASE_URL must be set"),
        domain: env::var("AUTH0_DOMAIN").expect("AUTH0_DOMAIN must be set"),
        secret: env::var("AUTH0_SECRET").expect("AUTH0_SECRET must be set"),
        client_id: env::var("AUTH0_CLIENT_ID").expect("AUTH0_CLIENT_ID must be set"),
        client_secret: env::var("AUTH0_CLIENT_SECRET").expect("AUTH0_CLIENT_SECRET must be set"),
    };

    Config {
        server: server_config,
        db: database_config,
        auth0: auth0_config,
        nylas_api_key: env::var("NYLAS_API_KEY").expect("NYLAS_API_KEY must be set"),
    }
}

pub async fn config() -> &'static Config {
    CONFIG.get_or_init(|| init_config()).await
}
