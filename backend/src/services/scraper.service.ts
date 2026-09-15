import axios from 'axios';
import * as cheerio from 'cheerio';

export class ScraperService {
  /**
   * Extrai dados metadados (OpenGraph) e preço de uma página de e-commerce a partir de uma URL.
   */
  static async extractProductData(url: string) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        }
      });

      const $ = cheerio.load(data);

      // 1. Extração de OpenGraph Tags
      const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
      const image_url = $('meta[property="og:image"]').attr('content') || '';
      const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';

      // 2. Extração de Preço Atual (Básico/Heurístico)
      let current_price = 0;
      
      // Tenta achar tags padrão de preço
      let priceStr = $('meta[property="product:price:amount"]').attr('content') || 
                     $('meta[name="twitter:data1"]').attr('content'); // Usado em alguns e-commerces
      
      if (!priceStr) {
        // Fallback: Busca elementos de interface comuns em Kabum, Mercado Livre, Amazon
        priceStr = $('.andes-money-amount__fraction').first().text() || // Mercado Livre
                   $('.a-price-whole').first().text() || // Amazon
                   $('[id^="price-value"]').first().text() || // Kabum etc
                   $('[class*="price"], [class*="Preco"]').first().text();
      }

      if (priceStr) {
        // Limpeza da string de preço: remover 'R$', pontos (se milhar) e trocar vírgula por ponto.
        // Exemplo: 'R$ 4.299,90' -> '4299.90'
        let cleanPrice = priceStr.replace(/R\$\s*/g, '').trim();
        cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.'); // Assumindo padrão brasileiro
        
        const parsedPrice = parseFloat(cleanPrice);
        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          current_price = parsedPrice;
        }
      }

      // 3. Inferência de Marca (Brand) baseada no Título
      let brand = '';
      const commonBrands = ['Apple', 'Samsung', 'Sony', 'Logitech', 'Dell', 'ASUS', 'HyperX', 'Acer', 'Lenovo', 'Motorola', 'Xiaomi'];
      for (const b of commonBrands) {
        if (title.toLowerCase().includes(b.toLowerCase())) {
          brand = b;
          break;
        }
      }

      return {
        title: title.trim(),
        image_url,
        description: description.trim(),
        current_price,
        brand,
      };

    } catch (error: any) {
      console.error('Erro na extração de URL:', error.message);
      throw new Error('Falha ao extrair dados da URL. Verifique se o link é válido e público.');
    }
  }
}
