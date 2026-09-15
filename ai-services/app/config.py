import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env localizado na raiz do monorepo ou localmente
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv()

class Settings:
    """Configurações centralizadas do microsserviço Python."""
    
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres_secret_key")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "market_intelligence")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")  # 'database' dentro do docker, 'localhost' fora
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    AI_SERVICE_PORT: int = int(os.getenv("AI_SERVICE_PORT", "8000"))
    
    # Modelo NLP padrão (Multilíngue/Português para classificação de sentimentos)
    NLP_MODEL_NAME: str = os.getenv("NLP_MODEL_NAME", "nlptown/bert-base-multilingual-uncased-sentiment")

settings = Settings()
