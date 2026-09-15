-- Script de Inicialização da Base de Dados - SaaS de Inteligência de Mercado
-- Extensão para geração automatizada de UUIDs v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- TABELA: competitors (Concorrentes / Marketplaces Monitorados)
-- =============================================================================
CREATE TABLE IF NOT EXISTS competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: categories (Categorias de Produtos)
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: products (Catálogo de Produtos Monitorados)
-- =============================================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sku VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    product_url TEXT NOT NULL,
    image_url TEXT,
    brand VARCHAR(100),
    target_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: price_history (Série Temporal de Variação de Preços e Performance)
-- =============================================================================
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    discount_percentage NUMERIC(5, 2),
    in_stock BOOLEAN DEFAULT TRUE,
    rating_score NUMERIC(3, 2),
    rating_count INT DEFAULT 0,
    extracted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: product_reviews (Avaliações dos Consumidores & Sentimento NLP)
-- =============================================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    author VARCHAR(100),
    rating NUMERIC(2, 1),
    title VARCHAR(255),
    review_text TEXT NOT NULL,
    review_date TIMESTAMPTZ,
    sentiment_label VARCHAR(20) CHECK (sentiment_label IN ('positive', 'neutral', 'negative', 'pending')) DEFAULT 'pending',
    sentiment_score NUMERIC(5, 4), -- Grau de confiança da previsão IA (ex: 0.9850)
    processed_at TIMESTAMPTZ,
    extracted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: scraping_logs (Logs de Execução de Jobs de Scraping)
-- =============================================================================
CREATE TABLE IF NOT EXISTS scraping_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_url TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('success', 'failed', 'running')) NOT NULL,
    items_scraped INT DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMPTZ
);

-- =============================================================================
-- ÍNDICES DE PERFORMANCE (Otimização para Consultas Analíticas e Dashboards)
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_products_competitor ON products(competitor_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON price_history(product_id, extracted_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_sentiment ON product_reviews(product_id, sentiment_label);
CREATE INDEX IF NOT EXISTS idx_reviews_extracted ON product_reviews(extracted_at DESC);

-- =============================================================================
-- SEED DE DADOS INICIAIS (Ambiente de Desenvolvimento)
-- =============================================================================
INSERT INTO competitors (name, domain, logo_url) VALUES
('Amazon Brasil', 'amazon.com.br', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'),
('Mercado Livre', 'mercadolivre.com.br', 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png'),
('Kabum', 'kabum.com.br', 'https://static.kabum.com.br/conteudo/icons/logo.svg')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Smartphones', 'Celulares e telefones inteligentes'),
('Hardware & PC', 'Componentes para computadores e placas de vídeo'),
('Periféricos', 'Teclados, mouses, headsets e acessórios')
ON CONFLICT (name) DO NOTHING;

-- Trigger para atualizar automaticamente o campo updated_at em products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
