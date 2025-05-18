from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    auth_enabled: bool = True
    session_expiry_minutes: int = 60 * 24 * 7  # 1 week by default
    secret_key: str = "change-me"
    algorithm: str = "HS256"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
