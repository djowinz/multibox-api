use std::env;
use dotenvy::dotenv;
use tokio::sync::OnceCell;

#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
}

#[derive(Debug)]
struct DatabaseConfig {
    url: String,
}

#[derive(Debug)]
pub struct Config {
    server: ServerConfig,
    db: DatabaseConfig,
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
    };

    let database_config = DatabaseConfig {
        url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
    };

    Config {
        server: server_config,
        db: database_config,
        nylas_api_key: env::var("NYLAS_API_KEY").expect("NYLAS_API_KEY must be set"),
    }
}

pub async fn config() -> &'static Config {
    CONFIG.get_or_init(|| init_config()).await
}