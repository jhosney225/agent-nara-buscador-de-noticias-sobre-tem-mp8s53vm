```javascript
const https = require('https');
const readline = require('readline');

// Configuración de la API de NewsAPI
const API_KEY = 'demo'; // Clave demo para ejemplo funcional
const API_BASE = 'https://newsapi.org/v2';

// Crear interfaz de readline para entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para hacer peticiones HTTPS
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Función para buscar noticias por palabra clave
async function searchNews(query) {
  try {
    console.log(`\n🔍 Buscando noticias sobre: "${query}"...\n`);
    
    const url = `${API_BASE}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=es&pageSize=10`;
    
    const response = await makeRequest(url);
    
    if (response.articles && response.articles.length > 0) {
      console.log(`✅ Se encontraron ${response.articles.length} noticias:\n`);
      console.log('━'.repeat(80));
      
      response.articles.forEach((article, index) => {
        console.log(`\n📰 Noticia ${index + 1}:`);
        console.log(`   Título: ${article.title}`);
        console.log(`   Fuente: ${article.source.name}`);
        console.log(`   Fecha: ${new Date(article.publishedAt).toLocaleDateString('es-ES')}`);
        console.log(`   Descripción: ${article.description || 'No disponible'}`);
        console.log(`   URL: ${article.url}`);
        console.log('─'.repeat(80));
      });
    } else {
      console.log('❌ No se encontraron noticias para este tema.');
    }
  } catch (error) {
    console.error('❌ Error al buscar noticias:', error.message);
  }
}

// Función para obtener noticias por categoría
async function getNewsByCategory(category) {
  try {
    console.log(`\n🔍 Obteniendo noticias de la categoría: "${category}"...\n`);
    
    const url = `${API_BASE}/top-headlines?category=${category}&language=es&pageSize=10`;
    
    const response = await makeRequest(url);
    
    if (response.articles && response.articles.length > 0) {
      console.log(`✅ Se encontraron ${response.articles.length} noticias:\n`);
      console.log('━'.repeat(80));
      
      response.articles.forEach((article, index) => {
        console.log(`\n📰 Noticia ${index + 1}:`);
        console.log(`   Título: ${article.title}`);
        console.log(`   Fuente: ${article.source.name}`);
        console.log(`   Fecha: ${new Date(article.publishedAt).toLocaleDateString('es-ES')}`);
        console.log(`   Descripción: ${article.description || 'No disponible'}`);
        console.log(`   URL: ${article.url}`);
        console.log('─'.repeat(80));
      });
    } else {
      console.log('❌ No se encontraron noticias para esta categoría.');
    }
  } catch (error) {
    console.error('❌ Error al obtener noticias:', error.message);
  }
}

// Función para mostrar el menú principal
function showMenu() {
  console.log('\n' + '═'.repeat(80));
  console.log('📰 BUSCADOR DE NOTICIAS - MENÚ PRINCIPAL');
  console.log('═'.repeat(80));
  console.log('\n1. Buscar noticias por palabra clave');
  console.log('2. Ver noticias por categoría');
  console.log('3. Salir\n');
}

// Función para mostrar categorías disponibles
function showCategories() {
  const categories = [
    'business', 'entertainment', 'general', 'health', 
    'science', 'sports', 'technology'
  ];
  
  console.log('\n📁 Categorías disponibles:');
  categories.forEach((cat, index) => {
    console.log(`   ${index + 1}. ${cat}`);
  });
  console.log();
  
  return categories;
}

// Función principal del programa
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                 🌍 BUSCADOR DE NOTICIAS - VERSIÓN 1.0                         ║');
  console.log('║                    Encuentra noticias sobre tus temas favoritos                ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════════╝');
  
  let running = true;
  
  while (running) {
    showMenu();
    
    const choice = await new Promise((resolve) => {
      rl.question('Selecciona una opción (1-3): ', resolve);
    });
    
    switch (choice.trim()) {
      case '1':
        const query = await new Promise((resolve)