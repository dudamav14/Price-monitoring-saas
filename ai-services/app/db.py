import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from typing import Dict, Any, List, Optional
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_connection():
    """Retorna uma conexão ativa com o banco PostgreSQL (suporta Docker, 127.0.0.1 e localhost)."""
    hosts_to_try = []
    if settings.POSTGRES_HOST:
        hosts_to_try.append(settings.POSTGRES_HOST)
    if "127.0.0.1" not in hosts_to_try:
        hosts_to_try.append("127.0.0.1")
    if "localhost" not in hosts_to_try:
        hosts_to_try.append("localhost")
        
    last_exception = None
    for host in hosts_to_try:
        try:
            conn = psycopg2.connect(
                dbname=settings.POSTGRES_DB,
                user=settings.POSTGRES_USER,
                password=settings.POSTGRES_PASSWORD,
                host=host,
                port=settings.POSTGRES_PORT,
                connect_timeout=3
            )
            return conn
        except Exception as e:
            last_exception = e
        except BaseException as e:
            last_exception = e
            
    logger.error(f"Erro ao conectar ao banco PostgreSQL: {repr(last_exception)}")
    raise RuntimeError(f"Não foi possível conectar ao PostgreSQL. Verifique se o container está rodando na porta 5432. Erro: {repr(last_exception)}")

def get_competitor_by_name(competitor_name: str) -> Optional[Dict[str, Any]]:
    """Busca um concorrente cadastrado pelo nome."""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, name, domain FROM competitors WHERE name ILIKE %s LIMIT 1;", (f"%{competitor_name}%",))
            row = cur.fetchone()
            return dict(row) if row else None
    finally:
        conn.close()

def get_category_by_name(category_name: str) -> Optional[Dict[str, Any]]:
    """Busca uma categoria cadastrada pelo nome."""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, name FROM categories WHERE name ILIKE %s LIMIT 1;", (f"%{category_name}%",))
            row = cur.fetchone()
            return dict(row) if row else None
    finally:
        conn.close()

def upsert_product(product_data: Dict[str, Any]) -> str:
    """Insere um novo produto ou atualiza se a URL/SKU já existir."""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Tenta encontrar o produto existente por URL
            cur.execute("SELECT id FROM products WHERE product_url = %s LIMIT 1;", (product_data['product_url'],))
            existing = cur.fetchone()
            
            if existing:
                product_id = existing['id']
                cur.execute("""
                    UPDATE products 
                    SET title = %s, description = %s, image_url = %s, target_price = %s, updated_at = NOW()
                    WHERE id = %s RETURNING id;
                """, (
                    product_data['title'], product_data.get('description'), 
                    product_data.get('image_url'), product_data.get('target_price'), 
                    product_id
                ))
            else:
                cur.execute("""
                    INSERT INTO products (competitor_id, category_id, sku, title, description, product_url, image_url, brand, target_price)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (
                    product_data['competitor_id'], product_data.get('category_id'),
                    product_data.get('sku'), product_data['title'],
                    product_data.get('description'), product_data['product_url'],
                    product_data.get('image_url'), product_data.get('brand'),
                    product_data.get('target_price')
                ))
                product_id = cur.fetchone()['id']
            
            conn.commit()
            return str(product_id)
    finally:
        conn.close()

def save_price_history(price_data: Dict[str, Any]) -> str:
    """Registra um novo ponto de histórico de preços para um produto."""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO price_history (product_id, price, original_price, discount_percentage, in_stock, rating_score, rating_count)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                price_data['product_id'], price_data['price'],
                price_data.get('original_price'), price_data.get('discount_percentage'),
                price_data.get('in_stock', True), price_data.get('rating_score'),
                price_data.get('rating_count', 0)
            ))
            entry_id = cur.fetchone()['id']
            conn.commit()
            return str(entry_id)
    finally:
        conn.close()

def save_product_reviews(product_id: str, reviews: List[Dict[str, Any]]) -> int:
    """Insere a lista de avaliações coletadas para o produto."""
    if not reviews:
        return 0
    
    conn = get_connection()
    inserted_count = 0
    try:
        with conn.cursor() as cur:
            for review in reviews:
                cur.execute("""
                    INSERT INTO product_reviews (product_id, author, rating, title, review_text, sentiment_label, sentiment_score, processed_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW());
                """, (
                    product_id, review.get('author', 'Anônimo'),
                    review.get('rating', 5.0), review.get('title'),
                    review['review_text'], review.get('sentiment_label', 'pending'),
                    review.get('sentiment_score', 0.0)
                ))
                inserted_count += 1
            conn.commit()
            return inserted_count
    finally:
        conn.close()

def log_scraping_job(target_url: str, status: str, items_scraped: int = 0, error_message: str = None) -> str:
    """Grava o registro de execução do job de web scraping."""
    conn = get_connection()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO scraping_logs (target_url, status, items_scraped, error_message, finished_at)
                VALUES (%s, %s, %s, %s, NOW())
                RETURNING id;
            """, (target_url, status, items_scraped, error_message))
            log_id = cur.fetchone()['id']
            conn.commit()
            return str(log_id)
    finally:
        conn.close()
